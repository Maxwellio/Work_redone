import { requestJson } from '../../../api/http'

/** @returns {Promise<object[]>} GET /api/admin/users */
export function fetchAdminUsers() {
  return requestJson('/admin/users')
}

/** @param {object} payload @returns {Promise<{id:number}>} POST /api/admin/users/save */
export function saveAdminUser(payload) {
  return requestJson('/admin/users/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
