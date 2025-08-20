import { Router } from 'express';
import { rsPool } from '../db.js';
import { rishAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', rishAuth, async (req, res) => {
  const userId = req.rsUser.id;
  const [enrolls] = await rsPool.query(`
    SELECT c.id, c.title, c.description
    FROM enrollments e JOIN courses c ON e.course_id=c.id
    WHERE e.user_id=?
  `, [userId]);
  const [attempts] = await rsPool.query(`
    SELECT qa.id, q.title, qa.score, qa.total, qa.created_at
    FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id=q.id
    WHERE qa.user_id=? ORDER BY qa.created_at DESC
  `, [userId]);
  res.json({ courses: enrolls, attempts });
});

export default router;
