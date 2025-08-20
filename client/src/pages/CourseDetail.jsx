import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'

export default function CourseDetail(){
  const { id } = useParams()
  const [course, setCourse] = useState(null)

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/courses/${id}`)
      setCourse(data)
    })()
  }, [id])

  if (!course) return <p>Loading...</p>

  const enroll = async () => {
    await api.post(`/courses/enroll/${id}`)
    alert('Enrolled!')
  }

  return (
    <div className="stack">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <button onClick={enroll}>Enroll</button>

      <h3>Lessons</h3>
      <ul>
        {course.lessons.map(l => (
          <li key={l.id}>
            <strong>{l.title}</strong>
            {l.video_path && (
              <video controls width="640">
                <source src={`http://localhost:4000/api/uploads/video/${l.id}/stream`} type="video/mp4" />
              </video>
            )}
            {l.doc_path && (
              <p><a target="_blank" href={`http://localhost:4000/${l.doc_path}`}>Download PDF</a></p>
            )}
          </li>
        ))}
      </ul>

      <h3>Quizzes</h3>
      <ul>
        {course.quizzes.map(q => (
          <li key={q.id}>
            {q.title} — <Link to={`/quiz/${q.id}`}>Take quiz</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
