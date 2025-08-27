# E-Commerce Platform

A Full-stack e-commerce platform featuring a modern React frontend and robust Node.js backend API with comprehensive shopping functionality.

## 🚀 Features

- 🛍️ **Product Management** - Browse, search, and filter products by category
- 🛒 **Shopping Cart** - Add, update, remove items with persistent storage
- 👤 **User Authentication** - Secure JWT-based authentication with refresh tokens
- 💳 **Payment Processing** - Stripe integration for secure checkout
- 🎟️ **Coupon System** - Discount codes and automatic coupon generation
- 📊 **Analytics Dashboard** - Sales tracking and user metrics (Admin)
- 📱 **Responsive Design** - Mobile-first design for all devices
- � **Security** - Rate limiting, CORS, input validation, and secure headers
- ☁️ **Cloud Storage** - Cloudinary integration for image management
- � **Caching** - Redis caching for improved performance

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis (Upstash)
- **Authentication**: JWT with refresh tokens
- **Payment**: Stripe API
- **File Storage**: Cloudinary
- **Security**: Helmet, Rate Limiting, CORS

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Fetch API

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[API Authentication](./docs/API_AUTHENTICATION.md)** - JWT authentication, login/logout, token management
- **[API Endpoints](./docs/API_ENDPOINTS.md)** - Complete API reference with examples
- **[Database Models](./docs/DATABASE_MODELS.md)** - MongoDB schema definitions and relationships
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to Heroku, Railway, AWS, and more

### Quick Links

| Documentation | Description |
|---------------|-------------|
| [Authentication](./docs/API_AUTHENTICATION.md) | User registration, login, JWT tokens |
| [API Reference](./docs/API_ENDPOINTS.md) | All endpoints with request/response examples |
| [Database Design](./docs/DATABASE_MODELS.md) | Schema definitions and relationships |
| [Deployment](./docs/DEPLOYMENT.md) | Production deployment instructions |

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- Redis
- Stripe account (for payments)
- Cloudinary account (for image storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abdullahsaleh203/e-commerce.git
cd e-commerce
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:8000](http://localhost:8000) in your browser to see the application.

## API Documentation

This project includes comprehensive API documentation using Swagger UI. The documentation provides detailed information about all available endpoints, request/response schemas, authentication requirements, and example usage.

### Accessing the API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Alternative port**: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

### API Features

The API documentation includes:

- **Interactive Testing**: Test endpoints directly from the browser
- **Request/Response Examples**: See exactly what data to send and expect
- **Authentication Examples**: Learn how to authenticate with JWT tokens
- **Schema Definitions**: Detailed data models for all entities
- **Error Handling**: Comprehensive error response documentation

### API Endpoints Overview

#### Authentication (`/api/v1/auth`)
- `POST /signup` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh JWT token
- `GET /profile` - Get user profile (Protected)

#### Products (`/api/v1/products`)
- `GET /` - Get all products (Admin only)
- `POST /` - Create product (Admin only)
- `GET /featured` - Get featured products
- `GET /category/:category` - Get products by category
- `GET /recommendations` - Get recommended products
- `PATCH /:id` - Toggle featured status (Admin only)
- `DELETE /:id` - Delete product (Admin only)

#### Shopping Cart (`/api/v1/cart`)
- `GET /` - Get cart items (Protected)
- `POST /` - Add item to cart (Protected)
- `PUT /:id` - Update item quantity (Protected)
- `DELETE /` - Clear cart (Protected)

#### Payment (`/api/v1/payment`)
- `POST /create-checkout-session` - Create Stripe checkout (Protected)
- `POST /checkout-success` - Handle payment success (Protected)

#### Coupons (`/api/v1/coupons`)
- `GET /` - Get user coupons (Protected)
- `POST /validate` - Validate coupon code (Protected)

#### Analytics (`/api/v1/analytics`)
- `GET /` - Get business analytics (Admin only)

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. You can authenticate in two ways:

1. **Bearer Token**: Include `Authorization: Bearer <token>` in request headers
2. **HTTP-only Cookie**: Token automatically sent with requests after login

### Error Handling

All API endpoints return standardized error responses:

```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Testing the API

1. Start the development server: `npm run dev`
2. Open the Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
3. Use the "Try it out" feature to test endpoints
4. For protected endpoints, first authenticate using the `/auth/login` endpoint
5. Copy the returned token and use the "Authorize" button in Swagger UI

## Project Structure

```
e-commerce/
├── components/     # Reusable UI components
├── pages/         # Next.js pages
├── public/        # Static assets
├── styles/        # Global styles
├── utils/         # Utility functions
├── models/        # Database models
├── api/           # API routes
└── config/        # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

