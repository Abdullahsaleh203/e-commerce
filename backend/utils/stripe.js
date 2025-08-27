import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Use a default test key if STRIPE_SECRET_KEY is not provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_default_key_for_development';

const stripe = new Stripe(stripeSecretKey);
export default stripe;
