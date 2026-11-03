# TechFest 2026 Portal — Full Stack Project

This folder contains the existing React frontend and the Express/MongoDB backend added for the Web Technology Laboratory experiments.

## Folder structure

```text
TechFest-2026/
├── techfest-react/             React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   └── services/api.js
│   └── .env.example
├── techfest-backend/           Express + MongoDB backend
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── tests/
│   └── .env.example
└── .github/workflows/ci.yml    GitHub Actions checks
```

## 1. Requirements

- Node.js 20 or newer (Node.js 22 LTS recommended)
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- VS Code and Chrome

## 2. Configure the backend

Open a terminal in the project parent folder and run:

```powershell
cd techfest-backend
npm install
Copy-Item .env.example .env
```

Open `techfest-backend/.env` and set `MONGO_URI` and a private `JWT_SECRET` (at least 32 characters). For a local MongoDB installation, the example connection string works when MongoDB is running. For MongoDB Atlas, paste the Atlas connection string instead.

For example:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/techfest
JWT_SECRET=use_a_long_random_secret_of_at_least_32_characters
CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173
ADMIN_NAME=TechFest Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use_a_strong_admin_password
```

The optional admin account is created only when the database starts and that email does not already exist. Change the example admin email and password before using it. Do not commit `.env` to GitHub.

Start the backend:

```powershell
npm run dev
```

Expected terminal output includes `MongoDB connected successfully` and `TechFest backend running at http://localhost:5000`.

Open `http://localhost:5000/api/health` in Chrome. The response should show that the API is running. On its first successful database connection, the backend inserts the six sample TechFest events if the Events collection is empty.

## 3. Configure the frontend

Open a second VS Code terminal:

```powershell
cd techfest-react
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend `.env` should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

Open the Vite address (usually `http://localhost:5173`). The Events page now loads events from MongoDB through Express. Create a participant account from **Login → Create an account**, log in, and then register for an event. Registration is saved in MongoDB and the event seat count is reduced by the backend. The **My Registrations** link in the navigation shows saved registrations and allows a participant to cancel one.

Keep both terminal windows running while testing the full-stack application.

## 4. API routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| GET | `/api/events` | Public | List events |
| GET | `/api/events/:id` | Public | Read one event |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |
| POST | `/api/auth/register` | Public | Create participant account |
| POST | `/api/auth/login` | Public | Log in |
| POST | `/api/auth/logout` | Logged in | Log out |
| GET | `/api/auth/me` | Logged in | Current user |
| GET | `/api/auth/csrf` | Public | Obtain CSRF token |
| POST | `/api/registrations` | Logged in | Register for an event |
| GET | `/api/registrations/my` | Logged in | View own registrations |
| GET | `/api/registrations` | Admin | View all registrations |
| DELETE | `/api/registrations/:id` | Owner/Admin | Cancel registration |

For Postman/Thunder Client, first call `GET /api/auth/csrf` and keep the returned cookies. Send the returned `csrfToken` value in the `X-CSRF-Token` header for POST, PUT, PATCH and DELETE requests.

## 5. Security features included

- Helmet security response headers and a Content Security Policy.
- MongoDB query sanitisation through `express-mongo-sanitize`.
- Express request validation for account, event and registration inputs.
- Password hashing with bcrypt; passwords are never returned by user routes.
- JWT authentication in an HTTP-only cookie.
- CSRF double-submit token cookie and `X-CSRF-Token` header check for state-changing requests.
- SameSite cookies in development; Secure and SameSite=None cookies in production for cross-origin hosting.
- CORS restricted to the configured frontend origins.
- Rate limiting on login and account creation.
- Centralised error handling and request logging.
- `.env` and `node_modules` excluded from Git.

React renders user-provided text as text rather than using `dangerouslySetInnerHTML`.

## 6. Git and GitHub

Run Git from this project parent folder (the folder containing both `techfest-react` and `techfest-backend`):

```powershell
git init
git add .
git commit -m "Add TechFest full stack application"
git branch -M main
git checkout -b feature-page
git add .
git commit -m "Add feature branch work"
git checkout main
git merge feature-page
```

Create an empty GitHub repository, then connect it:

```powershell
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not commit either `.env` file or any `node_modules` folder.

## 7. CI/CD

The file `.github/workflows/ci.yml` runs on pushes and pull requests to `main`. It installs frontend and backend dependencies, runs ESLint, builds the React app, checks backend syntax and runs the backend unit tests. A green GitHub Actions run means these checks passed.

For continuous deployment, connect the GitHub repository to Netlify (frontend) and Render (backend), and enable deployment on successful pushes. Set the environment variables in each hosting dashboard; never put production secrets in source code.

## 8. Cloud deployment settings

**MongoDB Atlas**
- Create a cluster and database user.
- Set a restricted Network Access rule appropriate for your deployment.
- Copy the connection string into Render's `MONGO_URI` environment variable.

**Render backend Web Service**
- Root directory: `techfest-backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URLS` (your exact frontend URL), and optional `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

**Netlify frontend**
- Base directory: `techfest-react`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`
- `public/_redirects` is included so React Router pages work after refresh.

Because the frontend and backend use different hosting domains, production cookies use `SameSite=None; Secure`. Confirm that your chosen browser allows the required cross-site cookies. For a production deployment, using frontend and API custom domains under the same site is preferable where possible.

## 9. Performance audit

Run the frontend production build:

```powershell
cd techfest-react
npm run build
```

Open the deployed website in Chrome, press F12, choose Lighthouse, and run the audit. Save before-and-after reports when you make performance improvements such as image compression and lazy loading.

## 10. Troubleshooting

- **MongoDB connection error:** confirm MongoDB is running or check the Atlas URI, username, password and network access list.
- **CORS error:** make sure `CLIENT_URLS` contains the exact frontend origin, including `http://` or `https://` and the correct port.
- **Events page says failed to fetch:** start the backend and confirm `/api/health` works.
- **CSRF check failed:** refresh the frontend page so it obtains a new CSRF token.
- **Admin routes return 403:** sign in using the optional admin account configured in the backend `.env`.
