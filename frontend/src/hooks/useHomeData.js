import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFittings, getHydrotests, getSubstitutes } from '../api'
import { ensureParty, ensurePreformTypes } from '../api/staticReferenceCache'

const DEBOUNCE_MS = 350

export function useHomeData({ activeTab, searchQuery, showMyRecords, user }) {
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preformTypes, setPreformTypes] = useState([])
  const [preformError, setPreformError] = useState(null)
  const [partyList, setPartyList] = useState([])
  const [pendingScrollToId, setPendingScrollToId] = useState(null)

  const beginLoading = () => {
    setLoading(true)
    setError(null)
    setSelectedRowId(null)
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadData = useCallback(async () => {
    const requestId = Symbol('home-data-request')
    let isCurrent = true
    setLoading(true)
    setError(null)
    try {
      const userId = showMyRecords && user?.userId ? user.userId : null
      if (activeTab === 0) {
        const data = await getSubstitutes(debouncedSearch, userId)
        setListData(data)
      } else if (activeTab === 1 || activeTab === 2) {
        const data = await getFittings(activeTab === 1 ? 1 : 2, debouncedSearch, userId)
        setListData(data)
      } else {
        const data = await getHydrotests(debouncedSearch, userId)
        setListData(data)
      }
    } catch (err) {
      if (!isCurrent) return
      setError(err.message || 'Ошибка загрузки')
      setListData([])
    } finally {
      if (!isCurrent) return
      setLoading(false)
    }
    return () => {
      isCurrent = false
    }
  }, [activeTab, debouncedSearch, showMyRecords, user])

  useEffect(() => {
    const cleanup = loadData()
    return typeof cleanup === 'function' ? cleanup : undefined
  }, [loadData])

  const ensurePreformLoaded = useCallback(async () => {
    const r = await ensurePreformTypes()
    setPreformTypes(r.data)
    if (r.ok) setPreformError(null)
    else setPreformError(r.error ?? 'Ошибка загрузки типов заготовок')
  }, [])

  const ensurePartyLoaded = useCallback(async () => {
    const r = await ensureParty()
    setPartyList(r.data)
  }, [])

  useEffect(() => {
    setSelectedRowId(null)
  }, [activeTab])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  const preformTypesFiltered = useMemo(
    () =>
      preformTypes
        .filter((item) => item.idPreform === 1 || item.idPreform === 2)
        .sort((a, b) => a.idPreform - b.idPreform),
    [preformTypes]
  )

  const preformTypesFilteredFitting = useMemo(
    () =>
      preformTypes
        .filter((item) => item.idPreform === 3 || item.idPreform === 4)
        .sort((a, b) => a.idPreform - b.idPreform),
    [preformTypes]
  )

  return {
    selectedRowId,
    setSelectedRowId,
    listData,
    loading,
    error,
    preformError,
    preformTypesFiltered,
    preformTypesFilteredFitting,
    partyList,
    ensurePreformLoaded,
    ensurePartyLoaded,
    loadData,
    beginLoading,
    pendingScrollToId,
    setPendingScrollToId,
  }
}
