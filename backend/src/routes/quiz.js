import express from 'express';
import { generateQuiz, saveAttempt, listQuizzes, getQuiz, listAttempts } from '../controllers/quizController.js';

const router = express.Router();

router.post('/generate', generateQuiz); // expects { topic, difficulty, numQuestions }
router.post('/attempt', saveAttempt);
router.get('/', listQuizzes);
// Ensure static sub-routes are declared before the parameterized `/:id` route
router.get('/attempts', listAttempts);
router.get('/:id', getQuiz);

export default router;
