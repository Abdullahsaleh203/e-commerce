# Deployment Guide

This guide covers deploying the e-commerce backend API to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:

- [ ] MongoDB database (local or MongoDB Atlas)
- [ ] Redis instance (local or Upstash)
- [ ] Stripe account with API keys
- [ ] Cloudinary account for image storage
- [ ] Environment variables configured

## Environment Variables

Create a production-ready `.env` file:

```env
# Database
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_at_least_32_chars
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=https://optimal-ewe-16898.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=8000
NODE_ENV=production

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Deployment Options

## 1. Heroku Deployment

### Prerequisites
- Heroku CLI installed
- Git repository

### Steps

1. **Login to Heroku:**
```bash
heroku login
```

2. **Create Heroku app:**
```bash
heroku create your-ecommerce-api
```

3. **Set environment variables:**
```bash
heroku config:set DATABASE_URI="mongodb+srv://user:pass@cluster.mongodb.net/ecommerce"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set STRIPE_SECRET_KEY="sk_live_your_key"
heroku config:set CLOUDINARY_CLOUD_NAME="your_cloud_name"
# ... set all other variables
```

4. **Create Procfile:**
```bash
echo "web: node backend/server.js" > Procfile
```

5. **Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

6. **Scale dynos:**
```bash
heroku ps:scale web=1
```

### Heroku Add-ons (Optional)
```bash
# MongoDB Atlas (if not using external)
heroku addons:create mongolab:sandbox

# Redis (if not using Upstash)
heroku addons:create heroku-redis:mini

# Logging
heroku addons:create papertrail:choklad
```

## 2. Railway Deployment

### Prerequisites
- Railway account
- GitHub repository

### Steps

1. **Connect GitHub:**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure build settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend` (if backend is in subdirectory)

3. **Set environment variables:**
   - Go to Variables tab in Railway dashboard
   - Add all environment variables from your `.env` file

4. **Deploy:**
   - Railway automatically deploys on push to main branch

### Railway.json (Optional)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 3. DigitalOcean App Platform

### Steps

1. **Create App:**
   - Go to DigitalOcean App Platform
   - Connect GitHub repository

2. **Configure App Spec:**
```yaml
name: ecommerce-api
services:
- name: api
  source_dir: backend
  github:
    repo: your-username/ecommerce
    branch: main
  build_command: npm install
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URI
    value: your_mongodb_uri
    type: SECRET
  - key: JWT_SECRET
    value: your_jwt_secret
    type: SECRET
```

3. **Add environment variables** in the App Platform dashboard

4. **Deploy** by pushing to the connected branch

## 4. AWS EC2 Deployment

### Prerequisites
- AWS account
- EC2 instance running Ubuntu 20.04+
- Domain name (optional)

### Steps

1. **Connect to EC2:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2:**
```bash
sudo npm install -g pm2
```

4. **Clone repository:**
```bash
git clone https://github.com/your-username/ecommerce.git
cd ecommerce/backend
npm install
```

5. **Create environment file:**
```bash
nano .env
# Add all your environment variables
```

6. **Create PM2 ecosystem file:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ecommerce-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    }
  }]
};
```

7. **Start application:**
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

8. **Setup Nginx reverse proxy:**
```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/ecommerce-api
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ecommerce-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 5. Vercel Deployment (Serverless)

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Create vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Set environment variables:**
```bash
vercel env add DATABASE_URI
vercel env add JWT_SECRET
# Add all other environment variables
```

## Database Setup

### MongoDB Atlas

1. **Create cluster:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster

2. **Create database user:**
   - Database Access → Add New Database User
   - Set username/password

3. **Whitelist IP addresses:**
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` for all IPs (production: use specific IPs)

4. **Get connection string:**
   - Clusters → Connect → Connect your application
   - Copy the connection string

### Redis Setup (Upstash)

1. **Create Redis database:**
   - Go to [Upstash](https://upstash.com)
   - Create new Redis database

2. **Get credentials:**
   - Copy REST URL and token
   - Add to environment variables

## SSL Certificate

### Let's Encrypt (Free)
```bash
sudo certbot --nginx -d yourdomain.com
```

### Cloudflare (Recommended)
1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption
4. Set SSL mode to "Full (strict)"

## Monitoring and Logging

### PM2 Monitoring
```bash
# View logs
pm2 logs

# Monitor processes
pm2 monit

# Restart app
pm2 restart ecommerce-api
```

### Application Monitoring

1. **Setup error tracking:**
```bash
npm install @sentry/node
```

```javascript
// In server.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

2. **Setup uptime monitoring:**
   - Use services like UptimeRobot, Pingdom, or StatusCake
   - Monitor `/api/v1/health` endpoint

### Health Check Endpoint

Create a health check endpoint:

```javascript
// In routes
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

## Performance Optimization

### 1. Enable Gzip Compression
```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Set up Caching Headers
```javascript
app.use('/api/v1/products/featured', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

### 3. Database Indexing
```javascript
// In your models
userSchema.index({ email: 1 });
productSchema.index({ category: 1, isFeatured: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
```

### 4. Redis Caching
```javascript
// Cache frequently accessed data
const getCachedProducts = async () => {
  const cached = await redis.get('featured_products');
  if (cached) return JSON.parse(cached);
  
  const products = await Product.find({ isFeatured: true });
  await redis.setex('featured_products', 300, JSON.stringify(products));
  return products;
};
```

## Security Checklist

- [ ] Environment variables are not exposed
- [ ] JWT secrets are strong and unique
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive data
- [ ] Database credentials are secure
- [ ] Regular security updates are applied

## Backup Strategy

### Database Backups
```bash
# MongoDB Atlas - automatic backups
# Manual backup:
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/ecommerce"
```

### Application Backups
- Use Git for code versioning
- Backup environment variables securely
- Document deployment procedures

## Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Find process using port
lsof -i :8000
# Kill process
kill -9 PID
```

2. **MongoDB connection issues:**
   - Check connection string
   - Verify IP whitelist
   - Confirm user credentials

3. **Redis connection issues:**
   - Verify Upstash credentials
   - Check network connectivity
   - Review Redis configuration

4. **Memory issues:**
```bash
# Check memory usage
free -h
# Restart PM2 processes
pm2 restart all
```

### Logging Best Practices

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

This deployment guide provides comprehensive instructions for deploying your e-commerce backend to various platforms with security and performance considerations.
