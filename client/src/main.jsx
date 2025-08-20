import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './pages/App.jsx'
import Login from './pages/Login.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import Quiz from './pages/Quiz.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './styles/base.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route index element={<Navigate to="/courses" replace />} />
        <Route path="login" element={<Login/>} />
        <Route path="courses" element={<Courses/>} />
        <Route path="courses/:id" element={<CourseDetail/>} />
        <Route path="quiz/:id" element={<Quiz/>} />
        <Route path="dashboard" element={<Dashboard/>} />
      </Route>
    </Routes>
  </BrowserRouter>
)
