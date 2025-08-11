# RealEstate Backend API

A RESTful backend API for a real estate platform supporting user registration, role-based access (users, agents, agency owners), profile management (including profile images), secure authentication, and file uploads. Built with Node.js, Express, TypeScript, and MySQL.

---

## Features

- User registration and login with email verification
- Role-based access control: users, agents, agency owners
- Profile image upload and management (local storage or AWS S3)
- Update profile info: about me, phone, website, username, password
- File upload support for images and documents with validation
- Secure JWT authentication and token verification middleware
- Agent and agency management with approval and rejection workflows
- Email notifications for verification, approval, rejection, and password changes
- Custom error handling with clear, consistent responses

---

## Technologies Used

- Node.js & Express.js
- TypeScript
- MySQL with Prisma ORM
- Multer for file uploads (local and AWS S3 options)
- AWS SDK (optional for S3 storage)
- JSON Web Tokens (JWT) for authentication
- dotenv for environment variable management


## 🌱 Environment Variables

Before running the project, create a `.env` file in the root directory. You can copy `.env.example` as a starting point:

```bash
cp .env.example .env

# Database configuration
DB_HOST=localhost
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=your_db_name
DB_PORT=3306

# Full DATABASE_URL (used by Prisma or other ORMs)
DATABASE_URL="mysql://db_user:db_password@localhost:3306/your_db_name"

# Allowed frontend origins for CORS (comma-separated)
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000

# Base URL of your frontend client (used in email links, redirects, etc.)
CLIENT_BASE_URL=http://localhost:3000

# Email configuration for sending emails
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
EMAIL_SERVICE=gmail

# JWT secret for authentication
JWT_SECRET=your_jwt_secret_key

# Express server port
PORT=8080



# Node environment (can be development, production, or test)
NODE_ENV=development
git clone https://github.com/geri1123/backendRE
cd your-repo

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Build the project (for production or when using TypeScript)
npm run build


# OR in development mode
npm run dev