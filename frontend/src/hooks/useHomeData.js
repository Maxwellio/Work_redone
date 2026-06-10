import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getFittings, getHydrotests, getSubstitutes } from '../api'
import { ensureParty, ensurePreformTypes } from '../api/staticReferenceCache'
import {
  HOME_TABLE_ROW_HEIGHT,
  HOME_TABLE_VIRTUAL_THRESHOLD,
} from '../constants/tableLayout'
import { COLUMNS } from '../models/tableConfig'
import { getRowId } from '../utils/format'
import { sortListData } from '../utils/sortListData'

const DEBOUNCE_MS = 350

export function useHomeData({ activeTab, searchQuery, monthFilter, showMyRecords, user }) {
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preformTypes, setPreformTypes] = useState([])
  const [preformError, setPreformError] = useState(null)
  const [partyList, setPartyList] = useState([])
  const [pendingScrollToId, setPendingScrollToId] = useState(null)
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const scrollContainerRef = useRef(null)

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
      const yearMonth = monthFilter || null
      if (activeTab === 0) {
        const data = await getSubstitutes(debouncedSearch, userId, yearMonth)
        setListData(data)
      } else if (activeTab === 1 || activeTab === 2) {
        const data = await getFittings(activeTab === 1 ? 1 : 2, debouncedSearch, userId, yearMonth)
        setListData(data)
      } else {
        const data = await getHydrotests(debouncedSearch, userId, yearMonth)
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
  }, [activeTab, debouncedSearch, monthFilter, showMyRecords, user])

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
    setSortField(null)
    setSortDirection('asc')
  }, [activeTab])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [activeTab])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [debouncedSearch, monthFilter])

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

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField])

  const sortedListData = useMemo(
    () => sortListData(listData, sortField, sortDirection, COLUMNS[activeTab]),
    [listData, sortField, sortDirection, activeTab]
  )

  useEffect(() => {
    if (pendingScrollToId == null) return
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current
      const index = sortedListData.findIndex(
        (row) => getRowId(row, activeTab) === pendingScrollToId
      )
      if (index >= 0) {
        const virtualized = sortedListData.length > HOME_TABLE_VIRTUAL_THRESHOLD
        if (virtualized && container) {
          container.scrollTop = index * HOME_TABLE_ROW_HEIGHT
        } else {
          const element = document.querySelector(`[data-row-id="${pendingScrollToId}"]`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }
      }
      setPendingScrollToId(null)
    }, 100)
    return () => clearTimeout(timer)
  }, [pendingScrollToId, sortedListData, activeTab])

  return {
    selectedRowId,
    setSelectedRowId,
    listData,
    sortedListData,
    sortField,
    sortDirection,
    handleSort,
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
    scrollContainerRef,
  }
}
