import { request } from './http'

export async function getParty() {
  const res = await request('/party', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getParty failed: ${res.status}`)
  return res.json()
}
