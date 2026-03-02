import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFittings, getHydrotests, getParty, getPreformTypes, getSubstitutes } from '../api'

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

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadData = useCallback(async () => {
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
      setError(err.message || 'Ошибка загрузки')
      setListData([])
    } finally {
      setLoading(false)
    }
  }, [activeTab, debouncedSearch, showMyRecords, user])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (activeTab !== 0 && activeTab !== 1 && activeTab !== 2) return
    let isMounted = true
    setPreformError(null)
    getPreformTypes()
      .then((data) => {
        if (!isMounted) return
        setPreformTypes(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!isMounted) return
        setPreformError(err.message || 'Ошибка загрузки типов заготовок')
        setPreformTypes([])
      })
    return () => {
      isMounted = false
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 1 && activeTab !== 2) return
    let isMounted = true
    getParty()
      .then((data) => {
        if (!isMounted) return
        setPartyList(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!isMounted) return
        setPartyList([])
      })
    return () => {
      isMounted = false
    }
  }, [activeTab])

  useEffect(() => {
    setSelectedRowId(null)
  }, [activeTab])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  useEffect(() => {
    if (pendingScrollToId == null) return
    const timer = setTimeout(() => {
      const element = document.querySelector(`[data-row-id="${pendingScrollToId}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
      setPendingScrollToId(null)
    }, 100)
    return () => clearTimeout(timer)
  }, [pendingScrollToId, listData])

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
    loadData,
    pendingScrollToId,
    setPendingScrollToId,
  }
}
