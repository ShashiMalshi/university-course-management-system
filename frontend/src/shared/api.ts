const API = import.meta.env.VITE_API ?? 'http://localhost:8080/api/v1'

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as T
}

export async function getJSON<T=any>(path: string): Promise<T> {
  return handle<T>(await fetch(`${API}${path}`))
}

export async function postJSON<T=any>(path: string, body: any): Promise<T> {
  return handle<T>(await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }))
}

export async function postVoid(path: string): Promise<void> {
  const res = await fetch(`${API}${path}`, { method: 'POST' })
  if (!res.ok) throw new Error(await res.text())
}

export async function putJSON<T=any>(path: string, body: any): Promise<T> {
  return handle<T>(await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }))
}

export async function delVoid(path: string): Promise<void> {
  const res = await fetch(`${API}${path}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}
