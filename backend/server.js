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
import authRouter from './routes/auth.js';

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

// connecting to MongoDB
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
  .then(() => console.log('DB connection successful! 🚀 '))
  .catch((err) => console.error('DB connection error:', err));

// Data sanitization against XSS
// app.use(xss());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/v1/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🌐 `);
});
