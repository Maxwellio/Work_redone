import { requestJson } from '../../../api/http'

/** @returns {Promise<object[]>} GET /api/admin/users */
export function fetchAdminUsers() {
  return requestJson('/admin/users')
}
