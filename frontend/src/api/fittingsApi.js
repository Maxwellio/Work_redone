import { buildQuery, request } from './http'

export async function getFittings(tip, search, userId) {
  const query = buildQuery({ tip, search, userId })
  const res = await request(`/fittings${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getFittings failed: ${res.status}`)
  return res.json()
}

export async function saveFitting(payload) {
  const res = await request('/fittings', {
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

export async function deleteFitting(id) {
  const res = await request(`/fittings/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка удаления')
  }
}
