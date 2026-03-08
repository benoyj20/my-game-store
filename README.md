🎮 Game Application System
A full-stack web application designed to manage a digital game store with a robust relational database backend. This system allows for role-based access control, secure user authentication, and real-time inventory management.

🚀 Live Demo
https://my-game-store-1.onrender.com/registration

🛠️ Tech Stack
Frontend: React.js (Vite), Material UI (MUI).

Backend: Node.js, Express.js.

Database: MySQL hosted on Aiven Cloud.

Security: Password hashing using Bcrypt.

Deployment: Render (Web Service for Backend, Static Site for Frontend).

✨ Key Features
Role-Based Access: Distinct interfaces and permissions for Customers, Employees, and Admins.

Secure Authentication: User login and registration powered by Bcrypt hashing and stored procedures.

Inventory Management: Admins and Employees can update game stock, pricing, and details.

Order & Review System: Customers can place orders, manage wishlists, and submit game reviews.

Optimized Queries: Heavy use of MySQL Stored Procedures to ensure data integrity and performance.

📂 Project Structure
This project uses a flat monorepo structure for simplicity:

my-react-app/
├── public/              # Static assets (Vite)
├── src/                 # React frontend components
├── server.js            # Node.js/Express backend API
├── backup.sql           # Database schema & stored procedures
├── package.json         # Project dependencies
└── vite.config.js       # Frontend build configuration

⚙️ Setup & Installation
1. Database Setup
Create a MySQL instance on Aiven.

Import the provided backup.sql file into your database (e.g., game_application).

Ensure all Stored Procedures (like get_user_password and login_user) are created correctly.

2. Backend Configuration
Create a .env file in the root directory (or set these in Render):

DB_HOST=your-aiven-hostname
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_NAME=game_application
DB_PORT=28698

3. Installation
# Install dependencies
npm install

# Run the backend (default port 5000)
node server.js

# Run the frontend (Vite dev server)
npm run dev
