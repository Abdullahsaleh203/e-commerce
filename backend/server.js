
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
// import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss';
import userRoutes from './routes/userRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import couponsRoutes from './routes/couponsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
<<<<<<< HEAD
import analyticsRoutes from './routes/analyticsRoutes.js'
import { specs, swaggerUi } from './config/swagger.js';
=======
import analyticsRoutes from './routes/analyticsRoutes.js';
>>>>>>> ef126a2fb5073d628b3ce6e8241f34746f839882


const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

// Set security HTTP headers
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Middleware to log requests

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Middleware to set security HTTP headers
// helmet() is a middleware that helps secure your Express apps by setting various HTTP headers
app.use(helmet());

// Enable CORS for all routes to allow cross-origin requests
// app.use(cors({
//   origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.FRONTEND_URL,
//   credentials: true // This allows cookies to be sent with requests
// }));

// Data sanitization against NoSQL query injection
/// mongoSanitize() is a middleware that helps prevent NoSQL injection attacks by sanitizing user input
// app.use(mongoSanitize()); // Removed duplicate usage

// Cookie parser
app.use(cookieParser());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true })); // Parse incoming requests with JSON payloads


// Connect to MongoDB
const DB = process.env.DATABASE_URI;
mongoose.connect(DB)
  .then(() => console.log('DB connection successful! 🚀  🌐'))
  .catch((err) => console.error('DB connection error:', err));

// Data sanitization against XSS
// app.use(xss());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-Commerce API Documentation'
}));

app.get('/', (req, res) => {
<<<<<<< HEAD
  res.send('Hello World! Visit <a href="/api-docs">/api-docs</a> for API documentation.');
=======
  res.send('<h1> Hello World! </h1> <h2>Welcome to the E-commerce API</h2>');
>>>>>>> ef126a2fb5073d628b3ce6e8241f34746f839882
});
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/coupons', couponsRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🌐 `);
});

