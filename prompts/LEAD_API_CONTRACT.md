# Lead Controller — Public API Contract

**Base URL:** `/api`
**Content-Type:** `application/json` (except `upload_document` which is `multipart/form-data`)

## Authentication

Most endpoints require one of:
- **`sessionToken`** — preferred; pass as query param or JSON body field `sessionToken`
- **`code` / `otpCode` / `verificationCode`** — deprecated raw security code (still accepted for backward compatibility)

---

## 1. Create Lead

```
POST /api/leads/save
```

**Request body:**
```json
{
  "form": {
    "firstName": "string",
    "lastName": "string",
    "companyAddress": {
      "line1": "string",
      "line2": "string",
      "city": "string",
      "state": "string",
      "zip": "string"
    },
    "mailingAddressChoice": "same-as-company | custom",
    "mailingAddress": { "line1": "", "line2": "", "city": "", "state": "", "zip": "" },
    "bank": {
      "name": "string",
      "accountType": "Checking | Savings",
      "routingNumber": "string",
      "accountNumberMasked": "string",
      "accountNumberMaskedConfirm": "string"
    },
    "personal": {
      "ssnLast4Masked": "string",
      "driverLicenseNumber": "string"
    },
    "personalAddressChoice": "same-as-business | custom",
    "personalAddress": { "line1": "", "line2": "", "city": "", "state": "", "zip": "" },
    "billingChoice": "self | other",
    "billingContact": { "name": "", "role": "", "email": "" },
    "files": {
      "voidCheck": { "field": "voidCheck", "filename": "stored-filename.pdf" },
      "driverLicenseScan": { "field": "driverLicenseScan", "filename": "stored-filename.pdf" }
    },
    "acceptTerms": true
  },
  "stepCompleted": 3,
  "email": "user@example.com",
  "accountType": "PP_BUSINESS"
}
```

**Responses:**

| Status | Body |
|--------|------|
| `201 Created` | `{ "id": "lead-id", "message": "Lead created successfully" }` |
| `400 Bad Request` | `{ "error": "reason string" }` |
| `422 Unprocessable Entity` | `{ "errors": { "field": ["message"] } }` |

---

## 2. Fetch Lead by OTP Code (Verify & Consume Code)

```
GET /api/leads/fetch_by_code?code=123456
```
Also accepts: `?otpCode=123456`

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` (approved/in_progress) | `{ "success": true, "session_token": "token", "lead": {...}, "step_completed": 3, "document_id": "gdrive-id" }` (`document_id` omitted if not present) |
| `200 OK` (pending) | `{ "success": true, "pending": true, "session_token": "token", "lead": {...}, "step_completed": 3 }` |
| `401 Unauthorized` | `{ "success": false, "code": "OTP_INVALID_OR_USED", "message": "Invalid or used code" }` |

> **Note:** The OTP code is consumed (invalidated) on successful call. Store the returned `session_token` for all subsequent requests.

---

## 3. Validate Session

```
GET /api/leads/validate-session?sessionToken=<token>
```
Also accepts `sessionToken` in request body.

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "lead": {...}, "step_completed": 3 }` |
| `401 Unauthorized` | `{ "success": false, "code": "INVALID_SESSION", "message": "Invalid or expired session" }` |
| `400 Bad Request` | `{ "success": false, "code": "MISSING_CREDENTIALS", "message": "..." }` |

---

## 4. Request New Code (Email Recovery)

```
POST /api/leads/request-new-code
```

**Request body:**
```json
{ "email": "user@example.com" }
```

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "message": "If this email is associated with an approved application, a new code has been sent." }` |
| `400 Bad Request` | `{ "success": false, "error": "email is required" }` |

> **Note:** Always returns `200` regardless of whether the email exists (anti-enumeration).

---

## 5. Update Lead

```
POST /api/leads/update-lead
```

**Request body:**
```json
{
  "sessionToken": "token",
  "form": { },
  "stepCompleted": 4
}
```

The `form` shape is a subset of the registration fields used in `create`. Only provided fields are applied.

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "lead": {...} }` |
| `401 Unauthorized` | `{ "success": false, "code": "INVALID_SESSION", "message": "..." }` |
| `400 Bad Request` | `{ "success": false, "code": "MISSING_CREDENTIALS", "message": "..." }` |

---

## 6. Generate Contract

```
POST /api/leads/generate_contract
```

**Request body:**
```json
{
  "sessionToken": "token",
  "form": {
    "bank": {
      "name": "string",
      "routingNumber": "9-digit string",
      "accountNumberMasked": "5-17 digit string"
    },
    "plaid": {
      "requiresManualBankInput": true
    }
  }
}
```

> **Note:** If Plaid verification returned `requires_manual_bank_input: true`, the `bank` fields are required. The full registration `form` shape (same as create) is accepted here.

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "document_id": "gdrive-doc-id", "document_filename": "" }` |
| `401 Unauthorized` | `{ "success": false, "code": "INVALID_SESSION", "message": "..." }` |
| `422 Unprocessable Entity` | `{ "success": false, "error": "Manual bank details are required before final submission for tokenized Plaid accounts" }` |

---

## 7. Get Signing Embed URL

```
POST /api/leads/sign_embed_url
```

**Request body:**
```json
{
  "sessionToken": "token",
  "documentId": "google-drive-doc-id"
}
```

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "sign_url": "https://..." }` |
| `400 Bad Request` | `{ "success": false, "error": "documentId is required" }` |
| `400 Bad Request` | `{ "success": false, "error": "Lead is missing email address required for signing" }` |
| `400 Bad Request` | `{ "success": false, "error": "Lead is missing name required for signing" }` |
| `403 Forbidden` | `{ "success": false, "error": "Document does not belong to this lead" }` |
| `503 Service Unavailable` | `{ "success": false, "error": "Google Drive token not available" }` |
| `500 Internal Server Error` | `{ "success": false, "error": "Failed to generate signing URL" }` |

---

## 8. Complete Signing

```
POST /api/leads/complete-signing
```

**Request body:**
```json
{ "sessionToken": "token" }
```

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true }` |
| `401 Unauthorized` | `{ "success": false, "code": "INVALID_SESSION", "message": "..." }` |

---

## 9. Upload Document

```
POST /api/leads/upload_document
Content-Type: multipart/form-data
```

**Form fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `sessionToken` | string | yes (or `code`) | Auth token |
| `field` | string | yes | `voidCheck`, `driverLicenseScan`, or `fuelInvoice` |
| `file` | binary | yes | PDF, JPEG, PNG, WEBP, or GIF; max 10 MB |

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "fileName": "stored-filename.pdf", "field": "voidCheck" }` |
| `400 Bad Request` | `{ "success": false, "error": "field must be voidCheck, driverLicenseScan, existingProgram" }` |
| `400 Bad Request` | `{ "success": false, "error": "file is required" }` |
| `400 Bad Request` | `{ "success": false, "error": "Invalid file type. Please upload a PDF or image file." }` |
| `400 Bad Request` | `{ "success": false, "error": "File is too large. Maximum allowed size is 10MB." }` |
| `401 Unauthorized` | `{ "success": false, "code": "INVALID_SESSION", "message": "..." }` |

> **Note:** The returned `fileName` must be passed in the `files` map when calling `generate_contract`.

---

## 10. Set Fuel Cards

```
POST /api/leads/set_fuel_cards
```

**Request body:**
```json
{
  "sessionToken": "token",
  "fuelCards": [
    { "unit": 1, "driverId": "D001" },
    { "unit": 2, "driverId": "D002" }
  ]
}
```

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "fuel_cards_count": 2, "message": "Fuel cards saved successfully" }` |
| `400 Bad Request` | `{ "success": false, "error": "reason" }` |
| `401 Unauthorized` | `{ "success": false, "code": "INVALID_SESSION", "message": "..." }` |
| `422 Unprocessable Entity` | `{ "success": false, "errors": { "field": ["msg"] } }` |

---

## 11. Plaid — Get Link Token (Step 5 Bank Verification)

```
POST /api/leads/plaid/link-token
```

**Request body:**
```json
{ "sessionToken": "token" }
```

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "link_token": "link-sandbox-...", "expiration": "ISO8601", "request_id": "..." }` |
| `422 Unprocessable Entity` | `{ "success": false, "code": "LEAD_NOT_ELIGIBLE", "message": "..." }` |
| `502 Bad Gateway` | `{ "success": false, "code": "PLAID_LINK_TOKEN_FAILED", "message": "...", "request_id": "..." }` |

---

## 12. Plaid — Get Combined Link Token (Auth + Identity Verification)

```
POST /api/leads/plaid/combined-link-token
```

**Request body:**
```json
{ "sessionToken": "token" }
```

**Responses:**

| Status | Body |
|--------|------|
| `200 OK` | `{ "success": true, "mode": "single_session_probe", "link_token": "...", "expiration": "ISO8601", "request_id": "...", "identity_verification_template_id": "..." }` |
| `422 Unprocessable Entity` | `{ "success": false, "code": "LEAD_NOT_ELIGIBLE", "message": "..." }` |
| `503 Service Unavailable` | `{ "success": false, "code": "PLAID_COMBINED_FLOW_UNAVAILABLE", "message": "Identity Verification template is not configured" }` |
| `502 Bad Gateway` | `{ "success": false, "code": "PLAID_LINK_TOKEN_FAILED", "message": "...", "request_id": "..." }` |

---

## 13. Plaid — Exchange Public Token

```
POST /api/leads/plaid/exchange
```

**Request body:**
```json
{
  "sessionToken": "token",
  "publicToken": "public-sandbox-...",
  "accountId": "plaid-account-id",
  "metadata": {
    "link_session_id": "...",
    "institution": { "name": "Chase" },
    "accounts": [
      { "id": "account-id", "mask": "0000", "subtype": "checking" }
    ]
  }
}
```

**Success response `200 OK`:**
```json
{
  "success": true,
  "step_completed": 5,
  "next_step": 6,
  "requires_manual_bank_input": false,
  "plaid": {
    "plaid_item_id": "...",
    "plaid_account_id": "...",
    "institution_name": "Chase",
    "account_mask": "0000",
    "account_subtype": "checking",
    "holder_category": "personal | business | null",
    "is_tokenized_account_number": false,
    "request_id": "..."
  }
}
```

> **Tokenized account note:** If `requires_manual_bank_input: true` and `is_tokenized_account_number: true`, `step_completed` is unchanged and `next_step` is `5`. The front end must collect manual bank details and pass them in `generate_contract`.

**Error responses:**

| Status | Code | Meaning |
|--------|------|---------|
| `400 Bad Request` | `PLAID_PUBLIC_TOKEN_REQUIRED` | `publicToken` missing |
| `400 Bad Request` | `PLAID_ACCOUNT_ID_REQUIRED` | `accountId` missing |
| `401 Unauthorized` | `INVALID_SESSION` | Bad/expired session |
| `422 Unprocessable Entity` | `LEAD_NOT_ELIGIBLE` | Lead status not eligible |
| `422 Unprocessable Entity` | `PLAID_NO_ELIGIBLE_ACCOUNT` | No checking/savings account with ACH routing found |
| `502 Bad Gateway` | `PLAID_AUTH_DATA_UNAVAILABLE` | Plaid auth data fetch failed |
| `502 Bad Gateway` | `PLAID_TOKEN_EXCHANGE_FAILED` | Token exchange API call failed |

---

## Common Error Shape

All error responses follow one of these shapes:

```json
{ "success": false, "code": "ERROR_CODE", "message": "Human readable message" }
{ "success": false, "error": "Human readable message" }
{ "success": false, "errors": { "field": ["validation message"] } }
```

---

## Typical Registration Flow

```
1. POST /api/leads/save               → lead created
2. GET  /api/leads/fetch_by_code      → OTP verified, receive session_token
3. POST /api/leads/upload_document    → upload voidCheck, driverLicenseScan
4. POST /api/leads/update-lead        → save step progress
5. POST /api/leads/plaid/link-token   → get Plaid link_token
   → (Plaid Link UI runs client-side)
6. POST /api/leads/plaid/exchange     → exchange public_token
7. POST /api/leads/generate_contract  → create contract document
8. POST /api/leads/sign_embed_url     → get Zoho signing URL
   → (user signs in embedded iframe)
9. POST /api/leads/complete-signing   → mark lead as signed
```
