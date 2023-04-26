# FROM node:18-alpine
# WORKDIR /opt/app
# COPY package*.json ./
# RUN npm i
# COPY . .
# EXPOSE 3000
# CMD ["npm", "run", "start"]

#STAGE1 BUILDER (프로덕션 환경에 필요한 소스만 남김)
FROM node:18-alpine as BUILDER 
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build 

#STAGE2 
FROM node:18-alpine
WORKDIR /app
COPY --from=BUILDER /app/build .
# /app/ => 이 경로에 build 폴더 내부에 있던 파일들이 위치
RUN npm install -g serve
CMD ["serve", "-s", "."]



