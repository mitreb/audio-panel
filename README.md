# Audio Panel - Product Management System 🎵

A full-stack product management system designed for music-centric environments, allowing users to manage audio products including albums, singles, and music releases with cover art.

**Live Demo:** [https://audiopanel.online/](https://audiopanel.online/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo Screenshots](#demo-screenshots)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## 🎯 Overview

Audio Panel is a product management system for music products. Users can create, update, and delete products with cover art. The system includes authentication, role-based access control, and both user and admin interfaces with light/dark theme support.

## ✨ Features

### User Features

- **Product Management**
  - Create products with name, artist name, and cover art
  - View products in grid or table layout
  - Update existing products
  - Delete owned products
- **Authentication**
  - User registration and login
  - JWT-based authentication
- **UI/UX**
  - Responsive design for all screen sizes
  - Light/dark theme toggle
  - Grid and table view options with user preference persistence
  - Real-time form validation

### Admin Features

- **Dashboard Statistics**
  - Total users, products
  - Recent products
- **User Management**
  - View all users
  - Update user roles (USER/ADMIN)
  - Delete users
- **Product Oversight**
  - View all products across users
  - Delete any product

## 📸 Demo Screenshots

### User Dashboard

#### Grid View

<table>
  <tr>
    <td><img src="assets/screenshots/user-dashboard-grid-light.png" alt="User Dashboard Grid - Light Mode" /></td>
    <td><img src="assets/screenshots/user-dashboard-grid-dark.png" alt="User Dashboard Grid - Dark Mode" /></td>
  </tr>
  <tr>
    <td align="center"><em>Light Mode</em></td>
    <td align="center"><em>Dark Mode</em></td>
  </tr>
</table>

#### Table View

<table>
  <tr>
    <td><img src="assets/screenshots/user-dashboard-table-light.png" alt="User Dashboard Table - Light Mode" /></td>
    <td><img src="assets/screenshots/user-dashboard-table-dark.png" alt="User Dashboard Table - Dark Mode" /></td>
  </tr>
  <tr>
    <td align="center"><em>Light Mode</em></td>
    <td align="center"><em>Dark Mode</em></td>
  </tr>
</table>

### Admin Dashboard

#### Overview

<table>
  <tr>
    <td><img src="assets/screenshots/admin-dashboard-light.png" alt="Admin Dashboard - Light Mode" /></td>
    <td><img src="assets/screenshots/admin-dashboard-dark.png" alt="Admin Dashboard - Dark Mode" /></td>
  </tr>
  <tr>
    <td align="center"><em>Light Mode</em></td>
    <td align="center"><em>Dark Mode</em></td>
  </tr>
</table>

#### User Management

<table>
  <tr>
    <td><img src="assets/screenshots/admin-users-light.png" alt="Admin Users - Light Mode" /></td>
    <td><img src="assets/screenshots/admin-users-dark.png" alt="Admin Users - Dark Mode" /></td>
  </tr>
  <tr>
    <td align="center"><em>Light Mode</em></td>
    <td align="center"><em>Dark Mode</em></td>
  </tr>
</table>

#### Product Management - Grid View

<table>
  <tr>
    <td><img src="assets/screenshots/admin-products-grid-light.png" alt="Admin Products Grid - Light Mode" /></td>
    <td><img src="assets/screenshots/admin-products-grid-dark.png" alt="Admin Products Grid - Dark Mode" /></td>
  </tr>
  <tr>
    <td align="center"><em>Light Mode</em></td>
    <td align="center"><em>Dark Mode</em></td>
  </tr>
</table>

#### Product Management - Table View

<table>
  <tr>
    <td><img src="assets/screenshots/admin-products-table-light.png" alt="Admin Products Table - Light Mode" /></td>
    <td><img src="assets/screenshots/admin-products-table-dark.png" alt="Admin Products Table - Dark Mode" /></td>
  </tr>
  <tr>
    <td align="center"><em>Light Mode</em></td>
    <td align="center"><em>Dark Mode</em></td>
  </tr>
</table>

## 🛠 Technology Stack

### Backend

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js v5
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with HTTP-only cookies, bcryptjs for password hashing
- **File Upload:** Multer with Google Cloud Storage support
- **Validation:** Zod schemas
- **Testing:** Jest with Supertest
- **Development:** tsx for hot reloading

### Frontend

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS v4
- **UI Components:** shadcn/ui
- **Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router v7
- **Form Handling:** React Hook Form with Zod validation
- **HTTP Client:** Axios
- **Testing:** Vitest with Testing Library

### DevOps

- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL
- **Cloud Storage:** Google Cloud Storage (optional)

## 📁 Project Structure

```
audio-panel/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.ts                # Database seeding
│   │   └── migrations/            # Database migrations
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   ├── features/              # Feature-based modules
│   │   │   ├── admin/             # Admin functionality
│   │   │   ├── auth/              # Authentication
│   │   │   └── products/          # Product management
│   │   ├── shared/                # Shared utilities
│   │   │   ├── errors/            # Custom error classes
│   │   │   ├── middleware/        # Global middleware
│   │   │   └── utils/             # Utility functions
│   │   ├── app.ts                 # Express app setup
│   │   └── server.ts              # Server entry point
│   ├── uploads/                   # Local file storage (dev)
│   ├── docker-compose.yml         # Docker services
│   ├── Dockerfile                 # Backend container
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   └── ui/                # UI primitives
│   │   ├── features/              # Feature modules
│   │   │   ├── admin/             # Admin pages
│   │   │   ├── auth/              # Auth pages
│   │   │   ├── products/          # Product pages
│   │   │   ├── landing/           # Landing page
│   │   │   └── theme/             # Theme provider
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utility libraries
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API services
│   │   ├── App.tsx                # Root component
│   │   └── main.tsx               # Entry point
│   ├── Dockerfile                 # Frontend container
│   ├── nginx.conf                 # Nginx configuration
│   └── package.json
│
└── assets/
    └── screenshots/               # Demo screenshots
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose
- PostgreSQL (or use Docker Compose)
- Google Cloud account (optional, for cloud storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mitreb/audio-panel.git
   cd audio-panel
   ```

2. **Set up the backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` directory:

   ```env
   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/main"

   # JWT
   JWT_SECRET="your-secret-key-here"

   # Server
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:5173"

   # Google Cloud Storage (optional)
   USE_CLOUD_STORAGE=false
   GCP_PROJECT_ID=""
   GCS_BUCKET_NAME=""
   ```

4. **Start PostgreSQL with Docker Compose**

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database (optional)**

   ```bash
   npx prisma db seed
   ```

7. **Create an admin user**

   ```bash
   npm run create-admin
   ```

8. **Start the backend server**

   ```bash
   npm run dev
   ```

9. **Set up the frontend** (in a new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

10. **Access the application**
    - Frontend: http://localhost:5173
    - Backend API: http://localhost:3000

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

All authenticated endpoints require a valid JWT token sent via HTTP-only cookie.

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "message": "Login successful"
}
```

#### Logout

```http
POST /api/auth/logout
```

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

#### Get Current User

```http
GET /api/auth/user
```

**Response (200):**

```json
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

### Products

#### Get All Products

Returns all products for the authenticated user.

```http
GET /api/products
```

**Response (200):**

```json
{
  "products": [
    {
      "id": "clx...",
      "name": "Thriller",
      "artist": "Michael Jackson",
      "coverImage": "https://storage.googleapis.com/...",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "userId": "clx..."
    }
  ]
}
```

#### Get Single Product

```http
GET /api/products/:id
```

**Response (200):**

```json
{
  "id": "clx...",
  "name": "Thriller",
  "artist": "Michael Jackson",
  "coverImage": "https://storage.googleapis.com/...",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "userId": "clx..."
}
```

#### Create Product

```http
POST /api/products
Content-Type: multipart/form-data

name: "Thriller"
artist: "Michael Jackson"
coverImage: [file]
```

**Response (201):**

```json
{
  "id": "clx...",
  "name": "Thriller",
  "artist": "Michael Jackson",
  "coverImage": "https://storage.googleapis.com/...",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "userId": "clx..."
}
```

**Validation:**

- `name`: Required, 1-100 characters
- `artist`: Required, 1-100 characters
- `coverImage`: Required, image file (JPEG, PNG, WebP), max 5MB

#### Update Product

```http
PATCH /api/products/:id
Content-Type: multipart/form-data

name: "Thriller (Remastered)"
artist: "Michael Jackson"
coverImage: [file] (optional)
```

**Response (200):**

```json
{
  "id": "clx...",
  "name": "Thriller (Remastered)",
  "artist": "Michael Jackson",
  "coverImage": "https://storage.googleapis.com/...",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z",
  "userId": "clx..."
}
```

#### Delete Product

```http
DELETE /api/products/:id
```

**Response (200):**

```json
{
  "message": "Product deleted successfully"
}
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Get Dashboard Stats

```http
GET /api/admin/stats
```

**Response (200):**

```json
{
  "totalUsers": 150,
  "totalProducts": 1250,
  "totalAdmins": 5,
  "recentUsers": 12,
  "recentProducts": 45
}
```

#### Get All Users

```http
GET /api/admin/users
```

**Response (200):**

```json
{
  "users": [
    {
      "id": "clx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "_count": {
        "products": 5
      }
    }
  ]
}
```

#### Update User Role

```http
PATCH /api/admin/users/:id/role
Content-Type: application/json

{
  "role": "ADMIN"
}
```

**Response (200):**

```json
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "ADMIN",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### Delete User

```http
DELETE /api/admin/users/:id
```

**Response (200):**

```json
{
  "message": "User deleted successfully"
}
```

#### Get All Products (Admin)

```http
GET /api/admin/products
```

**Response (200):**

```json
{
  "products": [
    {
      "id": "clx...",
      "name": "Thriller",
      "artist": "Michael Jackson",
      "coverImage": "https://storage.googleapis.com/...",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "user": {
        "id": "clx...",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  ]
}
```

#### Delete Product (Admin)

```http
DELETE /api/admin/products/:id
```

**Response (200):**

```json
{
  "message": "Product deleted successfully"
}
```

### Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

**Common Status Codes:**

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Environment Variables

### Backend

| Variable            | Description                  | Default                 | Required |
| ------------------- | ---------------------------- | ----------------------- | -------- |
| `DATABASE_URL`      | PostgreSQL connection string | -                       | ✅       |
| `JWT_SECRET`        | Secret key for JWT signing   | -                       | ✅       |
| `PORT`              | Server port                  | `3000`                  | ❌       |
| `NODE_ENV`          | Environment mode             | `development`           | ❌       |
| `FRONTEND_URL`      | Frontend URL for CORS        | `http://localhost:5173` | ❌       |
| `USE_CLOUD_STORAGE` | Enable Google Cloud Storage  | `false`                 | ❌       |
| `GCP_PROJECT_ID`    | Google Cloud project ID      | -                       | ⚠️       |
| `GCS_BUCKET_NAME`   | GCS bucket name              | -                       | ⚠️       |

⚠️ Required only if `USE_CLOUD_STORAGE=true`

### Frontend

The frontend uses a proxy in development and environment-specific builds for production. Configure the API URL in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## 🚢 Deployment

This project is deployed on Google Cloud Platform (GCP). GitHub Actions automatically deploy frontend and backend separately to GCP Cloud Run when changes are pushed to the `main` branch.

The deployment workflows are located in `.github/workflows/`:

- `deploy-backend.yml` - Triggers on changes to `backend/**` files
- `deploy-frontend.yml` - Triggers on changes to `frontend/**` files

Each service deploys independently based on which files were modified.

### Infrastructure

- **Backend & Frontend:** GCP Cloud Run (separate services)
- **Database:** Cloud SQL for PostgreSQL
- **File Storage:** Google Cloud Storage (set `USE_CLOUD_STORAGE=true`)
- **Local Development:** Docker Compose

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

**mitreb**

- GitHub: [@mitreb](https://github.com/mitreb)

## 🙏 Acknowledgments

- Built as a technical assignment for a Full-Stack Engineer position
- Designed for music-centric product management
- Implements modern web development best practices

---

**Live Demo:** [https://audiopanel.online/](https://audiopanel.online/)

For questions or support, please open an issue on GitHub.
