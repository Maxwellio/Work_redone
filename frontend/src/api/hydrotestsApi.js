import { buildQuery, request } from './http'

export async function getHydrotests(search, userId, yearMonth) {
  const query = buildQuery({ search, userId, yearMonth })
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

/** @param {{ id: number | null, d: number | null, l: number | null, th: number | null, testtime: number | null, mass: number | null, l1: number | null, l2: number | null }} payload */
export async function calcHydroNvForm(payload) {
  const res = await request('/hydrotests/calc-nv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка расчёта нормы времени')
  }
  return res.json()
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

export async function copyHydrotest(id, userId) {
  const query = buildQuery({ userId })
  const res = await request(`/hydrotests/${id}/copy${query}`, {
    method: 'POST',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка копирования')
  }
}
