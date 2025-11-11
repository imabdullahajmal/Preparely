import mongoose from 'mongoose';

const ChoiceSchema = new mongoose.Schema({
  text: String,
  correct: Boolean
}, {_id: false});

const QuestionSchema = new mongoose.Schema({
  prompt: String,
  choices: [ChoiceSchema]
}, {_id: false});

const QuizSchema = new mongoose.Schema({
  topic: String,
  difficulty: String,
  source: String,
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
