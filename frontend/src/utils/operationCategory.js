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

/** Большая форма: irazm участвует в расчёте только для операций 13, 38, 39. */
export function isIrazmUsedInLargeFormCalc(id) {
  if (id == null || !Number.isFinite(Number(id))) return false
  const n = Number(id)
  if (!Number.isInteger(n)) return false
  return n === 13 || n === 38 || n === 39
}

/** Большая форма: valueMeas участвует в расчёте для 14–17, 28–37, 59, 60. */
export function isValueMeasUsedInLargeFormCalc(id) {
  if (id == null || !Number.isFinite(Number(id))) return false
  const n = Number(id)
  if (!Number.isInteger(n)) return false
  if (n >= 14 && n <= 17) return true
  if (n >= 28 && n <= 37) return true
  return n === 59 || n === 60
}
