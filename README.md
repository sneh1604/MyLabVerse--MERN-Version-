# MyLabVerse - Laboratory Management System

## Project Overview

MyLabVerse is a comprehensive laboratory management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a robust platform for managing laboratory operations, test reports, appointments, and staff activities with secure authentication and role-based access control.

## Core Features

### 1. Authentication & Authorization
- Secure user registration and login
- Role-based access control (Administrator, Staff, Patients)
- JWT-based authentication with cookie management
- Firebase authentication integration

### 2. Report Management
- Hemogram Reports
- Lipid Reports
- Blood Sugar Reports
- Detailed test listings and results

### 3. Administrative Features
- Staff activity monitoring
- Performance metrics tracking
- Administrator dashboard
- User management

### 4. Appointment System
- Patient appointment scheduling
- Appointment tracking
- Status management

## Technical Architecture

### Backend Components
- **Server**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Firebase Auth
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

### Models Structure
- User Model
- TestList Model
- Report Models:
  - Hemogram Report
  - Lipid Report
  - Blood Sugar Report
- Administrator Model
- StaffActivity Model
- PerformanceMetrics Model
- Appointment Model

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /dashboard` - Protected admin dashboard access

### Reports
- Endpoints for managing different types of reports
- CRUD operations for test results
- Report generation and retrieval

### Administrative
- Staff activity tracking
- Performance monitoring
- User management operations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Firebase project credentials

### Installation

1. **Clone the Repository**
```sh
git clone <repository-url>
cd MyLabVerse
```

2. **Environment Setup**
```sh
# Create .env file in server directory
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_CONFIG=your_firebase_config
```

3. **Install Dependencies**
```sh
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### Running the Application

1. **Start Backend Server**
```sh
cd server
npm run dev
# Server runs on http://localhost:4000
```

2. **Start Frontend Application**
```sh
cd client
npm run dev
# Client runs on http://localhost:5173
```

## Security Features

- Password encryption using bcryptjs
- JWT token-based authentication
- HTTP-only cookies
- Firebase authentication integration
- Role-based access control
- Request validation middleware
  
[MyLabVerse API Endpoints Documentation.docx](https://github.com/user-attachments/files/20238542/MyLabVerse.API.Endpoints.Documentation.docx)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For more information or support, please open an issue in the repository.
