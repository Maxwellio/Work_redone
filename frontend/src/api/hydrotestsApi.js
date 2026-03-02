import { buildQuery, request } from './http'

export async function getHydrotests(search, userId) {
  const query = buildQuery({ search, userId })
  const res = await request(`/hydrotests${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getHydrotests failed: ${res.status}`)
  return res.json()
}

export async function saveHydrotest(payload) {
  const res = await request('/hydrotests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка сохранения')
  }
  return res.json()
}

export async function calcHydroTime(id) {
  const res = await request(`/hydrotests/${id}/calc-time`, {
    method: 'POST',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка расчёта')
  }
}

export async function deleteHydrotest(id) {
  const res = await request(`/hydrotests/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка удаления')
  }
}
