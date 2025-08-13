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

