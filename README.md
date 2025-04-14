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
- On success, attaches decoded payload (`userId`, `email`) to `req.user`.

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
  - Backend redirects with token in query string `?token=...`.
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
