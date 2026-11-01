# 🤝 Contributing to Chattingo

Thank you for your interest in contributing to **Chattingo**! We welcome contributions to make this real-time communication platform even better.

---

## 📋 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Setup](#-development-setup)
- [Coding Standards & Guidelines](#-coding-standards--guidelines)
- [Submitting a Pull Request](#-submitting-a-pull-request)

---

## 📜 Code of Conduct
Please ensure all interactions in issues, pull requests, and discussions remain respectful, constructive, and welcoming.

---

## 💡 How Can I Contribute?
- **Reporting Bugs**: Check the issues tab before opening a new issue with reproduction steps.
- **Suggesting Enhancements**: Propose new features or UX improvements.
- **Pull Requests**: Fix open issues or implement features.

---

## 🚀 Development Setup

### Prerequisites
- **Node.js** 18+ and `npm`
- **JDK 17+** (Eclipse Temurin or OpenJDK recommended)
- **MySQL 8.0+**
- **Docker & Docker Compose** (Optional, for containerized local runs)

### 1. Fork & Clone
```bash
git clone https://github.com/AryanAbhale26/chattingo.git
cd chattingo
```

### 2. Configure Local Database
```sql
CREATE DATABASE chattingo_db;
```

### 3. Launch Backend
```bash
cd backend
# Edit src/main/resources/application.properties for your MySQL credentials
./mvnw spring-boot:run
```

### 4. Launch Frontend
```bash
cd frontend
npm install
npm start
```

---

## 📐 Coding Standards & Guidelines

### Frontend (React & Tailwind CSS)
- Maintain modular component structure under `src/Components/`.
- Use Tailwind CSS utility classes and adhere to the dark mode color system (`#111b21`, `#202c33`, `#00a884`).
- Ensure state updates flow through Redux where global sync is required.

### Backend (Spring Boot & Java)
- Follow standard Spring Boot layering: `Controller` -> `Service` -> `Repository` -> `Model`.
- Keep REST endpoints idempotent and restful.
- Ensure WebSocket handlers are authenticated and secured via JWT.

---

## 📤 Submitting a Pull Request
1. Create a feature branch: `git checkout -b feature/your-feature-name`.
2. Commit your changes with clear, descriptive commit messages.
3. Test locally to ensure both backend and frontend build with zero errors.
4. Push to your branch and open a Pull Request against `main`.

Thank you for helping make Chattingo better!
