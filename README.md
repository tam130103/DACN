# 🍔 Food Delivery Website (DACN Project)

A full-stack **Food Delivery Web Application** built with **React.js**, **Node.js**, **Express**, and **MongoDB**.  
This project allows users to browse food, add to cart, place orders, and make payments using **Stripe integration**.  
It also includes an **Admin Dashboard** for managing products, orders, and users.

---

## 🚀 Features

### 👨‍💻 User Side
- ✅ Browse food categories and products  
- 🛒 Add to cart, update quantity, and remove items  
- 💳 Stripe payment integration for online checkout  
- 🔐 Authentication (Login/Register with JWT)  
- 🧾 Order tracking and order history  
- 📱 Responsive UI (works on mobile and desktop)

### 🧑‍💼 Admin Side
- 📦 Manage food items (add / edit / delete)  
- 📊 View and manage orders from customers  
- 👥 Manage user accounts  
- 📈 Dashboard analytics and order statistics  

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React.js, React Router, Axios, Context API, CSS Modules |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Payment** | Stripe API |
| **Hosting** | Render / Vercel |
| **Version Control** | Git, GitHub |

---

## 📂 Project Structure

```
FoodDelivery/
├── backend/                # Node.js + Express API
│   ├── server.js           # Main server file
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   └── config/             # Database & environment setup
│
├── frontend/               # React.js client app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main pages (Home, Cart, etc.)
│   │   ├── context/        # State management
│   │   ├── App.js
│   │   └── index.js
│   └── public/
│
└── README.md
```

---

## ⚙️ Installation Guide

### 1️⃣ Clone the repository
```bash
git clone https://github.com/tam130103/DACN.git
cd DACN/FoodDelivery
```

### 2️⃣ Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
```
Then start the server:
```bash
npm start
```

### 3️⃣ Frontend setup
```bash
cd ../frontend
npm install
npm start
```

---

## 🌐 Live Demo

🔗 **Demo Website:** (Add your Render/Vercel link here)  
🔗 **GitHub Repo:** [https://github.com/tam130103/DACN](https://github.com/tam130103/DACN)

---

## 🧠 Screenshots

| Home Page | Cart Page | Admin Dashboard |
|------------|------------|----------------|
| ![Home](https://raw.githubusercontent.com/tam130103/DACN/main/FoodDelivery/images/image-1.png) | ![Cart](https://raw.githubusercontent.com/tam130103/DACN/main/FoodDelivery/images/image-2.png) | ![Dashboard](https://raw.githubusercontent.com/tam130103/DACN/main/FoodDelivery/images/image-3.png) |

---

## 📘 API Overview (Backend)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/foods` | Get all food items |
| `POST` | `/api/orders` | Create new order |
| `GET` | `/api/orders/:userId` | Get user's order history |
| `POST` | `/api/payment` | Process payment via Stripe |

---

## 💡 Future Improvements
- Add delivery tracking system  
- Integrate multiple payment gateways  
- Add reviews and ratings for food  
- Implement push notifications for order status  

---

## 👨‍💻 Author

**Nguyễn Tâm**  
📍 Hanoi, Vietnam  
💼 [GitHub](https://github.com/tam130103) | [Email](mailto:thetam2103@gmail.com)

---

## 📝 License
This project is licensed under the **MIT License** — feel free to use and modify for your own learning or projects.

---

⭐ *If you like this project, don’t forget to give it a star on GitHub!* ⭐
