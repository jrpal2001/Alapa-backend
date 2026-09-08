# Task Checklist (TODO)

## Phase 1: Project Structure & Infrastructure (COMPLETED)
- [x] Create core documentation files (`PROJECT.md`, `TECHSTACK.md`, `PLAN.md`, `TODO.md`)
- [x] Initialize monorepo root `package.json` (JavaScript ES modules)
- [x] Create `shared/` package (Winston logger, custom HTTP errors, standard API response helper, error handler middleware)
- [x] Create `services/api-gateway` boilerplate (JavaScript, Express, health endpoint, `.env.example`, `Dockerfile`)
- [x] Create `services/auth-service` boilerplate (JavaScript, Express handling Auth & User profiles, health endpoint, `.env.example`, `Dockerfile`)
- [x] Create `services/chat-service` boilerplate (JavaScript, Express, health endpoint, `.env.example`, `Dockerfile`)
- [x] Create `services/video-call-service` boilerplate (JavaScript, Express, health endpoint, `.env.example`, `Dockerfile`)
- [x] Create `services/notification-service` boilerplate (JavaScript, Express, health endpoint, `.env.example`, `Dockerfile`)
- [x] Create root `.env.example` and `.env` files
- [x] Create root `docker-compose.yml` and `README.md`

## Phase 2: API Gateway (COMPLETED)
- [x] Implement proxy routing to microservices (`/api/auth/*` & `/api/users/*` → Port 8001, `/api/chat/*` → Port 8003, `/api/calls/*` → Port 8004, `/api/notifications/*` → Port 8005)
- [x] Implement request rate limiting (`express-rate-limit`)
- [x] Implement downstream service liveness monitoring on `GET /health`
- [x] Verify proxy route forwarding to all downstream services

## Phase 3: Auth & User Service (COMPLETED)
- [x] Mongoose `User` Model schema (`name`, `email`, `passwordHash`, `authProvider`, `googleId`, `appleId`, `profileImage`, `fcmTokens`, `blockedUsers`, `isActive`, `refreshTokens` array)
- [x] Register (`POST /api/auth/register`) with bcrypt hashing
- [x] Login (`POST /api/auth/login`) returning Access & Refresh JWTs
- [x] Token Refresh (`POST /api/auth/refresh`) & Logout (`POST /api/auth/logout`) with token rotation & revocation
- [x] Google & Apple OAuth sign-in handlers
- [x] Profile Management (`GET /api/users/me`, `PATCH /api/users/me`, `GET /api/users/search`, `GET /api/users/:userId`)
- [x] FCM token management (`POST /api/users/fcm-token`, `DELETE /api/users/fcm-token`)
- [x] Block user handlers (`POST /api/users/:userId/block`, `DELETE /api/users/:userId/block`)
- [x] Verified all Auth & User endpoints via Gateway integration tests

## Phase 4: Chat Service (COMPLETED)
- [x] Conversation & Message Mongoose schemas (`alapa_chat` MongoDB database)
- [x] Firestore realtime projection sync layer (`services/chat-service/src/config/firebase.js`)
- [x] Create & lookup conversations (`POST /api/chat/conversations`, `GET /api/chat/conversations`)
- [x] Send text & media messages (`POST /api/chat/messages`)
- [x] Fetch message history with pagination (`GET /api/chat/conversations/:id/messages`)
- [x] Mark messages as read & reset unread counts (`POST /api/chat/conversations/:id/read`)
- [x] Delete conversation (`DELETE /api/chat/conversations/:id`)
- [x] Verified all Chat endpoints via Gateway integration tests

## Phase 5: Notification Service (COMPLETED)
- [x] FCM Multicast push notification dispatcher (`services/notification-service/src/config/fcm.js`)
- [x] Chat message push notification endpoint (`POST /api/notifications/send-chat`)
- [x] High-priority incoming call push notification endpoint (`POST /api/notifications/send-call`)
- [x] Verified Notification endpoints via Gateway integration tests

## Phase 6 & 7: Video Call Service & WebRTC Signaling (COMPLETED)
- [x] Call Mongoose Model schema (`alapa_video` MongoDB database)
- [x] Call creation & lifecycle state management (`ringing`, `accepted`, `rejected`, `missed`, `cancelled`, `ended`)
- [x] Firestore WebRTC signaling handler (SDP Offer, Answer, ICE Candidates)
- [x] Integrated call notification triggers
- [x] Verified Video Call & Signaling endpoints via Gateway integration tests

## Phase 8: STUN/TURN Infrastructure (COMPLETED)
- [x] Coturn server configuration setup (`infrastructure/turn/turnserver.conf`)
- [x] ICE servers configuration endpoint (`GET /api/calls/ice-servers`)

## Phase 9: Call History & Advanced Query (COMPLETED)
- [x] Paginated call logs with filtering by `type` and `status` (`GET /api/calls/history`)

## Phase 10: Security & Hardening (COMPLETED)
- [x] Auth endpoint rate limiting (`/api/auth/login`, `/api/auth/register`)
- [x] Helmet security headers & CORS policy
- [x] Input sanitization against MongoDB query injection

## Phase 11: Testing & Verification (COMPLETED)
- [x] End-to-End integration test suite (`scratch/test-final.js`) with 100% pass verification

## Phase 12: Docker & Render Deployment (COMPLETED)
- [x] Multi-service `docker-compose.yml` with Coturn & MongoDB
- [x] Dockerfiles for all 5 microservices
- [x] Render Infrastructure as Code manifest (`render.yaml`)
- [x] Comprehensive deployment documentation (`DEPLOYMENT.md`)
