import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../shared/auth'
import { getJSON } from '../../shared/api'
import { useToast } from '../../components/Toast'

type Course = { id:number; code:string; title:string; credit:number; lecturerName:string }
type Enrollment = { id:number; studentEmail:string; course: Course }

async function fetchEnrollments(email:string){
  try { return await getJSON<Enrollment[]>(`/enrollments?studentEmail=${encodeURIComponent(email)}`) }
  catch { return await getJSON<Enrollment[]>(`/me/enrollments?studentEmail=${encodeURIComponent(email)}`) }
}

export default function StudentCourses(){
  const { user } = useAuth()
  const email = user?.email || ''
  const { push } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [my, setMy] = useState<Enrollment[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = () => Promise.all([
    getJSON<Course[]>('/courses').catch(()=>[]),
    email ? fetchEnrollments(email).catch(()=>[]) : Promise.resolve([])
  ]).then(([c,e]) => { setCourses(c); setMy(e) }).finally(()=>setLoading(false))

  useEffect(() => { reload() }, [email])

  const enrolledCourseIds = new Set(my.map(e => e.course.id))
  const filtered = useMemo(()=>courses.filter(c => (c.code+' '+c.title+' '+c.lecturerName).toLowerCase().includes(q.toLowerCase())), [courses,q])

  const enroll = async (courseId:number) => {
    try {
      await fetch(`${import.meta.env.VITE_API ?? 'http://localhost:8080/api/v1'}/enrollments?studentEmail=${encodeURIComponent(email)}&courseId=${courseId}`, { method: 'POST' })
      push({ type:'success', message:'Enrolled' }); reload()
    } catch (e:any) {
      push({ type:'error', message: e?.message || 'Failed to enroll' })
    }
  }

  // Optional: if backend supports DELETE /enrollments/:id
  const unenroll = async (courseId:number) => {
    const enr = my.find(e => e.course.id === courseId)
    if(!enr) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API ?? 'http://localhost:8080/api/v1'}/enrollments/${enr.id}`, { method: 'DELETE' })
      if(!res.ok) throw new Error(await res.text())
      push({ type:'success', message:'Unenrolled' }); reload()
    } catch (e:any) {
      push({ type:'error', message: e?.message || 'Unenroll not supported' })
    }
  }

  return (
    <section>
      <div className="page-header">
        <h2 className="section-title">Browse Courses</h2>
        <input className="input w-64" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=>(<div key={i} className="card h-36 animate-pulse" />))}</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(c => {
            const enrolled = enrolledCourseIds.has(c.id)
            return (
              <div key={c.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">{c.code} • {c.credit} credits</p>
                    <p className="mt-1">Lecturer: {c.lecturerName}</p>
                  </div>
                  <span className={`badge ${enrolled ? 'badge-ok' : 'badge-info'}`}>{enrolled ? 'Enrolled' : 'Open'}</span>
                </div>
                <div className="mt-4">
                  {enrolled ? (
                    <button className="btn-ghost" onClick={()=>unenroll(c.id)}>Unenroll</button>
                  ) : (
                    <button className="btn-primary" onClick={()=>enroll(c.id)}>Enroll</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
