import { useEffect, useRef } from 'react'

/**
 * После перезагрузки списка переходов выделяет целевую строку и прокручивает к ней.
 *
 * @param {object|null} pendingFocus — { kind: 'record', recordId, scrollBlock } | { kind: 'lastRow', scrollBlock }
 * @param {Array} rowsSorted
 * @param {boolean} loading
 * @param {(row: object) => number|string|null} getRecordId
 * @param {(row: object) => string|number} getRowKey
 * @param {(key: string|number|null) => void} setSelectedRowKey
 * @param {import('react').RefObject<HTMLElement>} tableContainerRef
 * @param {() => void} onHandled
 */
export function useTransitionListFocus({
  pendingFocus,
  rowsSorted,
  loading,
  getRecordId,
  getRowKey,
  setSelectedRowKey,
  tableContainerRef,
  onHandled,
}) {
  const onHandledRef = useRef(onHandled)
  onHandledRef.current = onHandled

  useEffect(() => {
    if (!pendingFocus || loading) return

    const timer = setTimeout(() => {
      let targetRow = null

      if (pendingFocus.kind === 'record' && pendingFocus.recordId != null) {
        targetRow = rowsSorted.find((row) => getRecordId(row) == pendingFocus.recordId)
      } else if (pendingFocus.kind === 'lastRow' && rowsSorted.length > 0) {
        targetRow = rowsSorted[rowsSorted.length - 1]
      }

      if (!targetRow) {
        onHandledRef.current?.()
        return
      }

      const recordId = getRecordId(targetRow)
      setSelectedRowKey(getRowKey(targetRow))

      const container = tableContainerRef?.current
      const element =
        container?.querySelector(`[data-transition-row-id="${recordId}"]`) ??
        document.querySelector(`[data-transition-row-id="${recordId}"]`)

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: pendingFocus.scrollBlock ?? 'nearest',
        })
      }

      onHandledRef.current?.()
    }, 100)

    return () => clearTimeout(timer)
  }, [pendingFocus, rowsSorted, loading, getRecordId, getRowKey, setSelectedRowKey, tableContainerRef])
}
