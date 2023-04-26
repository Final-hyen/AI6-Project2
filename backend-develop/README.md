# Osondoson Backend

> **우리...같이 운동하실래요?**

Osondoson 서비스의 Backend 레포지토리 입니다.

## Project Setting (local)

**해당 프로젝트를 이용하기 전에 eslint, prettier 플러그인을 설치하셔야합니다**

~~~bash
# TypeScript 설치
npm i -g typescript 
# node_modules 의존성 설치
npm i
# PM2 설치
npm i -g pm2
~~~

## How to run this on server?

1. **local에서 docker를 이용해서 배포하는 방법**

~~~bash
# Docker로 배포하기 전에 .env 파일을 넣어주셔야합니다

# Docker build
docker build -t osondoson:latest .

# Docker run
docker run -d -p 3500:3500 osondoson
~~~

2. **자동 배포 방법 (with Jenkins)**

- [Jenkins](http://3.35.19.238:8080) 에서 backend 파이프라인을 직접 실행하는 방법
- Develop 브랜치에 머지가 일어나면 Webhook을 통해서 Jenkins에서 CI/CD가 발생합니다

## 기술 스택

### Language

<img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=black">

### Framework
<img src="https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=Node.js&logoColor=black"> <img src="https://img.shields.io/badge/Express-FFB71B?style=for-the-badge&logo=Express&logoColor=black">

### Databases
<img src="https://img.shields.io/badge/MongoDB-6DB33F?style=for-the-badge&logo=mongodb&logoColor=black"> <img src="https://img.shields.io/badge/PostgreSQL-4479A1?style=for-the-badge&logo=PostgreSQL&logoColor=white"> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">

### ORM
<img src="https://img.shields.io/badge/TypeORM-4479A1?style=for-the-badge&logo=PostgreSQL&logoColor=white">

### Deployment
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"> <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=black"> <img src="https://img.shields.io/badge/AWS ECR-FFB71B?style=for-the-badge&logo=Amazon AWS&logoColor=black">

### 기타
**Inversify**