/**
 * Соответствует patrubki.constants.OperationCategory.isSmallForm (Java).
 * Малая форма: операции 1–12 и 42–51.
 */
export function isSmallFormOperationId(id) {
  if (id == null || !Number.isFinite(Number(id))) return false
  const n = Number(id)
  if (!Number.isInteger(n)) return false
  if (n >= 1 && n <= 12) return true
  if (n >= 42 && n <= 51) return true
  return false
}

/**
 * Соответствует patrubki.constants.OperationCategory.isLargeForm (Java).
 * Большая форма: операции 13–39 и 56–60.
 */
export function isLargeFormOperationId(id) {
  if (id == null || !Number.isFinite(Number(id))) return false
  const n = Number(id)
  if (!Number.isInteger(n)) return false
  if (n >= 13 && n <= 39) return true
  if (n >= 56 && n <= 60) return true
  return false
}

/**
 * Соответствует patrubki.constants.OperationCategory.isAssignment (Java).
 * Присваивание: операции 40–41 и 52–55.
 */
export function isAssignmentOperationId(id) {
  if (id == null || !Number.isFinite(Number(id))) return false
  const n = Number(id)
  if (!Number.isInteger(n)) return false
  if (n >= 40 && n <= 41) return true
  if (n >= 52 && n <= 55) return true
  return false
}
