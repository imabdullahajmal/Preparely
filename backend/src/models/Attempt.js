import mongoose from 'mongoose';

const AttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [{ questionIndex: Number, selectedIndex: Number }],
  score: Number,
  takenAt: { type: Date, default: Date.now }
});

export default mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);
