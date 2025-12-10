import Quiz from '../models/Quiz.js';
import Attempt from '../models/Attempt.js';
import jwt from 'jsonwebtoken';
import { generateQuizFromGemini } from '../services/geminiService.js';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const TOKEN_NAME = 'preparely_token';

function getUserFromReq(req){
  const token = req.cookies && req.cookies[TOKEN_NAME];
  if(!token) return null;
  try{ return jwt.verify(token, JWT_SECRET); } catch(e){return null}
}

// Expected request body: { topic, difficulty, numQuestions }
export async function generateQuiz(req, res){
  const { topic, difficulty, numQuestions } = req.body;
  if(!topic || !numQuestions) return res.status(400).json({ error: 'topic and numQuestions required' });
  const n = Number(numQuestions) || 0;
  if(n <= 0 || n > 50) return res.status(400).json({ error: 'numQuestions must be between 1 and 50' });

  // Attempt to call the external Gemini service via the geminiService when a key is configured.
  // Otherwise fall back to a local deterministic mock generator so the app remains usable during development.

  try{
    let quizObj = null;

    if(GEMINI_KEY){
      try{
        quizObj = await generateQuizFromGemini({ topic, difficulty, numQuestions: n });
      }catch(e){
        // log and fall through to fallback mock generator
        console.warn('Gemini generation failed, falling back to mock:', e && e.message ? e.message : e);
      }
    }

    // Fallback: generate a simple mock quiz locally
    if(!quizObj || !quizObj.questions){
      const questions = [];
      for(let i=0;i<n;i++){
        const correctIndex = i % 4; // deterministic placement
        const choices = [];
        // More descriptive choice texts so frontend displays readable options
        const choiceTexts = [
          `${topic}: the main idea or correct statement about this question.`,
          `A common misconception or wrong answer related to ${topic}.`,
          `A related but incorrect detail about ${topic}.`,
          `An edge-case or distractor concerning ${topic}.`
        ];
        for(let j=0;j<4;j++){
          const letter = String.fromCharCode(65+j);
          choices.push({ text: `${letter}) ${choiceTexts[j]}`, correct: j===correctIndex });
        }
        questions.push({ prompt: `Question ${i+1}: Which statement best describes ${topic}? (difficulty: ${difficulty || 'medium'})`, choices });
      }
      quizObj = { topic, difficulty: difficulty || 'medium', questions };
    }

  if(!quizObj || !quizObj.questions) return res.status(502).json({ error: 'Invalid quiz format from generator' });

  const saved = new Quiz({ topic: quizObj.topic || topic, difficulty: quizObj.difficulty || difficulty, questions: quizObj.questions, source: GEMINI_KEY ? 'gemini' : 'mock' });
    await saved.save();
    res.json({ ok: true, quiz: saved });
  } catch(err){
    console.error('generateQuiz error', err);
    res.status(500).json({ error: 'internal', details: String(err) });
  }
}

export async function saveAttempt(req, res){
  const userPayload = getUserFromReq(req);
  if(!userPayload) return res.status(401).json({ error: 'unauthenticated' });
  const { quizId, answers } = req.body; // answers: [{questionIndex, selectedIndex}]
  if(!quizId || !answers) return res.status(400).json({ error: 'quizId and answers required' });

  const quiz = await Quiz.findById(quizId);
  if(!quiz) return res.status(404).json({ error: 'quiz not found' });

  // compute score (simple count of correct choice)
  let score = 0;
  for(const a of answers){
    const q = quiz.questions[a.questionIndex];
    if(!q) continue;
    const choice = q.choices && q.choices[a.selectedIndex];
    if(choice && choice.correct) score++;
  }

  const attempt = new Attempt({ user: userPayload.sub, quiz: quiz._id, answers, score });
  await attempt.save();

  res.json({ ok: true, attempt });
}

export async function listQuizzes(req, res){
  const quizzes = await Quiz.find().sort({ createdAt: -1 }).limit(50);
  res.json({ ok: true, quizzes });
}

export async function listAttempts(req, res){
  const userPayload = getUserFromReq(req);
  if(!userPayload) return res.status(401).json({ error: 'unauthenticated' });
  const attempts = await Attempt.find({ user: userPayload.sub }).sort({ takenAt: -1 }).limit(50).populate('quiz');
  res.json({ ok: true, attempts });
}

export async function getQuiz(req, res){
  const id = req.params.id;
  const quiz = await Quiz.findById(id);
  if(!quiz) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true, quiz });
  
}
