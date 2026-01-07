# Backend API Reference - All Endpoints

## Base Information
- **Base URL**: `http://localhost:8080`
- **Port**: 8080
- **Database**: PostgreSQL (samah_store)
- **Schema**: store
- **Auth**: JWT Bearer Token

---

## 🔐 AUTHENTICATION ENDPOINTS

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response 200:
{
  "accessToken": "string",
  "tokenType": "Bearer"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "string",
  "password": "string"
}

Response 200:
{
  "accessToken": "string",
  "tokenType": "Bearer"
}
```

### Refresh Token
```http
POST /api/auth/refresh
Cookie: refresh_token=...

Response 200:
{
  "accessToken": "string",
  "tokenType": "Bearer"
}
```

### Logout
```http
POST /api/auth/logout
Cookie: refresh_token=...

Response 204 No Content
```

---

## 🛍️ PUBLIC CATALOG ENDPOINTS

### Get All Categories
```http
GET /api/categories

Response 200:
[
  {
    "id": 1,
    "name": "string",
    "slug": "string",
    "active": true
  }
]
```

### Get All Products (with filters)
```http
GET /api/products?q=search&categoryId=1&minPrice=10&maxPrice=100&page=0&size=12&sort=createdAt,desc

Response 200:
{
  "content": [
    {
      "id": 1,
      "name": "string",
      "slug": "string",
      "category": {...},
      "primaryImageUrl": "string",
      "minVariantPrice": 50.00,
      "active": true
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "number": 0,
  "size": 12
}
```

### Get Product Details by Slug
```http
GET /api/products/{slug}

Response 200:
{
  "id": 1,
  "name": "string",
  "slug": "string",
  "description": "string",
  "category": {...},
  "images": [
    {
      "id": 1,
      "url": "string",
      "sortOrder": 0
    }
  ],
  "variants": [
    {
      "id": 1,
      "sku": "string",
      "size": "M",
      "color": "Blue",
      "price": 50.00,
      "stockQuantity": 10,
      "active": true
    }
  ],
  "active": true
}
```

---

## 🛒 CART ENDPOINTS (Requires CUSTOMER role)

### Get My Cart
```http
GET /api/cart
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "variant": {...},
      "quantity": 2,
      "lineTotal": 100.00
    }
  ],
  "subtotal": 100.00
}
```

### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "variantId": 1,
  "quantity": 2
}

Response 200: CartDto
```

### Update Cart Item Quantity
```http
PUT /api/cart/items/{variantId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}

Response 200: CartDto
```
*Note: quantity=0 removes the item*

### Remove Item from Cart
```http
DELETE /api/cart/items/{variantId}
Authorization: Bearer {token}

Response 200: CartDto
```

### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer {token}

Response 200: CartDto
```

---

## 📍 ADDRESS ENDPOINTS (Requires CUSTOMER role)

### List My Addresses
```http
GET /api/addresses
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "city": "string",
    "street": "string",
    "details": "string",
    "phone": "string"
  }
]
```

### Create Address
```http
POST /api/addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "city": "string",
  "street": "string",
  "details": "string",
  "phone": "string"
}

Response 201: AddressDto
```

### Update Address
```http
PUT /api/addresses/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "city": "string",
  "street": "string",
  "details": "string",
  "phone": "string"
}

Response 200: AddressDto
```

### Delete Address
```http
DELETE /api/addresses/{id}
Authorization: Bearer {token}

Response 204 No Content
```

---

## 📦 ORDER ENDPOINTS (Customer)

### Place Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "addressId": 1,
  "couponCode": "SAVE10" // optional
}

Response 201:
{
  "id": 1,
  "status": "NEW",
  "customer": {...},
  "address": {...},
  "items": [...],
  "subtotal": 120.00,
  "shippingFee": 5.00,
  "discountTotal": 10.00,
  "total": 115.00,
  "createdAt": "2026-01-05T12:00:00Z"
}
```

### List My Orders
```http
GET /api/orders/me?page=0&size=10
Authorization: Bearer {token}

Response 200: Page<OrderDto>
```

### Get My Order Details
```http
GET /api/orders/{id}
Authorization: Bearer {token}

Response 200: OrderDto
```

---

## 🎫 COUPON ENDPOINTS (Customer)

### Apply Coupon
```http
POST /api/coupons/apply
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "SAVE10",
  "subtotal": 100.00
}

Response 200:
{
  "id": 1,
  "code": "SAVE10",
  "type": "PERCENT",
  "value": 10.00,
  "discount": 10.00,
  "minOrderTotal": 50.00,
  "active": true
}
```

---

## 🚚 SHIPPING ENDPOINTS

### Get Shipping Quote
```http
GET /api/shipping/quote?city=Amman
Authorization: Bearer {token}

Response 200:
{
  "city": "Amman",
  "shippingFee": 3.00
}
```

---

## 👑 ADMIN - ORDERS

### List All Orders
```http
GET /api/admin/orders?delivered=false&page=0&size=20&sort=id,desc
Authorization: Bearer {admin-token}

Response 200: Page<OrderDto>
```
*delivered=false: Active orders (NEW, PROCESSING, SHIPPED)*
*delivered=true: Delivered orders*

### Update Order Status
```http
PATCH /api/admin/orders/{id}/status
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "status": "PROCESSING"
}

Response 200: OrderDto
```
*Allowed statuses: NEW, PROCESSING, SHIPPED, DELIVERED, FAILED_PICKUP*

### Assign Order to Employee
```http
PATCH /api/admin/orders/{id}/assign
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "employeeId": 5
}

Response 200: OrderDto
```

---

## 👑 ADMIN - PRODUCTS

### List Products
```http
GET /api/admin/products?page=0&size=20
Authorization: Bearer {admin-token}

Response 200: Page<ProductDto>
```

### Create Product
```http
POST /api/admin/products
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "string",
  "slug": "string",
  "description": "string",
  "categoryId": 1,
  "primaryImageUrl": "string",
  "active": true
}

Response 201: ProductDto
```

### Update Product
```http
PUT /api/admin/products/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "string",
  "slug": "string",
  "description": "string",
  "categoryId": 1,
  "active": true
}

Response 200: ProductDto
```

### Delete Product (Permanent)
```http
DELETE /api/admin/products/{id}/permanent
Authorization: Bearer {admin-token}

Response 204 No Content
```
*Note: May fail if product has orders*

---

## 👑 ADMIN - CATEGORIES

### List Categories
```http
GET /api/admin/categories
Authorization: Bearer {admin-token}

Response 200: [CategoryDto]
```

### Create Category
```http
POST /api/admin/categories
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "string",
  "slug": "string",
  "active": true
}

Response 201: CategoryDto
```

### Update Category
```http
PUT /api/admin/categories/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "string",
  "slug": "string",
  "active": true
}

Response 200: CategoryDto
```

---

## 👑 ADMIN - METRICS

### Get Dashboard Metrics
```http
GET /api/admin/metrics
Authorization: Bearer {admin-token}

Response 200:
{
  "totalOrders": 100,
  "todayOrders": 5,
  "processingOrders": 10,
  "shippedOrders": 8,
  "deliveredOrders": 75,
  "cancelledOrders": 2,
  "revenueSinceReset": 5000.00,
  "revenueResetAt": "2026-01-01T00:00:00Z"
}
```

### Reset Revenue Counter
```http
POST /api/admin/metrics/revenue/reset
Authorization: Bearer {admin-token}

Response 204 No Content
```

---

## 👑 ADMIN - EMPLOYEES

### List Employees
```http
GET /api/admin/employees
Authorization: Bearer {admin-token}

Response 200:
[
  {
    "id": 5,
    "username": "employee1",
    "email": "emp@store.com"
  }
]
```

---

## 👑 ADMIN - SHIPPING ZONES

### List Shipping Zones
```http
GET /api/admin/shipping-zones
Authorization: Bearer {admin-token}

Response 200:
[
  {
    "id": 1,
    "city": "Amman",
    "fee": 3.00
  }
]
```

### Create Shipping Zone
```http
POST /api/admin/shipping-zones
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "city": "Irbid",
  "fee": 5.00
}

Response 201: ShippingZoneDto
```

---

## 👑 ADMIN - COUPONS

### List Coupons
```http
GET /api/admin/coupons
Authorization: Bearer {admin-token}

Response 200: [CouponDto]
```

### Create Coupon
```http
POST /api/admin/coupons
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "code": "WELCOME10",
  "type": "PERCENT",
  "value": 10.00,
  "minOrderTotal": 50.00,
  "startAt": "2026-01-01T00:00:00Z",
  "endAt": "2026-12-31T23:59:59Z",
  "usageLimitTotal": 100,
  "usageLimitPerUser": 1,
  "active": true
}

Response 201: CouponDto
```

---

## 👔 EMPLOYEE - ORDERS

### List My Assigned Orders
```http
GET /api/employee/orders?page=0&size=20
Authorization: Bearer {employee-token}

Response 200: Page<OrderDto>
```

### Get Order Details
```http
GET /api/employee/orders/{id}
Authorization: Bearer {employee-token}

Response 200: OrderDto
```

### Update Order Status (Limited)
```http
PATCH /api/employee/orders/{id}/status
Authorization: Bearer {employee-token}
Content-Type: application/json

{
  "status": "SHIPPED"
}

Response 200: OrderDto
```
*Employee can only set: PROCESSING, SHIPPED, DELIVERED*

---

## 👑 ADMIN - USERS

### Disable User
```http
PATCH /api/admin/users/{id}/disable
Authorization: Bearer {admin-token}

Response 200: UserDto
```

---

## 📊 STATUS CODES

- **200 OK**: Success
- **201 Created**: Resource created
- **204 No Content**: Success with no body
- **400 Bad Request**: Validation error or business rule violation
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate or constraint violation
- **500 Internal Server Error**: Server error

---

## 🔒 ROLES

- **CUSTOMER**: Can shop, manage cart, place orders
- **EMPLOYEE**: Can view and update assigned orders
- **ADMIN**: Full system access

---

## 📝 NOTES

1. All timestamps are in ISO-8601 format (UTC)
2. Currency is JOD (Jordanian Dinar)
3. Pagination is 0-indexed
4. Default page size is typically 20
5. All Arabic error messages are returned from backend
6. Images are served from `/uploads/` path
7. Refresh token is HttpOnly cookie (set by server)

---

**Last Updated**: 2026-01-05

