**Full Stack role Assignment**

## To test the api end points you can use postman or jest

`npm test`

to start unit test of api endpoints

# Project Setup and Running Guide

This guide will walk you through the steps to set up and run the project on your local machine. The project is built using **React.js** for the frontend, **Tailwind CSS** for styling, and **Node.js** with **Express**, **MySQL**, and **Sequelize** for the backend. It also includes features like JWT authentication, rate limiting, password reset, and account verification.

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Node.js**
2. **npm** (Node Package Manager) or **yarn**
3. **MySQL** (installed and running)

---

## Step 1: Clone the Repository

If you haven't already, clone the project repository to your local machine:

```bash
git clone <repository-url>
cd <project-folder>
```

Reference for env is in .env.sample file

# Database Configuration

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name

# JWT Configuration

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Email Configuration (for password reset and account verification)

EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password (app password if using gmail)

# Rate Limiting

RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

`cd backend`
`npm install`
`npm start`

## Frontend Setup

`cd ../frontend`
`npm install`
`npm run dev`
