FROM node:20-alpine
WORKDIR /app
COPY shared ./shared
COPY services/video-call-service ./services/video-call-service
WORKDIR /app/shared
RUN npm install
WORKDIR /app/services/video-call-service
RUN npm install
EXPOSE 8004
CMD ["npm", "start"]
