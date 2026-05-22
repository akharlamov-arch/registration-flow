const DEFAULT_ENDPOINTS = {
  validateSessionUrl: '/api/leads/validate-session?sessionToken=',
  completeSigningUrl: '/api/leads/complete-signing',
  storeFuelCardsUrl: '/api/leads/set_fuel_cards'
};
const DEFAULT_DOMAIN = window.RegistrationShared.DEFAULT_DOMAIN; // change in shared.js when deploying

function postSigningForm() {
  return {
    step: 1,
    pageState: 'loading', // 'loading', 'error', 'ready'
    pageError: '',
    fuelCardsSubmitting: false,
    addFuelCards: 'no', // 'yes' | 'no'
    errors: {},
    lead: null,

    // Fuel cards inputs
    fuelCardsData: [
      window.RegistrationShared.newFuelCardRow()
    ],

    // Returns the session token from URL params.
    // ZohoSign redirect URLs now carry `?token=<session_token>` (ticket 6.46).
    // Falls back to `?code=` for any in-flight signings whose redirect URLs
    // were registered with the old format before the deploy.
    getSessionToken() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('token') || urlParams.get('code') || '';
    },

    // Initialize on page load
    init() {
      this.validateSession();
    },

    getEndpoint(key) {
      return window.RegistrationShared.resolveEndpoint(DEFAULT_DOMAIN, DEFAULT_ENDPOINTS, key);
    },

    async requestJson(url, options = {}, timeoutMs = 20000) {
      return window.RegistrationShared.requestJson(url, options, timeoutMs);
    },

    // Authenticates via session token and checks that the lead has completed
    // the signing step.  Does NOT consume any credential.
    async validateSession() {
      const token = this.getSessionToken();

      if (!token) {
        this.pageState = 'error';
        this.pageError = 'No session token provided. Please use the link from your signing confirmation.';
        return;
      }

      try {
        const validateUrl = this.getEndpoint('validateSessionUrl');
        const { ok, data: json } = await this.requestJson(validateUrl + encodeURIComponent(token), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        console.log('validate-session response', json);

        if (!ok || !json.success) {
          this.pageState = 'error';
          this.pageError = json.message || 'Invalid or expired session. Please contact support.';
          return;
        }

        if (!json.lead) {
          this.pageState = 'error';
          this.pageError = 'Unable to retrieve your information. Please contact support.';
          return;
        }

        const lead = json.lead;
        this.lead = lead;

        // Check that the lead has completed the signing step.
        // completed_step >= 10 OR status == "signed"
        const completedStep = parseInt(lead.completed_step || lead.completedStep || 0, 10);
        const status = (lead.status || '').toLowerCase();

        if (completedStep < 10 && status !== 'signed') {
          this.pageState = 'error';
          this.pageError = 'Your registration is not yet complete. Please finish the signing process first.';
          return;
        }

        // Validation passed - show the form.
        this.pageState = 'ready';

        // ONRAMP is app-based — no physical fuel cards needed; skip straight to confirmation.
        if ((lead.account || '').toUpperCase() === 'ONRAMP') {
          this.step = 3;
        }

        // Mark the lead as signed and create the onboarding task.
        // Idempotent — safe to call even if the lead is already signed.
        const completeSigningUrl = this.getEndpoint('completeSigningUrl');
        await this.requestJson(completeSigningUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: token })
        });

      } catch (err) {
        console.error('validate-session error', err);
        this.pageState = 'error';
        this.pageError = 'Network error. Please check your connection and try again.';
      }
    },

    goNext() {
      if (this.addFuelCards === 'yes') {
        this.step = 2;
      } else {
        this.step = 3;
      }
    },

    addFuelCardRow() {
      this.fuelCardsData.push(window.RegistrationShared.newFuelCardRow());
    },

    removeFuelCardRow(idx) {
      if (this.fuelCardsData.length > 1) {
        this.fuelCardsData.splice(idx, 1);
      }
    },

    async submitFuelCards() {
      if (this.fuelCardsSubmitting) return;
      this.errors.fuelCards = '';
      const cleaned = window.RegistrationShared.cleanFuelCards(this.fuelCardsData);

      this.fuelCardsSubmitting = true;
      try {
        const storeFuelCardsUrl = this.getEndpoint('storeFuelCardsUrl');
        const { ok, data: json } = await this.requestJson(storeFuelCardsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.buildFuelCardsPayload(cleaned))
        });

        if (!ok || json.success === false) {
          this.errors.fuelCards = json.message || 'Failed to store fuel cards. Please try again.';
          return;
        }

        this.step = 3;
      } catch (err) {
        console.error('store-fuel-cards error', err);
        this.errors.fuelCards = 'Network error. Please try again.';
      } finally {
        this.fuelCardsSubmitting = false;
      }
    },

    buildFuelCardsPayload(fuelCards) {
      return {
        sessionToken: this.getSessionToken(),
        fuelCards
      };
    }
  }
}
