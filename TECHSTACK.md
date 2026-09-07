# Technology Stack

## Mobile Client (Reference)
- **Framework**: React Native
- **Language**: TypeScript

## Backend Microservices
- **Runtime**: Node.js (v20+)
- **Language**: JavaScript (ES Modules / CommonJS Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT, Google OAuth, Apple OAuth
- **Realtime Sync / WebRTC Signaling**: Firebase Firestore SDK
- **Push Notifications**: Firebase Cloud Messaging (FCM / Firebase Admin SDK)
- **Media Communication**: WebRTC (P2P), STUN (Google STUN / custom), TURN (coturn)
- **Logging & Utilities**: Winston / Morgan, Custom Error Handling, Express Validator / Zod (or custom JS validation)

## Infrastructure & DevOps
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy / Gateway**: Nginx / Node-http-proxy API Gateway
- **Target Cloud Environment**: AWS (ECS / EC2 / EKS ready)
