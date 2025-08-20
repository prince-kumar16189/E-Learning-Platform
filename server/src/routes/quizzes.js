import { Router } from 'express';
import { rsPool } from '../db.js';
import { rishAuth, rsRole } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = Router();

router.post('/',
  rishAuth, rsRole('instructor','admin'),
  body('course_id').isInt(),
  body('title').isLength({ min: 3 }),
  body('questions').isArray({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { course_id, title, questions } = req.body;
    const [qz] = await rsPool.query('INSERT INTO quizzes(course_id, title) VALUES (?,?)', [course_id, title]);
    const quizId = qz.insertId;
    for (const q of questions) {
      const [qq] = await rsPool.query(
        'INSERT INTO quiz_questions(quiz_id, question, options_json, correct_index) VALUES (?,?,?,?)',
        [quizId, q.question, JSON.stringify(q.options), q.correctIndex]
      );
    }
    res.json({ id: quizId, title });
  }
);

router.get('/:id', rishAuth, async (req, res) => {
  const quizId = req.params.id;
  const [[quiz]] = await rsPool.query('SELECT id, title, course_id FROM quizzes WHERE id=?', [quizId]);
  if (!quiz) return res.status(404).json({ error: 'Not found' });
  const [qs] = await rsPool.query('SELECT id, question, options_json FROM quiz_questions WHERE quiz_id=?', [quizId]);
  const questions = qs.map(q => ({ id: q.id, question: q.question, options: JSON.parse(q.options_json) }));
  res.json({ ...quiz, questions });
});

router.post('/:id/submit',
  rishAuth,
  body('answers').isArray(),
  async (req, res) => {
    const quizId = req.params.id;
    const { answers } = req.body; // [{questionId, selectedIndex}]
    const [qs] = await rsPool.query('SELECT id, correct_index FROM quiz_questions WHERE quiz_id=?', [quizId]);
    let score = 0;
    for (const a of answers) {
      const q = qs.find(q => q.id === a.questionId);
      if (q && q.correct_index === a.selectedIndex) score++;
    }
    const total = qs.length;
    const [attempt] = await rsPool.query(
      'INSERT INTO quiz_attempts(user_id, quiz_id, score, total) VALUES (?,?,?,?)',
      [req.rsUser.id, quizId, score, total]
    );
    res.json({ score, total, percent: total ? Math.round((score/total)*100) : 0 });
  }
);

export default router;
