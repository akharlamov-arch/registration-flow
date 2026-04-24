// app.js — Core Application Logic
// Handles: language switching, step navigation, progress bar, validation, file uploads

// ============================================================
// STATE
// ============================================================
let currentStep = 1;
let totalSteps = 0;
let currentLang = 'en';
let pageName = 'lead'; // 'lead' or 'registration'

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Determine page type
  pageName = document.body.getAttribute('data-page') || 'lead';

  // Count total steps
  const steps = document.querySelectorAll('.step');
  totalSteps = steps.length;

  // Load saved language preference
  const savedLang = localStorage.getItem('itrucking-lang') || 'en';
  setLanguage(savedLang);

  // Build step indicator dots
  buildStepIndicators();

  // Show first step
  showStep(1);

  // Init file upload widgets
  initFileUploads();
});

// ============================================================
// LANGUAGE
// ============================================================
function setLanguage(lang) {
  if (!translations[lang]) lang = 'en';
  currentLang = lang;
  localStorage.setItem('itrucking-lang', lang);

  // Sync select element
  const select = document.getElementById('lang-select');
  if (select) select.value = lang;

  // Apply all translations to DOM
  applyTranslations();

  // Update html[lang]
  document.documentElement.lang = lang === 'uk' ? 'uk' : lang;
}

function applyTranslations() {
  const t = translations[currentLang];
  if (!t) return;

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(t, key);
    if (value !== undefined) el.textContent = value;
  });

  // Placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = getNestedValue(t, key);
    if (value !== undefined) el.placeholder = value;
  });

  // Page title
  const titleKey = pageName + '.title';
  const titleValue = getNestedValue(t, titleKey);
  if (titleValue) document.title = titleValue;

  // Update nav buttons text
  updateNavButtons();
}

function getNestedValue(obj, key) {
  return key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

// ============================================================
// STEPS
// ============================================================
function buildStepIndicators() {
  const container = document.getElementById('step-indicators');
  if (!container || totalSteps === 0) return;

  container.innerHTML = '';

  for (let i = 1; i <= totalSteps; i++) {
    // Connector line between steps
    if (i > 1) {
      const line = document.createElement('div');
      line.id = `connector-${i}`;
      line.className = 'step-connector h-px flex-1 max-w-12 bg-gray-200 transition-colors duration-300';
      container.appendChild(line);
    }

    // Step circle
    const circle = document.createElement('button');
    circle.id = `indicator-${i}`;
    circle.type = 'button';
    circle.setAttribute('aria-label', `Step ${i}`);
    circle.setAttribute('data-step-btn', i);
    container.appendChild(circle);
  }

  updateStepIndicators();
}

function updateStepIndicators() {
  for (let i = 1; i <= totalSteps; i++) {
    const indicator = document.getElementById(`indicator-${i}`);
    const connector = document.getElementById(`connector-${i}`);

    if (!indicator) continue;

    if (i < currentStep) {
      // Completed
      indicator.className =
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 flex-shrink-0 bg-primary border-primary text-white cursor-default';
      indicator.innerHTML = `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
      if (connector) connector.className = 'step-connector h-px flex-1 max-w-12 bg-primary transition-colors duration-300';
    } else if (i === currentStep) {
      // Active
      indicator.className =
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 flex-shrink-0 bg-primary border-primary text-white ring-4 ring-primary/20 cursor-default';
      indicator.textContent = i;
      if (connector) connector.className = 'step-connector h-px flex-1 max-w-12 bg-primary transition-colors duration-300';
    } else {
      // Upcoming
      indicator.className =
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 flex-shrink-0 bg-white border-gray-200 text-slate-400 cursor-default';
      indicator.textContent = i;
      if (connector) connector.className = 'step-connector h-px flex-1 max-w-12 bg-gray-200 transition-colors duration-300';
    }
  }
}

function showStep(stepNumber) {
  document.querySelectorAll('.step').forEach((stepEl, idx) => {
    const isActive = (idx + 1) === stepNumber;
    stepEl.style.display = isActive ? 'block' : 'none';
    stepEl.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  currentStep = stepNumber;
  updateProgress();
  updateStepIndicators();
  updateNavButtons();

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
  if (!validateCurrentStep()) return;
  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
  } else {
    submitForm();
  }
}

function prevStep() {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
}

// ============================================================
// PROGRESS BAR
// ============================================================
function updateProgress() {
  const percent = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 100;
  const bar = document.getElementById('progress-bar');
  if (bar) {
    bar.style.width = `${Math.round(percent)}%`;
    bar.setAttribute('aria-valuenow', Math.round(percent));
  }

  // Step counter text
  const t = translations[currentLang];
  const counter = document.getElementById('step-counter');
  if (counter && t) {
    counter.textContent = `${t.progress.stepLabel} ${currentStep} ${t.progress.of} ${totalSteps}`;
  }
}

// ============================================================
// NAV BUTTONS
// ============================================================
function updateNavButtons() {
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const t = translations[currentLang];
  if (!t) return;

  if (btnBack) {
    const isFirst = currentStep === 1;
    btnBack.disabled = isFirst;
    btnBack.setAttribute('aria-disabled', isFirst ? 'true' : 'false');
    btnBack.style.opacity = isFirst ? '0.4' : '1';
    btnBack.style.cursor = isFirst ? 'not-allowed' : 'pointer';
    const backLabel = btnBack.querySelector('[data-i18n="common.back"]');
    if (backLabel) backLabel.textContent = t.common.back;
  }

  if (btnNext) {
    const isLast = currentStep === totalSteps;
    const btnLabel = btnNext.querySelector('.btn-next-label');
    if (btnLabel) btnLabel.textContent = isLast ? t.common.submit : t.common.next;
    const arrow = btnNext.querySelector('.btn-next-arrow');
    if (arrow) arrow.style.display = isLast ? 'none' : 'inline-block';
  }
}

// ============================================================
// VALIDATION
// ============================================================
function validateCurrentStep() {
  const stepEl = document.getElementById(`step-${currentStep}`);
  if (!stepEl) return true;

  let isValid = true;
  const t = translations[currentLang];

  // Clear previous errors
  stepEl.querySelectorAll('.field-error').forEach(el => el.remove());
  stepEl.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('border-red-400', 'focus:ring-red-300', 'input-error');
    el.classList.add('border-gray-200');
  });

  // Validate required inputs
  stepEl.querySelectorAll('[required]').forEach(input => {
    const val = input.value.trim();
    if (!val) {
      markFieldError(input, t ? t.common.required : 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(val)) {
      markFieldError(input, t ? t.common.invalidEmail : 'Please enter a valid email');
      isValid = false;
    }
  });

  // Validate required checkboxes
  stepEl.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
    if (!checkbox.checked) {
      markFieldError(checkbox, t ? t.common.required : 'This field is required');
      isValid = false;
    }
  });

  // Validate required radio groups
  const radioGroups = new Set();
  stepEl.querySelectorAll('input[type="radio"][required]').forEach(radio => {
    radioGroups.add(radio.name);
  });
  radioGroups.forEach(groupName => {
    const checked = stepEl.querySelector(`input[type="radio"][name="${groupName}"]:checked`);
    if (!checked) {
      const firstRadio = stepEl.querySelector(`input[type="radio"][name="${groupName}"]`);
      if (firstRadio) {
        markFieldError(firstRadio, t ? t.common.required : 'Please select an option');
        isValid = false;
      }
    }
  });

  // Focus first error
  if (!isValid) {
    const firstError = stepEl.querySelector('.input-error');
    if (firstError) firstError.focus();
  }

  return isValid;
}

function markFieldError(input, message) {
  input.classList.add('border-red-400', 'input-error');
  input.classList.remove('border-gray-200');

  const error = document.createElement('p');
  error.className = 'field-error text-xs text-red-500 mt-1';
  error.setAttribute('role', 'alert');
  error.textContent = message;

  // Insert after parent wrapper or input itself
  const wrapper = input.closest('.input-wrapper') || input.parentNode;
  wrapper.appendChild(error);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================================
// FILE UPLOAD UI
// ============================================================
function initFileUploads() {
  document.querySelectorAll('.file-upload-zone').forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    const label = zone.querySelector('.file-upload-label');
    if (!input) return;

    // Click triggers file dialog
    zone.addEventListener('click', () => input.click());

    // Keyboard accessibility
    zone.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });

    // File selected via dialog
    input.addEventListener('change', () => updateFileLabel(input, label));

    // Drag & drop
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('border-primary', 'bg-blue-50/50');
    });
    zone.addEventListener('dragleave', e => {
      if (!zone.contains(e.relatedTarget)) {
        zone.classList.remove('border-primary', 'bg-blue-50/50');
      }
    });
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('border-primary', 'bg-blue-50/50');
      if (e.dataTransfer.files.length > 0) {
        input.files = e.dataTransfer.files;
        updateFileLabel(input, label);
      }
    });
  });
}

function updateFileLabel(input, label) {
  if (!label) return;
  const t = translations[currentLang];
  if (input.files && input.files.length > 0) {
    const name = input.files[0].name;
    const size = (input.files[0].size / 1024).toFixed(0);
    label.textContent = `${name} (${size} KB)`;
    label.classList.add('text-primary', 'font-medium');
    label.classList.remove('text-slate-400');
  } else {
    label.textContent = t ? t.common.noFile : 'No file chosen';
    label.classList.remove('text-primary', 'font-medium');
    label.classList.add('text-slate-400');
  }
}

// ============================================================
// FORM SUBMIT
// ============================================================
function submitForm() {
  const btnNext = document.getElementById('btn-next');
  const t = translations[currentLang];

  if (btnNext) {
    btnNext.disabled = true;
    btnNext.innerHTML = `
      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span>${t ? t.common.loading : 'Sending...'}</span>`;
  }

  // TODO: Replace with actual backend/API call
  setTimeout(() => {
    showSuccessScreen();
  }, 1500);
}

function showSuccessScreen() {
  const t = translations[currentLang];
  const successT = t && t[pageName] && t[pageName].success ? t[pageName].success : {
    title: 'Submitted!',
    message: 'Thank you for your submission.',
  };

  const formCard = document.getElementById('form-card');
  const navButtons = document.getElementById('nav-buttons');
  const progressContainer = document.getElementById('progress-container');

  if (formCard) {
    formCard.innerHTML = `
      <div class="text-center py-12 px-4">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-[#1E293B] mb-3">${successT.title}</h2>
        <p class="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">${successT.message}</p>
      </div>`;
  }
  if (navButtons) navButtons.style.display = 'none';
  if (progressContainer) progressContainer.style.display = 'none';
}
