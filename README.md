# Express.js Clean Architecture API

A RESTful API built with Express.js following Clean Architecture principles, featuring authentication, user management, and role-based access control.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Error Handling](#error-handling)
- [Security](#security)
- [License](#license)

## Features
- Clean Architecture design pattern for separation of concerns
- JWT Authentication with access and refresh tokens
- Role-based access control for ADMIN, USER, and GUEST
- Input validation using Yup
- Soft delete functionality to retain deleted data for audit purposes
- TypeScript support for type safety and better development experience
- Consistent error handling with async/await

## Installation

Clone the repository
```bash
git clone https://github.com/minde8888/protfolio
```

Install dependencies
```bash
npm install
# Or using Yarn:
yarn
```

Start the server
```bash
npm run start
# Or if using Yarn:
yarn start
```

## Environment Variables
Create a `.env` file in the root directory:
```env
DB_HOST=host
DB_PORT=port
DB_USERNAME=username
DB_PASSWORD=password
DB_NAME=database_name
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
```

## User Roles
```typescript
enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/register
Content-Type: application/json

{
    "email": "example@mail.com",
    "name": "New User",
    "password": "yourpassword"
}
```

Success Response (201 Created):
```json
{
    "status": 201
}
```

Error Response (409 Conflict):
```json
{
    "status": 409,
    "error": "Email already exists"
}
```

#### Login
```http
POST /api/v1/login
Content-Type: application/json

{
    "email": "example@mail.com",
    "password": "yourpassword"
}
```

Success Response (200 OK):
```json
{
    "token": {
        "accessToken": "eyJhbG...",
        "refreshToken": "eyJhbG..."
    },
    "user": {
        "id": "uuid",
        "email": "example@mail.com",
        "name": "User Name",
        "role": "user",
        "isDeleted": false
    }
}
```

Error Response (404 Not Found):
```json
{
    "status": "error",
    "message": "The email address or password is incorrect. Please retry",
    "statusCode": 404
}
```

### User Management Endpoints

#### Get All Users
```http
GET /api/v1/users
Authorization: Bearer <token>
```

Success Response (200 OK):
```json
[
    {
        "id": "uuid",
        "email": "example@mail.com",
        "name": "User Name",
        "isDeleted": false
    }
]
```

#### Get User by ID
```http
GET /api/v1/users/:id
Authorization: Bearer <token>
```

Success Response (200 OK):
```json
{
    "id": "uuid",
    "email": "example@mail.com",
    "name": "User Name",
    "isDeleted": false
}
```

#### Update User
```http
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Name",
    "email": "updated@mail.com"
}
```

Success Response (200 OK):
```json
{
    "id": "uuid",
    "email": "updated@mail.com",
    "name": "Updated Name",
    "isDeleted": false
}
```

Error Response (404 Not Found):
```json
{
    "status": "error",
    "message": "User with ID <uuid> not found or has been deleted",
    "statusCode": 404
}
```

#### Delete User
```http
DELETE /api/v1/users/:id
Authorization: Bearer <token>
```

Success Response: `200 OK` (No content)

Error Response (404 Not Found):
```json
{
    "status": "error",
    "message": "Entity not found or has been deleted",
    "statusCode": 404
}
```

## Authentication Requirements
All protected endpoints require a valid JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

## Error Handling
The API returns appropriate HTTP status codes and structured error messages:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Access to the requested resource is forbidden
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource or conflicting data

## Security
- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication and role-based access control
- Role-based access control ensures restricted access to sensitive resources
- Soft delete functionality is implemented to prevent permanent data loss in the database

## Scripts

```bash
npm run start           # Start the server using ts-node
npm run dev            # Start with nodemon for development
npm run migration:generate  # Generate new migration
npm run migration:run     # Run pending migrations
npm run migration:revert  # Revert last migration
npm run migration:fix     # Fix migration issues
```

## Dependencies
- Express.js
- TypeORM
- PostgreSQL
- Redis (optional)
- JWT
- Yup
- TypeScript
- Bcrypt

## License
This project is licensed under the MIT License.