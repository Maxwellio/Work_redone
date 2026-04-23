import { requestJson } from '../../../api/http'

export function fetchAdminRoles() {
  return requestJson('/admin/roles')
}

export function fetchAdminOrgChoices() {
  return requestJson('/admin/organizations/choices')
}
