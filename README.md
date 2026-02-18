# Micro Marketplace Backend

Node.js + Express backend for the Micro Marketplace application.
Provides authentication, product management, favorites, search, pagination, and image upload support (Cloudinary + URL).

---

# Live API (Render)

Base URL:

```
https://microbackend.onrender.com

```

Example:

```
https://microbackend.onrender.com/products
```

---

# Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Cloudinary (image upload)
* Multer (file handling)
* Render (deployment)
* dotenv

---

# Features

Authentication

* Register user
* Login user
* JWT token authentication

Products

* Create product (file upload or image URL)
* Update product
* Delete product
* Get all products
* Get single product

Search & Pagination

* Search by title
* Search by price
* Pagination support

Favorites

* Add to favorites
* Remove from favorites
* Get favorite products

Image Upload

* Upload image file (Cloudinary)
* OR provide image URL

Secure

* Password hashing (bcrypt)
* JWT protected routes

---

# Folder Structure

```
backend/
│
├── config/
│   ├── db.js
│   └── cloudinary.js
│
├── controllers/
│   ├── authController.js
│   └── productController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
├── models/
│   ├── User.js
│   └── Product.js
│
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
│
├── .env
├── server.js
└── package.json
```

---

# Installation (Local Setup)

Clone repo

```
git clone https://github.com/your-username/micro-marketplace.git
```

Go to backend folder

```
cd backend
```

Install dependencies

```
npm install
```

Create .env file

```
PORT=5001
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Run server

```
npm run dev
```

Server runs at:

```
http://localhost:5001
```

---

# API Endpoints

Auth

Register

```
POST /auth/register
```

Login

```
POST /auth/login
```

Products

Get all products

```
GET /products
```

Get single product

```
GET /products/:id
```

Create product

```
POST /products
```

Update product

```
PUT /products/:id
```

Delete product

```
DELETE /products/:id
```

Favorites

Toggle favorite

```
POST /products/:id/favorite
```

Get favorites

```
GET /products/favorites
```

---

# Authentication

Send token in header:

```
Authorization: Bearer YOUR_TOKEN
```

---

# Deployment

Backend deployed on Render

Steps used:

* Push code to GitHub
* Connect repo to Render
* Set environment variables
* Deploy

---

# Environment Variables (Render)

Set these in Render dashboard:

```
MONGODB_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

# Test Credentials

Example:

```
Email: test@test.com
Password: 123456
```

---

# Author

Prince Raj
Backend Developer
