Preparely — Backend

Setup

1. Copy `.env.example` to `.env` and fill in values (MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, PORT).
2. Install dependencies:
   npm install
3. Start in development with nodemon (auto-restarts):
   npm run dev

Notes
- Server exposes endpoints under `/api/auth` and `/api/quiz`.
- Gemini integration expects a REST-like API and the `GEMINI_API_KEY` env var. You may need to adapt the endpoint URL in `src/controllers/quizController.js` to your provider.
- Uses HTTP-only cookie named `preparely_token` for session.
