import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Dashboard(){
  const [data, setData] = useState(null)
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/progress/me')
      setData(data)
    })()
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <div className="stack">
      <h2>Your Dashboard</h2>
      <section>
        <h3>Enrolled Courses</h3>
        <ul>
          {data.courses.map(c => <li key={c.id}>{c.title}</li>)}
        </ul>
      </section>
      <section>
        <h3>Recent Quiz Attempts</h3>
        <ul>
          {data.attempts.map(a => (
            <li key={a.id}>
              {a.title}: {a.score}/{a.total} — {new Date(a.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
