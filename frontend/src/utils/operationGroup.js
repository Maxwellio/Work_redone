export function getOperationsInSameGroup(allOperations, idOperations) {
  const current = allOperations.find((o) => o.idOperations === idOperations)
  if (!current?.idGroupOperations) return current ? [current] : []
  return allOperations
    .filter((o) => o.idGroupOperations === current.idGroupOperations)
    .sort((a, b) => (a.idOperations ?? 0) - (b.idOperations ?? 0))
}
