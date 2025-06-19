# Documentation Index

Welcome to the e-commerce platform documentation. This directory contains comprehensive guides for developers, administrators, and contributors.

## Documentation Structure

### 📖 Core Documentation

| File | Description | Audience |
|------|-------------|----------|
| [API_AUTHENTICATION.md](./API_AUTHENTICATION.md) | Authentication system, JWT tokens, security | Developers |
| [API_ENDPOINTS.md](./API_ENDPOINTS.md) | Complete API reference with examples | Developers, Frontend |
| [DATABASE_MODELS.md](./DATABASE_MODELS.md) | Database schemas and relationships | Developers, DBAs |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide | DevOps, System Admins |

### 🚀 Quick Start Guides

#### For Developers
1. Read [API_AUTHENTICATION.md](./API_AUTHENTICATION.md) to understand authentication
2. Review [API_ENDPOINTS.md](./API_ENDPOINTS.md) for available endpoints
3. Check [DATABASE_MODELS.md](./DATABASE_MODELS.md) for data structures

#### For System Administrators
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
2. Review security configurations in authentication docs
3. Set up monitoring and logging as per deployment guide

#### For Frontend Developers
1. Start with [API_ENDPOINTS.md](./API_ENDPOINTS.md) for API integration
2. Review authentication flow in [API_AUTHENTICATION.md](./API_AUTHENTICATION.md)
3. Understand data models in [DATABASE_MODELS.md](./DATABASE_MODELS.md)

## Architecture Overview

```
Frontend (Next.js)
       ↓
API Layer (Express.js)
       ↓
Authentication Middleware (JWT)
       ↓
Business Logic (Controllers)
       ↓
Data Layer (MongoDB + Redis)
       ↓
External Services (Stripe, Cloudinary)
```

## Key Features Covered

### Authentication System
- JWT token-based authentication
- Refresh token mechanism
- Role-based access control (User/Admin)
- Secure password hashing
- Session management with Redis

### E-commerce Functionality
- Product catalog management
- Shopping cart operations
- Payment processing with Stripe
- Coupon and discount system
- Order management
- Analytics and reporting

### Security Features
- Rate limiting and DDoS protection
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure HTTP headers

## Environment Setup

### Required Services
- **Database**: MongoDB (Atlas recommended)
- **Cache**: Redis (Upstash recommended)
- **Payment**: Stripe account
- **File Storage**: Cloudinary account

### Environment Variables
```env
# Core
NODE_ENV=production
PORT=5000

# Database
DATABASE_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Stripe
STRIPE_SECRET_KEY=sk_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## API Testing

### Authentication Flow Test
```bash
# 1. Register user
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test123!"}' \
  -c cookies.txt

# 2. Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  -c cookies.txt

# 3. Get profile
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -b cookies.txt
```

### E-commerce Flow Test
```bash
# 1. Get featured products
curl -X GET http://localhost:5000/api/v1/products/featured

# 2. Add to cart
curl -X POST http://localhost:5000/api/v1/cart \
  -H "Content-Type: application/json" \
  -d '{"ProductId":"PRODUCT_ID_HERE"}' \
  -b cookies.txt

# 3. Create checkout session
curl -X POST http://localhost:5000/api/v1/payment/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"products":[{"_id":"ID","name":"Product","price":99,"quantity":1}]}' \
  -b cookies.txt
```

## Common Use Cases

### User Registration and Login
- New user signs up → receives JWT tokens
- User logs in → gets access and refresh tokens
- Tokens stored in HTTP-only cookies
- Refresh token used for seamless token renewal

### Shopping Flow
- Browse products by category or featured status
- Add items to cart (persistent across sessions)
- Apply discount coupons during checkout
- Process payment through Stripe
- Receive order confirmation

### Admin Operations
- View analytics dashboard
- Manage product catalog
- Toggle featured products
- Monitor user activity

## Error Handling

### Common Error Patterns
```json
{
  "status": "error",
  "message": "Descriptive error message",
  "statusCode": 400
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created successfully
- `400`: Bad request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `409`: Conflict (duplicate resource)
- `429`: Too many requests (rate limited)
- `500`: Internal server error

## Performance Considerations

### Caching Strategy
- Redis for session storage
- API response caching for static data
- Database query optimization with indexes

### Database Optimization
- Proper indexing on frequently queried fields
- Aggregation pipelines for analytics
- Connection pooling for performance

### Security Best Practices
- Environment variables for sensitive data
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure cookie configuration

## Monitoring and Maintenance

### Health Checks
- Database connectivity
- Redis availability
- External service status
- Application uptime

### Logging Strategy
- Error logging with stack traces
- Access logs for monitoring
- Performance metrics tracking
- Security event logging

## Support and Troubleshooting

### Common Issues
1. **Authentication failures**: Check JWT secret configuration
2. **Database connection issues**: Verify MongoDB URI and network access
3. **Redis connection problems**: Confirm Upstash credentials
4. **Payment processing errors**: Validate Stripe configuration
5. **Image upload failures**: Check Cloudinary settings

### Getting Help
- Review specific documentation files for detailed information
- Check error logs for debugging information
- Verify environment variable configuration
- Test API endpoints with provided examples

## Contributing to Documentation

When updating documentation:
1. Keep examples current and tested
2. Include both success and error scenarios
3. Provide clear, step-by-step instructions
4. Update this index when adding new documentation
5. Maintain consistent formatting and structure

---

This documentation is designed to provide comprehensive coverage of the e-commerce platform. For specific implementation details, refer to the individual documentation files listed above.
