import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { GraduationCap, BookOpen, Users2, ClipboardList, BarChart3, Menu, Sun, Moon, Bell, Search, LogOut } from 'lucide-react'
import { useAuth } from '../shared/auth'

export default function MainLayout({ children }: PropsWithChildren) {
  const { user, signOut } = useAuth()
  const role = user?.role ?? 'STUDENT'
  const nav = useNavigate()

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/students', label: 'Students', icon: Users2 },
    { to: '/admin/enrollments', label: 'Enrollments', icon: ClipboardList },
    { to: '/admin/results', label: 'Results', icon: GraduationCap },
  ]
  const studentLinks = [
    { to: '/portal', label: 'Home', icon: BarChart3, end: true },
    { to: '/portal/courses', label: 'Courses', icon: BookOpen },
    { to: '/portal/enrollments', label: 'My Enrollments', icon: ClipboardList },
  ]
  const links = role === 'ADMIN' ? adminLinks : studentLinks

  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const t = localStorage.getItem('theme') === 'dark'
    setDark(t); document.documentElement.classList.toggle('dark', t)
  }, [])
  const toggleTheme = () => {
    const t = !dark; setDark(t)
    document.documentElement.classList.toggle('dark', t)
    localStorage.setItem('theme', t ? 'dark' : 'light')
  }
  const doSignOut = () => { signOut(); nav('/login') }

  return (
    <div className="min-h-screen flex relative">
      {open && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setOpen(false)} />}

        <aside
    className={`fixed md:static z-40 inset-y-0 left-0 w-72 text-white shadow-xl transform transition-transform
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    // old hardcoded colors → replaced with our brand-gradient class
    // style={{ background: 'linear-gradient(180deg, #3f37c9 0%, #4361ee 50%, #4cc9f0 100%)' }}
    >
    <div className="brand-gradient h-full">
        <div className="px-6 py-6 border-b border-white/10 flex items-center gap-3">
        <img src="/logo.svg" alt="UniCMS" className="w-8 h-8" />
        <div>
            <h1 className="text-2xl font-bold tracking-tight">UniCMS</h1>
            <p className="text-white/70 text-xs">{role === 'ADMIN' ? 'Admin Console' : 'Student Portal'}</p>
        </div>
        </div>
        <nav className="px-3 py-4 space-y-1">
        {links.map(({to,label,icon:Icon,end}) => (
            <NavLink key={to} to={to} end={end}
            className={({isActive}) => `navlink ${isActive ? 'navlink-active' : 'navlink-inactive'}`}
            onClick={() => setOpen(false)}
            >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
            </NavLink>
        ))}
        </nav>
    </div>
    </aside>


      <div className="flex-1 flex flex-col bg-glow">
        <header className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-gray-100 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="md:hidden btn-ghost" onClick={() => setOpen(true)}><Menu className="w-5 h-5" /></button>
              <div className="hidden md:block font-semibold text-gray-800 dark:text-slate-100">{role==='ADMIN'?'Admin':'Student'} mode</div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="field w-56 hidden sm:block">
                <span className="icon text-gray-400"><Search className="w-4 h-4" /></span>
                <input className="input" placeholder="Search…" />
              </div>
              <button className="icon-btn" aria-label="Notifications"><Bell className="w-5 h-5" /></button>
              <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="icon-btn" onClick={doSignOut} title="Sign out"><LogOut className="w-5 h-5" /></button>
            </div>
          </div>
        </header>

        <main className="flex-1 mx-auto max-w-7xl w-full p-6 lg:p-8">
          {/* Render nested route content OR children when provided */}
          {children ?? <Outlet />}
        </main>

        <footer className="mt-10 border-t border-gray-100 dark:border-slate-800 py-6 text-center text-sm text-gray-500 dark:text-slate-400">
          © {new Date().getFullYear()} UniCMS
        </footer>
      </div>
    </div>
  )
}
