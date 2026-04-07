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

export async function calcFitTime(id) {
  const res = await request(`/fittings/${id}/calc-time`, {
    method: 'POST',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка расчёта')
  }
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

export async function getFittingDetails(idFiting) {
  const res = await request(`/fittings/${idFiting}/details`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getFittingDetails failed: ${res.status}`)
  return res.json()
}

/** Список NTK для панели большой формы перехода (труба/патрубок), по станочному диаметру. */
export async function getNtkForTransition(dStan) {
  if (dStan == null || dStan === '') {
    return []
  }
  const query = buildQuery({ dStan })
  const res = await request(`/ntk/for-transition${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getNtkForTransition failed: ${res.status}`)
  return res.json()
}
