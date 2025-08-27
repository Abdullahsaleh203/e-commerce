import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'A comprehensive e-commerce API with authentication, product management, cart functionality, payments, and analytics',
      contact: {
        name: 'Abdallah Saleh',
        email: 'abdallah.saleh203@yahoo.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'http://localhost:8000',
        description: 'Alternative development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Unique username',
              minLength: 3
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 12,
              description: 'User password (min 12 chars, must contain uppercase, lowercase, number, and special character)',
              writeOnly: true
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'User role'
            },
            cartItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          }
        },
        UserSignup: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Unique username',
              minLength: 3
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 12,
              description: 'User password (min 12 chars, must contain uppercase, lowercase, number, and special character)'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'description', 'category', 'image'],
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID'
            },
            name: {
              type: 'string',
              minLength: 3,
              description: 'Product name'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            category: {
              type: 'string',
              enum: ['electronics', 'fashion', 'books'],
              description: 'Product category'
            },
            stock: {
              type: 'number',
              default: 0,
              description: 'Available stock quantity'
            },
            image: {
              type: 'string',
              description: 'Product image URL'
            },
            isFeatured: {
              type: 'boolean',
              default: false,
              description: 'Whether product is featured'
            },
            sold: {
              type: 'number',
              default: 0,
              description: 'Number of units sold'
            },
            reviews: {
              type: 'number',
              default: 0,
              description: 'Number of reviews'
            },
            ratings: {
              type: 'number',
              default: 0,
              description: 'Average rating'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Product creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        ProductCreate: {
          type: 'object',
          required: ['name', 'price', 'description', 'category', 'image'],
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              description: 'Product name'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            category: {
              type: 'string',
              enum: ['electronics', 'fashion', 'books'],
              description: 'Product category'
            },
            stock: {
              type: 'number',
              default: 0,
              description: 'Available stock quantity'
            },
            image: {
              type: 'string',
              description: 'Product image URL'
            },
            isFeatured: {
              type: 'boolean',
              default: false,
              description: 'Whether product is featured'
            }
          }
        },
        CartItem: {
          type: 'object',
          properties: {
            product: {
              type: 'string',
              description: 'Product ID'
            },
            quantity: {
              type: 'number',
              minimum: 1,
              default: 1,
              description: 'Quantity of the product'
            }
          }
        },
        AddToCart: {
          type: 'object',
          required: ['productId'],
          properties: {
            productId: {
              type: 'string',
              description: 'Product ID to add to cart'
            },
            quantity: {
              type: 'number',
              minimum: 1,
              default: 1,
              description: 'Quantity to add'
            }
          }
        },
        UpdateQuantity: {
          type: 'object',
          required: ['quantity'],
          properties: {
            quantity: {
              type: 'number',
              minimum: 0,
              description: 'New quantity (0 removes item)'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Order ID'
            },
            user: {
              type: 'string',
              description: 'User ID'
            },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'string',
                    description: 'Product ID'
                  },
                  quantity: {
                    type: 'number',
                    minimum: 1,
                    description: 'Quantity ordered'
                  },
                  price: {
                    type: 'number',
                    minimum: 0,
                    description: 'Price at time of order'
                  }
                }
              }
            },
            totalAmount: {
              type: 'number',
              minimum: 0,
              description: 'Total order amount'
            },
            stripeSessionId: {
              type: 'string',
              description: 'Stripe session ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        Coupon: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Coupon ID'
            },
            code: {
              type: 'string',
              description: 'Coupon code'
            },
            discountPercentage: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Discount percentage'
            },
            expirationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Coupon expiration date'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Whether coupon is active'
            },
            userId: {
              type: 'string',
              description: 'User ID who can use this coupon'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Coupon creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        ValidateCoupon: {
          type: 'object',
          required: ['code'],
          properties: {
            code: {
              type: 'string',
              description: 'Coupon code to validate'
            }
          }
        },
        CheckoutSession: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'string',
                    description: 'Product ID'
                  },
                  quantity: {
                    type: 'number',
                    minimum: 1,
                    description: 'Quantity to purchase'
                  }
                }
              }
            },
            couponCode: {
              type: 'string',
              description: 'Optional coupon code'
            }
          }
        },
        CheckoutSuccess: {
          type: 'object',
          required: ['sessionId'],
          properties: {
            sessionId: {
              type: 'string',
              description: 'Stripe session ID'
            }
          }
        },
        Analytics: {
          type: 'object',
          properties: {
            totalRevenue: {
              type: 'number',
              description: 'Total revenue'
            },
            totalSales: {
              type: 'number',
              description: 'Total number of sales'
            },
            totalProducts: {
              type: 'number',
              description: 'Total number of products'
            },
            totalUsers: {
              type: 'number',
              description: 'Total number of users'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            token: {
              type: 'string',
              description: 'JWT token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      },
      {
        cookieAuth: []
      }
    ]
  },
  apis: ['./backend/routes/*.js', './backend/controllers/*.js'] // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
