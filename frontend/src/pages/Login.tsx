import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJSON } from '../shared/api'
import { useAuth } from '../shared/auth'

type Student = { id:number; name:string; email:string; studentId:string }

export default function Login(){
  const nav = useNavigate()
  const { signIn } = useAuth()
  const [role, setRole] = useState<'ADMIN'|'STUDENT'>('STUDENT')
  const [students, setStudents] = useState<Student[]>([])
  const [email, setEmail] = useState('')

  useEffect(() => { getJSON<Student[]>('/students').then(setStudents).catch(()=>setStudents([])) }, [])
  useEffect(() => { if (role === 'STUDENT' && students.length) setEmail(students[0].email) }, [role, students])

  const submit = () => {
    if (role === 'ADMIN') { signIn({ role: 'ADMIN', email: 'admin@local' }); nav('/admin') }
    else { if(!email) return; signIn({ role: 'STUDENT', email }); nav('/portal') }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950">
      {/* LEFT: white side with brand copy and image near bottom */}
      <section className="relative min-h-[42vh] lg:min-h-screen bg-white dark:bg-slate-950">
        {/* Brand + headings (top-left) */}
        <div className="absolute top-8 left-6 sm:top-12 sm:left-12">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="UniCMS logo" className="w-12 h-12 sm:w-14 sm:h-14" />
            <div>
              {/* UniCMS in primary color */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary-700 dark:text-primary-300">
                UniCMS
              </h1>
              {/* University Course Management in secondary color */}
              <p className="text-sm sm:text-base font-medium text-secondary-600 dark:text-secondary-400">
                University Course Management
              </p>
            </div>
          </div>
          {/* Welcome back! smaller + accent tint */}
          <h2 className="mt-5 text-xl sm:text-xl font-semibold text-600 dark:text-zaffre-300">
            Welcome back!
          </h2>
        </div>

        {/* Illustration anchored toward the bottom */}
        <img
          src="/login-hero.jpg"
          alt="Students learning online"
          className="pointer-events-none select-none absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-[82%] md:w-[86%] max-w-[980px] h-auto object-contain"
        />
      </section>

      {/* RIGHT: colored background (#d9e8ea) with a clean form card */}
      <section className="login-form-bg flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md card bg-white/95 dark:bg-slate-900/80 border border-white/60 dark:border-slate-800 backdrop-blur">
          <h3 className="text-lg font-semibold">Sign in</h3>
          <p className="text-gray-700 dark:text-slate-300 text-sm mt-1">
            Continue as a Student or Admin.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              onClick={()=>setRole('STUDENT')}
              className={`btn w-full ${role==='STUDENT'
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'btn-ghost'}`}
            >
              Student
            </button>
            <button
              onClick={()=>setRole('ADMIN')}
              className={`btn w-full ${role==='ADMIN'
                ? 'bg-secondary-600 hover:bg-secondary-700 text-white'
                : 'btn-ghost'}`}
            >
              Admin
            </button>
          </div>

          {role === 'STUDENT' ? (
            <div className="mt-6">
              <label className="text-sm font-medium">Choose your email</label>
              <select className="input mt-1 w-full" value={email} onChange={e=>setEmail(e.target.value)}>
                {students.map(s => <option key={s.id} value={s.email}>{s.name} ({s.email})</option>)}
              </select>
            </div>
          ) : (
            <p className="mt-6 text-sm text-gray-700 dark:text-slate-300">
              Admin console for creating courses, managing students, and publishing grades.
            </p>
          )}

          <button className="btn-primary w-full mt-6" onClick={submit}>Continue</button>

          <p className="mt-4 text-[11px] text-gray-500">
            * Demo login for the assignment. Production would integrate with university SSO.
          </p>
        </div>
      </section>
    </div>
  )
}
