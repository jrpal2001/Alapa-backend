# Alapa Backend Microservices Deployment Guide

This guide details local environment setup, Docker Compose orchestrations, Firebase credentials configuration, Coturn WebRTC relay setup, and Render.com cloud deployment.

---

## 1. Local Architecture Overview

```
                      ┌──────────────────────────┐
                      │   API Gateway (8000)     │
                      └─────────────┬────────────┘
                                    │
      ┌─────────────────┬───────────┼───────────────┬────────────────┐
      ▼                 ▼           ▼               ▼                ▼
Auth Service      Chat Service  Video Service  Notification    Coturn TURN
   (8001)            (8003)        (8004)          (8005)          (3478)
 alapa_auth       alapa_chat    alapa_video         FCM          STUN/TURN
```

---

## 2. Environment Setup

### Environment Variables Matrix

Copy `.env.example` or populate root/service `.env` files:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Service listening port | `8000` |
| `NODE_ENV` | Execution environment | `development` / `production` |
| `MONGO_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT token signing | `7vK9mQ2xL8pR4sT6...` |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Inline JSON string or path to Firebase admin key | `./alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.json` |
| `STUN_SERVER` | WebRTC STUN server URL | `stun:stun.l.google.com:19302` |
| `TURN_SERVER` | WebRTC TURN server URL | `turn:alapa.app:3478` |

---

## 3. Running Locally

### Option A: Direct Node Execution (Development)

Start all services in separate terminals:

```bash
# Terminal 1: Shared Library Build / Watch
cd shared && npm install

# Terminal 2: API Gateway (Port 8000)
cd services/api-gateway && npm run dev

# Terminal 3: Auth & User Service (Port 8001)
cd services/auth-service && npm run dev

# Terminal 4: Chat Service (Port 8003)
cd services/chat-service && npm run dev

# Terminal 5: Video Call Service (Port 8004)
cd services/video-call-service && npm run dev

# Terminal 6: Notification Service (Port 8005)
cd services/notification-service && npm run dev
```

### Option B: Docker Compose (All Services + Mongo + Coturn)

```bash
docker-compose up --build -d
```

Check status:
```bash
docker-compose ps
```

---

## 4. Firebase Setup (Firestore & Push Notifications)

1. Go to **Firebase Console** -> Project Settings -> Service Accounts.
2. Download your private key JSON file (e.g. `alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.json`).
3. Save it to the root of the backend folder or set `FIREBASE_SERVICE_ACCOUNT_KEY` in environment variables.

---

## 5. Render.com Deployment (Infrastructure as Code)

1. Push code repository to GitHub/GitLab.
2. Log into [Render.com](https://render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your `Alapa/backend` repository. Render automatically reads `render.yaml`.
5. Enter your MongoDB Atlas connection strings for `MONGO_URI`.
6. Click **Apply**. All 5 Web Services will build and deploy automatically!

---

## 6. End-to-End Verification

Run the automated integration test suite:

```bash
node scratch/test-final.js
```
