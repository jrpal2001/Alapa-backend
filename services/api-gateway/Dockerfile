FROM node:20-alpine
WORKDIR /app
COPY shared ./shared
COPY services/api-gateway ./services/api-gateway
WORKDIR /app/shared
RUN npm install
WORKDIR /app/services/api-gateway
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
