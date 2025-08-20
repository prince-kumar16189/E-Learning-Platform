import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { rsPool } from '../db.js';
import { rishAuth, rsRole } from '../middleware/auth.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('video/') ? 'uploads/videos' : 'uploads/docs';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({ storage });

// Upload a lesson video or PDF (instructors/admin)
router.post('/lesson', rishAuth, rsRole('instructor','admin'), upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'doc', maxCount: 1 }
]), async (req, res) => {
  const { course_id, title } = req.body;
  const videoPath = req.files?.video?.[0]?.path || null;
  const docPath = req.files?.doc?.[0]?.path || null;
  const [result] = await rsPool.query(
    'INSERT INTO lessons(course_id, title, video_path, doc_path) VALUES (?,?,?,?)',
    [course_id, title, videoPath, docPath]
  );
  res.json({ id: result.insertId, title, video_path: videoPath, doc_path: docPath });
});

// Basic video streaming with range requests
router.get('/video/:lessonId/stream', async (req, res) => {
  const lessonId = req.params.lessonId;
  const [[lesson]] = await rsPool.query('SELECT video_path FROM lessons WHERE id=?', [lessonId]);
  if (!lesson || !lesson.video_path) return res.status(404).end();
  const videoPath = lesson.video_path;
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

export default router;
