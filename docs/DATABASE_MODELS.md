# Database Models Documentation

This document describes all the database models used in the e-commerce backend application.

## User Model

The User model represents registered users in the system.

### Schema Definition

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  cartItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1']
    }
  }]
}, {
  timestamps: true
});
```

### Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `username` | String | Yes | User's display name (3-30 chars) |
| `email` | String | Yes | User's email address (unique) |
| `password` | String | Yes | Hashed password (min 8 chars) |
| `role` | String | No | User role: 'user' or 'admin' |
| `cartItems` | Array | No | Shopping cart items |
| `createdAt` | Date | Auto | Account creation timestamp |
| `updatedAt` | Date | Auto | Last modification timestamp |

### Methods

```javascript
// Compare password for authentication
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

### Example Document

```json
{
  "_id": "648a5c7d1234567890abcdef",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "$2a$12$hashedpasswordhere",
  "role": "user",
  "cartItems": [
    {
      "product": "648a5c7d1234567890abcdef",
      "quantity": 2,
      "_id": "648a5c7d1234567890abcdef"
    }
  ],
  "createdAt": "2025-06-19T10:30:00.000Z",
  "updatedAt": "2025-06-19T10:30:00.000Z"
}
```

---

## Product Model

The Product model represents items available for purchase.

### Schema Definition

```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['electronics', 'fashion', 'books', 'home', 'sports', 'beauty'],
      message: 'Category must be one of: electronics, fashion, books, home, sports, beauty'
    }
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sold: {
    type: Number,
    default: 0,
    min: [0, 'Sold quantity cannot be negative']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  }
}, {
  timestamps: true
});
```

### Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `name` | String | Yes | Product name (max 100 chars) |
| `price` | Number | Yes | Product price (≥ 0) |
| `description` | String | Yes | Product description (max 1000 chars) |
| `category` | String | Yes | Product category (enum) |
| `stock` | Number | No | Available quantity (default: 0) |
| `image` | String | Yes | Product image URL |
| `isFeatured` | Boolean | No | Featured status (default: false) |
| `sold` | Number | No | Number of units sold (default: 0) |
| `reviews` | Number | No | Number of reviews (default: 0) |
| `ratings` | Number | No | Average rating 0-5 (default: 0) |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last modification timestamp |

### Example Document

```json
{
  "_id": "648a5c7d1234567890abcdef",
  "name": "iPhone 14 Pro",
  "price": 999.99,
  "description": "Latest iPhone with advanced camera system and A16 Bionic chip",
  "category": "electronics",
  "stock": 50,
  "image": "https://res.cloudinary.com/demo/image/upload/v1234567890/iphone14pro.jpg",
  "isFeatured": true,
  "sold": 125,
  "reviews": 42,
  "ratings": 4.8,
  "createdAt": "2025-06-19T10:30:00.000Z",
  "updatedAt": "2025-06-19T11:45:00.000Z"
}
```

---

## Order Model

The Order model represents completed purchases.

### Schema Definition

```javascript
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  products: [{
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  stripeSessionId: {
    type: String,
    required: [true, 'Stripe session ID is required'],
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, {
  timestamps: true
});
```

### Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `user` | ObjectId | Yes | Reference to User who placed order |
| `products` | Array | Yes | Array of ordered products |
| `products.ProductId` | ObjectId | Yes | Reference to Product |
| `products.quantity` | Number | Yes | Quantity ordered |
| `products.price` | Number | Yes | Price at time of order |
| `totalAmount` | Number | Yes | Total order amount |
| `stripeSessionId` | String | Yes | Stripe payment session ID |
| `status` | String | No | Order status (default: 'pending') |
| `shippingAddress` | Object | No | Delivery address |
| `createdAt` | Date | Auto | Order creation timestamp |
| `updatedAt` | Date | Auto | Last modification timestamp |

### Example Document

```json
{
  "_id": "648a5c7d1234567890abcdef",
  "user": "648a5c7d1234567890abcdef",
  "products": [
    {
      "ProductId": "648a5c7d1234567890abcdef",
      "quantity": 2,
      "price": 999.99,
      "_id": "648a5c7d1234567890abcdef"
    }
  ],
  "totalAmount": 1999.98,
  "stripeSessionId": "cs_test_1234567890abcdef",
  "status": "paid",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "createdAt": "2025-06-19T10:30:00.000Z",
  "updatedAt": "2025-06-19T10:30:00.000Z"
}
```

---

## Coupon Model

The Coupon model represents discount codes for users.

### Schema Definition

```javascript
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [4, 'Coupon code must be at least 4 characters'],
    maxlength: [20, 'Coupon code cannot exceed 20 characters']
  },
  discountAmount: {
    type: Number,
    required: [true, 'Discount amount is required'],
    min: [0, 'Discount amount cannot be negative']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  expirationDate: {
    type: Date,
    required: [true, 'Expiration date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Expiration date must be in the future'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Coupon must belong to a user']
  },
  usageLimit: {
    type: Number,
    default: 1,
    min: [1, 'Usage limit must be at least 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  minimumAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum amount cannot be negative']
  }
}, {
  timestamps: true
});
```

### Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `code` | String | Yes | Unique coupon code (4-20 chars) |
| `discountAmount` | Number | Yes* | Fixed discount amount |
| `discountPercentage` | Number | Yes* | Percentage discount (0-100) |
| `expirationDate` | Date | Yes | Coupon expiry date |
| `isActive` | Boolean | No | Active status (default: true) |
| `user` | ObjectId | Yes | Reference to User who owns coupon |
| `usageLimit` | Number | No | Max usage count (default: 1) |
| `usedCount` | Number | No | Current usage count (default: 0) |
| `minimumAmount` | Number | No | Minimum order amount (default: 0) |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last modification timestamp |

*Either `discountAmount` OR `discountPercentage` is required

### Methods

```javascript
// Check if coupon is valid
couponSchema.methods.isValid = function() {
  return this.isActive && 
         this.expirationDate > new Date() && 
         this.usedCount < this.usageLimit;
};

// Apply coupon to order amount
couponSchema.methods.applyDiscount = function(orderAmount) {
  if (!this.isValid() || orderAmount < this.minimumAmount) {
    return orderAmount;
  }
  
  if (this.discountAmount) {
    return Math.max(0, orderAmount - this.discountAmount);
  } else if (this.discountPercentage) {
    return orderAmount * (1 - this.discountPercentage / 100);
  }
  
  return orderAmount;
};
```

### Example Document

```json
{
  "_id": "648a5c7d1234567890abcdef",
  "code": "WELCOME10",
  "discountAmount": 10.00,
  "expirationDate": "2025-12-31T23:59:59.999Z",
  "isActive": true,
  "user": "648a5c7d1234567890abcdef",
  "usageLimit": 1,
  "usedCount": 0,
  "minimumAmount": 50.00,
  "createdAt": "2025-06-19T10:30:00.000Z",
  "updatedAt": "2025-06-19T10:30:00.000Z"
}
```

---

## Database Relationships

### User → Products (Cart)
- One-to-Many: User has many cart items
- Each cart item references a Product

### User → Orders
- One-to-Many: User can have multiple orders
- Each order belongs to one user

### Product → Orders
- Many-to-Many: Products can be in multiple orders
- Orders can contain multiple products

### User → Coupons
- One-to-Many: User can have multiple coupons
- Each coupon belongs to one user

### Relationship Diagram

```
User
├── cartItems[] → Product
├── orders[] → Order
└── coupons[] → Coupon

Order
├── user → User
└── products[] → Product

Product
├── orders[] → Order (via Order.products)
└── cartItems[] → User (via User.cartItems)

Coupon
└── user → User
```

## Indexing Strategy

### Recommended Indexes

```javascript
// User model indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Product model indexes
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search

// Order model indexes
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 }); // Recent orders first
orderSchema.index({ stripeSessionId: 1 }, { unique: true });

// Coupon model indexes
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ user: 1 });
couponSchema.index({ expirationDate: 1 });
couponSchema.index({ isActive: 1 });
```

## Data Validation

### Custom Validators

```javascript
// Email validation
validate: {
  validator: function(email) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  },
  message: 'Please enter a valid email address'
}

// Password strength validation
validate: {
  validator: function(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);
  },
  message: 'Password must contain at least 8 characters with uppercase, lowercase, and number'
}

// Future date validation
validate: {
  validator: function(date) {
    return date > new Date();
  },
  message: 'Date must be in the future'
}
```

This document provides a comprehensive overview of all database models used in the e-commerce application, including their schemas, relationships, and validation rules.
