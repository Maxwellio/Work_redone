import { getOperationGroups, getOperations } from './operationsApi'
import { getParty } from './partyApi'
import { getPreformTypes } from './preformApi'

let preformSettled = false
let preformList = []
let preformPromise = null

let partySettled = false
let partyList = []
let partyPromise = null

let operationGroupsSettled = false
let operationGroupsList = []
let operationGroupsPromise = null

let operationsAllSettled = false
let operationsAllList = []
let operationsAllPromise = null

/**
 * Статичные справочники: один успешный HTTP на сессию, дедуп параллельных вызовов.
 * Пустой массив с сервера кэшируется (preformSettled / partySettled).
 */
export async function ensurePreformTypes() {
  if (preformSettled) {
    return { ok: true, data: preformList }
  }
  if (!preformPromise) {
    const p = getPreformTypes()
      .then((data) => {
        preformList = Array.isArray(data) ? data : []
        preformSettled = true
        return { ok: true, data: preformList }
      })
      .catch((err) => {
        return {
          ok: false,
          error: err.message || 'Ошибка загрузки типов заготовок',
          data: [],
        }
      })
      .finally(() => {
        preformPromise = null
      })
    preformPromise = p
  }
  return preformPromise
}

export async function ensureParty() {
  if (partySettled) {
    return { ok: true, data: partyList }
  }
  if (!partyPromise) {
    const p = getParty()
      .then((data) => {
        partyList = Array.isArray(data) ? data : []
        partySettled = true
        return { ok: true, data: partyList }
      })
      .catch(() => {
        return { ok: false, data: [] }
      })
      .finally(() => {
        partyPromise = null
      })
    partyPromise = p
  }
  return partyPromise
}

/** Оба справочника успешно закешированы (для мгновенного отображения модалки). */
export function isOperationReferenceCacheWarm() {
  return operationGroupsSettled && operationsAllSettled
}

export async function ensureOperationGroups() {
  if (operationGroupsSettled) {
    return { ok: true, data: operationGroupsList }
  }
  if (!operationGroupsPromise) {
    const p = getOperationGroups()
      .then((data) => {
        operationGroupsList = Array.isArray(data) ? data : []
        operationGroupsSettled = true
        return { ok: true, data: operationGroupsList }
      })
      .catch((err) => {
        return {
          ok: false,
          error: err.message || 'Ошибка загрузки переходов',
          data: [],
        }
      })
      .finally(() => {
        operationGroupsPromise = null
      })
    operationGroupsPromise = p
  }
  return operationGroupsPromise
}

/** Полный список приёмов (без фильтра groupId на сервере). */
export async function ensureOperations() {
  if (operationsAllSettled) {
    return { ok: true, data: operationsAllList }
  }
  if (!operationsAllPromise) {
    const p = getOperations()
      .then((data) => {
        operationsAllList = Array.isArray(data) ? data : []
        operationsAllSettled = true
        return { ok: true, data: operationsAllList }
      })
      .catch((err) => {
        return {
          ok: false,
          error: err.message || 'Ошибка загрузки переходов',
          data: [],
        }
      })
      .finally(() => {
        operationsAllPromise = null
      })
    operationsAllPromise = p
  }
  return operationsAllPromise
}
