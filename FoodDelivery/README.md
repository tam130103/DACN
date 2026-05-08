# 🍅 Food Delivery Application

A full-stack food delivery platform featuring a user-facing application, an administrative dashboard, and a robust REST API backend. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🏗️ Project Structure

The repository is organized into three main modules:

- **`/backend`**: Node.js & Express API, handling database operations, authentication, and payment processing.
- **`/frontend`**: React 19 application for customers to browse the menu, manage their cart, and place orders.
- **`/admin`**: React 19 dashboard for administrators to manage food items, track orders, and update delivery statuses.

## 🚀 Tech Stack

- **Frontend & Admin**: React 19, Vite, Axios, React Router, React Toastify.
- **Backend**: Node.js, Express, Mongoose (MongoDB), Stripe (Payments), Cloudinary (Image Storage).
- **Security**: JWT Authentication, Bcrypt password hashing, Secure Stripe verification.
- **DevOps**: Docker, Docker Compose.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Stripe Account (for API keys)
- Cloudinary Account (for image uploads)

### 1. Clone the repository
```bash
git clone <repository-url>
cd FoodDelivery
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### 3. Install Dependencies
Run the following in each directory:
```bash
# For Backend
cd backend && npm install

# For Frontend
cd ../frontend && npm install

# For Admin
cd ../admin && npm install
```

### 4. Running the Application

#### Option A: Running with Docker (Recommended)
Make sure you have Docker and Docker Compose installed:
```bash
docker-compose up --build
```

#### Option B: Manual Start
```bash
# Start Backend
cd backend && npm run dev

# Start Frontend
cd frontend && npm run dev

# Start Admin
cd admin && npm run dev
```

## 🔒 Security Features Implemented
- **Server-side Price Verification**: All order totals are calculated on the server using database prices to prevent client-side tampering.
- **Stripe Session Validation**: Payment verification uses the Stripe API to confirm session status, preventing unauthorized bypasses.
- **Password Hashing**: Secure storage of user credentials using Bcrypt.

## 📝 Features
- **User App**: Auth (Login/Register), Menu Filter, Cart System, Stripe Integration, Order History.
- **Admin Panel**: Add/Remove Food Items, Real-time Order Status Updates, Order List View.
- **Backend**: Image upload to Cloudinary, JWT Token management, CORS Whitelisting.

---
*Created as part of the DACN Graduation Project.*
