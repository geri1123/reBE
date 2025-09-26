# 🏠 RealEstate Backend API

A **RESTful + real-time backend API** for a real estate platform supporting user management, property listings, role-based access (users, agents, agency owners), secure authentication, email verification, password recovery, profile images, property media uploads to **Firebase**, **real-time notifications with Socket.IO**, and **caching for better performance**.  

Built with **Node.js, Express, TypeScript, Prisma, MySQL, Firebase, and Socket.IO**.  

---

## 🚀 Features

- 🔐 **Authentication & Security**
  - User registration and login with **email verification**
  - **JWT-based authentication** with token middleware
  - Password recovery (send reset email + reset password)
  - Role-based access: **Users, Agents, Agency Owners**

- 👤 **User Profiles**
  - Upload and manage **profile images** (stored in Firebase)
  - Update profile info: about me, phone, website, username, password

- 🏘 **Properties**
  - Agents and agency owners can add/manage properties
  - Upload property **photos & documents** directly to Firebase
  - Property approval/rejection workflows

- 📩 **Real-time Notifications**
  - **Socket.IO integration** for property updates, approvals, and system notifications

- ⚡ **Performance & Caching**
  - Category data cached for faster responses
  - File validation for images and documents

- 📧 **Email Support**
  - Email verification on signup
  - Notifications for approvals, rejections, and password changes
  - Password reset workflow

- 🛠 **Error Handling**
  - Centralized custom error handling with consistent JSON responses

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js, TypeScript  
- **Database**: MySQL + Prisma ORM  
- **Authentication**: JWT  
- **File Storage**: Firebase Storage (replaces AWS S3)  
- **Real-time**: Socket.IO  
- **Uploads**: Multer (validation + upload to Firebase)  
- **Email**: Nodemailer (with Gmail or SMTP service)  
- **Caching**: In-memory caching for categories  
- **Environment Management**: dotenv  

---

## 🌱 Environment Variables

Create a `.env` file in the root directory.  

```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=re_db
DB_PORT=3306
DATABASE_URL="mysql://root:your_password@localhost:3306/re_db"

# CORS
CORS_ORIGIN=http://localhost:3000,http://192.168.0.104:3000

# Client
CLIENT_BASE_URL=http://localhost:3000

# Email
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
EMAIL_SERVICE=gmail

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=8080
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_STORAGE_BUCKET=your_bucket_name



📦 Installation & Setup

# Clone repo
git clone https://github.com/geri1123/backendRE
cd reBE

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Build project (for production)
npm run build

# Run in development
npm run dev


# 📌 API Routes Documentation
## 🔑 Auth Routes (`/api/auth`)
| Method | Endpoint                 | Description |
|--------|---------------------------|-------------|
| POST   | `/register`              | Register a new user |
| POST   | `/login`                 | Login with email & password (rate-limited) |
| GET    | `/verify-email`          | Verify user email using token |
| POST   | `/resend-verification`   | Resend email verification link |
| POST   | `/recover-password`      | Request password recovery link |
| POST   | `/reset-password`        | Reset password using recovery token |

---

## 👤 User Routes (`/profile`)
| Method | Endpoint                  | Description |
|--------|----------------------------|-------------|
| PATCH  | `/update-profileImg`      | Update profile picture |
| PATCH  | `/update-username`        | Change username |
| PATCH  | `/update-password`        | Change password |
| PATCH  | `/update-me`              | Update profile fields |
| GET    | `/userInfo`               | Get logged-in user info |

---

## 🏢 Agency Routes (`/agencyapi`)
| Method | Endpoint                     | Description |
|--------|-------------------------------|-------------|
| PATCH  | `/updateAgencyFields`        | Update agency details |
| GET    | `/getAgentsRequest`          | Get pending agent requests |
| PATCH  | `/agent-request/respond`     | Respond to agent request |
| PATCH  | `/update-logo`               | Update agency logo |

---

## 🔔 Notification Routes (`/api/notification`)
| Method | Endpoint                   | Description |
|--------|-----------------------------|-------------|
| GET    | `/getNotifications`        | Get all notifications for logged-in user |
| PATCH  | `/markAsRead/:id`          | Mark notification as read |

---

## 🗂 Category Routes (`/apiCat`)
| Method | Endpoint                     | Description |
|--------|-------------------------------|-------------|
| GET    | `/filter`                    | Get available filters |
| GET    | `/attributes/:subcategoryId` | Get attributes by subcategory |
| GET    | `/attributes/:language/:subcategoryId` | Get attributes (localized) |

---

## 📋 Listing Type Routes (`/apiLT`)
| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| GET    | `/listingTypes`   | Get all listing types |
| GET    | `/countries`      | Get list of countries |
| GET    | `/cities/:code`   | Get cities by country code |

---

## 🛍 Product Routes (`/product`)
| Method | Endpoint                          | Description |
|--------|------------------------------------|-------------|
| POST   | `/addProduct`                     | Add new product (with images) |
| GET    | `/search`                         | Search products |
| GET    | `/search/:category`               | Search products by category |
| GET    | `/search/:category/:subcategory`  | Search products by category + subcategory |

---

## 🩺 Health Check
| Method | Endpoint      | Description |
|--------|---------------|-------------|
| GET    | `/`           | Root health info |
| GET    | `/health`     | Health check with uptime & timestamp |
