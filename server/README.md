# E-Learning Server (Node/Express + MySQL)

## Setup
1. Create a MySQL database: `elearn_db` (or edit `.env`).
2. Import `schema.sql` into the database.
3. Copy `.env.example` to `.env` and set your values.
4. Install deps: `npm install`
5. Run: `npm run dev`

## Endpoints (high level)
- `POST /api/auth/register` {name,email,password,role?}
- `POST /api/auth/login` -> {token,user}
- `GET /api/courses` list
- `POST /api/courses` (instructor/admin) create
- `GET /api/courses/:id` details + lessons + quizzes
- `POST /api/courses/enroll/:courseId` enroll current user
- `POST /api/quizzes` (instructor/admin) create quiz with questions
- `GET /api/quizzes/:id` get quiz (questions only, no answers)
- `POST /api/quizzes/:id/submit` submit answers -> score/percent
- `GET /api/progress/me` user courses + quiz attempts
- `POST /api/uploads/lesson` upload lesson video/doc (multer fields: video, doc)
- `GET /api/uploads/video/:lessonId/stream` stream a lesson video
