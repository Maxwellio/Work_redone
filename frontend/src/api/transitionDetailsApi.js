import { request } from './http'

async function handleSaveResponse(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Ошибка сохранения')
  }
  return res.json()
}

/**
 * @param {object} payload — поля MakeSubstituteDetailSaveDto; id для редактирования
 */
export async function saveSubstituteDetail(payload) {
  const id = payload.id
  const isUpdate = id != null && id > 0
  const path = isUpdate ? `/substitute-details/${id}` : '/substitute-details'
  const method = isUpdate ? 'PUT' : 'POST'
  const body = { ...payload }
  if (!isUpdate) {
    delete body.id
  }
  const res = await request(path, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  return handleSaveResponse(res)
}

/**
 * @param {object} payload — поля FitingDetailSaveDto; id для редактирования
 */
export async function saveFittingDetail(payload) {
  const id = payload.id
  const isUpdate = id != null && id > 0
  const path = isUpdate ? `/fitting-details/${id}` : '/fitting-details'
  const method = isUpdate ? 'PUT' : 'POST'
  const body = { ...payload }
  if (!isUpdate) {
    delete body.id
  }
  const res = await request(path, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  return handleSaveResponse(res)
}
