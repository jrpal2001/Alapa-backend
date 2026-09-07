# Project Overview — Real-Time Communication Platform (Alapa Backend)

## Architecture Overview
The backend is structured as a decoupled microservices architecture operating in a monorepo structure. It provides services for real-time messaging, push notifications, authentication, user management, and WebRTC video/audio calls for a mobile application (React Native).

## Core Requirements
- **Microservices**: Independent Node.js microservices with data ownership. `auth-service` handles both authentication (`/api/auth/*`) and user profile management (`/api/users/*`) initially.
- **API Gateway**: Single entry point routing requests to microservices (`/api/auth`, `/api/users`, `/api/chat`, `/api/calls`).
- **Realtime Chat & Signaling**: Firebase Firestore acts as the realtime sync layer and WebRTC signaling channel.
- **Durable Storage**: MongoDB (with Mongoose) serves as the persistent database of record.
- **Media Streams**: WebRTC peer-to-peer audio/video calling. Node.js servers DO NOT handle media streams directly.
- **Push Notifications**: Firebase Cloud Messaging (FCM) triggered via dedicated Notification Service.

## Repository Structure
```
backend/
├── services/
│   ├── api-gateway/          (Port 8000)
│   ├── auth-service/         (Port 8001 - Auth & User Profiles)
│   ├── chat-service/         (Port 8003 - Realtime Messaging)
│   ├── video-call-service/   (Port 8004 - WebRTC Calls & Signaling)
│   └── notification-service/ (Port 8005 - FCM Push Notifications)
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── turn/
├── shared/
│   ├── constants/
│   ├── logger/
│   ├── middleware/
│   └── utils/
├── PROJECT.md
├── TECHSTACK.md
├── PLAN.md
├── TODO.md
├── docker-compose.yml
├── .env.example
└── package.json
```
