# API Contract - Backend (Spring Boot)

**Base URL:** `http://localhost:8080`

**Authentication:** Bearer token in `Authorization` header for protected endpoints.

**Refresh Token:** HTTP-only cookie named `refresh_token` on `/api/auth/refresh` path.

---

## Table of Contents

1. [Authentication (Public)](#authentication-public)
2. [Public Catalog (No Auth)](#public-catalog-no-auth)
3. [Cart (CUSTOMER)](#cart-customer)
4. [Addresses (CUSTOMER)](#addresses-customer)
5. [Orders (CUSTOMER)](#orders-customer)
6. [Coupons (CUSTOMER)](#coupons-customer)
7. [Shipping (CUSTOMER)](#shipping-customer)
8. [Admin - Categories](#admin---categories-admin)
9. [Admin - Products](#admin---products-admin)
10. [Admin - Variants](#admin---variants-admin)
11. [Admin - Product Images](#admin---product-images-admin)
12. [Admin - Shipping Zones](#admin---shipping-zones-admin)
13. [Admin - Coupons](#admin---coupons-admin)
14. [Admin - Orders](#admin---orders-admin)
15. [Admin - Users & Employees](#admin---users--employees-admin)
16. [Employee - Orders](#employee---orders-employee)
17. [Error Responses](#error-responses)

---

## Authentication (Public)

### POST /api/auth/register

**Role:** Public (no authentication required)

**Description:** Register a new customer account.

**Request Body:**
```json
{
  "username": "string (3-50 chars, required)",
  "email": "string (email format, required)",
  "password": "string (min 8 chars, required)"
}
```

**Response 200:**
```json
{
  "accessToken": "string (JWT)",
  "tokenType": "Bearer",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "CUSTOMER"
  }
}
```

**Response 400:** Username or email already exists.

**Side Effects:**
- Sets HTTP-only cookie `refresh_token` (7 days expiry)
- User role is always `CUSTOMER`

---

### POST /api/auth/login

**Role:** Public

**Description:** Login with username/email and password.

**Request Body:**
```json
{
  "usernameOrEmail": "string (required)",
  "password": "string (required)"
}
```

**Response 200:**
```json
{
  "accessToken": "string (JWT)",
  "tokenType": "Bearer",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "CUSTOMER | EMPLOYEE | ADMIN"
  }
}
```

**Response 401:** Invalid credentials or user disabled/deleted.

**Side Effects:**
- Sets HTTP-only cookie `refresh_token`

---

### POST /api/auth/refresh

**Role:** Public (requires refresh_token cookie)

**Description:** Refresh access token using refresh token cookie.

**Request:** No body required (uses HTTP-only cookie).

**Response 200:**
```json
{
  "accessToken": "string (new JWT)",
  "tokenType": "Bearer",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Response 401:** Refresh token invalid/expired or user disabled.

**Side Effects:**
- Rotates refresh token (old token revoked, new cookie set)

---

### POST /api/auth/logout

**Role:** Public

**Description:** Logout and revoke refresh token.

**Response 204:** No content.

**Side Effects:**
- Revokes refresh token in database
- Clears `refresh_token` cookie

---

## Public Catalog (No Auth)

### GET /api/categories

**Role:** Public

**Description:** List all active categories.

**Response 200:**
```json
[
  {
    "id": "number",
    "name": "string",
    "slug": "string",
    "active": "boolean"
  }
]
```

---

### GET /api/products

**Role:** Public

**Description:** Search/filter products with pagination.

**Query Parameters:**
- `q` (optional): Search query (product name/description)
- `categoryId` (optional): Filter by category ID
- `minPrice` (optional): Minimum variant price
- `maxPrice` (optional): Maximum variant price
- `page` (optional, default 0): Page number (0-indexed)
- `size` (optional, default 12): Page size
- `sort` (optional): Sort field, e.g., `createdAt,desc` or `minVariantPrice,asc`

**Response 200:**
```json
{
  "content": [
    {
      "id": "number",
      "name": "string",
      "slug": "string",
      "active": "boolean",
      "deleted": "boolean",
      "category": {
        "id": "number",
        "name": "string"
      },
      "primaryImageUrl": "string (URL or null)",
      "minVariantPrice": "number (BigDecimal)"
    }
  ],
  "pageable": { ... },
  "totalElements": "number",
  "totalPages": "number",
  "number": "number (current page)",
  "size": "number",
  "first": "boolean",
  "last": "boolean"
}
```

---

### GET /api/products/{slug}

**Role:** Public

**Description:** Get product details by slug.

**Path Parameters:**
- `slug`: Product slug (unique)

**Response 200:**
```json
{
  "id": "number",
  "name": "string",
  "slug": "string",
  "description": "string (nullable)",
  "active": "boolean",
  "deleted": "boolean",
  "category": {
    "id": "number",
    "name": "string",
    "slug": "string"
  },
  "images": [
    {
      "id": "number",
      "url": "string",
      "sortOrder": "number"
    }
  ],
  "variants": [
    {
      "id": "number",
      "sku": "string (nullable)",
      "size": "string (nullable)",
      "color": "string (nullable)",
      "price": "number (BigDecimal)",
      "stockQuantity": "number (integer)",
      "active": "boolean",
      "deleted": "boolean"
    }
  ]
}
```

**Response 404:** Product not found.

---

## Cart (CUSTOMER)

All cart endpoints require `CUSTOMER` role.

### GET /api/cart

**Role:** CUSTOMER

**Description:** Get or create cart for current user.

**Response 200:**
```json
{
  "id": "number",
  "items": [
    {
      "id": "number",
      "variant": {
        "id": "number",
        "sku": "string",
        "size": "string",
        "color": "string",
        "price": "number",
        "stockQuantity": "number"
      },
      "quantity": "number (integer)",
      "lineTotal": "number (price * quantity)"
    }
  ],
  "subtotal": "number (sum of all line totals)"
}
```

---

### POST /api/cart/items

**Role:** CUSTOMER

**Description:** Add item to cart (or update quantity if variant already in cart).

**Request Body:**
```json
{
  "variantId": "number (required)",
  "quantity": "number (min 1, required)"
}
```

**Response 200:** Updated CartDto (same as GET /api/cart).

**Response 404:** Variant not found or inactive.

**Response 400:** Insufficient stock.

---

### PUT /api/cart/items/{variantId}

**Role:** CUSTOMER

**Description:** Update item quantity in cart. If quantity is 0, item is removed.

**Path Parameters:**
- `variantId`: ID of the variant

**Request Body:**
```json
{
  "quantity": "number (min 0, required)"
}
```

**Response 200:** Updated CartDto.

**Response 404:** Item not in cart.

---

### DELETE /api/cart/items/{variantId}

**Role:** CUSTOMER

**Description:** Remove item from cart.

**Path Parameters:**
- `variantId`: ID of the variant to remove

**Response 200:** Updated CartDto.

---

### DELETE /api/cart/clear

**Role:** CUSTOMER

**Description:** Remove all items from cart.

**Response 200:** Empty CartDto.

---

## Addresses (CUSTOMER)

All address endpoints require `CUSTOMER` role.

### GET /api/addresses

**Role:** CUSTOMER

**Description:** List customer's addresses.

**Response 200:**
```json
[
  {
    "id": "number",
    "city": "string",
    "street": "string",
    "details": "string (nullable)",
    "phone": "string"
  }
]
```

---

### POST /api/addresses

**Role:** CUSTOMER

**Description:** Create a new address.

**Request Body:**
```json
{
  "city": "string (required, not blank)",
  "street": "string (required, not blank)",
  "details": "string (optional)",
  "phone": "string (required, phone pattern)"
}
```

**Response 200:** AddressDto (created).

---

### PUT /api/addresses/{id}

**Role:** CUSTOMER

**Description:** Update an address (ownership verified).

**Path Parameters:**
- `id`: Address ID

**Request Body:** Same as POST.

**Response 200:** Updated AddressDto.

**Response 404:** Address not found or not owned by user.

---

### DELETE /api/addresses/{id}

**Role:** CUSTOMER

**Description:** Delete an address.

**Path Parameters:**
- `id`: Address ID

**Response 204:** No content.

**Response 404:** Address not found or not owned by user.

---

## Orders (CUSTOMER)

### POST /api/orders

**Role:** CUSTOMER

**Description:** Place order from cart.

**Request Body:**
```json
{
  "addressId": "number (required)",
  "couponCode": "string (optional)"
}
```

**Response 200:**
```json
{
  "id": "number",
  "status": "PENDING",
  "subtotal": "number",
  "discount": "number",
  "shippingFee": "number",
  "grandTotal": "number",
  "items": [
    {
      "id": "number",
      "productName": "string",
      "variantSize": "string",
      "variantColor": "string",
      "unitPrice": "number",
      "quantity": "number",
      "lineTotal": "number"
    }
  ],
  "address": { ... },
  "couponCode": "string (nullable)",
  "createdAt": "timestamp"
}
```

**Response 400:** Cart empty, invalid address, invalid coupon, or stock issues.

**Side Effects:**
- Decrements stock atomically
- Creates CouponUsage if coupon applied
- Clears cart after successful order

---

### GET /api/orders/me

**Role:** CUSTOMER

**Description:** List customer's orders (paginated).

**Query Parameters:**
- `page` (optional, default 0)
- `size` (optional, default 10)

**Response 200:** Page<OrderDto>

---

### GET /api/orders/{id}

**Role:** CUSTOMER

**Description:** Get order details (ownership verified).

**Path Parameters:**
- `id`: Order ID

**Response 200:** OrderDto (full details).

**Response 404:** Order not found or not owned by user.

---

## Coupons (CUSTOMER)

### POST /api/coupons/apply

**Role:** CUSTOMER

**Description:** Validate and apply coupon to subtotal (preview discount).

**Request Body:**
```json
{
  "code": "string (required)",
  "subtotal": "number (required, min 0)"
}
```

**Response 200:**
```json
{
  "code": "string",
  "type": "PERCENT | FIXED",
  "value": "number",
  "discount": "number (calculated discount)",
  "finalTotal": "number (subtotal - discount, min 0)"
}
```

**Response 400:** Coupon invalid, expired, usage limit exceeded, or minimum order not met.

---

## Shipping (CUSTOMER)

### GET /api/shipping/quote

**Role:** CUSTOMER

**Description:** Get shipping quote for address.

**Query Parameters:**
- `addressId` (required): Address ID
- `subtotal` (optional): Order subtotal

**Response 200:**
```json
{
  "fee": "number",
  "city": "string",
  "zone": "string (nullable)"
}
```

**Response 404:** Address not found or no shipping zone configured for city.

---

## Admin - Categories (ADMIN)

All admin category endpoints require `ADMIN` role.

### GET /api/admin/categories

**Role:** ADMIN

**Description:** List categories (paginated, includes inactive).

**Query Parameters:**
- `page`, `size`, `sort` (standard Pageable)

**Response 200:**
```json
{
  "content": [
    {
      "id": "number",
      "name": "string",
      "slug": "string",
      "active": "boolean"
    }
  ],
  "totalElements": "number",
  "totalPages": "number",
  "number": "number",
  "size": "number"
}
```

---

### GET /api/admin/categories/{id}

**Role:** ADMIN

**Response 200:** AdminCategoryResponse

---

### POST /api/admin/categories

**Role:** ADMIN

**Request Body:**
```json
{
  "name": "string (required, not blank)",
  "slug": "string (required, unique)",
  "active": "boolean (default true)"
}
```

**Response 201:** Created AdminCategoryResponse

**Response 409:** Slug already exists.

---

### PUT /api/admin/categories/{id}

**Role:** ADMIN

**Request Body:** Same as POST.

**Response 200:** Updated AdminCategoryResponse

**Response 404:** Category not found.

---

### DELETE /api/admin/categories/{id}

**Role:** ADMIN

**Response 204:** No content (soft delete).

**Response 409:** Category has products.

---

## Admin - Products (ADMIN)

All admin product endpoints require `ADMIN` role.

### GET /api/admin/products

**Role:** ADMIN

**Description:** List products with filters (paginated).

**Query Parameters:**
- `categoryId` (optional): Filter by category
- `q` (optional): Search query
- `active` (optional): Filter by active status
- `page`, `size`, `sort` (standard Pageable)

**Response 200:**
```json
{
  "content": [
    {
      "id": "number",
      "name": "string",
      "slug": "string",
      "categoryName": "string",
      "active": "boolean",
      "deleted": "boolean",
      "variantCount": "number",
      "minPrice": "number"
    }
  ],
  "totalElements": "number",
  "totalPages": "number"
}
```

---

### GET /api/admin/products/{id}

**Role:** ADMIN

**Response 200:**
```json
{
  "id": "number",
  "name": "string",
  "slug": "string",
  "description": "string",
  "categoryId": "number",
  "categoryName": "string",
  "active": "boolean",
  "deleted": "boolean"
}
```

---

### POST /api/admin/products

**Role:** ADMIN

**Request Body:**
```json
{
  "name": "string (required, not blank)",
  "slug": "string (required, unique)",
  "description": "string (optional)",
  "categoryId": "number (required)",
  "active": "boolean (default true)"
}
```

**Response 201:** Created AdminProductResponse

**Response 404:** Category not found.

**Response 409:** Slug already exists.

---

### PUT /api/admin/products/{id}

**Role:** ADMIN

**Request Body:** Same as POST.

**Response 200:** Updated AdminProductResponse

---

### DELETE /api/admin/products/{id}

**Role:** ADMIN

**Response 204:** No content (soft delete).

**Response 409:** Product referenced in orders.

---

## Admin - Variants (ADMIN)

All admin variant endpoints require `ADMIN` role.

### GET /api/admin/products/{productId}/variants

**Role:** ADMIN

**Description:** List variants for a product.

**Response 200:**
```json
[
  {
    "id": "number",
    "sku": "string",
    "size": "string",
    "color": "string",
    "price": "number",
    "stockQuantity": "number",
    "active": "boolean",
    "deleted": "boolean"
  }
]
```

---

### POST /api/admin/products/{productId}/variants

**Role:** ADMIN

**Request Body:**
```json
{
  "sku": "string (optional, unique if provided)",
  "size": "string (optional)",
  "color": "string (optional)",
  "price": "number (required, positive)",
  "stockQuantity": "number (required, min 0)",
  "active": "boolean (default true)"
}
```

**Response 201:** Created AdminVariantResponse

**Response 409:** SKU already exists or duplicate variant (size+color) for product.

---

### PUT /api/admin/variants/{variantId}

**Role:** ADMIN

**Request Body:** Same as POST.

**Response 200:** Updated AdminVariantResponse

---

### DELETE /api/admin/variants/{variantId}

**Role:** ADMIN

**Response 204:** No content (soft delete).

---

### PATCH /api/admin/variants/{variantId}/stock

**Role:** ADMIN

**Description:** Update stock quantity only.

**Request Body:**
```json
{
  "stockQuantity": "number (required, min 0)"
}
```

**Response 200:** Updated AdminVariantResponse

---

## Admin - Product Images (ADMIN)

All admin image endpoints require `ADMIN` role.

### GET /api/admin/products/{productId}/images

**Role:** ADMIN

**Response 200:**
```json
[
  {
    "id": "number",
    "url": "string",
    "sortOrder": "number"
  }
]
```

---

### POST /api/admin/products/{productId}/images

**Role:** ADMIN

**Request Body:**
```json
{
  "url": "string (required, valid URL)",
  "sortOrder": "number (optional, default 0)"
}
```

**Response 201:** Created AdminImageResponse

---

### DELETE /api/admin/products/{productId}/images/{imageId}

**Role:** ADMIN

**Response 204:** No content.

---

## Admin - Shipping Zones (ADMIN)

All admin shipping zone endpoints require `ADMIN` role.

### GET /api/admin/shipping-zones

**Role:** ADMIN

**Query Parameters:** `page`, `size`, `sort`

**Response 200:**
```json
{
  "content": [
    {
      "id": "number",
      "city": "string",
      "region": "string",
      "fee": "number"
    }
  ],
  "totalElements": "number",
  "totalPages": "number"
}
```

---

### GET /api/admin/shipping-zones/{id}

**Role:** ADMIN

**Response 200:** AdminShippingZoneResponse

---

### POST /api/admin/shipping-zones

**Role:** ADMIN

**Request Body:**
```json
{
  "city": "string (required, not blank)",
  "region": "string (optional)",
  "fee": "number (required, min 0)"
}
```

**Response 201:** Created AdminShippingZoneResponse

---

### PUT /api/admin/shipping-zones/{id}

**Role:** ADMIN

**Request Body:** Same as POST.

**Response 200:** Updated AdminShippingZoneResponse

---

### DELETE /api/admin/shipping-zones/{id}

**Role:** ADMIN

**Response 204:** No content.

---

## Admin - Coupons (ADMIN)

All admin coupon endpoints require `ADMIN` role.

### GET /api/admin/coupons

**Role:** ADMIN

**Query Parameters:** `page`, `size`, `sort`

**Response 200:**
```json
{
  "content": [
    {
      "id": "number",
      "code": "string",
      "type": "PERCENT | FIXED",
      "value": "number",
      "minOrderTotal": "number (nullable)",
      "startAt": "timestamp (nullable)",
      "endAt": "timestamp (nullable)",
      "usageLimitTotal": "number (nullable)",
      "usageLimitPerUser": "number (nullable)",
      "active": "boolean"
    }
  ],
  "totalElements": "number",
  "totalPages": "number"
}
```

---

### GET /api/admin/coupons/{id}

**Role:** ADMIN

**Response 200:** AdminCouponResponse

---

### POST /api/admin/coupons

**Role:** ADMIN

**Request Body:**
```json
{
  "code": "string (required, unique, uppercase)",
  "type": "PERCENT | FIXED (required)",
  "value": "number (required, positive)",
  "minOrderTotal": "number (optional, min 0)",
  "startAt": "timestamp (optional)",
  "endAt": "timestamp (optional)",
  "usageLimitTotal": "number (optional, min 1)",
  "usageLimitPerUser": "number (optional, min 1)",
  "active": "boolean (default true)"
}
```

**Response 201:** Created AdminCouponResponse

**Response 409:** Code already exists.

---

### PUT /api/admin/coupons/{id}

**Role:** ADMIN

**Request Body:** Same as POST.

**Response 200:** Updated AdminCouponResponse

---

### DELETE /api/admin/coupons/{id}

**Role:** ADMIN

**Response 204:** No content (soft delete).

---

## Admin - Orders (ADMIN)

### GET /api/admin/orders

**Role:** ADMIN

**Description:** List all orders (paginated).

**Query Parameters:**
- `status` (optional): Filter by order status
- `page`, `size`, `sort`

**Response 200:** Page<OrderDto>

---

### PATCH /api/admin/orders/{id}/status

**Role:** ADMIN

**Description:** Update order status.

**Request Body:**
```json
{
  "status": "PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED (required)"
}
```

**Response 200:** Updated OrderDto

**Response 400:** Invalid status transition.

---

### PATCH /api/admin/orders/{id}/assign

**Role:** ADMIN

**Description:** Assign order to employee.

**Request Body:**
```json
{
  "employeeId": "number (required)"
}
```

**Response 200:** Updated OrderDto with assignedEmployee field.

**Response 400:** User is not an employee.

**Response 404:** Employee not found.

---

## Admin - Users & Employees (ADMIN)

### GET /api/admin/employees

**Role:** ADMIN

**Description:** List all employees (role = EMPLOYEE).

**Response 200:**
```json
[
  {
    "id": "number",
    "username": "string",
    "email": "string",
    "enabled": "boolean"
  }
]
```

---

### PATCH /api/admin/users/{id}/disable

**Role:** ADMIN

**Description:** Disable/enable user account.

**Response 200:**
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "enabled": "boolean"
}
```

**Response 404:** User not found.

**Side Effects:**
- Increments user's tokenVersion (invalidates all existing access tokens)

---

## Employee - Orders (EMPLOYEE)

All employee order endpoints require `EMPLOYEE` role.

### GET /api/employee/orders

**Role:** EMPLOYEE

**Description:** List orders assigned to current employee (paginated).

**Query Parameters:** `page`, `size`, `sort`

**Response 200:** Page<OrderDto> (only orders where assignedEmployee.id = current user)

---

### GET /api/employee/orders/{id}

**Role:** EMPLOYEE

**Description:** Get order details (only if assigned to current employee).

**Response 200:** OrderDto

**Response 403:** Order not assigned to current employee.

**Response 404:** Order not found.

---

### PATCH /api/employee/orders/{id}/status

**Role:** EMPLOYEE

**Description:** Update order status (restricted transitions).

**Request Body:**
```json
{
  "status": "PROCESSING | SHIPPED | DELIVERED (required)"
}
```

**Response 200:** Updated OrderDto

**Response 400:** Invalid status transition. Allowed transitions:
- PROCESSING → SHIPPED
- SHIPPED → DELIVERED

**Response 403:** Order not assigned to current employee.

---

## Error Responses

### Common HTTP Status Codes

- **400 Bad Request:** Invalid input, validation errors, business rule violations.
- **401 Unauthorized:** Missing/invalid/expired token.
- **403 Forbidden:** User does not have required role.
- **404 Not Found:** Resource not found.
- **409 Conflict:** Duplicate unique constraint (e.g., username, email, slug, SKU).
- **422 Unprocessable Entity:** Validation errors (Bean Validation).

### Error Response Format

```json
{
  "timestamp": "ISO-8601 timestamp",
  "status": "number (HTTP status code)",
  "error": "string (HTTP status text)",
  "message": "string (error description)",
  "path": "string (request URI)"
}
```

### Validation Error Format (422)

```json
{
  "timestamp": "ISO-8601 timestamp",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Validation failed",
  "errors": {
    "fieldName": "error message",
    "anotherField": "error message"
  },
  "path": "string"
}
```

---

## Notes

1. **Pagination:** All paginated endpoints use Spring Data `Pageable` query parameters:
   - `page` (0-indexed)
   - `size`
   - `sort` (e.g., `createdAt,desc`)

2. **Soft Delete:** Products, variants, categories, and coupons use soft delete (marked as `deleted=true`).

3. **Stock Management:** Stock is decremented atomically during order placement using optimistic locking or explicit queries.

4. **Coupon Usage:** Tracked via `CouponUsage` entity (per customer, per order if applicable).

5. **Role Enforcement:** Backend uses `@PreAuthorize` annotations. Roles are case-sensitive uppercase: `CUSTOMER`, `EMPLOYEE`, `ADMIN`.

6. **Currency:** All prices and fees are in **JOD (Jordanian Dinar)** with 2 decimal precision.

---

**Generated:** 2026-01-02
**Version:** 1.0
**Backend Stack:** Spring Boot 3.x + Spring Security + JWT + PostgreSQL

