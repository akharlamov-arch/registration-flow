# ATTANTION-PAGE-01 — рабочая копия portal-demo на `/attantion`

**Статус:** готово к ревью
**Дата:** 2026-09-23 (обновлено: визуал контрактной вкладки восстановлен + реальные гейты на `/portal` теперь ведут на `/attantion`)

## Задача

Сделать копию страницы `portal-demo` (`src/pages/portal-demo/`) по адресу
`/attantion`, но без демо-симуляций — обе вкладки должны быть по-настоящему
рабочими, переиспользуя уже существующий функционал вместо повторной его
реализации. Визуал вкладки «Updated contract details» должен остаться ровно
таким же, как в `portal-demo` (карточки `Step1Contract.jsx`/`fields.js`), а не
превращаться в модальное окно.

## Что сделано

### Вкладка «Updated contract details»

Визуал (`Step1Contract.jsx`, группы полей `fields.js`) скопирован **без
изменений** — тот же порядок карточек, те же радио-кнопки «то же самое, что
и…», та же кнопка «Sign updated contract» / «Submit changes». Изменилась
только начинка:

- **Загрузка** — вместо демо-заглушки (`initialForm(customer)` на основе
  профиля лида) данные подтягиваются реальным
  `fetchContractSubject` (`src/api/portal.js`), тем же вызовом, что использует
  [`PortalContractForm.jsx`](../../src/components/PortalContractForm.jsx) внутри
  модалки `PortalContractUpdateGate`.
- **Сохранение** — вместо `console.log` + `setTimeout` реальный
  `submitContractSubject`, тот же эндпоинт `/api/portal/contract/send`.
- **Маппинг полей** — новый модуль
  [`formState.js`](../../src/pages/attantion/formState.js):
  `initialFormFromSubject`/`initialChoicesFromSubject` (реальный субъект →
  плоские `values`/`choices` демо-формы) и `buildContractPayload` (обратно, в
  форму реального API). Поля, которых нет в `fields.js` (`account`,
  `billing_schedule`, `is_business?`, e-mail/должность самого подписанта) —
  передаются **как есть** из последнего загруженного субъекта, чтобы
  сохранение через урезанный набор полей никогда не затирало то, что эта
  вкладка не показывает. `business_type` конвертируется между коротким кодом
  демо-формы (`llc`) и каноничной меткой CRM (`LLC`) в обе стороны
  (`Pijb.Contracts.PortalSubmission` — `@business_type_options`).
- **Ошибки сервера** — `mapServerErrors` раскладывает `data.errors` обратно на
  поля демо-формы (подсвечивает нужный инпут); то, что не сопоставляется
  (вложенные `company_address`/`billing_contact` и т.п.), уходит в общий баннер
  над формой.
- **Файл водительских прав** — [`Attachment.jsx`](../../src/pages/attantion/Attachment.jsx)
  теперь по-настоящему грузит файл в S3 (`presignUpload` + `uploadToS3` из
  `src/api/portal.js`, тот же флоу, что уже использует
  `src/pages/PortalPage.jsx`), а не просто запоминает имя файла. `token`
  прокинут через `Step1Contract` → `DemoField` → `Attachment`.
- Уже подписанный контракт по-прежнему показывает `ContractSigned.jsx` (без
  изменений); кнопка «Change request» открывает ту же самую форму повторно —
  в реальности это один и тот же эндпоинт что при первом заполнении, отдельного
  админ-одобряемого «change request» тут нет (в отличие от `PortalPage.jsx`).

### Вкладка «Bank account»

Кнопка «Connect with Plaid» в [`Step2Bank.jsx`](../../src/pages/attantion/Step2Bank.jsx)
вместо симулированной задержки + фиктивного `exchangeRelink('public-demo-token')`
теперь запускает ту же последовательность, что и кнопка «Verify» в
[`PortalBankVerificationGate.jsx`](../../src/components/PortalBankVerificationGate.jsx):
`usePlaidLink` → `createPlaidVerificationSession` → `fetchRelinkLinkToken` →
реальное окно Plaid Link → `exchangeRelink`. Ошибки обмена отображаются через
общий `PlaidExchangeErrorPanel`.

### Общее

- `signed`/`linked` — не локальный стейт с «мгновенным» переключением, а
  вычисляются из настоящих полей ответа `/api/portal/me` (`contract.stale`,
  `bank_verification.plaid_linked`), как и `PortalPage.jsx`. Обновляются через
  `refresh()` после успешной отправки контракта / Plaid-обмена.
- MOOV-фолбэк, история банка, библиотека документов, вход в портал —
  скопированы без изменений (реальный `/api/portal` слой, кроме demo-only
  login/policies эндпоинтов в `src/pages/attantion/api.js`, тоже скопированных
  как есть).
- Найденный и исправленный попутный баг: необработанный reject в
  `getPolicies` (CORS/эндпоинт не задеплоен) вешал вкладку «Documents &
  policies» в вечном спиннере — добавлен `.catch()`.

### Реальные гейты на `/portal` теперь ведут на `/attantion`

Кнопки в [`PortalBankVerificationGate.jsx`](../../src/components/PortalBankVerificationGate.jsx)
(«Verify») и [`PortalContractUpdateGate.jsx`](../../src/components/PortalContractUpdateGate.jsx)
(«Update») на настоящей странице `/portal` (`PortalPage.jsx`) больше не
выполняют действие на месте (реальный Plaid / реальная модалка контракта) —
они переходят на `/attantion`:

- **Verify** → вкладка «Bank account», вкладка «Updated contract details»
  заблокирована.
- **Update** → вкладка «Updated contract details», вкладка «Bank account»
  заблокирована.

Блокировка снимается **не по таймеру и не навсегда**, а как только реальное
состояние того гейта, который привёл сюда, разрешается (`contract.stale`
становится `false` / `bank_verification.plaid_linked` становится `true`) —
это то же самое условие, что уже управляет статусами шагов ("Action
required"/"Completed"), просто применённое и к соседней вкладке. Обычный
прямой заход на `/attantion` (не через гейт) — обе вкладки как обычно
доступны.

Токен сессии передаётся через `navigate(..., { state: { token, entry } })` —
**не через URL** (это bearer-токен, а строка запроса — не место для
чувствительных данных): клиент уже авторизован на `/portal`, поэтому повторный
логин на `/attantion` не требуется. Сразу после первого рендера это состояние
затирается (`navigate(path, { replace: true, state: null })`), потому что
`history.state` браузера иначе переживает обычную перезагрузку той же вкладки
и держал бы блокировку вечно; `Stepper` также сбрасывает её явно при Sign out,
чтобы новый логин в той же вкладке браузера не наследовал гейт от предыдущей
сессии.

`onVerified`/`onSent` (колбэки, которые раньше обновляли сводку на месте после
завершения) убраны из обоих компонентов вместе с мёртвым `handleBankVerified`
в `PortalPage.jsx` — теперь это просто больше не нужно, всё завершается на
`/attantion`.

## Проверка

- `npm run build` — без ошибок.
- Полная ручная проверка в браузере против реального бэкенда (`pijb-phx` на
  `:4000`), тестовый клиент **PORTAL GATE TEST LLC**
  (`portal-gate-test@example.test`, `id=21`, специально заведён для проверки
  гейтов — `contract.stale = true`):
  - Вход по одноразовому коду (реальные `/api/portal/request-code` +
    `/verify-code`, код прочитан из dev-почтового ящика `:4000/dev/mailbox`).
  - Вкладка контракта подтянула реальные значения (`Dana Reyes`,
    `PORTAL GATE TEST LLC`, `discount_tier: 3`, ранее загруженный
    `driver_license_file_name: dl.pdf`), форма заполнена и отправлена —
    `submitContractSubject` дошёл до `Pijb.Contracts.PortalSubmission.submit/2`,
    changeset сохранился корректно (проверено также напрямую через
    `mix run` на бэкенде: сохранённый `contract_data` содержит все поля с
    правильной формой, включая `business_type: "llc"`/`"LLC"` и
    вложенные адреса/`billing_contact`).
  - Финальный шаг (`SigningService.send_prepared`) вернул `{:error,
    :token_not_available}` — в этом деве не настроен Google OAuth credential
    для генерации превью-документа. Это инфраструктурный пробел дев-окружения
    (тот же класс, что отсутствующие `PLAID_SECRET`/`PLAID_CLIENT_ID`), **не
    баг маппинга** — UI показал корректный баннер «We could not send the
    contract. Please try again shortly.» без падений и без потери введённых
    данных.
  - Вкладка банка: «Connect with Plaid» дошла до реального
    `createPlaidVerificationSession`/`fetchRelinkLinkToken` и корректно
    показала «Failed to create Plaid link token» — тоже ожидаемо без
    `PLAID_SECRET`/`PLAID_CLIENT_ID` в этом деве.
  - Реальный `/portal` → «Update» → `/attantion` открылся сразу на вкладке
    контракта с реальными данными **без повторного логина** (сессия
    перенесена через `router state`), «Bank account» показывала иконку замка
    и текст «Locked», клик по ней ничего не делал.
  - Найден и исправлен баг при первой попытке: `history.state` браузера
    переживает обычную перезагрузку той же вкладки — прямой заход на
    `/attantion` без перехода через гейт (и даже повторный логин после Sign
    out в той же вкладке браузера) ошибочно наследовал блокировку от
    предыдущего перехода. Исправлено: `entry` захватывается в стейт компонента
    один раз при монтировании и вычищается из `history.state`
    (`navigate(path, { replace: true, state: null })`) сразу после первого
    рендера, плюс явный сброс в `Sign out`. Перепроверено: обычный логин
    (без перехода с `/portal`) после исправления показывает обе вкладки
    открытыми, включая после `window.location.reload()`.

## Вне рамок задачи

- Сама логика `PortalContractForm` / `PortalBankVerificationGate` /
  `usePlaidLink` не менялась — переиспользована как есть.
- Страница `portal-demo` (оригинал) не затронута.
- Google OAuth / Plaid credentials для локального деве — инфраструктура,
  `pijb-phx` не трогали.
