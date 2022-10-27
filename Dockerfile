FROM node:alpine

WORKDIR /app

COPY build ./build
COPY express.js .

RUN npm install express

EXPOSE 8080

CMD [ "node", "express.js"]