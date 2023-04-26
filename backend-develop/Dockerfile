# FROM node:18-alpine

# WORKDIR /opt/app

# COPY package*.json ./

# RUN npm install -g pm2

# RUN npm i

# COPY . .

# EXPOSE 3500

# RUN npm run build

# CMD ["pm2-runtime", "dist/bin/index.js"]

# Stage 1
FROM node:18-alpine as BUILDER
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY .env Data ./
COPY --from=BUILDER /app/dist ./dist
RUN npm ci --omit=dev && npm install -g pm2
EXPOSE 3500
CMD ["pm2-runtime", "dist/bin/index.js"]