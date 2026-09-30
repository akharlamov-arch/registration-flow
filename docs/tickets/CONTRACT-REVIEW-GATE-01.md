# CONTRACT-REVIEW-GATE-01 — "under review" state for a gated re-sign

> **Main ticket lives in `pijb-phx`**:
> `docs/archive/completed-tickets/CONTRACT_UPDATE_REVIEW_GATE_TICKET.md`
> (CRM-CONTRACT-REVIEW-01). This file is the frontend-only companion note, the
> same pattern `ATTANTION-PAGE-01.md` uses for its own backend-ticket
> cross-reference.

**Статус:** готово
**Дата:** 2026-09-30

## Задача

Once a customer's contract version is past `"v1"` (CRM-CONTRACT-VERSION-02, a
backend-only concept — this repo never computes it), the backend no longer
opens a Zoho embedded-signing request when the customer presses "Sign updated
contract". Instead it stages the submission for operator review and returns
`{success: true, status: "pending_review"}` from the **same**
`POST /api/portal/contract/sign` endpoint. This repo's job was purely the
client-side reaction to that new response shape — no new endpoint, no new
gate logic here.

## Что сделано

- `src/pages/attention/AttentionPage.jsx` — `handleSign` branches on
  `data?.status === 'pending_review'` (and the `CONTRACT_UPDATE_PENDING_REVIEW`
  409 code, for the rare race where a second Sign attempt reaches the server
  while the first proposal is still pending): either way it just `refresh()`es
  rather than opening `ContractSigningFrame`. A new derived value,
  `pendingReview = contract?.update_review?.status === 'pending'`, mirrors how
  `resumable` already reads `contract.pending` — both come from the real
  backend summary on every render, never a locally-faked flag. `renderContractTab()`
  gained an unconditional branch for it (no "edit and resubmit" escape hatch,
  unlike the resumable-embedded-request case — the server refuses a second
  submission outright while one is pending, per the product decision recorded
  in the main ticket's §4).
- `src/pages/attention/ContractSigningStatus.jsx` — new `ContractUnderReview`
  export, styled like the existing `ContractPending`/`ContractConfirming` in
  the same file (a `PenBadge`-style icon badge + title + body, no actions).
- The Stepper's step-1 state also reads `pending` (already a supported state
  with its own `attention.steps.pending` copy and amber styling — reused
  as-is, not invented) while a review is outstanding, alongside the existing
  `locked`/`done`/`active`.
- `src/data/translations.js` — `attention.signing.underReviewTitle` /
  `underReviewBody` / `updatePendingReview`, added to all four locales
  (en/ru/uk/es) next to the existing `signing.pendingTitle`/`pendingBody`.

## Как проверено

`npm run build` (this repo has no automated test runner — see its own
`CLAUDE.md`) plus a real end-to-end walkthrough against the live `pijb-phx`
dev backend: a gated portal customer + session token were seeded directly via
`Pijb.Customers.Portal.{Credentials, Sessions}` in a `mix run` script (no
customer/password touched other than a disposable one created for this), a
real `POST /contract/sign` was sent, and the running dev app (this repo,
`npm run dev`) was reloaded against it — confirming the "Your updated details
are under review" panel renders with the Step 1 rail reading "Awaiting
review". Test data was deleted afterward.

This walkthrough is also what caught a real bug on the `pijb-phx` side (fixed
there, not here): the first draft added `update_review` to the wrong endpoint's
response. See the main ticket's §15 for the full account — nothing in this
repo needed to change because of it.

## Out of scope (per the main ticket's §12/§4)

- Letting the customer edit/resubmit while a review is pending — the panel is
  informational only, by design.
- Any visual treatment of a *blocked* proposal — blocking does not
  automatically notify the customer (main ticket §4), so there is currently no
  distinct portal-side state for it; a blocked customer simply sees the same
  "Action required" form again once an operator follows up and the pending
  proposal is gone.
