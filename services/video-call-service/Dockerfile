FROM node:20-alpine
WORKDIR /app
COPY shared ./shared
COPY services/video-call-service ./services/video-call-service
COPY alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.json ./alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.json
WORKDIR /app/shared
RUN npm install
WORKDIR /app/services/video-call-service
RUN npm install
EXPOSE 8004
CMD ["npm", "start"]
