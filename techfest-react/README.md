# TechFest React frontend

This folder contains the React + Vite frontend. It is designed to run together with the separate `techfest-backend` folder in the parent project directory.

For the complete setup, MongoDB configuration, API list, Git/GitHub, CI/CD and deployment instructions, open the parent folder's `README.md`.

## Quick start

In this folder, install frontend packages and create the local environment file:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The `.env` file should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

Keep the React development server running in one terminal. Start the backend in a second terminal using the instructions in the parent README. The frontend normally opens at `http://localhost:5173`.
