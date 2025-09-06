import { useEffect, useState } from 'react'
import { getJSON, postVoid } from '../shared/api'

type Course = { id:number; title:string }
type Enrollment = { id:number; studentEmail:string; course: Course }
type Student = { id:number; name:string; email:string; studentId: string }

export default function Enrollments(){
  const [students, setStudents] = useState<Student[]>([])
  const [selectedEmail, setSelectedEmail] = useState('')
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJSON<Student[]>('/students').then(s => { setStudents(s); if(s[0]) setSelectedEmail(s[0].email) }).catch(()=>setStudents([]))
  }, [])

  useEffect(() => {
    if(!selectedEmail) return
    setLoading(true)
    getJSON<Enrollment[]>(`/me/enrollments?studentEmail=${encodeURIComponent(selectedEmail)}`)
      .then(setEnrollments).catch(()=>setEnrollments([])).finally(()=>setLoading(false))
  }, [selectedEmail])

  const assignGrade = async (enrollmentId:number, grade:string) => {
    if(!grade) return
    await postVoid(`/results?enrollmentId=${enrollmentId}&grade=${grade}`)
  }

  return (
    <section>
      <h2 className="section-title">Enrollments & Grades</h2>

      <div className="flex flex-col mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2">Select Student</label>
        <select className="input" value={selectedEmail} onChange={e=>setSelectedEmail(e.target.value)}>
            {students.map(s => <option key={s.id} value={s.email}>{s.name} ({s.email})</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr><th>Student Id</th><th>Course</th><th>Assign Grade</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:4}).map((_,i)=>(
                <tr key={i}><td colSpan={3}><div className="h-10 animate-pulse" /></td></tr>
              ))
            ) : (
              enrollments.map(e => (
                <tr key={e.id}>
                  <td>{students.find(s => s.email === e.studentEmail)?.studentId ?? e.studentEmail}</td>
                  <td>{e.course.title}</td>
                  <td>
                    <select className="input" defaultValue="" onChange={ev=>assignGrade(e.id, ev.target.value)}>
                      <option value="" disabled>Select</option>
                      {["A","B","C","D","E","F"].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
