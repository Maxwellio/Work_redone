import { useCallback, useLayoutEffect, useRef, useState } from 'react'

function computeRange(scrollTop, viewportHeight, itemCount, itemHeight, overscan) {
  if (itemCount === 0 || itemHeight <= 0) {
    return { startIndex: 0, endIndex: 0, paddingTop: 0 }
  }

  const rawStart = Math.floor(scrollTop / itemHeight)
  const startIndex = Math.max(0, rawStart - overscan)
  const visibleCount = viewportHeight > 0 ? Math.ceil(viewportHeight / itemHeight) + 1 : 1
  const endIndex = Math.min(itemCount, rawStart + visibleCount + overscan)
  const paddingTop = startIndex * itemHeight

  return { startIndex, endIndex, paddingTop }
}

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

export function useVirtualRange(scrollElement, itemCount, itemHeight, overscan = 5) {
  const viewportHeightRef = useRef(0)
  const [range, setRange] = useState(() =>
    computeRange(0, 0, itemCount, itemHeight, overscan)
  )
  const rafRef = useRef(null)

  const updateRange = useCallback(() => {
    if (!scrollElement) return
    const viewportHeight = measureScrollport(scrollElement, viewportHeightRef)
    setRange(
      computeRange(
        scrollElement.scrollTop,
        viewportHeight,
        itemCount,
        itemHeight,
        overscan
      )
    )
  }, [scrollElement, itemCount, itemHeight, overscan])

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      updateRange()
    })
  }, [updateRange])

  useLayoutEffect(() => {
    if (!scrollElement) return undefined

    updateRange()

    const raf1 = requestAnimationFrame(() => {
      updateRange()
      requestAnimationFrame(updateRange)
    })

    const onScroll = () => scheduleUpdate()

    scrollElement.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    const resizeObserver = new ResizeObserver(() => scheduleUpdate())
    resizeObserver.observe(scrollElement)

    return () => {
      cancelAnimationFrame(raf1)
      scrollElement.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scrollElement, updateRange, scheduleUpdate])

  useLayoutEffect(() => {
    updateRange()
  }, [itemCount, updateRange])

  return range
}
