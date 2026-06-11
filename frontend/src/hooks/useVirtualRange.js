import { useCallback, useLayoutEffect, useRef, useState } from 'react'

function getViewportHeight(el) {
  if (!el) return 0

  const { clientHeight } = el
  if (clientHeight > 0) return clientHeight

  const { height } = el.getBoundingClientRect()
  if (height > 0) return height

  const { top } = el.getBoundingClientRect()
  return Math.max(0, window.innerHeight - top)
}

function computeRange(scrollTop, viewportHeight, itemCount, itemHeight, overscan) {
  if (itemCount === 0 || itemHeight <= 0) {
    return { startIndex: 0, endIndex: 0, paddingTop: 0, paddingBottom: 0 }
  }

  const effectiveViewport =
    viewportHeight > 0 ? viewportHeight : Math.max(itemHeight * 10, window.innerHeight * 0.5)

  const rawStart = Math.floor(scrollTop / itemHeight)
  const startIndex = Math.max(0, rawStart - overscan)
  const visibleCount = Math.ceil(effectiveViewport / itemHeight) + 1
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
    setRange(
      computeRange(el.scrollTop, getViewportHeight(el), itemCount, itemHeight, overscan)
    )
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

    // Flex layout may settle after the first layout pass (especially in production builds).
    const raf1 = requestAnimationFrame(() => {
      updateRange()
      requestAnimationFrame(updateRange)
    })

    const onScroll = () => scheduleUpdate()

    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    const resizeObserver = new ResizeObserver(() => scheduleUpdate())
    resizeObserver.observe(el)

    let parent = el.parentElement
    while (parent) {
      resizeObserver.observe(parent)
      if (parent === document.body) break
      parent = parent.parentElement
    }

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
