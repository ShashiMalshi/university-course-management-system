import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

// Admin pages
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Students from './pages/Students'
import Enrollments from './pages/Enrollments'
import Results from './pages/Results'

// Student portal pages
import Login from './pages/Login'
import StudentDashboard from './pages/portal/StudentDashboard'
import StudentCourses from './pages/portal/StudentCourses'
import StudentEnrollments from './pages/portal/StudentEnrollments'

import { getUser } from './shared/auth'

function Guard({ role, children }: { role:'ADMIN'|'STUDENT'; children: JSX.Element }) {
  const u = getUser()
  if (!u) return <Navigate to="/login" replace />
  if (u.role !== role) return <Navigate to={u.role === 'ADMIN' ? '/admin' : '/portal'} replace />
  return children
}

function Root() {
  const u = getUser()
  if (!u) return <Navigate to="/login" replace />
  return <Navigate to={u.role === 'ADMIN' ? '/admin' : '/portal'} replace />
}

export default function App() {
  return (
    <Routes>
      {/* Root and Login */}
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />

      {/* Admin group */}
      <Route
        path="/admin"
        element={
          <Guard role="ADMIN">
            <MainLayout />
          </Guard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="students" element={<Students />} />
        <Route path="enrollments" element={<Enrollments />} />
        <Route path="results" element={<Results />} />
      </Route>

      {/* Student group */}
      <Route
        path="/portal"
        element={
          <Guard role="STUDENT">
            <MainLayout />
          </Guard>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="enrollments" element={<StudentEnrollments />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
