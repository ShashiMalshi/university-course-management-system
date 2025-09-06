import { useEffect, useMemo, useState } from 'react'
import { getJSON, postJSON, putJSON, delVoid } from '../shared/api'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

type Course = { id:number; code:string; title:string; credit:number; lecturerName:string }

export default function Courses(){
  const [courses, setCourses] = useState<Course[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  // Create modal
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ code:'', title:'', credit:3, lecturerName:'' })
  const [errors, setErrors] = useState<{[k:string]:string}>({})

  // Edit modal
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ code:'', title:'', credit:3, lecturerName:'' })

  // Delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { push } = useToast()

  const reload = () =>
    getJSON<Course[]>('/courses')
      .then(data => setCourses(data))
      .catch(()=>setCourses([]))
      .finally(()=>setLoading(false))

  useEffect(() => { reload() }, [])

  const filtered = useMemo(
    () => courses.filter(c => (c.code+' '+c.title+' '+c.lecturerName).toLowerCase().includes(q.toLowerCase())),
    [courses,q]
  )

  const validate = (f = form) => {
    const e: {[k:string]:string} = {}
    if(!f.code.trim()) e.code = 'Code is required'
    if(!f.title.trim()) e.title = 'Title is required'
    if(!f.lecturerName.trim()) e.lecturerName = 'Lecturer is required'
    if(!Number.isFinite(f.credit) || f.credit < 1) e.credit = 'Credit must be positive'
    setErrors(e); return Object.keys(e).length === 0
  }

  const submit = async () => {
    if(!validate()) { push({ type:'error', message:'Please fix form errors' }); return }
    try {
      await postJSON('/admin/courses', form)
      push({ type:'success', message:'Course created' })
      setForm({ code:'', title:'', credit:3, lecturerName:'' })
      setOpen(false); reload()
    } catch (e:any) {
      push({ type:'error', message: e?.message || 'Failed to create course' })
    }
  }

  const openEdit = (c: Course) => {
    setEditId(c.id)
    setEditForm({ code:c.code, title:c.title, credit:c.credit, lecturerName:c.lecturerName })
    setEditOpen(true)
  }

  const submitEdit = async () => {
    if(editId == null) return
    if(!validate(editForm)) { push({ type:'error', message:'Please fix form errors' }); return }
    try {
      await putJSON(`/admin/courses/${editId}`, editForm)
      push({ type:'success', message:'Course updated' })
      setEditOpen(false); setEditId(null); reload()
    } catch (e:any) {
      push({ type:'error', message: e?.message || 'Failed to update course' })
    }
  }

  const confirmDelete = (id:number) => { setDeleteId(id); setConfirmOpen(true) }
  const doDelete = async () => {
    if(deleteId == null) return
    try {
      await delVoid(`/admin/courses/${deleteId}`)
      push({ type:'success', message:'Course deleted' })
      setConfirmOpen(false); setDeleteId(null); reload()
    } catch (e:any) {
      push({ type:'error', message: e?.message || 'Failed to delete course' })
    }
  }

  return (
    <section>
      <div className="page-header">
        <h2 className="section-title">Courses</h2>
        <div className="flex items-center gap-2">
          <input className="input w-56" placeholder="Search courses…" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn-secondary" onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> New</button>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i)=>(<div key={i} className="card h-36 animate-pulse" />))}
        </div>
      ) : filtered.length ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(c => (
            <div key={c.id} className="card group">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">{c.code} • {c.credit} credits</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="icon-btn" title="Edit" onClick={()=>openEdit(c)}><Pencil className="w-4 h-4" /></button>
                  <button className="icon-btn text-danger-600 hover:text-danger-700" title="Delete" onClick={()=>confirmDelete(c.id)}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="mt-2">Lecturer: {c.lecturerName}</p>
              <div className="mt-3 flex gap-2">
                <span className="badge badge-info">Course</span>
                <span className="badge badge-ok">{c.credit} credits</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No matching courses.</p>
      )}

      {/* Create */}
      <Modal open={open} title="New Course" onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Code</label>
            <input className="input mt-1 w-full" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} />
            {errors.code && <p className="text-danger-600 text-sm mt-1">{errors.code}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Title</label>
            <input className="input mt-1 w-full" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
            {errors.title && <p className="text-danger-600 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Credit</label>
            <input type="number" min={1} className="input mt-1 w-full" value={form.credit} onChange={e=>setForm({...form, credit:Number(e.target.value)})} />
            {errors.credit && <p className="text-danger-600 text-sm mt-1">{errors.credit}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Lecturer</label>
            <input className="input mt-1 w-full" value={form.lecturerName} onChange={e=>setForm({...form, lecturerName:e.target.value})} />
            {errors.lecturerName && <p className="text-danger-600 text-sm mt-1">{errors.lecturerName}</p>}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button className="btn-ghost" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={submit}>Create</button>
        </div>
      </Modal>

      {/* Edit */}
      <Modal open={editOpen} title="Edit Course" onClose={() => setEditOpen(false)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Code</label>
            <input className="input mt-1 w-full" value={editForm.code} onChange={e=>setEditForm({...editForm, code:e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium">Title</label>
            <input className="input mt-1 w-full" value={editForm.title} onChange={e=>setEditForm({...editForm, title:e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium">Credit</label>
            <input type="number" min={1} className="input mt-1 w-full" value={editForm.credit} onChange={e=>setEditForm({...editForm, credit:Number(e.target.value)})} />
          </div>
          <div>
            <label className="text-sm font-medium">Lecturer</label>
            <input className="input mt-1 w-full" value={editForm.lecturerName} onChange={e=>setEditForm({...editForm, lecturerName:e.target.value})} />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button className="btn-ghost" onClick={()=>setEditOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={submitEdit}>Save</button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={confirmOpen} title="Delete Course" onClose={() => setConfirmOpen(false)}>
        <p>Are you sure you want to delete this course? This action cannot be undone.</p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button className="btn-ghost" onClick={()=>setConfirmOpen(false)}>Cancel</button>
          <button className="btn-danger" onClick={doDelete}>Delete</button>
        </div>
      </Modal>
    </section>
  )
}
