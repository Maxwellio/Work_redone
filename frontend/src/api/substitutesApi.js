import { buildQuery, request } from './http'

export async function getSubstitutes(search, userId) {
  const query = buildQuery({ search, userId })
  const res = await request(`/substitutes${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getSubstitutes failed: ${res.status}`)
  return res.json()
}

export async function saveSubstitute(payload) {
  const res = await request('/substitutes', {
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

export async function deleteSubstitute(id) {
  const res = await request(`/substitutes/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка удаления')
  }
}
