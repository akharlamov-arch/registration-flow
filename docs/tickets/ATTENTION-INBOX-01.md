# ATTENTION-INBOX-01 — a contract emailed for signature has its own state

> Follow-up found in [`ATTENTION-DIRECT-OPEN-01`](ATTENTION-DIRECT-OPEN-01.md).
> Backend half: `pijb-phx` **AGREEMENTS-TASK-02**
> (`docs/tickets/AGREEMENTS_TASK_PER_PROPOSAL_TICKET.md`) — without it, the
> secondary action below can lose an operator's review item.

**Статус:** готово к ревью
**Дата:** 2026-10-02

## Задача

A contract can be out for signature **by email**: an operator approved the
customer's change request (the Agreements card moves to *In progress*), or sent
the contract from the CRM by hand. The summary then says
`contract.pending = { delivery: "email", sent_at }`.

The portal had no state for it. The contract tab read *Action required* and
offered the editable form again, and nothing said "check your email":

- on the review track, **Request Changes** staged a *second* proposal. Only a
  pending one blocks another, so this was allowed, and on the backend before
  AGREEMENTS-TASK-02 it lost that proposal's review card when the customer
  signed the emailed contract;
- otherwise, **Sign updated contract** opened an in-place request that replaced
  the emailed one, without saying so.

## Решение

### Contract tab — `ContractInInbox` (`src/pages/attention/ContractSigningStatus.jsx`)

When `contract.pending.delivery === 'email'` and the customer is not already
editing, the tab shows **"Your updated contract is in your inbox"**: when it was
sent, a pointer to the email from Zoho Sign, and a spam-folder hint. It is the
emailed sibling of `ContractPending` (an embedded request: *Resume signing*).

The form is still one deliberate click away, labelled for what it will do:

| Track (`contract.review_required`) | Secondary action | Says |
|---|---|---|
| `true` | **Request more changes** | the request goes to review; until a new contract is sent, the emailed one is still the one to sign |
| otherwise | **Change my details and sign here instead** | signing here replaces the emailed contract |

Both stay available on purpose. A customer who finds a mistake in the emailed
contract has a legitimate reason to ask again, and signing in place was the
deliberate PORTAL-SIGN-02 path for an operator-sent contract. Neither is the
default any more. The form's **Cancel** returns to this panel.

Precedence in `renderContractTab` is unchanged except for the new branch: a
pending review (`update_review`) still wins, then an embedded request, then an
emailed one, then the form.

### Overview — `src/pages/attention/Overview.jsx`

A banner above the cards, **"Your updated contract is waiting in your inbox…"**,
the emailed counterpart of "We've got your request". The landing page is where
a returning customer arrives, and the contract card alone ("Update details")
gave no hint that a signature was owed.

The rail keeps *Action required*: a signature really is owed.

### Shared date format — `src/pages/attention/dates.js`

`formatLongDate` (moved out of `ContractSigned.jsx`) is now used by both
contract panels. `BankHistory`, `BankCodeEntry` and `PoliciesLibrary` keep their
own formatters. They print different formats (`Oct 2, 2026`, `Oct 3`, and a
raw-string fallback), so folding them in is a separate cleanup.

### Copy — `src/data/translations.js`

`attention.signing.inbox*` and `attention.hub.inboxBanner` in en/ru/uk/es.

### Which track an emailed customer is on

`review_required` is read from the server, as always. One case looked odd:
a customer with no Zoho signing history (manual contract entry, imported
contract) reads `review_required: false` while a contract is out. The version
is derived from archived versions, and they have none. That is intended: those
contracts count as old and must be re-signed anyway, so these customers get the
sign-track panel ("…sign here instead").

## Проверка

- `npm run build`: no errors. Every new key resolves in en/ru/uk/es.
- Browser, against JSON captured from the **real** pijb endpoints with
  AGREEMENTS-TASK-02 applied. The approve pipeline ran for real, with only Zoho,
  the renderer and the PDF export mocked:

  | Captured state | Page |
  |---|---|
  | Review track, approved, emailed | overview banner "waiting in your inbox", rail *Action required*; tab → inbox panel, "Sent on October 2, 2026.", **Request more changes** + its note |
  | …Request more changes | form in review mode (**Request Changes**, Cancel → back to the panel); submitted → overview with *both* banners, rail *Awaiting review*; tab → "under review" |
  | Sign track, operator-emailed (ru) | Russian panel, **Изменить данные и подписать здесь** → form, **Подписать обновлённый контракт** + Cancel |
  | No Zoho history, approved, emailed | sign-track panel (see above) |

- Phone width (375px): banners, panel and secondary button wrap correctly, with
  no horizontal scroll.

## Вне рамок

- A declined / recalled / expired Zoho request still reads as pending
  (`zoho_sign.revised` is not cleared), so the panel can point at a dead email.
  The sent date and the secondary action make that recoverable, not invisible.
  Modelling it is AGREEMENTS-TASK-01's follow-up.
- `attention.signed.note` (review-track wording), from ATTENTION-DIRECT-OPEN-01.
