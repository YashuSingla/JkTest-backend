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