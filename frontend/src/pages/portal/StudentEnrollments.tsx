import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../shared/auth'
import { getJSON } from '../../shared/api'

type Course = { id:number; code:string; title:string; credit:number; lecturerName:string }
type Enrollment = { id:number; studentEmail:string; course: Course }
type Result = { id:number; grade?:string; enrollment?: { id:number } }

async function fetchMyEnrollments(email:string){
  try { return await getJSON<Enrollment[]>(`/enrollments?studentEmail=${encodeURIComponent(email)}`) }
  catch { return await getJSON<Enrollment[]>(`/me/enrollments?studentEmail=${encodeURIComponent(email)}`) }
}

export default function StudentEnrollments(){
  const { user } = useAuth()
  const email = user?.email || ''
  const [rows, setRows] = useState<Enrollment[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(!email) return
    Promise.all([fetchMyEnrollments(email).catch(()=>[]), getJSON<Result[]>('/results').catch(()=>[])])
      .then(([e,r]) => { setRows(e); setResults(r) })
      .finally(()=>setLoading(false))
  }, [email])

  const gradeByEnr = useMemo(() => new Map(results.map(r => [r.enrollment?.id, r.grade ?? ''])), [results])

  return (
    <section>
      <h2 className="section-title">My Enrollments</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead><tr><th>Course</th><th>Code</th><th>Credits</th><th>Grade</th></tr></thead>
          <tbody>
            {loading ? (
              Array.from({length:4}).map((_,i)=>(<tr key={i}><td colSpan={4}><div className="h-10 animate-pulse" /></td></tr>))
            ) : rows.length ? (
              rows.map(e => (
                <tr key={e.id}>
                  <td>{e.course.title}</td>
                  <td>{e.course.code}</td>
                  <td>{e.course.credit}</td>
                  <td>{gradeByEnr.get(e.id) || '—'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center text-gray-500 py-6">No enrollments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
