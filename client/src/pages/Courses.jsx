import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

export default function Courses(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/courses')
      setList(data)
      setLoading(false)
    })()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="grid">
      {list.map(c => (
        <div key={c.id} className="card">
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p><em>By {c.instructor}</em></p>
          <Link to={`/courses/${c.id}`}>Open</Link>
        </div>
      ))}
    </div>
  )
}
