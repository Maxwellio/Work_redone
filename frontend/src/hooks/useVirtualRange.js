import { useCallback, useLayoutEffect, useRef, useState } from 'react'

function computeRange(scrollTop, viewportHeight, itemCount, itemHeight, overscan) {
  if (itemCount === 0 || itemHeight <= 0) {
    return { startIndex: 0, endIndex: 0, paddingTop: 0, paddingBottom: 0 }
  }

  const rawStart = Math.floor(scrollTop / itemHeight)
  const startIndex = Math.max(0, rawStart - overscan)
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + 1
  const endIndex = Math.min(itemCount, rawStart + visibleCount + overscan)
  const paddingTop = startIndex * itemHeight
  const paddingBottom = Math.max(0, (itemCount - endIndex) * itemHeight)

  return { startIndex, endIndex, paddingTop, paddingBottom }
}

/**
 * Принимает сам DOM-элемент (из состояния), а не ref-объект: эффект должен
 * перезапускаться, когда контейнер реально появляется в DOM. С ref-объектом
 * перезапуска не происходит, и без StrictMode (prod-сборка) подписка на scroll
 * могла не установиться вовсе.
 */
export function useVirtualRange(scrollEl, itemCount, itemHeight, overscan = 5) {
  const [range, setRange] = useState(() =>
    computeRange(0, 0, itemCount, itemHeight, overscan)
  )
  const rafRef = useRef(null)

  const updateRange = useCallback(() => {
    if (!scrollEl) return
    setRange(
      computeRange(scrollEl.scrollTop, scrollEl.clientHeight, itemCount, itemHeight, overscan)
    )
  }, [scrollEl, itemCount, itemHeight, overscan])

  useLayoutEffect(() => {
    if (!scrollEl) return undefined

    updateRange()

    const onScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        updateRange()
      })
    }

    scrollEl.addEventListener('scroll', onScroll, { passive: true })
    const resizeObserver = new ResizeObserver(() => updateRange())
    resizeObserver.observe(scrollEl)

    return () => {
      scrollEl.removeEventListener('scroll', onScroll)
      resizeObserver.disconnect()
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scrollEl, updateRange])

  return range
}
