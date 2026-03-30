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
 * Большая форма: операции 13–39.
 */
export function isLargeFormOperationId(id) {
  if (id == null || !Number.isFinite(Number(id))) return false
  const n = Number(id)
  if (!Number.isInteger(n)) return false
  return n >= 13 && n <= 39
}
