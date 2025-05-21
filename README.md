# 🛡️ Fraud Detection System for Online Payments

This is a microservice-based fraud detection backend built with Node.js, Express, MongoDB, and Redis. It analyzes user transaction patterns to detect and block fraudulent behavior in real time.

## 📦 Features

- User behavior tracking
- Transaction validation
- Real-time fraud detection logic
- Redis cache for fast lookups
- Modular architecture (easily extendable with ML)
- Built-in REST API for transactions

## 🚀 Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Redis (`ioredis`)
- Jest + Supertest (tests)
- Nodemailer
- Stripe / M-Pesa / Payment APIs

## 🧠 ML Ready

The system is structured to support a future ML plugin (e.g., TensorFlow.js / Python microservice) that will evaluate high-risk transactions using trained models.

## 🔧 Setup

```bash
# Clone repo
git clone https://github.com/yourusername/fraud-detector.git

# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Start MongoDB and Redis, then:
npm run dev
