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
