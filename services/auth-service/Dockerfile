FROM node:20-alpine
WORKDIR /app
COPY shared ./shared
COPY services/auth-service ./services/auth-service
WORKDIR /app/shared
RUN npm install
WORKDIR /app/services/auth-service
RUN npm install
EXPOSE 8001
CMD ["npm", "start"]
