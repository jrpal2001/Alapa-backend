# Alapa Backend Microservices

Real-time communication backend built with Node.js, Express.js, MongoDB, Firestore, WebRTC, and Docker.

## Project Architecture

```
backend/
├── services/
│   ├── api-gateway/          (Port 8000)
│   ├── auth-service/         (Port 8001 - Auth & User Profiles)
│   ├── chat-service/         (Port 8003 - Realtime Chat)
│   ├── video-call-service/   (Port 8004 - WebRTC Video/Audio)
│   └── notification-service/ (Port 8005 - FCM Push Notifications)
├── shared/                   (@alapa/shared package: logger, errors, utils)
├── PROJECT.md
├── TECHSTACK.md
├── PLAN.md
├── TODO.md
└── docker-compose.yml
```

## Service Health Endpoints

- API Gateway: `GET http://localhost:8000/health`
- Auth & User Service: `GET http://localhost:8001/health`
- Chat Service: `GET http://localhost:8003/health`
- Video Call Service: `GET http://localhost:8004/health`
- Notification Service: `GET http://localhost:8005/health`

## How to Run

### Local Node.js Development
1. Start MongoDB locally on `mongodb://localhost:27017`
2. Run individual services:
```bash
# Start API Gateway
npm run start:gateway

# Start Auth & User Service
npm run start:auth

# Start Chat Service
npm run start:chat

# Start Video Service
npm run start:video

# Start Notification Service
npm run start:notification
```

### Docker Compose
```bash
docker-compose up --build -d
```
To check container status:
```bash
docker-compose ps
```
To view logs:
```bash
docker-compose logs -f
```
