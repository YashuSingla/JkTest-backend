<<<<<<< HEAD
# 🛡️ NestJS Backend: Google Authentication & Post Management

This project is a **NestJS**-based backend application offering secure **Google OAuth 2.0 authentication** and **CRUD operations for posts**. Built with scalability and modularity in mind, it serves as a robust foundation for blogging platforms or content-driven applications.

---

## 🚀 Features

### 🔐 Authentication

- Google OAuth 2.0 via `@nestjs/passport` and `passport-google-oauth20`.
- Verifies Google `id_token` with Google servers.
- Generates **JWT tokens** on successful login.
- Secures routes using custom `JwtAuthGuard` and `JwtStrategy`.
- JWTs signed with `JWT_SECRET`, verified on each request.

#### 🧩 Google Authentication Flow

1. **Frontend Login**: Google SDK returns an `id_token`.
2. **Send Token to Backend**: Token is sent to `/auth/google`.
3. **Token Validation**: Backend verifies token with Google.
4. **Extract User Info**: Extracts email, name, Google ID (`sub`).
5. **User Handling**: Checks DB; creates new user if not exists.
6. **JWT Generation**: Signs and returns token with user data.
7. **Frontend Storage**: JWT stored (e.g., `localStorage`) for auth.

---

## 📚 API Routes

### 🔑 Authentication

- `GET /auth/google` – Validates Google token & returns JWT.

### 📝 Post Management

- `GET /posts` – Public: Fetch all posts.
- `GET /posts/:id` – Public: Fetch a post by ID.
- `POST /posts` – Auth: Create a new post.
- `PUT /posts/:id` – Auth: Update a post.
- `DELETE /posts/:id` – Auth: Delete a post.
- `GET /posts/my-posts` – Auth: Get all posts by authenticated user.

### 👤 User Management

- `GET /users/all` – Fetch all users.
- `GET /users/posts` – Get posts of a specific user.

---

## 🛡️ JWT Strategy

- Extracts token from `Authorization: Bearer <token>`.
- Validates signature and expiration.
- On success, attaches decoded payload to `req.user`.

> Uses Passport's `jwt` strategy internally within `JwtAuthGuard`.

---

## 🗄️ Database Integration

- Uses **TypeORM** with **PostgreSQL** (hosted on Aiven).
- **Entities**:
  - `User`: Stores user data.
  - `Post`: Stores blog posts.
- Connection config via `.env` variables in `app.module.ts`.

---

## ⚙️ Environment Variables

| Variable               | Description                        |
|------------------------|------------------------------------|
| `JWT_SECRET`           | Secret key for signing JWTs        |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID             |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret         |
| `DB_HOST`              | PostgreSQL Host                    |
| `DB_PORT`              | PostgreSQL Port                    |
| `DB_USERNAME`          | PostgreSQL Username                |
| `DB_PASSWORD`          | PostgreSQL Password                |
| `DB_NAME`              | PostgreSQL Database Name           |

---

## 🌐 CORS & Frontend Integration

- CORS enabled (e.g., `http://localhost:4200`).
- On successful auth:
  - Backend redirects with token.
  - Frontend extracts and stores token (e.g., in `localStorage`).

---

## 🔮 Future Enhancements

- ✅ **Role-Based Access Control (RBAC)**: Admin/User permissions.
- ✅ **Global Error Handling**: Centralized exception filters.
- ✅ **Refresh Tokens**: Extend sessions without re-authentication.

---

## 🛠️ Tech Stack

- **NestJS**
- **Passport.js**
- **Google OAuth**
- **JWT**
- **PostgreSQL** (via **TypeORM**)
- **Aiven** (Database hosting)

---
=======
# Backend Application for Authentication and Post Management

## Description

This project is a backend application built using the [NestJS](https://nestjs.com/) framework. It provides a secure and scalable server-side solution for managing Google-based user authentication and post-related operations. The application follows a modular architecture, making it easy to extend and maintain.

## Key Features

### 1. Authentication
- Implements **Google OAuth 2.0 authentication** using `@nestjs/passport` and the `passport-google-oauth20` strategy.
- Upon successful login, generates a **JWT token** which is sent back to the frontend.
- Secures protected routes using a custom `JwtAuthGuard` and `JwtStrategy`.
- Tokens are signed using a secret key (`JWT_SECRET`) or private key and verified on each protected request.

### 2. Routing and Functionalities

The application provides the following routes and functionalities:

#### Authentication Routes:
- `GET /auth/google`: Validates the Google token and sends back a JWT token to the frontend.

#### Post Management Routes:
- `GET /posts`: Retrieves a list of all posts (public).
- `GET /posts/:id`: Retrieves a specific post by its ID (public).
- `POST /posts`: Creates a new post (requires authentication).
- `PUT /posts/:id`: Updates an existing post (requires authentication).
- `DELETE /posts/:id`: Deletes a post (requires authentication).

#### User Management Routes:
- `GET /users/all`: Retrieves a list of all users.
- `GET /users/posts`: Retrieves Post details of a specific user by their.

### 3. JWT Strategy
- The `JwtStrategy` class is responsible for validating JWT tokens from incoming requests.
- Extracts tokens from the `Authorization` header using the Bearer scheme.
- The `validate()` method decodes the token payload and attaches user details (`userId`, `email`) to the request for use in controllers and services.

### 4. Database Integration
- Uses **TypeORM** to interact with a PostgreSQL database hosted on Aiven.
- The `User` entity defines the schema for storing user information.
- The `Post` entity defines the schema for storing blog posts.
- Connection details (host, port, credentials, SSL cert) are configured directly in `app.module.ts` and loaded from environment variables.

### 5. Environment Configuration
- Environment variables are loaded using built-in Node.js `process.env` (no extra config module).
- Key environment variables include:
  - `JWT_SECRET`: Secret for signing JWTs.
  - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials for Google.
  - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: PostgreSQL credentials.

### 6. CORS and Frontend Integration
- **CORS** is enabled in `main.ts` to allow requests from the frontend (e.g., `http://localhost:4200`).
- The backend handles Google login via the `GET /auth/google` route, which validates the Google token and generates a new JWT.
- On successful login, the backend redirects users to the frontend with the newly generated JWT token in the query string (`?token=...`).
- The frontend can extract and store the token (e.g., in `localStorage`) to authorize future requests.

## Future Enhancements
- **Role-Based Access Control (RBAC)**: Add user roles (e.g., admin, user) to restrict access to specific routes and actions.
- **Error Handling**: Improve global error responses with custom filters for bad requests, unauthorized access, etc.
- **Refresh Tokens**: Implement token refresh mechanism for longer sessions without re-login.

This backend application is ideal for building a blogging platform or any system that requires secure user authentication with social login and basic content management.
>>>>>>> master
