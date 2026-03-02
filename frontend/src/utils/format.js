export function getRowId(row, activeTab) {
  if (activeTab === 0) return row.idSubstitutePrepared
  if (activeTab === 1 || activeTab === 2) return row.idFiting
  return row.idHydrotest
}

export function formatCell(value) {
  if (value == null) return '—'
  if (typeof value === 'number' || typeof value === 'string') return String(value)
  return String(value)
}

export function parseNum(value) {
  if (value === '' || value == null) return null
  const number = Number(value)
  return Number.isNaN(number) ? null : number
}
