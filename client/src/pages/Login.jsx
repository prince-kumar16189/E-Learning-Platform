import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('rs_token', data.token)
      localStorage.setItem('rs_user', JSON.stringify(data.user))
      nav('/courses')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
      <p><strong>Tip:</strong> Create a user via <code>POST /api/auth/register</code> first.</p>
    </div>
  )
}
