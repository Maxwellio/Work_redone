const ID_KEYS = new Set(['idSubstitutePrepared', 'idFiting', 'idHydrotest'])

function isEmpty(value) {
  return value == null || value === ''
}

function getCellValue(row, col) {
  return col.getValue ? col.getValue(row) : row[col.key]
}

function compareValues(a, b, sortField) {
  const aEmpty = isEmpty(a)
  const bEmpty = isEmpty(b)
  if (aEmpty && bEmpty) return 0
  if (aEmpty) return 1
  if (bEmpty) return -1

  if (ID_KEYS.has(sortField)) {
    return Number(a) - Number(b)
  }

  if (sortField === 'createdAt') {
    return Date.parse(a) - Date.parse(b)
  }

  return String(a).localeCompare(String(b), 'ru', { numeric: true, sensitivity: 'base' })
}

export function sortListData(rows, sortField, sortDirection, columns) {
  if (!sortField || !Array.isArray(rows) || rows.length === 0) {
    return rows
  }

  const col = columns.find((c) => c.key === sortField)
  if (!col) {
    return rows
  }

  const direction = sortDirection === 'desc' ? -1 : 1

  return [...rows].sort((rowA, rowB) => {
    const valueA = sortField === 'createdAt' ? rowA.createdAt : getCellValue(rowA, col)
    const valueB = sortField === 'createdAt' ? rowB.createdAt : getCellValue(rowB, col)
    return compareValues(valueA, valueB, sortField) * direction
  })
}
