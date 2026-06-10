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

export function useVirtualRange(scrollRef, itemCount, itemHeight, overscan = 5) {
  const [range, setRange] = useState(() =>
    computeRange(0, 0, itemCount, itemHeight, overscan)
  )
  const rafRef = useRef(null)

  const updateRange = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setRange(computeRange(el.scrollTop, el.clientHeight, itemCount, itemHeight, overscan))
  }, [scrollRef, itemCount, itemHeight, overscan])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined

    updateRange()

    const onScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        updateRange()
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    const resizeObserver = new ResizeObserver(() => updateRange())
    resizeObserver.observe(el)

    return () => {
      el.removeEventListener('scroll', onScroll)
      resizeObserver.disconnect()
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scrollRef, updateRange])

  useLayoutEffect(() => {
    updateRange()
  }, [itemCount, updateRange])

  return range
}
