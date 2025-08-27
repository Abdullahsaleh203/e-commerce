# E-Commerce Project

A modern e-commerce platform built with Next.js, featuring a responsive design and comprehensive shopping experience.

## Features


- 🛍️ Product browsing and searching
- 🛒 Shopping cart functionality
- 👤 User authentication and profiles
- 💳 Secure payment processing
- 📱 Responsive design for all devices
- 🔍 Advanced product filtering and search
- ⭐ Product reviews and ratings
- 📦 Order tracking and management

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment Processing**: Stripe
- **Image Storage**: Cloudinary

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
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

## Contact

Your Name - [@yourtwitter](https://twitter.com/abdallahsaleh25) - 

Project Link: [https://github.com/abdullahsaleh203/e-commerce](https://github.com/abdullahsaleh203/e-commerce)
