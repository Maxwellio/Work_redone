import { request } from './http'

function getReportPath(activeTab, selectedRowId) {
  if (activeTab === 0) return `/downloadReportSub?id=${selectedRowId}`
  if (activeTab === 1 || activeTab === 2) return `/downloadReportFit?id=${selectedRowId}`
  return `/downloadReportHydro?id=${selectedRowId}`
}

function getFilenameFromDisposition(disposition) {
  if (!disposition) return 'report.pdf'
  const match = disposition.match(/filename="?([^";\n]+)"?/i)
  return match ? match[1].trim() : 'report.pdf'
}

export async function downloadReport(activeTab, selectedRowId) {
  const path = getReportPath(activeTab, selectedRowId)
  const res = await request(path, { method: 'GET' })
  if (!res.ok) throw new Error('Ошибка загрузки отчёта')

  const blob = await res.blob()
  const filename = getFilenameFromDisposition(res.headers.get('Content-Disposition'))
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
