import { request } from './http'

export async function getPreformTypes() {
  const res = await request('/preform-types', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getPreformTypes failed: ${res.status}`)
  return res.json()
}
