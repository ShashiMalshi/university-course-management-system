import { useEffect, useMemo, useState } from 'react'
import { getJSON } from '../shared/api'
import { BookOpen, Users2, ClipboardList, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'

type Course = { id:number; code:string; title:string; credit:number; lecturerName:string }
type Student = { id:number; name:string; studentId:string; email:string }
type Result = { id:number; grade?:string }

function Stat({icon:Icon, label, value, tone='primary'}:{icon:any; label:string; value:string|number; tone?:'primary'|'secondary'|'accent'}) {
  const toneBg = {
    primary: 'from-primary-50 to-white dark:from-primary-900/20 dark:to-slate-900',
    secondary: 'from-secondary-50 to-white dark:from-secondary-900/20 dark:to-slate-900',
    accent: 'from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900',
  }[tone]
  const iconBg = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
    secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300',
    accent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }[tone]
  return (
    <div className="card relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneBg} opacity-90`} />
      <div className="relative flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-slate-300">{label}</div>
          <div className="text-3xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  )
}

function normalizeGrade(g?:string){
  if(!g) return 'N/A'
  const t = g.trim().toUpperCase()
  return ['A','B','C','D','E','F'].includes(t) ? t : 'N/A'
}

export default function Dashboard(){
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [resultsOk, setResultsOk] = useState(true)

  useEffect(() => {
    Promise.all([
      getJSON<Course[]>('/courses').catch(()=>[]),
      getJSON<Student[]>('/students').catch(()=>[]),
      getJSON<Result[]>('/results').then(r=>{ setResultsOk(true); return r }).catch(()=>{ setResultsOk(false); return [] })
    ]).then(([c,s,r]) => { setCourses(c); setStudents(s); setResults(r) })
      .finally(()=>setLoading(false))
  }, [])

  const lecturers = useMemo(() => new Set(courses.map(c=>c.lecturerName)).size, [courses])
  const avgCredits = useMemo(() => {
    if(!courses.length) return 0
    return Math.round((courses.reduce((a,b)=>a+b.credit,0)/courses.length)*10)/10
  }, [courses])

  const gradeBuckets = useMemo(() => {
    const buckets: Record<string, number> = { 'A':0,'B':0,'C':0,'D':0,'E':0,'F':0,'N/A':0 }
    for(const r of results) buckets[normalizeGrade(r.grade)]++
    return Object.entries(buckets).map(([grade,count])=>({grade,count}))
  }, [results])

  const recentCourses = useMemo(() => [...courses].sort((a,b)=>b.id-a.id).slice(0,5), [courses])
  const recentStudents = useMemo(() => [...students].sort((a,b)=>b.id-a.id).slice(0,5), [students])

  return (
    <section className="space-y-6">
      {/* Welcome / Quick actions */}
      <div className="card bg-gradient-to-br from-white via-white to-primary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Welcome to UniCMS</h2>
            <p className="text-gray-600 dark:text-slate-300">Manage courses, students, enrollments, and results from one place.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/courses" className="btn-secondary"><Plus className="w-4 h-4" /> New Course</Link>
            <Link to="/admin/students" className="btn-accent"><Plus className="w-4 h-4" /> New Student</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({length:4}).map((_,i)=>(<div key={i} className="card h-24 animate-pulse" />))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat icon={BookOpen} label="Total Courses" value={courses.length} tone="primary" />
          <Stat icon={Users2} label="Total Students" value={students.length} tone="secondary" />
          <Stat icon={ClipboardList} label="Lecturers" value={lecturers} tone="accent" />
          <Stat icon={BookOpen} label="Avg. Credits" value={avgCredits} tone="primary" />
        </div>
      )}

      {/* Two columns: chart + lists */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Grade Distribution</h3>
            {!resultsOk && <span className="badge badge-warn">/results not available</span>}
          </div>
          {loading ? (
            <div className="h-64 animate-pulse" />
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={gradeBuckets} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent lists */}
        <div className="card lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Recent Courses</h3>
                <Link to="/admin/courses" className="text-sm text-primary-600 hover:underline">View all</Link>
              </div>
              <ul className="space-y-2">
                {recentCourses.length ? recentCourses.map(c => (
                  <li key={c.id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-slate-800 px-3 py-2">
                    <div>
                      <div className="font-medium">{c.title}</div>
                      <div className="text-sm text-gray-600 dark:text-slate-300">{c.code} • {c.lecturerName}</div>
                    </div>
                    <span className="badge badge-info">{c.credit} cr</span>
                  </li>
                )) : <div className="text-gray-500">No courses yet.</div>}
              </ul>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">New Students</h3>
                <Link to="/admin/students" className="text-sm text-primary-600 hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead><tr><th>Name</th><th>ID</th><th>Email</th></tr></thead>
                  <tbody>
                    {recentStudents.length ? recentStudents.map(s => (
                      <tr key={s.id}><td>{s.name}</td><td>{s.studentId}</td><td>{s.email}</td></tr>
                    )) : <tr><td colSpan={3} className="text-center text-gray-500 py-6">No students yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
