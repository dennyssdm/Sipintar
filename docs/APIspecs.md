# SIPINTAR — API Specification (Future / Not Implemented)

**Status:** Planning placeholder only  
**Phase 1:** No REST API calls. Use local typed mock data.  
**Approval gate:** Do not implement a backend until the user approves the completed frontend and authorizes a backend design phase.

## 1. Purpose and boundary

This document records a provisional interface boundary so frontend code can be structured without pretending that a production API exists. The source documents do not define endpoints, authentication protocols, request schemas, or deployment details. The contracts below are proposals for later review, not approved production requirements.

## 2. Future API conventions (proposed)

- Base path: `/api/v1` (provisional).
- JSON request/response bodies.
- UTF-8.
- Consistent pagination, validation errors, and server-side authorization.
- Dates in ISO 8601 format with timezone where relevant.
- Never trust client-side role flags for authorization.
- API must enforce classification: Terbuka, Internal, Terbatas, Metadata Saja.
- Return only fields the requesting principal is authorized to see.
- File download routes must validate both document availability and authorization.
- Do not expose confidential records merely because a search query matches metadata.

## 3. Proposed resources

| Resource | Purpose | Status |
|---|---|---|
| `/auth/session` | Establish/check session | Proposed; auth method undecided |
| `/auth/logout` | End session | Proposed |
| `/search` | Unified search across allowed categories | Proposed |
| `/gadik` | Gadik competence profiles | Proposed |
| `/resources` | Modul, Hanjar, references, and other learning resources | Proposed |
| `/library/books` | Book catalogue metadata | Proposed |
| `/curriculum` | Curriculum and service standards | Proposed |
| `/documents` | SOP, Pedoman, Manual Book metadata | Proposed |
| `/admin/resources` | Create/update records | Proposed |
| `/admin/resources/{id}/verify` | Verification action | Proposed |
| `/admin/access-policies` | Access policy administration | Proposed |
| `/admin/monitoring` | Aggregate monitoring data | Proposed |

Endpoints are illustrative and may be renamed during backend design.

## 4. Proposed search query

`GET /api/v1/search?q={query}&category={category}&page={page}&pageSize={pageSize}`

Possible categories: `gadik`, `modul`, `hanjar`, `buku`, `taskap`, `referensi`.

Illustrative response:
```json
{
  "items": [
    {
      "id": "mock-resource-001",
      "title": "Contoh Materi Pembelajaran",
      "category": "modul",
      "verificationStatus": "Dipublikasikan",
      "accessClassification": "Internal",
      "digitalAssetAvailable": false,
      "updatedAt": "2026-01-15T09:00:00+07:00"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

This is an example only, not a source-derived production schema.

## 5. Proposed data lifecycle enums

- `Draft`
- `Diverifikasi`
- `Dipublikasikan`
- `Tidak Aktif`
- `Arsip`

Access classification:
- `Terbuka`
- `Internal`
- `Terbatas`
- `Metadata Saja`

The UI should not assume all transitions are permitted for every role. The approved authorization matrix must be defined before backend implementation.

## 6. Error response proposal

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Periksa kembali data yang dimasukkan.",
    "details": []
  }
}
```

Suggested classes: `400` validation, `401` unauthenticated, `403` unauthorized, `404` not found, `409` conflict, `429` rate limited, `500` unexpected server error. Final behavior and error disclosure rules require security review.

## 7. Security requirements for future implementation

- Server-side authorization for every resource and action.
- Secure session/cookie strategy selected during architecture review.
- Password handling delegated to a vetted authentication mechanism; never store plaintext passwords.
- Input validation and output encoding.
- Rate limiting and abuse protection where appropriate.
- Audit events for sensitive admin actions if approved and supported.
- Secure file access and upload validation if uploads are introduced.
- Minimize personal data and define retention/deletion policy with the owner.
- Backups, secrets management, monitoring, and incident handling.
- Threat modeling and security testing before production release.

## 8. Open decisions before API approval

- Hosting/deployment environment and network constraints.
- Authentication provider and account lifecycle.
- Final roles and permission matrix.
- Database choice and ownership.
- File/document storage and download controls.
- Search strategy and expected data volume.
- Audit logging requirements and retention.
- Integration with existing services, if authorized.
- Data migration and stewardship process.
- Operational support and incident response.

## 9. Approval rule

This file is not permission to build the API. API work starts only after:
1. Frontend visual/interaction review is approved.
2. Data ownership and permission matrix are confirmed.
3. API/database design is reviewed as a separate phase.
4. The user explicitly authorizes implementation.
