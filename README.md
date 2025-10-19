# Confessly - Anonymous Confessions (owner-tracked) - Starter Repo

This is a starter repository containing a minimal frontend (React/Vite) and backend (Express + Mongo)
with an admin UI and OAuth-ready placeholders. It intentionally implements a pattern where confessions
are publicly anonymous but the site owner can map the submission to a user via a token.

IMPORTANT: Read the Security & Privacy notes in the canvas document before deploying.

## Quick start (local)
1. Install and run MongoDB locally (or use Docker compose).
2. Backend:
   - cd backend
   - cp .env.example .env  # and edit values
   - npm install
   - npm run dev
3. Frontend:
   - cd frontend
   - npm install
   - npm run dev
4. Admin OAuth:
   - Create OAuth apps in Google/GitHub and set redirect URIs to:
     `http://localhost:4000/auth/google/callback` and `http://localhost:4000/auth/github/callback`
   - Add credentials to backend `.env`

## Files included
- frontend/: Vite React app (minimal)
- backend/: Express server with routes and OAuth placeholders
- docker-compose.yml: quick local dev stack (app + mongo)

## Notes
- This repo is a starter. You must configure OAuth credentials, secure admin access, and use HTTPS for production.
