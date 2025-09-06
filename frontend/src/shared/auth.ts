import { useEffect, useState } from 'react'

export type Role = 'ADMIN' | 'STUDENT'
export type User = { email: string; role: Role; name?: string }

const KEY = 'unicms:user'

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch { return null }
}

export function setUser(user: User | null) {
  if (user) localStorage.setItem(KEY, JSON.stringify(user))
  else localStorage.removeItem(KEY)
  window.dispatchEvent(new StorageEvent('storage', { key: KEY }))
}

export function useAuth() {
  const [user, set] = useState<User | null>(getUser())
  useEffect(() => {
    const h = () => set(getUser())
    window.addEventListener('storage', h)
    return () => window.removeEventListener('storage', h)
  }, [])
  return { user, signIn: (u: User) => setUser(u), signOut: () => setUser(null) }
}
