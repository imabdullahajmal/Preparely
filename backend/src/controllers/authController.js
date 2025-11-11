import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const TOKEN_NAME = 'preparely_token';

export async function signup(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: 'username already taken' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash });
  await user.save();
  res.json({ ok: true, user: { id: user._id, username: user.username } });
}

export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'invalid credentials' });

  const token = jwt.sign({ sub: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(TOKEN_NAME, token, { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true, user: { id: user._id, username: user.username } });
}

export async function logout(req, res) {
  res.clearCookie(TOKEN_NAME);
  res.json({ ok: true });
}

export async function me(req, res) {
  const token = req.cookies[TOKEN_NAME];
  if (!token) return res.json({ user: null });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: payload.sub, username: payload.username } });
  } catch (err) {
    res.clearCookie(TOKEN_NAME);
    res.json({ user: null });
  }
}
