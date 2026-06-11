import { useCallback, useLayoutEffect, useRef, useState } from 'react'

function computeRange(scrollTop, viewportHeight, itemCount, itemHeight, overscan) {
  if (itemCount === 0 || itemHeight <= 0) {
    return { startIndex: 0, endIndex: 0, paddingTop: 0, paddingBottom: 0 }
  }

  const rawStart = Math.floor(scrollTop / itemHeight)
  const startIndex = Math.max(0, rawStart - overscan)
  const visibleCount = viewportHeight > 0 ? Math.ceil(viewportHeight / itemHeight) + 1 : 1
  const endIndex = Math.min(itemCount, rawStart + visibleCount + overscan)
  const paddingTop = startIndex * itemHeight
  const paddingBottom = Math.max(0, (itemCount - endIndex) * itemHeight)

  return { startIndex, endIndex, paddingTop, paddingBottom }
}

/**
 * Returns the scrollport height. When the container expands to fit virtualized
 * content, clientHeight can equal scrollHeight; reuse the last known scrollport.
 */
function measureScrollport(el, cachedHeightRef) {
  const clientHeight = el.clientHeight
  if (clientHeight <= 0) return cachedHeightRef.current

  const scrollHeight = el.scrollHeight

  if (scrollHeight > clientHeight) {
    cachedHeightRef.current = clientHeight
    return clientHeight
  }

  if (cachedHeightRef.current === 0) {
    cachedHeightRef.current = clientHeight
    return clientHeight
  }

  return cachedHeightRef.current
}

export function useVirtualRange(scrollRef, itemCount, itemHeight, overscan = 5) {
  const viewportHeightRef = useRef(0)
  const [range, setRange] = useState(() =>
    computeRange(0, 0, itemCount, itemHeight, overscan)
  )
  const rafRef = useRef(null)

  const updateRange = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const viewportHeight = measureScrollport(el, viewportHeightRef)
    setRange(computeRange(el.scrollTop, viewportHeight, itemCount, itemHeight, overscan))
  }, [scrollRef, itemCount, itemHeight, overscan])

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      updateRange()
    })
  }, [updateRange])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined

    updateRange()

    const raf1 = requestAnimationFrame(() => {
      updateRange()
      requestAnimationFrame(updateRange)
    })

    const onScroll = () => scheduleUpdate()

    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    const resizeObserver = new ResizeObserver(() => scheduleUpdate())
    resizeObserver.observe(el)

    return () => {
      cancelAnimationFrame(raf1)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scrollRef, updateRange, scheduleUpdate])

  useLayoutEffect(() => {
    updateRange()
  }, [itemCount, updateRange])

  return range
}
