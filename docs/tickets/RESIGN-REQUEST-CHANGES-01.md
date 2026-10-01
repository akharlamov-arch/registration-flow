# RESIGN-REQUEST-CHANGES-01 — «Request Changes» вместо «Sign updated contract» при переподписании

> Продолжение [`CONTRACT-REVIEW-GATE-01`](CONTRACT-REVIEW-GATE-01.md) (CRM-CONTRACT-REVIEW-01):
> бэкенд уже отправляет self-serve переподписание клиента с версией контракта
> выше `v1` на ревью оператора, но кнопка продолжала называться «Sign updated
> contract» и обещала подпись, которой не будет.

**Статус:** готово к ревью
**Дата:** 2026-10-01

## Задача

1. Клиенту, чьё переподписание уходит на ревью (версия контракта выше `v1`, т.е.
   `v1.1+`), кнопка на вкладке «Updated contract details» должна называться
   **Request Changes**, а не «Sign updated contract». Клиенты, которые подписывают
   впервые (или `v1` без гейта), видят прежнюю кнопку.
2. После нажатия клиента возвращает на стартовую страницу (Overview) и там над
   карточками показывается сообщение: «We've got your request. Please wait for an
   email to sign the updated agreement after a short review.»

## Решение

### Как фронт узнаёт, что это переподписание

Правило остаётся **на сервере** (`Pijb.Leads.ContractStatus.requires_manual_review?/1`,
то же, что решает при `POST /contract/sign`), фронт его не вычисляет и не копирует.
В блок `contract` ответа `/api/portal/me` / `/api/portal/session` /
`/api/portal/contract` добавлено булево поле **`review_required`** — «следующее
self-serve переподписание этого клиента пойдёт на ревью». Фронт читает его заранее,
чтобы подписать кнопку до нажатия. Fail-closed: нет поля / не `true` → обычный
флоу «Sign updated contract».

### Бэкенд (`pijb-phx`, ветка `CONTRACTS-TASK-LIFECYCLE`, где живёт гейт)

- `lib/pijb/customers/portal.ex` — новая `Portal.contract_summary/1`:
  `Freshness.summary/1` + `update_review` + `review_required`. Раньше этот блок
  собирался копипастой в двух местах (`Portal.summary/1` и
  `CustomerPortalContractController.show/2`) — теперь оба зовут одну функцию.
- `lib/pijb_web/controllers/customer_portal_contract_controller.ex` — `show/2`
  использует `Portal.contract_summary/1`.
- `test/pijb/customers/portal_test.exs` — два теста: голый fixture →
  `review_required: true`; baselined (`legacy_signed: true`) → `false`.

### Фронтенд (`registration-flow`)

- `src/data/translations.js` — новый блок `attention.review` во всех четырёх
  локалях (en/ru/uk/es): заголовок, пояснение, `submit: 'Request Changes'`, `busy`,
  `ready`, `idle`, `requestReceived`.
- `src/pages/attention/AttentionPage.jsx` — `reviewRequired = contract?.review_required === true`;
  `mode` у `Step1Contract` теперь `review` / `change` / `sign`. После ответа
  `pending_review` (или 409 `CONTRACT_UPDATE_PENDING_REVIEW`) — `refresh()`, сброс
  режима редактирования, `setStep('overview')` и прокрутка вверх.
- `src/pages/attention/Overview.jsx` — проп `requestReceived`; зелёный баннер над
  карточками, пока `contract.update_review.status === 'pending'` (переживает
  перезагрузку — состояние берётся с сервера, не локальный флаг).

## Проверка

- Бэкенд: `mix test test/pijb/customers/portal_test.exs test/pijb_web/controllers/customer_portal_contract_controller_test.exs` — 22 теста, 0 падений.
- Фронт: `npm run build` — без ошибок.
- Браузер (временный стаб бэкенда + второй Vite на :5174, оба убраны):
  - `review_required: true` → вкладка контракта: заголовок «Request changes to your
    contract», кнопка **Request Changes**; после заполнения и нажатия — возврат на
    Overview, баннер с сообщением, шаг в степпере «Awaiting review». Ошибок в консоли нет.
  - `review_required: false` → кнопка «Sign updated contract» (прежнее поведение).
- Реальный dev-бэкенд `:4000` крутится на ветке `LEAD-PLAID`, где гейта ещё нет,
  поэтому сквозная проверка против него невозможна до слияния `CONTRACTS-*`.

## Важно / допущения

- «Выше v1.1» понято как правило гейта, которое уже есть на сервере: `версия не в [nil, "v1"]`
  (то есть `v1.1` и выше). Если порог должен быть строго выше `v1.1` (т.е. `v1.2+`),
  менять нужно `requires_manual_review?/1` — тогда кнопка и сервер поменяются вместе.
- Формулировка сообщения слегка выправлена грамматически
  («please waiting email…» → «Please wait for an email…»). Правится одной строкой
  `attention.review.requestReceived`.
- **Порядок выкатки:** бэкенд с `review_required` должен выехать раньше или вместе с
  фронтом; на старом бэкенде фронт просто покажет прежнюю кнопку.

## Вне рамок

- Отдельное состояние для заблокированной оператором заявки (см. CONTRACT-REVIEW-GATE-01).
- Правка/повторная отправка, пока заявка на ревью.
