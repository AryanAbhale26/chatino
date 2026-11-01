# 💬 Chattingo — Modern Real-Time Chat & DevOps Platform

A full-stack, enterprise-grade real-time messaging application and automated DevOps deployment system inspired by WhatsApp Web. Built with modern web standards, featuring instant bi-directional WebSocket messaging, group conversations, status stories, multi-stage Docker containerization, and automated Jenkins CI/CD pipelines.

Developed by **[Aryan Abhale](https://github.com/AryanAbhale26)**.

---

## 📋 Table of Contents
- [Architecture Overview](#️-architecture-overview)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [Docker Multi-Stage Containerization](#-docker-multi-stage-containerization)
- [Jenkins CI/CD Pipeline](#-jenkins-cicd-pipeline)
- [Nginx & Production VPS Deployment](#-nginx--production-vps-deployment)
- [Local Development Setup](#-local-development-setup)
- [API Overview](#-api-overview)
- [Author & License](#-author--license)

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────┐
│             Nginx Reverse Proxy          │
│            Port: 80 / 443 (SSL)          │
└─────────────────────┬────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
┌────────▼────────┐       ┌────────▼────────┐
│  React Frontend │       │   Spring Boot   │
│  Container (80) │       │ Container(8080) │
└─────────────────┘       └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │  MySQL Database │
                          │ Container(3306) │
                          └─────────────────┘
```

---

## ✨ Key Features

### ⚡ Real-Time Messaging & WebSockets
- **Bi-directional Communication**: Spring WebSocket message broker with STOMP sub-protocol and SockJS fallback.
- **Instant Delivery**: Real-time message status indicators with delivery checkmarks.
- **Active Chat Indicators**: Live online status and active participant counts.

### 👥 Chats & Group Conversations
- **1-on-1 Direct Messaging**: Private conversations with user avatars, status details, and instant chat history.
- **Group Creation**: Create multi-user group conversations with custom group subject titles and group icons.
- **Participant Management**: Search contacts, add members with interactive chip selection, and customize group properties.

### ⭕ Database-Backed Status Stories
- **Cross-User Synchronization**: Status updates persist directly in MySQL and are accessible across all active users and browser sessions.
- **Client-Side Image Optimization**: High-resolution camera photos are automatically scaled and compressed via HTML5 Canvas before uploading to ensure fast delivery.
- **Story Viewer Carousel**: Automated story progression with animated duration bars and interactive pause-on-press/hold.
- **Navigation Controls**:
  - Prominent, floating circular **Forward** and **Backward** navigation buttons.
  - WhatsApp-style tap/click zones (tap right to advance, tap left to go back).
  - Full keyboard accessibility (<kbd>→</kbd> Next, <kbd>←</kbd> Previous, <kbd>Esc</kbd> Exit).
- **Status Replies**: Send direct text replies to contacts immediately from within their story view.
- **Smart Timestamps**: Human-readable relative status times (e.g., *"Today, 9:07 PM"*, *"Yesterday, 3:15 PM"*).

### 🔍 Interactive Profile Lightbox (Image Zoom)
- **High-Definition Inspection**: Click any active chat avatar or header title to open a full-screen, high-resolution image zoom modal.
- **Zoom Controls**: Smooth zoom in (+), zoom out (-), and reset controls with backdrop blur and ESC-key dismissal.

### 😊 WhatsApp-Style Categorized Emoji Picker
- **Rich Emoji Library**: Comprehensive emoji categories (Smileys, People, Nature, Food, Travel, Activities, Objects, Symbols).
- **Instant Search**: Real-time emoji search by keyword and name with direct insertion into the message input field.

### 🎨 Sleek Modern UI & Design System
- **Dark Mode Aesthetic**: Custom curated color palette inspired by modern WhatsApp Web (`#111b21`, `#202c33`, and vibrant emerald accents `#00a884`).
- **Responsive Layout**: Designed for seamless usability across widescreen monitors, laptops, and tablets.
- **Interactive Feedback**: Smooth transitions, hover micro-interactions, and message bubble animations.

### 🔒 Security, Authentication & Account Validation
- **JWT (JSON Web Tokens)**: Stateless authentication with secure authorization headers on REST and WebSocket channels.
- **Duplicate Account Handling**: Intelligent sign-up validation that detects existing accounts and renders a direct *"Sign In with [email]"* prompt.
- **Spring Security**: Password encryption via BCrypt and endpoint protection.
- **Relational Persistence**: MySQL schema managed by Spring Data JPA and Hibernate.

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 18, Redux Toolkit, Tailwind CSS, Material-UI, React Icons, SockJS, StompJS, React Router |
| **Backend** | Spring Boot 3.3.1, Java 17+, Spring Security 6, Spring Data JPA, Spring WebSocket, JJWT |
| **Database** | MySQL 8.0 |
| **Containerization** | Docker, Docker Compose (Multi-stage builds) |
| **CI/CD & DevOps** | Jenkins Declarative Pipeline, Trivy Security Scanner, Docker Hub |
| **Web Server** | Nginx (Reverse proxy, WebSocket upgrade, SSL termination) |

---

## 🐳 Docker Multi-Stage Containerization

Chattingo uses multi-stage Docker builds to produce ultra-lightweight, secure, and production-ready images.

### 1. Frontend Dockerfile (3-Stage Build)
- **Stage 1: Node.js Dependencies Environment**: Installs cached `node_modules` dependencies.
- **Stage 2: Production React Builder**: Compiles optimized, minified production bundle.
- **Stage 3: Nginx Runtime Server**: Serves static HTML/JS assets with custom Nginx routing and gzip compression.

```dockerfile
# Stage 1 & 2: Build Environment
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 3: Production Nginx Server
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Backend Dockerfile (3-Stage Build)
- **Stage 1: Maven Dependencies**: Resolves and caches Maven dependencies offline.
- **Stage 2: Application Packaging**: Packages Spring Boot application into executable JAR without running tests.
- **Stage 3: JRE Runtime**: Runs the application on a minimal, secure Eclipse Temurin JRE container.

```dockerfile
# Stage 1 & 2: Build Environment
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 3: Lightweight JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/chattingo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 3. Docker Compose Orchestration (`docker-compose.yml`)
Orchestrates the entire distributed application stack with health checks, network isolation, and environment variables.

```yaml
version: '3.8'

services:
  dbservice:
    image: mysql:8.0
    container_name: chattingo-mysql
    restart: always
    environment:
      MYSQL_DATABASE: chattingo_db
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpassword}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - chattingo-network

  appservice:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: chattingo-backend
    restart: always
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://dbservice:3306/chattingo_db?createDatabaseIfNotExist=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpassword}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS}
    ports:
      - "8080:8080"
    depends_on:
      - dbservice
    networks:
      - chattingo-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: chattingo-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - appservice
    networks:
      - chattingo-network

networks:
  chattingo-network:
    driver: bridge

volumes:
  mysql_data:
```

---

## 🔄 Jenkins CI/CD Pipeline

The automated Jenkins declarative pipeline executes 7 continuous integration and deployment stages on every git push:

```groovy
pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        VPS_SSH_KEY           = credentials('vps-ssh-key')
        IMAGE_TAG             = "${BUILD_NUMBER}"
        REGISTRY_USER         = 'aryandocker'
    }

    stages {
        stage('1. Git Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/AryanAbhale26/chattingo.git'
            }
        }

        stage('2. Image Build') {
            steps {
                sh '''
                    docker build -t ${REGISTRY_USER}/chattingo-backend:${IMAGE_TAG} ./backend
                    docker build -t ${REGISTRY_USER}/chattingo-frontend:${IMAGE_TAG} ./frontend
                '''
            }
        }

        stage('3. Filesystem Security Scan') {
            steps {
                sh 'trivy fs --severity HIGH,CRITICAL --exit-code 0 .'
            }
        }

        stage('4. Docker Image Scan') {
            steps {
                sh '''
                    trivy image --severity HIGH,CRITICAL --exit-code 0 ${REGISTRY_USER}/chattingo-backend:${IMAGE_TAG}
                    trivy image --severity HIGH,CRITICAL --exit-code 0 ${REGISTRY_USER}/chattingo-frontend:${IMAGE_TAG}
                '''
            }
        }

        stage('5. Push to Registry') {
            steps {
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                    docker push ${REGISTRY_USER}/chattingo-backend:${IMAGE_TAG}
                    docker push ${REGISTRY_USER}/chattingo-frontend:${IMAGE_TAG}
                '''
            }
        }

        stage('6. Update Compose') {
            steps {
                sh '''
                    sed -i "s|image: ${REGISTRY_USER}/chattingo-backend:.*|image: ${REGISTRY_USER}/chattingo-backend:${IMAGE_TAG}|g" docker-compose.prod.yml
                    sed -i "s|image: ${REGISTRY_USER}/chattingo-frontend:.*|image: ${REGISTRY_USER}/chattingo-frontend:${IMAGE_TAG}|g" docker-compose.prod.yml
                '''
            }
        }

        stage('7. Deploy to Production VPS') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no -i $VPS_SSH_KEY user@vps_ip \
                    "cd /opt/chattingo && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d --remove-orphans"
                '''
            }
        }
    }
}
```

---

## 🌐 Nginx & Production VPS Deployment

### Nginx Reverse Proxy with WebSocket Support
When deploying to production, Nginx proxies requests and upgrades HTTP requests to WebSocket connections seamlessly:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend Single Page Application
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend REST API Reverse Proxy
    location /api/ {
        proxy_pass http://appservice:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket Proxy for Real-Time Chat
    location /ws/ {
        proxy_pass http://appservice:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}
```

### SSL Setup (Let's Encrypt / Certbot)
```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🚀 Local Development Setup

### 1. Database Setup
Ensure MySQL is running locally:
```sql
CREATE DATABASE chattingo_db;
```

### 2. Backend Setup
```bash
cd backend
# Edit src/main/resources/application.properties if needed
.\mvnw.cmd spring-boot:run   # On Windows
./mvnw spring-boot:run       # On Linux/macOS
```
The backend starts at `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The application opens at `http://localhost:3000`.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user account |
| `POST` | `/auth/signin` | Authenticate user & obtain JWT |
| `GET` | `/api/users/profile` | Retrieve authenticated user profile |
| `GET` | `/api/users/search?name={query}` | Search users by name or email |
| `PUT` | `/api/users/update` | Update user name and profile picture |
| `POST` | `/api/chats/single` | Create or fetch a 1-on-1 conversation |
| `POST` | `/api/chats/group` | Create a new group chat |
| `GET` | `/api/chats/user` | Fetch all chats for the logged-in user |
| `POST` | `/api/messages/create` | Send a new message |
| `GET` | `/api/messages/chat/{chatId}` | Retrieve message history for a chat |
| `POST` | `/api/status/create` | Publish a new photo status update with caption |
| `GET` | `/api/status/my` | Fetch current user's published active statuses |
| `GET` | `/api/status/recent` | Fetch recent contacts' statuses grouped by user |
| `GET` | `/api/status/user/{userId}` | Fetch a specific user's status updates |
| `WS` | `/ws` | WebSocket handshake & STOMP topic subscriptions |

---

## 👤 Author

**Aryan Abhale**
- GitHub: [@AryanAbhale26](https://github.com/AryanAbhale26)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
