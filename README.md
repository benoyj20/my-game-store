# 🎮 Game Application System

A **full-stack web application** for managing a **digital game store**, featuring secure authentication, role-based access control, and real-time inventory management. The platform allows customers to browse games, place orders, and leave reviews while enabling employees and admins to manage inventory and system operations efficiently.

---

## 🚀 Live Demo

🔗 **Application:**  
https://my-game-store-1.onrender.com/registration

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Material UI (MUI)

### Backend
- Node.js
- Express.js

### Database
- MySQL (Hosted on Aiven Cloud)
- Stored Procedures for optimized queries

### Security
- Bcrypt password hashing
- Role-based authentication

### Deployment
- Render (Backend Web Service + Frontend Static Site)

---

## ✨ Key Features

### 🔐 Role-Based Access Control
- **Customers:** Browse games, manage wishlist, place orders, and submit reviews.
- **Employees:** Manage game inventory and update product information.
- **Admins:** Full system control including pricing, stock updates, and management.

### 🔑 Secure Authentication
- Passwords securely hashed using **Bcrypt**
- Login and registration powered by **MySQL stored procedures**

### 📦 Inventory Management
- Real-time updates to **game stock, price, and details**
- Accessible by admins and employees

### 🛒 Order & Review System
Customers can:
- Place orders
- Maintain wishlists
- Submit and view game reviews

### ⚡ Optimized Database Queries
- Extensive use of **MySQL Stored Procedures**
- Improves performance and ensures **data integrity**

---

## 🗂️ Project Structure

This project uses a **flat monorepo structure** for simplicity.

```
my-react-app/
│
├── public/              # Static assets
├── src/                 # React frontend components
│
├── server.js            # Node.js / Express backend API
├── backup.sql           # Database schema + stored procedures
│
├── package.json         # Project dependencies
├── vite.config.js       # Frontend build configuration
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Database Setup

1. Create a **MySQL instance on Aiven Cloud**.
2. Import the database schema using:

```sql
backup.sql
```

3. Ensure the following stored procedures are created:
- `get_user_password`
- `login_user`
- other procedures related to inventory and orders.

---

### 2️⃣ Backend Configuration

Create a `.env` file in the root directory:

```
DB_HOST=your-aiven-hostname
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_NAME=game_application
DB_PORT=28698
```

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Run the Backend

```bash
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

### 5️⃣ Run the Frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 📈 Future Improvements

- Payment gateway integration
- Game recommendation system using machine learning
- Advanced search and filtering
- Admin analytics dashboard

---

## 👤 Author

**Benoy Joseph**

- Computer Science Graduate
- Analytics Manager at HSBC
- Interested in **AI systems, data engineering, and full-stack development**

---

💡 *This project demonstrates full-stack development, secure authentication practices, database optimization using stored procedures, and cloud deployment.*
