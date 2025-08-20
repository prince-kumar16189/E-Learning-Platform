import { Router } from 'express';
import { rsPool } from '../db.js';
import { rishAuth, rsRole } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/', async (req, res) => {
  const [rows] = await rsPool.query(`
    SELECT c.id, c.title, c.description, u.name AS instructor
    FROM courses c JOIN users u ON c.instructor_id=u.id ORDER BY c.id DESC
  `);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const courseId = req.params.id;
  const [[course]] = await rsPool.query(
    'SELECT c.*, u.name AS instructor FROM courses c JOIN users u ON c.instructor_id=u.id WHERE c.id=?',
    [courseId]
  );
  if (!course) return res.status(404).json({ error: 'Not found' });
  const [lessons] = await rsPool.query('SELECT id, title, video_path, doc_path FROM lessons WHERE course_id=? ORDER BY id ASC', [courseId]);
  const [quizzes] = await rsPool.query('SELECT id, title FROM quizzes WHERE course_id=?', [courseId]);
  res.json({ ...course, lessons, quizzes });
});

router.post('/',
  rishAuth, rsRole('instructor','admin'),
  body('title').isLength({ min: 3 }),
  body('description').isLength({ min: 10 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, description } = req.body;
    const [result] = await rsPool.query(
      'INSERT INTO courses(title, description, instructor_id) VALUES (?,?,?)',
      [title, description, req.rsUser.id]
    );
    res.json({ id: result.insertId, title, description });
  }
);

router.post('/enroll/:courseId', rishAuth, async (req, res) => {
  const courseId = req.params.courseId;
  await rsPool.query('INSERT IGNORE INTO enrollments(user_id, course_id) VALUES (?,?)', [req.rsUser.id, courseId]);
  res.json({ ok: true });
});

export default router;
