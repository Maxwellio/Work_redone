import { getParty } from './partyApi'
import { getPreformTypes } from './preformApi'

let preformSettled = false
let preformList = []
let preformPromise = null

let partySettled = false
let partyList = []
let partyPromise = null

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
