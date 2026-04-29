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

export async function changePassword(oldPassword, newPassword) {
  const res = await request('/user/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  })

  if (!res.ok) {
    let message = `changePassword failed: ${res.status}`
    try {
      const data = await res.json()
      if (data?.error) {
        message = data.error
      }
    } catch (_) {
      // ignore parse errors for non-json responses
    }
    throw new Error(message)
  }

  return res.json()
}
