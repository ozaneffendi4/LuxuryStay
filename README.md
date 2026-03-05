📘 LuxuryStay – Hotel Management System
🏨 Project Overview

LuxuryStay is a full-stack Hotel Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

The system allows hotel administrators, managers, staff, and guests to manage hotel operations including room management, booking, reservation approval, payments, analytics, and system settings.

The application uses modern SaaS UI design, secure authentication, and role-based access control.

🚀 Technologies Used
Frontend

React.js (Vite)

Tailwind CSS

React Router

React Hook Form

Zod Validation

Framer Motion

Lucide Icons

Recharts

Backend

Node.js

Express.js

MongoDB

Mongoose

Security

JWT Authentication

bcrypt password hashing

Helmet security middleware

Rate limiting

Input validation

📂 Project Structure
LuxuryStay
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   ├── services
│   │   ├── context
│   │   ├── hooks
│   │   └── utils
│   │
│   ├── index.html
│   └── package.json
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
└── README.md
🔐 User Roles

The system supports four user roles.

Role	Permissions
Admin	Full system control
Manager	Manage bookings
Staff	Check-in & check-out guests
Guest/User	Book hotel rooms
👤 Admin Capabilities

Admin can:

Manage users

Manage rooms

Manage bookings

View analytics dashboard

Configure system settings

View logs

🧑‍💼 Manager Capabilities

Managers can:

View rooms

Approve reservations

Cancel bookings

Monitor occupancy statistics

🧑‍🔧 Staff Capabilities

Staff can:

Check-in guests

Check-out guests

View assigned bookings

Update room status

👨‍👩‍👧 Guest/User Capabilities

Guests can:

Register account

Login to system

View available rooms

Book rooms

View booking history

Simulate payment

📊 System Features
1️⃣ Authentication System

Features include:

User registration

Secure login

JWT authentication

Password hashing

Protected routes

Role-based access control

2️⃣ Admin Dashboard

The dashboard provides:

Total bookings

Total users

Total rooms

Revenue statistics

Occupancy statistics

Revenue charts

Charts are created using Recharts.

3️⃣ Room Management

Admin can:

Add new rooms

Edit room details

Delete rooms

Set room categories

Update room pricing

Manage room availability

Each room includes:

Title

Category

Price per night

Capacity

Description

Image URL

Status

4️⃣ Booking System

Guests can:

Select check-in and check-out dates

View available rooms

Choose a room

Create booking

Confirm booking

The system prevents double booking using date validation.

5️⃣ Reservation Management

Managers can:

Approve booking

Cancel reservation

Monitor booking status

Booking statuses:

pending
approved
cancelled
checked_in
checked_out
6️⃣ Payment Simulation

The system includes a simulated payment system.

Steps:

Booking created

Payment initiated

Payment confirmed

Booking processed

This module can be extended for real payment gateways.

7️⃣ System Settings

Admin can configure:

Tax percentage

Discount percentage

Hotel policies

Currency

These settings automatically affect booking calculations.

8️⃣ Logging System

The application logs important actions such as:

User registration

Login activity

Booking changes

Room updates

System errors

Logs include:

User

Action

Timestamp

Metadata

🗄 Database Design
User Schema
name
email
passwordHash
role
isActive
createdAt
updatedAt
Room Schema
title
category
description
pricePerNight
capacity
status
images
amenities
Booking Schema
guest
room
checkIn
checkOut
nights
totalAmount
status
approvedBy
cancelledBy
Payment Schema
booking
guest
amount
currency
provider
status
reference
Settings Schema
taxPercent
discountPercent
currency
hotelPolicies
Log Schema
actor
action
entityType
entityId
metadata
timestamp
🔒 Security Implementation

Security measures implemented:

JWT Authentication

bcrypt password hashing

Helmet HTTP headers

Express rate limiting

CORS protection

Zod validation

Protected API routes

🎨 UI / UX Design

The UI is inspired by modern SaaS dashboards such as:

Airbnb

Stripe

Notion

Features include:

Responsive layout

Animated transitions

Interactive dashboard cards

Clean typography

Mobile-friendly design

Fonts used:

Inter
Poppins
⚙️ Installation Guide
1️⃣ Clone Repository
git clone <repository-url>
cd LuxuryStay
2️⃣ Install Backend
cd server
npm install

Create .env file:

PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/luxurystay
JWT_SECRET=super_secret_key
CLIENT_URL=http://localhost:5173

Run server:

npm run dev
3️⃣ Install Frontend
cd client
npm install

Create .env

VITE_API_BASE_URL=http://localhost:5002/api

Run frontend:

npm run dev

Open browser:

http://localhost:5173
🔑 Seeded Accounts

After running the seed script:

npm run seed

You can login with:

Admin

admin@luxurystay.com
Password123

Manager

manager@luxurystay.com
Password123

Staff

staff@luxurystay.com
Password123
📈 Future Improvements

Possible enhancements:

Real payment gateway integration

Image upload with Cloudinary

Room availability calendar

Email notifications

PDF invoice generation

Multi-hotel support

🧠 Learning Outcomes

This project demonstrates:

Full-stack MERN development

REST API design

Secure authentication systems

Role-based access control

Database schema design

Frontend state management

Modern UI development

👨‍💻 Author

Developed as a MERN Stack Hotel Management System Project.

Project Name:

LuxuryStay Hotel Management System
