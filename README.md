Preparely

This repository contains the Preparely AI Quiz application with a Node/Express + MongoDB backend and a Vite + React frontend. The project includes Dockerfiles and GitHub Actions workflows for building and publishing Docker images.

See `backend/README.md` and `frontend/README.md` for service-specific instructions.

Docker and CI/CD
-----------------

Local compose (build and run backend, frontend, and MongoDB):

1. Create a `.env` in the repo root or set environment variables `JWT_SECRET` and `GEMINI_API_KEY` if needed.
2. Run:

```powershell
docker-compose up --build
```

This starts:
- MongoDB on `localhost:27017`
- Backend on `localhost:4000`
- Frontend (nginx) on `localhost:5173`

GitHub Actions
- `CI` workflow builds backend/frontend on push and PRs to `main`.
- `CD` workflow builds Docker images and pushes them to GitHub Container Registry `ghcr.io/<owner>/preparely-backend` and `.../preparely-frontend` on push to `main`.

To enable pushing images, the workflow uses the repository `GITHUB_TOKEN`; ensure the repository has `packages: write` permissions allowed for the token in your organization or repository settings.
