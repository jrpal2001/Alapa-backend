FROM node:20-alpine
WORKDIR /app
COPY shared ./shared
COPY services/notification-service ./services/notification-service
COPY alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.json ./alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.json
WORKDIR /app/shared
RUN npm install
WORKDIR /app/services/notification-service
RUN npm install
EXPOSE 8005
CMD ["npm", "start"]
