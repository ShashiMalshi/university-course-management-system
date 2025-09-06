import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../shared/auth'
import { getJSON } from '../../shared/api'

type Course = { id:number; code:string; title:string; credit:number; lecturerName:string }
type Enrollment = { id:number; studentEmail:string; course: Course }
type Result = { id:number; grade?:string; enrollment?: { id:number } }

async function fetchMyEnrollments(email:string){
  try { return await getJSON<Enrollment[]>(`/enrollments?studentEmail=${encodeURIComponent(email)}`) }
  catch { return await getJSON<Enrollment[]>(`/me/enrollments?studentEmail=${encodeURIComponent(email)}`) }
}

export default function StudentDashboard(){
  const { user } = useAuth()
  const email = user?.email || ''
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [enrs, setEnrs] = useState<Enrollment[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!email) return
    Promise.all([
      getJSON<Course[]>('/courses').catch(()=>[]),
      fetchMyEnrollments(email).catch(()=>[]),
      getJSON<Result[]>('/results').catch(()=>[])
    ]).then(([c,e,r]) => { setAllCourses(c); setEnrs(e); setResults(r) })
      .finally(()=>setLoading(false))
  }, [email])

  const myGrades = useMemo(() => {
    const byEnr = new Map(results.map(r => [r.enrollment?.id, r.grade ?? '']))
    return enrs.map(e => ({ course: e.course, grade: byEnr.get(e.id) || '—' }))
  }, [results, enrs])

  return (
    <section className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Welcome</h2>
            <p className="text-gray-600 dark:text-slate-300">{email}</p>
          </div>
          <div className="flex gap-2">
            <Link className="btn-primary" to="/portal/courses">Browse Courses</Link>
            <Link className="btn-ghost" to="/portal/enrollments">My Enrollments</Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i)=>(<div key={i} className="card h-24 animate-pulse" />))}
        </div>
      ) : (
        <>
          <div className="card">
            <h3 className="font-semibold mb-3">Enrolled Courses</h3>
            {enrs.length ? (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {enrs.map(e => (
                  <li key={e.id} className="rounded-xl border border-gray-100 dark:border-slate-800 p-3">
                    <div className="font-medium">{e.course.title}</div>
                    <div className="text-sm text-gray-600 dark:text-slate-300">{e.course.code} • {e.course.credit} cr</div>
                  </li>
                ))}
              </ul>
            ) : <div className="text-gray-500">You’re not enrolled yet. <Link className="text-primary-600" to="/portal/courses">Enroll now</Link>.</div>}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Recent Grades</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead><tr><th>Course</th><th>Code</th><th>Grade</th></tr></thead>
                <tbody>
                  {myGrades.length ? myGrades.map((g,i)=>(
                    <tr key={i}><td>{g.course.title}</td><td>{g.course.code}</td><td>{g.grade}</td></tr>
                  )) : <tr><td colSpan={3} className="text-center text-gray-500 py-6">No grades yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">All Courses</h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">Total {allCourses.length}</p>
          </div>
        </>
      )}
    </section>
  )
}
