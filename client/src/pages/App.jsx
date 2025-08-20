import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function App(){
  const nav = useNavigate()
  const userStr = localStorage.getItem('rs_user')
  const user = userStr ? JSON.parse(userStr) : null
  const logout = () => {
    localStorage.removeItem('rs_token')
    localStorage.removeItem('rs_user')
    nav('/login')
  }
  return (
    <div className="layout">
      <header>
        <h1>📚 E‑Learning</h1>
        <nav>
          <Link to="/courses">Courses</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div>
          {user ? (
            <>
              <span>{user.name} ({user.role})</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}
