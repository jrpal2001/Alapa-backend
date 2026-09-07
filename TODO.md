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
- [x] Implement proxy routing to microservices (`/api/auth/*` & `/api/users/*` → Port 8001, `/api/chat/*` → Port 8003, `/api/calls/*` → Port 8004)
- [x] Implement request rate limiting (`express-rate-limit`)
- [x] Implement downstream service liveness monitoring on `GET /health`
- [x] Verify proxy route forwarding to all downstream services

## Phase 3: Auth & User Service (COMPLETED)
- [x] Mongoose `User` Model schema (`name`, `email`, `passwordHash`, `authProvider`, `googleId`, `appleId`, `profileImage`, `fcmTokens`, `blockedUsers`, `isActive`)
- [x] Register (`POST /api/auth/register`) with bcrypt hashing
- [x] Login (`POST /api/auth/login`) returning Access & Refresh JWTs
- [x] Token Refresh (`POST /api/auth/refresh`) & Logout (`POST /api/auth/logout`)
- [x] Google & Apple OAuth sign-in handlers
- [x] Profile Management (`GET /api/users/me`, `PATCH /api/users/me`, `GET /api/users/search`, `GET /api/users/:userId`)
- [x] FCM token management (`POST /api/users/fcm-token`, `DELETE /api/users/fcm-token`)
- [x] Block user handlers (`POST /api/users/:userId/block`, `DELETE /api/users/:userId/block`)
- [x] Verified all Auth & User endpoints via Gateway integration tests

## Phase 4: Chat Service (NEXT UP)
- [ ] Conversation & Message schemas
- [ ] MongoDB storage & Firestore projection sync
- [ ] Conversation & Message APIs

## Phase 5: Notification Service
- [ ] FCM push notification sender

## Phase 6: Video Call Service
- [ ] Call model & call creation logic

## Phase 7: WebRTC Signaling
- [ ] Firestore WebRTC signaling handler

## Phase 8: STUN/TURN
- [ ] Coturn configuration setup

## Phase 9: Call History
- [ ] Call history endpoints

## Phase 10: Security
- [ ] Security hardening & rate limiting

## Phase 11: Testing
- [ ] Test suite

## Phase 12: Docker & AWS/Render Deployment
- [ ] Deployment manifests
