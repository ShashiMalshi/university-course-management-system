import { useEffect, useMemo, useState } from 'react'
import { getJSON, postJSON, putJSON, delVoid } from '../shared/api'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

type Student = { id:number; name:string; studentId:string; email:string }

export default function Students(){
  const [students, setStudents] = useState<Student[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name:'', studentId:'', email:'' })
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name:'', studentId:'', email:'' })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { push } = useToast()

  const reload = () =>
    getJSON<Student[]>('/students')
      .then(setStudents)
      .catch(()=>setStudents([]))
      .finally(()=>setLoading(false))

  useEffect(() => { reload() }, [])

  const filtered = useMemo(
    () => students.filter(s => (s.name+' '+s.studentId+' '+s.email).toLowerCase().includes(q.toLowerCase())),
    [students,q]
  )

  const create = async () => {
    if(!form.name.trim() || !form.studentId.trim() || !form.email.trim()){
      push({ type:'error', message:'Fill all fields' }); return
    }
    try {
      await postJSON('/admin/students', form)
      push({ type:'success', message:'Student added' })
      setForm({ name:'', studentId:'', email:'' }); setOpen(false); reload()
    } catch (e:any) {
      push({ type:'error', message: e?.message || 'Failed to add student' })
    }
  }

  const openEdit = (s: Student) => {
    setEditId(s.id)
    setEditForm({ name:s.name, studentId:s.studentId, email:s.email })
    setEditOpen(true)
  }

  const saveEdit = async () => {
    if(editId == null) return
    if(!editForm.name.trim() || !editForm.studentId.trim() || !editForm.email.trim()){
      push({ type:'error', message:'Fill all fields' }); return
    }
    try {
      await putJSON(`/admin/students/${editId}`, editForm)
      push({ type:'success', message:'Student updated' })
      setEditOpen(false); setEditId(null); reload()
    } catch (e:any) {
      push({ type:'error', message: e?.message || 'Failed to update student' })
    }
  }

  const confirmDelete = (id:number) => { setDeleteId(id); setConfirmOpen(true) }
  const doDelete = async () => {
    if(deleteId == null) return
    try {
      await delVoid(`/admin/students/${deleteId}`)
      push({ type:'success', message:'Student deleted' })
      setConfirmOpen(false); setDeleteId(null); reload()
    } catch (e:any) {
      push({ type:'error', message: e?.message || 'Failed to delete student' })
    }
  }

  return (
    <section>
      <div className="page-header">
        <h2 className="section-title">Students</h2>
        <div className="flex items-center gap-2">
          <input className="input w-64" placeholder="Search students…" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn-secondary" onClick={()=>setOpen(true)}><Plus className="w-4 h-4" /> New</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Student ID</th><th>Email</th><th className="w-32">Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:4}).map((_,i)=>(
                <tr key={i}><td colSpan={4}><div className="h-10 animate-pulse" /></td></tr>
              ))
            ) : filtered.length ? (
              filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.studentId}</td>
                  <td>{s.email}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="icon-btn" title="Edit" onClick={()=>openEdit(s)}><Pencil className="w-4 h-4" /></button>
                      <button className="icon-btn text-danger-600 hover:text-danger-700" title="Delete" onClick={()=>confirmDelete(s.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center text-gray-500 py-6">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create */}
      <Modal open={open} title="New Student" onClose={()=>setOpen(false)}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="text-sm font-medium">Name</label><input className="input mt-1 w-full" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
          <div><label className="text-sm font-medium">Student ID</label><input className="input mt-1 w-full" value={form.studentId} onChange={e=>setForm({...form, studentId:e.target.value})}/></div>
          <div className="sm:col-span-2"><label className="text-sm font-medium">Email</label><input className="input mt-1 w-full" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button className="btn-ghost" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={create}>Create</button>
        </div>
      </Modal>

      {/* Edit */}
      <Modal open={editOpen} title="Edit Student" onClose={()=>setEditOpen(false)}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="text-sm font-medium">Name</label><input className="input mt-1 w-full" value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})}/></div>
          <div><label className="text-sm font-medium">Student ID</label><input className="input mt-1 w-full" value={editForm.studentId} onChange={e=>setEditForm({...editForm, studentId:e.target.value})}/></div>
          <div className="sm:col-span-2"><label className="text-sm font-medium">Email</label><input className="input mt-1 w-full" value={editForm.email} onChange={e=>setEditForm({...editForm, email:e.target.value})}/></div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button className="btn-ghost" onClick={()=>setEditOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={saveEdit}>Save</button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={confirmOpen} title="Delete Student" onClose={()=>setConfirmOpen(false)}>
        <p>Are you sure you want to delete this student?</p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button className="btn-ghost" onClick={()=>setConfirmOpen(false)}>Cancel</button>
          <button className="btn-danger" onClick={doDelete}>Delete</button>
        </div>
      </Modal>
    </section>
  )
}
