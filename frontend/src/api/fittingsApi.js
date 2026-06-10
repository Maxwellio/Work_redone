import { buildQuery, request } from './http'

export async function getFittings(tip, search, userId, yearMonth) {
  const query = buildQuery({ tip, search, userId, yearMonth })
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

/** Связанные NTK для записи перехода (id_fiting_detail). */
export async function getFittingDetailNtk(idFitingDetail) {
  if (idFitingDetail == null) {
    return []
  }
  const res = await request(`/fitting-details/${idFitingDetail}/ntk`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getFittingDetailNtk failed: ${res.status}`)
  return res.json()
}

/** Список NTK для панели большой формы перехода; dStan на сервере по id фитинга. */
export async function getNtkForTransition(idFiting) {
  if (idFiting == null || idFiting === '') {
    return []
  }
  const query = buildQuery({ idFiting })
  const res = await request(`/ntk/for-transition${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getNtkForTransition failed: ${res.status}`)
  return res.json()
}
