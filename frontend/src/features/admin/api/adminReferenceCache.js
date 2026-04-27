import { fetchAdminOrgStruct, fetchAdminRoles } from './adminReferences'

let rolesSettled = false
let rolesList = []
let rolesPromise = null

let orgStructSettled = false
let orgStructList = []
let orgStructPromise = null

/**
 * Статичные справочники админки: один успешный HTTP на сессию, дедуп параллельных вызовов.
 * При ошибке сети флаг settled не выставляется (можно повторить запрос).
 */
export async function ensureAdminRoles() {
  if (rolesSettled) {
    return { ok: true, data: rolesList }
  }
  if (!rolesPromise) {
    const p = fetchAdminRoles()
      .then((data) => {
        rolesList = Array.isArray(data) ? data : []
        rolesSettled = true
        return { ok: true, data: rolesList }
      })
      .catch((err) => {
        return {
          ok: false,
          error: err.message || 'Не удалось загрузить роли',
          data: [],
        }
      })
      .finally(() => {
        rolesPromise = null
      })
    rolesPromise = p
  }
  return rolesPromise
}

export async function ensureAdminOrgStruct() {
  if (orgStructSettled) {
    return { ok: true, data: orgStructList }
  }
  if (!orgStructPromise) {
    const p = fetchAdminOrgStruct()
      .then((data) => {
        orgStructList = Array.isArray(data) ? data : []
        orgStructSettled = true
        return { ok: true, data: orgStructList }
      })
      .catch((err) => {
        return {
          ok: false,
          error: err.message || 'Не удалось загрузить подразделения',
          data: [],
        }
      })
      .finally(() => {
        orgStructPromise = null
      })
    orgStructPromise = p
  }
  return orgStructPromise
}
