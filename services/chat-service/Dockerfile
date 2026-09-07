FROM node:20-alpine
WORKDIR /app
COPY shared ./shared
COPY services/chat-service ./services/chat-service
WORKDIR /app/shared
RUN npm install
WORKDIR /app/services/chat-service
RUN npm install
EXPOSE 8003
CMD ["npm", "start"]
