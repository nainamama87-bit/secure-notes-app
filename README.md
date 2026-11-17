# Secure Notes App

A full-stack notes application built with **Node.js, Express.js, MongoDB, and Mongoose**. Users can create an account, sign in, and privately create, view, edit, and delete their own notes.

## Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT authentication stored in an HTTP-only cookie
- Protected notes API
- Each user can access only their own notes
- Create, read, update, and delete notes (CRUD)
- Login/register rate limiting
- Basic security headers with Helmet
- Responsive frontend using HTML, CSS, and vanilla JavaScript

## Tech stack

- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JSON Web Token (JWT), bcryptjs
- Frontend: HTML, CSS, JavaScript

## Requirements

Install Node.js 18 or later and have MongoDB running locally, or create a MongoDB Atlas database.

## Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/secure-notes-app.git
   cd secure-notes-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file by copying `.env.example` to `.env`.

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS/Linux:

   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and set your MongoDB connection string and a long, random JWT secret.

5. Start the server:

   ```bash
   npm run dev
   ```

6. Open **http://localhost:5000** in your browser.

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long, random secret used to sign JWTs |
| `NODE_ENV` | Use `production` when deployed |

Never commit `.env` or share your `JWT_SECRET`. `.gitignore` excludes `.env`.

## API endpoints

All request and response bodies use JSON.

### Authentication

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Sign in | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Sign out | Yes |

Example registration body:

```json
{
  "name": "Ankita",
  "email": "ankita@example.com",
  "password": "strongpassword123"
}
```

### Notes

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/api/notes` | Get your notes | Yes |
| POST | `/api/notes` | Create a note | Yes |
| PUT | `/api/notes/:id` | Update your note | Yes |
| DELETE | `/api/notes/:id` | Delete your note | Yes |

Example note body:

```json
{
  "title": "My project",
  "content": "Build and test the Secure Notes App."
}
```

The browser frontend sends the authentication cookie automatically. For API testing in Postman, enable cookie handling and keep the cookie returned by register/login for subsequent protected requests.

## Project structure

```text
secure-notes-app/
├── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── noteController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   └── routes/
│       ├── authRoutes.js
│       └── noteRoutes.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Push to GitHub

Create an empty repository on GitHub named `secure-notes-app`. Then run these commands from this project folder:

```bash
git init
git add .
git commit -m "Initial commit: Secure Notes App"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/secure-notes-app.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Security notes

- Passwords are hashed; plain-text passwords are never stored.
- JWTs are placed in HTTP-only cookies rather than browser local storage.
- Notes queries always filter by the authenticated user's ID.
- Authentication routes are rate-limited.
- Use HTTPS and set `NODE_ENV=production` when deploying.
- This is a learning/portfolio project, not a security-audited production service. For a production deployment, review CSRF protections, cookie configuration, logging, monitoring, and secret management.

## Suggested GitHub description

A secure full-stack notes manager built with Node.js, Express, MongoDB, JWT authentication, and bcrypt password hashing. Supports private CRUD operations for authenticated users.
