import { requestJson } from '../../../api/http'

export function fetchAdminRoles() {
  return requestJson('/admin/roles')
}

export function fetchAdminOrgStruct() {
  return requestJson('/admin/organizations/struct')
}
