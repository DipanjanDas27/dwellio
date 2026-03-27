FROM node:24.0.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8000

CMD ["npm", "start"]