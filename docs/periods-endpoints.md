# Periods API — Business logic & Frontend spec

**New changes (latest)**

- Exposed `dayPeriodCategoryId` in template responses by introducing `DayPeriodCategoryResponse` (frontend should use `dayPeriodCategoryId` when assigning).
- Added admin endpoints to manage template→category links:
  - POST `/api/periods/{periodId}/categories` — add category to an existing DayPeriod (validates category exists; prevents duplicates).
  - DELETE `/api/periods/{periodId}/categories/{categoryId}` — remove category link (blocked if already assigned to any EidDayPeriod).
- `POST /api/periods/template-with-categories` now validates and deduplicates `categoryIds` and returns 404 with missing IDs when appropriate.
- No database migration required; DTO/response shape changed (breaking for clients expecting old `categories` shape).
- Documentation updated and a compact OpenAPI snippet added to this file.

---

This document describes the `Periods` endpoints (`api/periods`) and related models so the frontend team can implement booking, admin and day views. It includes business rules, full endpoint reference, required request shapes, example responses and recommended frontend flows.

---

## Business logic — core models & rules (summary at top)
- Core concept: a DayPeriod is a reusable time-slot template. A DayPeriod can be connected to multiple Categories (many-to-many via `DayPeriodCategory`). Each connection (DayPeriod + Category) can be assigned to a specific EidDay and becomes an independent, bookable slot (an `EidDayPeriod`).

- Key relationships (exact):
  - DayPeriod (template) ⇄ DayPeriodCategory (period–category pair) ⇄ Category
  - DayPeriodCategory → EidDayPeriod (assignment for a specific EidDay)
  - EidDay → EidDayPeriod (one EidDay has many EidDayPeriods)
  - Order → EidDayPeriod (orders are placed against a specific EidDayPeriod)

- Important rules and guarantees:
  - "One period can be connected with more than one category": a single DayPeriod template may have multiple Category links; each produces a separate slot when assigned to a day.
  - "One day can have more than one period": an EidDay may contain multiple EidDayPeriods (different periods and/or different categories).
  - Capacity is per EidDayPeriod (per day + period + category). `DayPeriod.defaultCapacity` is a template default; `EidDayPeriod.maxCapacity` is the limit used at runtime and can be overridden when assigning.
  - `currentOrders` tracks placed orders for that EidDayPeriod; `availableAmount = maxCapacity - currentOrders` and `isFull` when `currentOrders >= maxCapacity`.
  - Orders reference a specific `eidDayPeriodId` — therefore limits apply to that exact category-slot for that period on that day.
  - Server enforces capacity atomically during order creation; frontend must re-check availability immediately before submit to avoid race conditions.
  - Duplicate assignment prevention: the same `DayPeriodCategory` cannot be assigned to the same `EidDay` twice (server rejects duplicates).

- Typical scenario (illustrative):
  - Template `DayPeriod {periodId:1, name:"Morning", defaultCapacity:12}` is linked to Category A and Category B.
  - When assigned to `EidDay` #1, the system creates two `EidDayPeriod` records:
    - EidDayPeriod #101 => (EidDay:1, Period:1, Category:A, maxCapacity:50, currentOrders:10)
    - EidDayPeriod #102 => (EidDay:1, Period:1, Category:B, maxCapacity:20, currentOrders:2)
  - Each EidDayPeriod is independent: #101 can be full while #102 still has availability.

- UI / frontend implications:
  - Booking: show `availableAmount` and disable selection when `isFull` is true.
  - Day view: group EidDayPeriods by `period` (rows) and show per-category capacities (columns) for each row.
  - Admin: use `template-with-categories` to create template + links; use `assign` to create EidDayPeriods (can override capacity at assign time).

- Short summary rule (plain): one DayPeriod → many Categories; one EidDay → many EidDayPeriods; capacity limits are defined per (day, period, category) and apply to order counts.

---

## Summary (what this resource does) ✅
- Manages DayPeriod *templates* (reusable time slots) and EidDayPeriod (actual assigned/bookable slots for specific days).
- Enforces capacities and exposes availability for booking flows.
- Admins can create templates, link categories and assign templates to EidDays.

---

## Models & field types (important)
- `DayPeriodResponse` (from templates)
  - `periodId` (int)
  - `nameAr` (string)
  - `nameEn` (string|null)
  - `startTime`, `endTime` (TimeSpan string, e.g. `"08:00:00"`)
  - `defaultCapacity` (int)
  - `isActive` (bool)
  - `sortOrder` (int)
  - `categories` (DayPeriodCategoryResponse[] — includes `dayPeriodCategoryId`)

- `DayPeriodCategoryResponse` (new)
  - `dayPeriodCategoryId` (int)
  - `categoryId` (int)
  - `nameAr`, `nameEn`, `productCount`, `isActive`, `sortOrder`

- `EidDayPeriodResponse` (bookable slot)
  - `eidDayPeriodId`, `eidDayId` (int)
  - `eidDayName` (string)
  - `eidDayDate` (ISO datetime)
  - `dayPeriodCategoryId` (int)
  - `periodId`, `periodName` (template identity)
  - `categoryId?`, `categoryName?`
  - `startTime`, `endTime` (TimeSpan)
  - `maxCapacity`, `currentOrders`, `availableAmount` (ints)
  - `isActive`, `isFull` (bool)

Time formats: `startTime` / `endTime` are returned as `HH:mm:ss`. Dates are ISO 8601.

---

## Endpoints (complete reference)
Base path: `/api/periods` — all endpoints require authentication. Admin-only endpoints are marked.

### GET /api/periods/templates
- Purpose: list DayPeriod templates with linked categories.
- Auth: any authenticated user
- Response: `ApiResponse<IEnumerable<DayPeriodResponse>>`
- Example response (single item):
```json
{ "success": true, "data": [ { "periodId":1, "nameAr":"الفترة الأولى", "startTime":"08:00:00", "endTime":"11:00:00", "defaultCapacity":12, "isActive":true, "sortOrder":1, "categories":[] } ] }
```

---

### GET /api/periods/templates/{id}/categories
- Purpose: get categories linked to a DayPeriod template.
- Auth: authenticated
- Response: `ApiResponse<IEnumerable<CategoryResponse>>`
- Use when you need category columns for a template preview.

---

### POST /api/periods/templates  (admin)
- Purpose: create a DayPeriod template
- Body: `CreateDayPeriodRequest`
  - required: `nameAr`, `startTime`, `endTime`
  - optional: `nameEn`, `defaultCapacity`, `sortOrder`
- Example request body:
```json
{ "nameAr": "الفترة الصباحية", "nameEn": "Morning", "startTime": "08:00:00", "endTime": "11:00:00", "defaultCapacity": 20 }
```
- Response: created `DayPeriodResponse` (message: `تم إنشاء الفترة بنجاح`).
- Note: this endpoint does not auto-link categories (use `template-with-categories` to link while creating).

---

### POST /api/periods/template-with-categories  (admin)
- Purpose: create a DayPeriod and link Category ids immediately.
- Body: `CreateDayPeriodWithCategoriesRequest` (includes `categoryIds: [int]`).
- Example request:
```json
{ "nameAr":"مساء","startTime":"17:00:00","endTime":"20:00:00","defaultCapacity":12,"categoryIds":[1,2] }
```
- Response: `DayPeriodResponse` including `categories` array.

---

### GET /api/periods
- Purpose: list EidDayPeriods (actual assigned slots)
- Query params (optional): `eidDayId`, `categoryId`
- Auth: yes
- Response: `ApiResponse<IEnumerable<EidDayPeriodResponse>>`
- Frontend use: management lists, period pickers for admin/cc.

Example item:
```json
{
  "eidDayPeriodId": 5,
  "eidDayId": 1,
  "eidDayName": "اليوم الأول",
  "eidDayDate": "2026-02-15T00:00:00",
  "dayPeriodCategoryId": 3,
  "periodId": 2,
  "periodName": "الفترة الثانية",
  "categoryId": 2,
  "categoryName": "منتجات الدجاج واللحم",
  "startTime": "11:00:00",
  "endTime": "14:00:00",
  "maxCapacity": 50,
  "currentOrders": 10,
  "availableAmount": 40,
  "isActive": true,
  "isFull": false
}
```

---

### GET /api/periods/day/{eidDayId}/grouped
- Purpose: return periods grouped by template period, each group contains per-category capacities.
- Auth: yes
- Response: `ApiResponse<IEnumerable<GroupedEidDayPeriodResponse>>`
- Use-case: day-view UI where each row = period and columns = categories with available counts.
- Example group snippet:
```json
{
  "periodId": 1,
  "periodName": "الفترة الأولى",
  "startTime":"08:00:00",
  "endTime":"11:00:00",
  "categoryCapacities": [ { "eidDayPeriodId":1, "categoryId":1, "categoryName":"الذبائح", "maxCapacity":50, "currentOrders":10, "availableAmount":40 } ]
}
```

---

### GET /api/periods/available
- Purpose: return active EidDayPeriods that are not full (recommended for booking flows)
- Query params: optional `categoryId`
- Auth: yes
- Response: `ApiResponse<IEnumerable<EidDayPeriodResponse>>`
- Important: backend already filters `IsActive` and `currentOrders < maxCapacity`.

---

### POST /api/periods/{eidDayId}/assign/{dayPeriodCategoryId}?capacity={capacity}  (admin)
- Purpose: assign a DayPeriodCategory to a given EidDay (creates EidDayPeriod)
- Path params: `eidDayId`, `dayPeriodCategoryId`; Query optional `capacity` to override default
- Business checks (server-side):
  - EidDay must exist, DayPeriodCategory must exist
  - Duplicate assignment is rejected (400)
- Example success message: `تم تعيين الفترة لليوم بنجاح`
- Example response `EidDayPeriodResponse` included.

Errors returned by server:
- 404 + `اليوم غير موجود` — EidDay missing
- 404 + `علاقة الفترة والكاتجوري غير موجودة` — DayPeriodCategory missing
- 400 + `الفترة مضافة مسبقاً لهذا اليوم` — duplicate assignment

---

### PUT /api/periods/{id}  (admin)
- Purpose: update an existing EidDayPeriod
- Body: `UpdateEidDayPeriodRequest` — fields: `maxCapacity?`, `isActive?`
- Server updates `maxCapacity` and/or `isActive` and returns updated `EidDayPeriodResponse` (message: `تم تحديث الفترة بنجاح`).
- 404 if the EidDayPeriod is not found (`الفترة غير موجودة`).

---

## Endpoint details — request & response examples
Below are concrete examples (URL, request body where applicable, and response body) for the main Periods endpoints. Use these for frontend integration and Postman examples.

### GET /api/periods/templates
- URL: GET `/api/periods/templates`
- Request: none
- Success response example (200):
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "periodId": 1,
      "nameAr": "الفترة الأولى",
      "nameEn": "Period 1",
      "startTime": "08:00:00",
      "endTime": "11:00:00",
      "defaultCapacity": 12,
      "isActive": true,
      "sortOrder": 1,
      "categories": [
        {
          "dayPeriodCategoryId": 3,
          "categoryId": 1,
          "nameAr": "الذبائح",
          "nameEn": "Sacrifices",
          "productCount": 5
        }
      ]
    }
  ]
}
```

---

### GET /api/periods/templates/{id}/categories
- URL: GET `/api/periods/templates/1/categories`
- Request: none
- Success response example (200):
```json
{
  "success": true,
  "data": [
    { "categoryId": 1, "nameAr": "الذبائح", "nameEn": "Sacrifices", "isActive": true, "sortOrder": 1, "productCount": 5 }
  ]
}
```

---

### POST /api/periods/templates  (admin)
- URL: POST `/api/periods/templates`
- Request example (JSON body):
```json
{
  "nameAr": "الفترة الصباحية",
  "nameEn": "Morning",
  "startTime": "08:00:00",
  "endTime": "11:00:00",
  "defaultCapacity": 20,
  "sortOrder": 1
}
```
- Success response (200): `DayPeriodResponse` (categories empty unless linked)
```json
{ "success": true, "message": "تم إنشاء الفترة بنجاح", "data": { "periodId": 10, "nameAr":"الفترة الصباحية", "startTime":"08:00:00", "defaultCapacity":20, "categories": [] } }
```

---

### POST /api/periods/template-with-categories  (admin)
- URL: POST `/api/periods/template-with-categories`
- Request example:
```json
{
  "nameAr": "المساء",
  "nameEn": "Evening",
  "startTime": "17:00:00",
  "endTime": "20:00:00",
  "defaultCapacity": 12,
  "sortOrder": 2,
  "categoryIds": [1, 2]
}
```
- Success response: `DayPeriodResponse` (includes `dayPeriodCategoryId` for each linked category)
```json
{
  "success": true,
  "message": "تم إنشاء الفترة وربطها بالكاتجوري بنجاح",
  "data": {
    "periodId": 11,
    "nameAr": "المساء",
    "categories": [
      { "dayPeriodCategoryId": 21, "categoryId": 1, "nameAr":"الذبائح" },
      { "dayPeriodCategoryId": 22, "categoryId": 2, "nameAr":"منتجات الدجاج" }
    ]
  }
}
```
- Validation error (missing category id): 404
```json
{ "success": false, "message": "التصنيفات غير موجودة: 99" }
```

---

### POST /api/periods/{periodId}/categories (admin)
- URL: POST `/api/periods/5/categories`
- Request body: integer `categoryId` (e.g. `2`)
- Success response example (200): updated `DayPeriodResponse` with new `dayPeriodCategoryId`
```json
{ "success": true, "message": "تم إضافة التصنيف للفترة بنجاح", "data": { "periodId": 5, "categories": [ { "dayPeriodCategoryId": 33, "categoryId": 2, "nameAr":"..." } ] } }
```
- Errors: 404 period/category not found, 400 if already linked

---

### DELETE /api/periods/{periodId}/categories/{categoryId} (admin)
- URL: DELETE `/api/periods/5/categories/2`
- Success response example (200): updated `DayPeriodResponse`
- Error example (cannot remove because assigned to a day): 400
```json
{ "success": false, "message": "لا يمكن إزالة التصنيف لأن الفئة مُستخدمة في فترات مضافة لليوم" }
```

---

### DELETE /api/periods/templates/{periodId}  (admin)
- Purpose: permanently delete a DayPeriod *template* and remove its linked `DayPeriodCategory` records and any `EidDayPeriod` assignments that were created from them.
- Important safety rules (server-enforced):
  - Deletion is allowed only when none of the related `EidDayPeriod` records have orders. If any related `EidDayPeriod` has `currentOrders > 0` or there are `Order` rows referencing those `EidDayPeriod` ids, the server returns 400 and rejects deletion.
  - When deletion succeeds the `DayPeriod`, its `DayPeriodCategory` links and related `EidDayPeriod` rows are removed (DB cascade / EF handles this).
- Auth: admin only (`Roles = admin`)
- URL example: DELETE `/api/periods/templates/5`
- Success response (200): returns the deleted `DayPeriodResponse` (snapshot) and message `تم حذف الفترة بنجاح`.
```json
{ "success": true, "message": "تم حذف الفترة بنجاح", "data": { "periodId": 5, "nameAr": "الفترة الصباحية", "categories": [] } }
```
- Error responses (examples):
  - 404 + `الفترة غير موجودة` — template id not found.
  - 400 + `لا يمكن حذف الفترة لأن هناك طلبات مرتبطة بأحد الفترات المضافة لليوم` — cannot delete because there are placed orders for related day-periods.

Frontend notes / implementation checklist:
- Show a confirmation modal before calling this endpoint; explain that linked assignments (day slots) will be removed if no orders exist.
- After success: re-fetch `/api/periods/templates` and any day views using this period.
- If response is 400 (orders exist): show server message and direct user to the Orders / Day view to handle/remove orders first.
- Consider disabling the delete button when the UI shows any non-zero `currentOrders` on assigned slots (optimistic UX).

---

### GET /api/periods
- URL: GET `/api/periods` (optional query `eidDayId`, `categoryId`)
- Response item example (EidDayPeriodResponse):
```json
{
  "eidDayPeriodId": 5,
  "eidDayId": 1,
  "eidDayName": "اليوم الأول",
  "eidDayDate": "2026-02-15T00:00:00",
  "dayPeriodCategoryId": 3,
  "periodId": 2,
  "periodName": "الفترة الثانية",
  "categoryId": 2,
  "categoryName": "منتجات الدجاج",
  "startTime": "11:00:00",
  "endTime": "14:00:00",
  "maxCapacity": 50,
  "currentOrders": 10,
  "availableAmount": 40,
  "isActive": true,
  "isFull": false
}
```

---

### GET /api/periods/day/{eidDayId}/grouped
- URL: GET `/api/periods/day/1/grouped`
- Response example (grouped by period):
```json
{
  "success": true,
  "data": [
    {
      "periodId": 1,
      "periodName": "الفترة الأولى",
      "startTime": "08:00:00",
      "endTime": "11:00:00",
      "categoryCapacities": [
        { "eidDayPeriodId": 101, "categoryId": 1, "categoryName": "الذبائح", "maxCapacity": 50, "currentOrders": 10, "availableAmount": 40, "isFull": false }
      ]
    }
  ]
}
```

---

### GET /api/periods/available
- URL: GET `/api/periods/available` (optional `categoryId`)
- Purpose: return active, not-full slots (use in booking flow)
- Example response: array of `EidDayPeriodResponse` similar to the `/api/periods` item above

---

### POST /api/periods/{eidDayId}/assign/{dayPeriodCategoryId}?capacity={capacity} (admin)
- URL example: POST `/api/periods/1/assign/3?capacity=60`
- Request: none (capacity via query)
- Success response example (200): created `EidDayPeriodResponse`
```json
{
  "success": true,
  "message": "تم تعيين الفترة لليوم بنجاح",
  "data": {
    "eidDayPeriodId": 200,
    "eidDayId": 1,
    "dayPeriodCategoryId": 3,
    "periodId": 2,
    "categoryId": 2,
    "maxCapacity": 60,
    "currentOrders": 0,
    "availableAmount": 60,
    "isActive": true
  }
}
```
- Errors: 404 EidDay missing, 404 DayPeriodCategory missing, 400 duplicate assignment

---

### PUT /api/periods/{id} (admin)
- URL: PUT `/api/periods/200`
- Request example (UpdateEidDayPeriodRequest):
```json
{ "maxCapacity": 45, "isActive": true }
```
- Success response: updated `EidDayPeriodResponse` including recalculated `availableAmount` and `currentOrders`.

---

## Errors & HTTP codes (how to show on UI)
- 200 OK — ApiResponse.success = true
- 400 Bad Request — client validation or business validation (e.g. duplicate assignment)
- 401 Unauthorized — not logged in (cookie absent/expired)
- 403 Forbidden — authenticated but not admin
- 404 Not Found — missing resource
- Error body: ApiResponse with `success=false` and `message` (Arabic messages from server).

---

## Recommended frontend flows & tips 💡
- Booking flow: call `GET /api/periods/available?categoryId={id}` to populate slots. Before submit, re-check availability (same endpoint) to avoid races.
- Day view (grouped): call `GET /api/periods/day/{eidDayId}/grouped` for UI that shows period rows with multiple categories.
- Admin: use `GET /api/periods/templates` to populate template editor; use `POST /api/periods/template-with-categories` to create template + categories in one request.
- All requests rely on server-set HTTP-only cookie after login — do NOT store token in localStorage.
- Time values: treat `startTime`/`endTime` as `HH:mm:ss` strings.

---

## Quick examples (curl-like) 🔧
- Get available (category 1):
```bash
curl -X GET "/api/periods/available?categoryId=1" -b cookiefile
```
- Admin assign period with capacity override:
```bash
curl -X POST "/api/periods/1/assign/3?capacity=60" -b admin-cookie
```
- Update EidDayPeriod capacity:
```bash
curl -X PUT "/api/periods/12" -H "Content-Type: application/json" -d '{"maxCapacity":45}' -b admin-cookie
```

---

## OpenAPI (Swagger) — compact snippet (copy-paste)
Use this minimal OpenAPI snippet to document the key Periods endpoints in your Swagger file.

```yaml
openapi: 3.0.1
info:
  title: Periods (compact)
  version: "1.0"
paths:
  /api/periods/templates:
    get:
      summary: List DayPeriod templates
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  message: { type: string, nullable: true }
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/DayPeriodResponse'

  /api/periods/template-with-categories:
    post:
      summary: Create DayPeriod + link categories (admin)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateDayPeriodWithCategoriesRequest'
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse_DayPeriodResponse'

  /api/periods/{periodId}/categories:
    post:
      summary: Add category to existing template (admin)
      parameters:
        - in: path
          name: periodId
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: integer
              example: 2
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse_DayPeriodResponse'

  /api/periods/{eidDayId}/assign/{dayPeriodCategoryId}:
    post:
      summary: Assign DayPeriodCategory to EidDay (admin)
      parameters:
        - in: path
          name: eidDayId
          required: true
          schema: { type: integer }
        - in: path
          name: dayPeriodCategoryId
          required: true
          schema: { type: integer }
        - in: query
          name: capacity
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse_EidDayPeriodResponse'

  /api/periods/{id}:
    put:
      summary: Update EidDayPeriod (admin)
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateEidDayPeriodRequest'
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse_EidDayPeriodResponse'

components:
  schemas:
    DayPeriodCategoryResponse:
      type: object
      properties:
        dayPeriodCategoryId: { type: integer }
        categoryId: { type: integer }
        nameAr: { type: string }
        nameEn: { type: string, nullable: true }
        productCount: { type: integer }

    DayPeriodResponse:
      type: object
      properties:
        periodId: { type: integer }
        nameAr: { type: string }
        nameEn: { type: string, nullable: true }
        startTime: { type: string, example: '08:00:00' }
        endTime: { type: string, example: '11:00:00' }
        defaultCapacity: { type: integer }
        categories:
          type: array
          items:
            $ref: '#/components/schemas/DayPeriodCategoryResponse'

    CreateDayPeriodWithCategoriesRequest:
      type: object
      properties:
        nameAr: { type: string }
        nameEn: { type: string, nullable: true }
        startTime: { type: string }
        endTime: { type: string }
        defaultCapacity: { type: integer }
        sortOrder: { type: integer }
        categoryIds:
          type: array
          items: { type: integer }

    EidDayPeriodResponse:
      type: object
      properties:
        eidDayPeriodId: { type: integer }
        eidDayId: { type: integer }
        dayPeriodCategoryId: { type: integer }
        periodId: { type: integer }
        categoryId: { type: integer }
        maxCapacity: { type: integer }
        currentOrders: { type: integer }
        availableAmount: { type: integer }

    UpdateEidDayPeriodRequest:
      type: object
      properties:
        maxCapacity: { type: integer }
        isActive: { type: boolean }

    ApiResponse_DayPeriodResponse:
      type: object
      properties:
        success: { type: boolean }
        message: { type: string, nullable: true }
        data: { $ref: '#/components/schemas/DayPeriodResponse' }

    ApiResponse_EidDayPeriodResponse:
      type: object
      properties:
        success: { type: boolean }
        message: { type: string, nullable: true }
        data: { $ref: '#/components/schemas/EidDayPeriodResponse' }
```

---

Done — file updated with examples and OpenAPI snippet.
