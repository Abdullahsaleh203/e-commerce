# API Endpoints Documentation

Complete reference for all API endpoints in the e-commerce backend.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Most endpoints require authentication. Include the JWT token in one of these ways:

1. **HTTP-only Cookie** (Recommended): Automatically sent with requests
2. **Authorization Header**: `Authorization: Bearer <token>`

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data here
  },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "status": "error", 
  "message": "Error description",
  "statusCode": 400
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com", 
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "648a5c7d1234567890abcdef",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "cartItems": []
  }
}
```

### 2. Login User
**POST** `/auth/login`

Authenticate user and return JWT tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "648a5c7d1234567890abcdef",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 3. Refresh Token
**POST** `/auth/refresh-token`

Generate new access token using refresh token.

**Authentication:** Requires refresh token cookie

**Success Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Logout
**POST** `/auth/logout`

Logout user and invalidate tokens.

**Success Response (200):**
```json
{
  "status": "success", 
  "message": "Logged out successfully"
}
```

### 5. Get Profile
**GET** `/auth/profile`

Get current user's profile information.

**Authentication:** Required

**Success Response (200):**
```json
{
  "_id": "648a5c7d1234567890abcdef",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "cartItems": [
    {
      "product": "648a5c7d1234567890abcdef",
      "quantity": 2
    }
  ]
}
```

---

## Product Endpoints

### 1. Get All Products (Admin)
**GET** `/products`

Get all products (admin only).

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "648a5c7d1234567890abcdef",
        "name": "iPhone 14 Pro",
        "price": 999.99,
        "description": "Latest iPhone model",
        "category": "electronics",
        "stock": 50,
        "image": "https://example.com/image.jpg",
        "isFeatured": true,
        "sold": 125,
        "reviews": 42,
        "ratings": 4.8
      }
    ]
  }
}
```

### 2. Get Featured Products
**GET** `/products/featured`

Get all featured products.

**Authentication:** None required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "648a5c7d1234567890abcdef",
        "name": "iPhone 14 Pro",
        "price": 999.99,
        "category": "electronics",
        "image": "https://example.com/image.jpg",
        "isFeatured": true
      }
    ]
  }
}
```

### 3. Get Products by Category
**GET** `/products/category/:category`

Get products filtered by category.

**Parameters:**
- `category` (string): One of 'electronics', 'fashion', 'books', 'home', 'sports', 'beauty'

**Authentication:** None required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "648a5c7d1234567890abcdef",
        "name": "iPhone 14 Pro",
        "price": 999.99,
        "category": "electronics"
      }
    ]
  }
}
```

### 4. Get Product Recommendations
**GET** `/products/recommendations`

Get personalized product recommendations.

**Authentication:** None required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "648a5c7d1234567890abcdef",
        "name": "Recommended Product",
        "price": 49.99,
        "category": "electronics"
      }
    ]
  }
}
```

### 5. Create Product (Admin)
**POST** `/products`

Create a new product.

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "name": "iPhone 14 Pro",
  "price": 999.99,
  "description": "Latest iPhone with advanced features",
  "category": "electronics",
  "image": "base64_encoded_image_or_url"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "product": {
      "_id": "648a5c7d1234567890abcdef",
      "name": "iPhone 14 Pro",
      "price": 999.99,
      "description": "Latest iPhone with advanced features",
      "category": "electronics",
      "stock": 0,
      "image": "https://cloudinary.com/uploaded-image.jpg",
      "isFeatured": false
    }
  }
}
```

### 6. Toggle Featured Product (Admin)
**PATCH** `/products/:id`

Toggle product's featured status.

**Parameters:**
- `id` (string): Product ID

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "product": {
      "_id": "648a5c7d1234567890abcdef",
      "isFeatured": true
    }
  }
}
```

### 7. Delete Product (Admin)
**DELETE** `/products/:id`

Delete a product.

**Parameters:**
- `id` (string): Product ID

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

## Cart Endpoints

### 1. Get Cart Items
**GET** `/cart`

Get current user's cart items.

**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "cartItems": [
      {
        "_id": "648a5c7d1234567890abcdef",
        "product": {
          "_id": "648a5c7d1234567890abcdef",
          "name": "iPhone 14 Pro",
          "price": 999.99,
          "image": "https://example.com/image.jpg"
        },
        "quantity": 2
      }
    ]
  }
}
```

### 2. Add Item to Cart
**POST** `/cart`

Add a product to cart.

**Authentication:** Required

**Request Body:**
```json
{
  "ProductId": "648a5c7d1234567890abcdef"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "cartItems": [
      {
        "product": "648a5c7d1234567890abcdef",
        "quantity": 1
      }
    ]
  }
}
```

### 3. Update Cart Item Quantity
**PUT** `/cart/:id`

Update quantity of a cart item.

**Parameters:**
- `id` (string): Product ID in cart

**Authentication:** Required

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "cartItems": [
      {
        "product": "648a5c7d1234567890abcdef",
        "quantity": 3
      }
    ]
  }
}
```

### 4. Remove All Items from Cart
**DELETE** `/cart`

Clear all items from cart.

**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Cart cleared successfully",
  "data": {
    "cartItems": []
  }
}
```

---

## Payment Endpoints

### 1. Create Checkout Session
**POST** `/payment/create-checkout-session`

Create a Stripe checkout session for payment.

**Authentication:** Required

**Request Body:**
```json
{
  "products": [
    {
      "_id": "648a5c7d1234567890abcdef",
      "name": "iPhone 14 Pro",
      "price": 999.99,
      "image": "https://example.com/image.jpg",
      "quantity": 2
    }
  ],
  "couponCode": "DISCOUNT10"
}
```

**Success Response (200):**
```json
{
  "id": "cs_test_1234567890abcdef",
  "totalAmount": 1989.98
}
```

### 2. Process Successful Checkout
**POST** `/payment/checkout-success`

Process successful payment and create order.

**Authentication:** Required

**Request Body:**
```json
{
  "sessionId": "cs_test_1234567890abcdef"
}
```

**Success Response (200):**
```json
{
  "message": "Order created successfully",
  "orderId": "648a5c7d1234567890abcdef"
}
```

---

## Coupon Endpoints

### 1. Get User Coupons
**GET** `/coupons`

Get current user's available coupons.

**Authentication:** Required

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "coupons": [
      {
        "_id": "648a5c7d1234567890abcdef",
        "code": "WELCOME10",
        "discountAmount": 10.00,
        "expirationDate": "2025-12-31T23:59:59.999Z",
        "isActive": true
      }
    ]
  }
}
```

### 2. Validate Coupon
**POST** `/coupons/validate`

Validate a coupon code for use.

**Authentication:** Required

**Request Body:**
```json
{
  "code": "WELCOME10"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "coupon": {
      "_id": "648a5c7d1234567890abcdef",
      "code": "WELCOME10",
      "discountAmount": 10.00,
      "isActive": true
    },
    "message": "Coupon is valid"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Coupon not found or expired",
  "statusCode": 400
}
```

---

## Analytics Endpoints (Admin Only)

### 1. Get Analytics Data
**GET** `/analytics`

Get comprehensive analytics data including sales, users, and revenue.

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "analytics": {
    "users": 150,
    "products": 45,
    "totalSales": 230,
    "totalRevenue": 15670.50
  },
  "dailySales": [
    {
      "date": "2025-06-13",
      "totalSales": 12,
      "totalRevenue": 850.30
    },
    {
      "date": "2025-06-14",
      "totalSales": 8,
      "totalRevenue": 620.75
    }
  ]
}
```

---

## Error Codes Reference

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 | Bad Request | Invalid input data, validation errors |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (e.g., admin required) |
| 404 | Not Found | Resource doesn't exist (user, product, etc.) |
| 409 | Conflict | Resource already exists (duplicate email, etc.) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Database errors, server issues |

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 attempts per 15 minutes per IP (login/signup)
- **Admin endpoints**: 200 requests per 15 minutes per IP

## CORS Policy

The API accepts requests from:
- `http://localhost:3000` (Development frontend)
- `https://yourdomain.com` (Production frontend)

## Example Usage

### Complete User Flow with cURL

1. **Register:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123!"}' \
  -c cookies.txt
```

2. **Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}' \
  -c cookies.txt
```

3. **Get featured products:**
```bash
curl -X GET http://localhost:8000/api/v1/products/featured
```

4. **Add to cart:**
```bash
curl -X POST http://localhost:8000/api/v1/cart \
  -H "Content-Type: application/json" \
  -d '{"ProductId":"648a5c7d1234567890abcdef"}' \
  -b cookies.txt
```

5. **Create checkout session:**
```bash
curl -X POST http://localhost:8000/api/v1/payment/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"products":[{"_id":"648a5c7d1234567890abcdef","name":"iPhone","price":999,"quantity":1}]}' \
  -b cookies.txt
```

This comprehensive API documentation covers all available endpoints with detailed request/response examples and error handling information.
