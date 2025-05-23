import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config();
// Initialize Redis client

export const client = new Redis(process.env.UPSTASH_REDIS_REST_URL);
