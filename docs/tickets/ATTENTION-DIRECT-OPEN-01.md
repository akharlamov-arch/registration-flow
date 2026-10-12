# ATTENTION-DIRECT-OPEN-01 — overview "Update" opens the edit surface directly

> Follows [`RESIGN-REQUEST-CHANGES-01`](RESIGN-REQUEST-CHANGES-01.md) and
> [`CONTRACT-REVIEW-GATE-01`](CONTRACT-REVIEW-GATE-01.md). Frontend only — the
> backend half of RESIGN-REQUEST-CHANGES-01 (`contract.review_required`)
> shipped in `pijb-phx` PR #156 (`CONTRACTS-TASK-LIFECYCLE`, merged to `dev`
> 2026-10-02) and is checked against this page below.

**Статус:** готово к ревью
**Дата:** 2026-10-02

## Задача

The `#/attention` overview has two cards, **Update details** and **Update bank**,
each with an `Update` button. A customer whose contract and bank are already in
order had to click twice to reach anything they could change:

1. **Update details** → the "Updated contract signed" panel → `Update my
   details` → the form. A customer on an old contract got the form on the
   first click. Both should get it on the first click.
2. **Update bank** → the "Bank account verified" panel → `Link a different
   account` → the Plaid / MOOV card. The connect card should come first. The
   connection history stays as it is.

Also check that a customer on the review track (contract past `v1`, whose
update goes to operator review rather than an in-place signature) sees a
**Request Changes** button, not "Sign updated contract".

## Решение

### Contract tab — `src/pages/attention/AttentionPage.jsx`

The overview's contract card now calls `openContract`, which puts a signed
customer straight into edit mode (`editingContract`) before opening the tab.
Every other state renders exactly as before:

| Contract state | Before | After |
|---|---|---|
| Stale (old contract) | form | form (unchanged) |
| Signed, current | "signed" panel → form | **form** |
| Signed, request under review | "signed" panel → "under review" | **"under review"** |
| Embedded request half-signed | "Resume signing" panel | "Resume signing" panel (unchanged) |

The half-signed case keeps its panel on purpose: a fresh submit would create a
new Zoho request and supersede the one the customer was part-way through.
`signed` already implies no pending request (`contractSigned`), so the edit
flag cannot skip that panel.

`ContractSigned` stays — it is what a customer sees right after signing in
place, and where `Cancel` on the form returns a signed customer (default kept).

### Button label

No code change. `Step1Contract`'s `mode` is already
`review_required ? 'review' : signed ? 'change' : 'sign'`, and `attention.review.submit`
is **Request Changes** in all four locales. The label was wrong only because
no backend sent `contract.review_required` until `CONTRACTS-TASK-LIFECYCLE`
(PR #156). Wherever that is not deployed yet, the frontend fails closed to
"Sign updated contract", while the server still stages the submission for review
and the overview shows "request received".

### Bank tab — `src/pages/attention/Step2Bank.jsx`

`relinking` starts `true` for a connected customer, so the Plaid / MOOV card is
the first thing they see, with the existing "Still connected: …" strip above
it. `Keep current account` still shows the verified panel (default kept). The
tab remounts on every visit, so each visit starts the same way.

It does **not** start relinking while a bank change is already under way —
`bankChangeUnderWay(history)` (new, `src/components/bankDisplay.js`: any
`pending_review` / `pending_verification` entry, i.e. a MOOV submission or a
Plaid re-link staged for review) or a deposit code is awaited. Those customers
need the status / code-entry screen, which the connect card hides.

### Copy — `src/data/translations.js`

While relinking, the connect card said **"No account connected"** directly
under "Still connected: Chase ···· 4471". That was easy to miss behind a
click; as the landing view it is a contradiction. New keys
`attention.bank.relinkTitle` / `relinkBody` (en/ru/uk/es) — "Link a new bank
account", and that the current account stays in use until the new one takes
over.

## Проверка

- `npm run build` — no errors.
- Browser, against a scratch mock with one persona per state. The repo's
  `devtools/portal-mock-server.mjs` can't be used: it still returns the
  pre-`stale` contract shape and lands on "could not load the status".
  - Signed, `review_required: false` → one click to the form, **Sign updated
    contract**. Cancel → the "signed" panel.
  - Signed, `review_required: true` → one click to the form, **Request
    Changes**. Submitting → overview, "We've got your request" banner, rail
    "Awaiting review". A second Update → the "under review" panel directly.
  - Stale → form, "Sign updated contract" (unchanged).
  - Embedded request half-signed → "Resume signing" / "Change my details
    first" (unchanged).
  - Connected bank → the "Link a new bank account" card under "Still
    connected: Chase ···· 4471", history below. Keep current account → the
    verified panel.
  - Connected + MOOV submission under review, connected + Plaid re-link under
    review, connected + deposit code awaited → the verified panel with the
    submission / history / code-entry card, as before (no auto-relink).
  - No bank → "No account connected" card (unchanged).
  - Console: only the expected quiet 409 from the half-signed persona's
    load-time reconcile.
- Against the merged backend (`pijb-phx` `dev` @ `3c0e4b83`), in a scratch
  worktree: the touched suites pass (135 tests). A throwaway controller test
  (not committed) drove `GET /api/portal/session`, `/me` and `/contract` for
  each state. The `contract` block is exactly
  `{signed_on, stale, pending, update_review, review_required}` on all three.
  Sign → `pending_review`, then `update_review: {status: "pending"}`, then 409
  `CONTRACT_UPDATE_PENDING_REVIEW` on a second submit. That JSON, replayed
  through this page:

  | Server state | Page |
  |---|---|
  | Signed, no baseline (`review_required: true`) | one click → form, **Request Changes** |
  | Proposal pending | overview banner, rail "Awaiting review", Update → "under review" panel |
  | Signed, baselined v1 (`false`) | one click → form, **Sign updated contract**, Cancel |
  | No signature, baselined v1 | form, **Sign updated contract** |
  | No signature, no baseline (`true`) | form, **Request Changes** (the server stages it for review too) |

## Follow-up found while checking

**An approved update emailed for signature has no state on this page.** Once an
operator approves a proposal (the Agreements task moves to *In progress*), the
contract is e-mailed: `pending: {delivery: "email"}`, `update_review: null`.
The page then reads the contract as *Action required* and offers the editable
form again, never saying "check your email":

- on the review track, **Request Changes** stages a *second* proposal — only a
  `:pending` proposal blocks another (`UpdateProposals.pending_for_customer/1`),
  so an approved one does not;
- on the sign track, **Sign updated contract** opens an embedded request that
  supersedes the emailed one.

Needs a "your updated contract is in your inbox" panel for
`contract.pending.delivery === 'email'`, and likely a server-side refusal while
an approved proposal's contract is unsigned. Not done here.

## Вне рамок

- `attention.signed.note` still says "update them here and sign the updated
  contract", which a review-track customer will not do.
- Updating `devtools/portal-mock-server.mjs` to the current contract shape.
