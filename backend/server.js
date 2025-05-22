import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

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
app.use(morgan('dev'));
app.use(helmet());
/// mongoSanitize() is a middleware that helps prevent NoSQL injection attacks by sanitizing user input
app.use(mongoSanitize());
// Enable CORS for all routes to allow cross-origin requests 
app.use(cors());

// Connect to MongoDB
const DB = process.env.DATABASE_URI;
mongoose.connect(DB)
  .then(() => console.log('DB connection successful! 🚀 '))
  .catch((err) => console.error('DB connection error:', err));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🌐 `);
});
