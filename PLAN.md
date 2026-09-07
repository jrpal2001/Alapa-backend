# Implementation Plan & Roadmap

## Overview
This roadmap breaks down the development of the microservices backend into 13 discrete, sequential phases.

---

### Phase 1: Project Structure & Infrastructure Setup (CURRENT)
- Root monorepo initialization with JavaScript (`.js`)
- Shared module (`shared/`): logger, error handling middleware, common response formatters, constants
- Microservices folder template creation (`api-gateway`, `auth-service`, `user-service`, `chat-service`, `video-call-service`, `notification-service`)
- Environment configuration setup (`.env.example`)
- Docker & Docker Compose setup (`docker-compose.yml`, service `Dockerfile`s)
- Express server initialization with `/health` check routes for all services

### Phase 2: API Gateway
- Express-based API Gateway using `express-http-proxy` or `http-proxy-middleware`
- Gateway routing for `/api/auth/*`, `/api/users/*`, `/api/chat/*`, `/api/calls/*`
- Centralized rate limiting, request logging, and CORS handling

### Phase 3: Auth Service
- User registration (`POST /api/auth/register`) with bcrypt password hashing
- User login (`POST /api/auth/login`) with JWT token generation (access + refresh tokens)
- OAuth integrations (`POST /api/auth/google`, `POST /api/auth/apple`)
- Token refresh (`POST /api/auth/refresh`), Logout (`POST /api/auth/logout`), Profile check (`GET /api/auth/me`)

### Phase 4: User Service
- User profile management (`GET /api/users/me`, `PATCH /api/users/me`)
- User search (`GET /api/users/search`, `GET /api/users/:userId`)
- FCM token registration & deletion (`POST /api/users/fcm-token`, `DELETE /api/users/fcm-token`)
- User blocking (`POST /api/users/:userId/block`, `DELETE /api/users/:userId/block`)

### Phase 5: Chat Service
- Conversation creation & lookup (`POST /api/chat/conversations`, `GET /api/chat/conversations`)
- Message storage in MongoDB (`Message`, `Conversation` models)
- Realtime Firestore sync projection layer (MongoDB as single source of truth)
- Read status & unread counts (`POST /api/chat/conversations/:conversationId/read`)

### Phase 6: Notification Service
- Firebase Admin FCM integration
- Message notifications & call alert triggers
- Device token dispatching via microservice events/REST APIs

### Phase 7: Video Call Service
- Call creation and state lifecycle management (` ringing`, `accepted`, `rejected`, `missed`, `cancelled`, `ended`)
- MongoDB call history records
- Triggering incoming call push notifications via Notification Service

### Phase 8: WebRTC Signaling
- Firestore-based WebRTC SDP Offer / Answer exchange
- ICE candidate sync via Firestore realtime collections

### Phase 9: STUN / TURN Infrastructure
- STUN server configuration for public address discovery
- Coturn deployment configuration for TURN relay fallback

### Phase 10: Call History
- Call history query endpoints (`GET /api/calls/history`, `GET /api/calls/:callId`)
- Duration, participant stats, call filtering

### Phase 11: Security & Hardening
- JWT validation middleware across Gateway & services
- Firestore security rules for signaling & chat projections
- Request rate limiting, input validation, headers security (`helmet`)

### Phase 12: Testing
- Unit tests for services (Jest / Supertest)
- Microservices integration tests
- WebRTC signaling flow tests

### Phase 13: Deployment
- Containerization verification
- Production Docker compose / ECS manifests & AWS deployment scripts
