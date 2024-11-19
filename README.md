# cca_auth

🔐 A robust Clean Architecture Authentication module for Node.js applications, providing enterprise-grade authentication, user management, and role-based access control.

[![npm version](https://badge.fury.io/js/cca_auth.svg)](https://badge.fury.io/js/cca_auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Key Features

- 🏗️ **Clean Architecture Design**: Follows best practices for maintainable and scalable code
- 🔐 **JWT Authentication**: Secure token-based auth with access and refresh tokens
- 👥 **Role-Based Access Control**: Built-in roles (ADMIN, USER, GUEST)
- ✅ **Input Validation**: Robust request validation using Yup
- 🗑️ **Soft Delete**: Safe data handling with soft delete functionality
- 📝 **TypeScript Support**: Full TypeScript support with type definitions
- 🔄 **Error Handling**: Consistent and informative error responses
- 📦 **Redis Support**: Optional Redis integration for enhanced performance
- 🔒 **Security First**: Built-in security features including password hashing and JWT protection

## 📦 Installation

```bash
# Using npm
npm install cca_auth

# Using yarn
yarn add cca_auth
```

## 🚀 Quick Start

1. **Basic Setup**

```typescript
import { bootstrap, IServerConfig } from "cca_auth";

const config: IServerConfig = {
  port: 3000,
  apiPrefix: "/api/v1",
  databaseConfig: {
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "auth_db",
  },
};

bootstrap(config)
  .then(() => console.log("✅ Server started successfully"))
  .catch(console.error);
```

2. **Advanced Configuration**

```typescript
// Redis configuration (optional)
const redisConfig = {
  redisOn: true,
  url: "redis://localhost:6379",
};

// JWT configuration (optional)
const jwtConfig = {
  accessTokenSecret: "your-access-token-secret",
  refreshTokenSecret: "your-refresh-token-secret",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
};

bootstrap(config, redisConfig, jwtConfig);
```

## ⚙️ Configuration Guide

### Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=auth_db
DB_LOGGING=true

# Application Configuration
NODE_ENV=development
API_PREFIX=/api/v1
PORT=3000

# JWT Configuration
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true
```

### Configuration Interfaces

```typescript
interface IServerConfig {
  port?: number;
  apiPrefix?: string;
  databaseConfig?: DatabaseConfig;
}

interface DatabaseConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  logging?: boolean;
  synchronize?: boolean;
  entities?: string[];
  migrations?: string[];
}

interface IRedis {
  redisOn?: boolean;
  url?: string;
}

interface IJwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}
```

## 🔗 API Reference

### Authentication Endpoints

```typescript
/**
 * Register a new user
 * POST ${apiPrefix}/register
 */
{
    "email": "user@example.com",
    "name": "User Name",
    "password": "password123"
}

/**
 * Login
 * POST ${apiPrefix}/login
 */
{
    "email": "user@example.com",
    "password": "password123"
}

/**
 * Refresh Token
 * POST ${apiPrefix}/refresh
 */
{
    "refreshToken": "your-refresh-token"
}
```

### User Management Endpoints

All endpoints require JWT authentication via Bearer token in the Authorization header.

```typescript
// Get all users
GET ${apiPrefix}/users

// Get user by ID
GET ${apiPrefix}/users/:id

// Update user
PUT ${apiPrefix}/users/:id
{
    "name": "Updated Name",
    "email": "updated@example.com"
}

// Delete user (soft delete)
DELETE ${apiPrefix}/users/:id
```

## 🔒 Security Features

- **Password Security**: Automatic password hashing using bcrypt
- **JWT Protection**: Secure token-based authentication
- **Role-Based Security**: Fine-grained access control
- **Data Protection**: Soft delete functionality for safe data handling
- **Input Validation**: Request validation using Yup
- **Database Security**: Secure TypeORM operations

## 🛠️ Error Handling

The module provides consistent error responses across all endpoints:

```typescript
{
    "status": "error",
    "message": "Detailed error message",
    "statusCode": 404  // HTTP status code
    "error": {         // Optional detailed error information
        "field": "email",
        "type": "validation"
    }
}
```

## 📚 Dependencies

- **Core**: Express.js, TypeScript
- **Database**: TypeORM, PostgreSQL
- **Caching**: Redis (optional)
- **Security**: jsonwebtoken, bcrypt
- **Validation**: Yup
- **Types**: @types/node, @types/express

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: mindaugaskul@gmail.com
