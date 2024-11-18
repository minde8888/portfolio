# cca_auth

A Clean Architecture Authentication module for Node.js applications, providing robust authentication, user management, and role-based access control built on Express.js.

[![npm version](https://badge.fury.io/js/cca_auth.svg)](https://badge.fury.io/js/cca_auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install cca_auth
# or
yarn add cca_auth
```

## Quick Start

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

// Optional Redis configuration
const redisConfig = {
  redisOn: true,
  url: "redis://localhost:6379",
};

// Optional JWT configuration
const jwtConfig = {
  accessTokenSecret: "your-access-token-secret",
  refreshTokenSecret: "your-refresh-token-secret",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
};

bootstrap(config, redisConfig, jwtConfig)
  .then(() => console.log("Server started successfully"))
  .catch(console.error);
```

## Database Configuration Guide

### Basic Setup

1. Create a `.env` file in your project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=auth_db
DB_LOGGING=true
NODE_ENV=development
```

2. Configure TypeORM entities and migrations:

```typescript
const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.DB_LOGGING === "true",
  synchronize: process.env.NODE_ENV !== "production"
};
```

## Features

- 🏗️ Clean Architecture design pattern
- 🔐 JWT Authentication with access and refresh tokens
- 👥 Role-based access control (ADMIN, USER, GUEST)
- ✅ Input validation using Yup
- 🗑️ Soft delete functionality
- 📝 TypeScript support
- 🔄 Consistent error handling

## Configuration

### Server Configuration (IServerConfig)

```typescript
interface IServerConfig {
  port?: number;
  apiPrefix?: string;
  databaseConfig?: DatabaseConfig;
}
```

### Database Configuration

```typescript
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
```

### Redis Configuration

```typescript
interface IRedis {
  redisOn?: boolean;
  url?: string;
}
```

### JWT Configuration

```typescript
interface IJwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}
```

## API Endpoints

### Authentication

```typescript
// Register a new user
POST ${apiPrefix}/register
Content-Type: application/json

{
    "email": "user@example.com",
    "name": "User Name",
    "password": "password123"
}

// Login
POST ${apiPrefix}/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### User Management

All endpoints require JWT authentication via Bearer token:

```typescript
// Get all users
GET ${apiPrefix}/users

// Get user by ID
GET ${apiPrefix}/users/:id

// Update user
PUT ${apiPrefix}/users/:id

// Delete user
DELETE ${apiPrefix}/users/:id
```

## Error Handling

The module provides consistent error responses:

```typescript
{
    "status": "error",
    "message": "Error message here",
    "statusCode": 404 // HTTP status code
}
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Soft delete functionality
- Request validation
- TypeORM for database operations

## Dependencies

- Express.js
- TypeORM
- PostgreSQL
- Redis (optional)
- jsonwebtoken
- Yup
- TypeScript
- bcrypt

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 

## License

This project is licensed under the MIT License - see the LICENSE file for details.
