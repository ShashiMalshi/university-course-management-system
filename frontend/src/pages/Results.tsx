import { useEffect, useMemo, useState } from 'react'
import { getJSON } from '../shared/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

type Course = { id:number; title:string; code?:string; credit?:number }
type Enrollment = { id:number; studentEmail:string; course: Course }
type Result = { id:number; enrollment: Enrollment; grade?: string; updatedAt?: string }

const GRADES = ['A','B','C','D','E','F'] as const
const PASS_GRADES = new Set(['A','B','C','D']) // Treat A–D as pass for this assignment
const GPA4: Record<string, number> = { A:4, B:3, C:2, D:1, E:0, F:0 }
const GRADE_LABEL = (g?:string) => {
  const t = (g ?? '').trim().toUpperCase()
  return GRADES.includes(t as any) ? (t as typeof GRADES[number]) : 'N/A'
}
const PIE_COLORS = ['#10b981','#f43f5e'] // pass, fail
const GRADE_COLORS: Record<string,string> = { A:'#16a34a', B:'#22c55e', C:'#3b82f6', D:'#f59e0b', E:'#ef4444', F:'#dc2626', 'N/A':'#94a3b8' }

export default function Results(){
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // filters
  const [courseId, setCourseId] = useState<number | 'ALL'>('ALL')
  const [gradeFilter, setGradeFilter] = useState<'ALL' | typeof GRADES[number]>('ALL')
  const [q, setQ] = useState('') // search by student email

  useEffect(() => {
    getJSON<Result[]>('/results')
      .then(setResults)
      .catch(() => setError('No /results endpoint found — showing empty analytics.'))
      .finally(() => setLoading(false))
  }, [])

  // derived
  const courses = useMemo(() => {
    const map = new Map<number, Course>()
    for(const r of results){ if(r.enrollment?.course) map.set(r.enrollment.course.id, r.enrollment.course) }
    return [...map.values()].sort((a,b)=> (a.code ?? a.title).localeCompare(b.code ?? b.title))
  }, [results])

  const filtered = useMemo(() => {
    return results.filter(r => {
      if(courseId !== 'ALL' && r.enrollment?.course?.id !== courseId) return false
      const g = GRADE_LABEL(r.grade)
      if(gradeFilter !== 'ALL' && g !== gradeFilter) return false
      if(q && !r.enrollment?.studentEmail?.toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
  }, [results, courseId, gradeFilter, q])

  const buckets = useMemo(() => {
    const b: Record<string, number> = { A:0,B:0,C:0,D:0,E:0,F:0,'N/A':0 }
    for(const r of filtered){ b[GRADE_LABEL(r.grade)]++ }
    return Object.entries(b).map(([grade, count]) => ({ grade, count }))
  }, [filtered])

  const kpis = useMemo(() => {
    const total = filtered.length
    const pass = filtered.reduce((acc, r) => acc + (PASS_GRADES.has(GRADE_LABEL(r.grade)) ? 1 : 0), 0)
    const fail = total - pass
    // GPA (weighted by course.credit when available)
    let wSum = 0, w = 0
    for(const r of filtered){
      const g = GRADE_LABEL(r.grade)
      const credit = r.enrollment?.course?.credit ?? 1
      wSum += (GPA4[g] ?? 0) * credit
      w += credit
    }
    const gpa = w ? (wSum / w) : 0
    // courses covered
    const courseSet = new Set(filtered.map(r => r.enrollment?.course?.id).filter(Boolean) as number[])
    return { total, pass, fail, passRate: total ? (pass/total*100) : 0, gpa: Number.isFinite(gpa) ? gpa : 0, courses: courseSet.size }
  }, [filtered])

  const passFailData = useMemo(() => ([
    { name: 'Pass', value: kpis.pass },
    { name: 'Fail', value: kpis.fail },
  ]), [kpis.pass, kpis.fail])

  // CSV export
  const exportCSV = () => {
    const rows = [
      ['Result ID','Student Email','Course Code','Course Title','Credit','Grade','Updated At'],
      ...filtered.map(r => [
        r.id,
        r.enrollment?.studentEmail ?? '',
        r.enrollment?.course?.code ?? '',
        r.enrollment?.course?.title ?? '',
        r.enrollment?.course?.credit ?? '',
        GRADE_LABEL(r.grade),
        r.updatedAt ? new Date(r.updatedAt).toLocaleString() : ''
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section>
      <div className="page-header">
        <h2 className="section-title">Results Analytics</h2>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={exportCSV}>Export CSV</button>
          {error && <span className="badge badge-warn">{error}</span>}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500">Average GPA</p>
          <p className="text-3xl font-bold mt-1">{kpis.gpa.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Pass Rate</p>
          <p className="text-3xl font-bold mt-1">{kpis.passRate.toFixed(0)}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Graded Results</p>
          <p className="text-3xl font-bold mt-1">{kpis.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Courses Covered</p>
          <p className="text-3xl font-bold mt-1">{kpis.courses}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm font-medium">Course</label>
            <select className="input mt-1 w-full" value={String(courseId)} onChange={(e)=>setCourseId(e.target.value==='ALL'?'ALL':Number(e.target.value))}>
              <option value="ALL">All courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code ? `${c.code} — ${c.title}` : c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Grade</label>
            <select className="input mt-1 w-full" value={gradeFilter} onChange={(e)=>setGradeFilter(e.target.value as any)}>
              <option value="ALL">All</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Search by student email</label>
            <input className="input mt-1 w-full" placeholder="e.g. alice@example.com" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-3">Grade Distribution</h3>
          {loading ? (
            <div className="h-64 animate-pulse" />
          ) : (
            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                <BarChart data={buckets} margin={{ top: 10, right: 24, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8,8,0,0]}>
                    {buckets.map((b, i) => (
                      <Cell key={i} fill={GRADE_COLORS[b.grade] ?? '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Pass vs Fail</h3>
          {loading ? (
            <div className="h-64 animate-pulse" />
          ) : (
            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={passFailData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                    {passFailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Results table */}
      <div className="card mt-6 overflow-x-auto">
        <h3 className="font-semibold mb-3">All Results</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Student Email</th>
              <th>Course</th>
              <th>Credit</th>
              <th>Grade</th>
              <th>Updated</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:5}).map((_,i)=>(
                <tr key={i}><td colSpan={6}><div className="h-10 animate-pulse" /></td></tr>
              ))
            ) : filtered.length ? (
              filtered.map(r => {
                const g = GRADE_LABEL(r.grade)
                const course = r.enrollment?.course
                return (
                  <tr key={r.id}>
                    <td>{r.enrollment?.studentEmail}</td>
                    <td>{course?.code ? `${course.code} — ${course.title}` : course?.title}</td>
                    <td>{course?.credit ?? '-'}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: (GRADE_COLORS[g] || '#94a3b8') + '22',
                          color: GRADE_COLORS[g] || '#64748b',
                          borderColor: (GRADE_COLORS[g] || '#94a3b8') + '55'
                        }}
                      >
                        {g}
                      </span>
                    </td>
                    <td>{r.updatedAt ? new Date(r.updatedAt).toLocaleString() : '—'}</td>
                    <td className="text-gray-500">{r.id}</td>
                  </tr>
                )
              })
            ) : (
              <tr><td colSpan={6} className="text-center text-gray-500 py-6">No results match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
