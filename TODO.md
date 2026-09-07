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

## Phase 2: API Gateway (NEXT UP)
- [ ] Implement proxy routing to microservices (`/api/auth/*` & `/api/users/*` → Port 8001, `/api/chat/*` → Port 8003, `/api/calls/*` → Port 8004)
- [ ] Add central request logging and CORS handling

## Phase 3: Auth & User Service
- [ ] User Model schema
- [ ] Register & Login endpoints
- [ ] JWT tokens & OAuth handlers
- [ ] Profile CRUD & FCM token handling
- [ ] User block/unblock feature

## Phase 4: Chat Service
- [ ] Conversation & Message schemas
- [ ] MongoDB storage & Firestore projection sync

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

## Phase 12: Docker & AWS Deployment
- [ ] Deployment manifests
