import { buildQuery, request } from './http'

export async function getOperationGroups() {
  const res = await request('/operation-groups', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getOperationGroups failed: ${res.status}`)
  return res.json()
}

export async function getOperations(groupId) {
  const query = buildQuery({ groupId })
  const res = await request(`/operations${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getOperations failed: ${res.status}`)
  return res.json()
}
