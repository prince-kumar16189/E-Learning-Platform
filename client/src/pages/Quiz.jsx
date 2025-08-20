import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/client'

export default function Quiz(){
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/quizzes/${id}`)
      setQuiz(data)
    })()
  }, [id])

  const submit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
        questionId: Number(questionId), selectedIndex: Number(selectedIndex)
      }))
    }
    const { data } = await api.post(`/quizzes/${id}/submit`, payload)
    setResult(data)
  }

  if (!quiz) return <p>Loading...</p>

  return (
    <div className="card">
      <h2>{quiz.title}</h2>
      {quiz.questions.map(q => (
        <div key={q.id} className="quiz-q">
          <p><strong>{q.question}</strong></p>
          {q.options.map((opt, idx) => (
            <label key={idx}>
              <input
                type="radio"
                name={`q_${q.id}`}
                value={idx}
                onChange={e => setAnswers(a => ({...a, [q.id]: e.target.value}))}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submit}>Submit</button>
      {result && <p>Score: {result.score}/{result.total} ({result.percent}%)</p>}
    </div>
  )
}
