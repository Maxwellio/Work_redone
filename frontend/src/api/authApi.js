import { request } from './http'

export async function login(username, password) {
  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }).toString(),
  })
}

export async function getCurrentUser() {
  const res = await request('/current-user', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (res.status === 401) return null
  if (!res.ok) throw new Error(`getCurrentUser failed: ${res.status}`)
  return res.json()
}

export async function logout() {
  const res = await request('/logout', {
    method: 'POST',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`logout failed: ${res.status}`)
  return res.json()
}
