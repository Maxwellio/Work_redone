import { useCallback, useEffect, useRef, useState } from 'react'
import { getOperationGroups, getOperations } from '../api'

export function useTransitionsRef(open) {
  const openEffectHasRun = useRef(false)
  const [groups, setGroups] = useState([])
  const [operations, setOperations] = useState([])
  const [operationsByGroup, setOperationsByGroup] = useState({})
  const [selectedGroupIdState, setSelectedGroupIdState] = useState(null)
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingOperations, setLoadingOperations] = useState(false)
  const [errorGroups, setErrorGroups] = useState(null)
  const [errorOperations, setErrorOperations] = useState(null)

  useEffect(() => {
    if (!open) {
      openEffectHasRun.current = false
      return
    }
    setLoadingGroups(true)
    setErrorGroups(null)
    setGroups([])
    setSelectedGroupIdState(null)
    setOperations([])
    getOperationGroups()
      .then((data) => setGroups(Array.isArray(data) ? data : []))
      .catch((err) => setErrorGroups(err.message || 'Ошибка загрузки групп'))
      .finally(() => setLoadingGroups(false))
    openEffectHasRun.current = true
  }, [open])

  useEffect(() => {
    if (!open || selectedGroupIdState == null) {
      setOperations([])
      return
    }

    const cached = operationsByGroup[selectedGroupIdState]
    if (cached) {
      setOperations(cached)
      setLoadingOperations(false)
      setErrorOperations(null)
      return
    }

    setLoadingOperations(true)
    setErrorOperations(null)
    getOperations(selectedGroupIdState)
      .then((data) => {
        const safeData = Array.isArray(data) ? data : []
        setOperations(safeData)
        setOperationsByGroup((prev) => ({
          ...prev,
          [selectedGroupIdState]: safeData,
        }))
      })
      .catch((err) => {
        setErrorOperations(err.message || 'Ошибка загрузки операций')
        setOperations([])
      })
      .finally(() => setLoadingOperations(false))
  }, [open, selectedGroupIdState, operationsByGroup])

  const setSelectedGroupId = useCallback((id) => {
    setSelectedGroupIdState(id)
  }, [])

  const selectedGroupId =
    open && !openEffectHasRun.current ? null : selectedGroupIdState
  const operationsEffective =
    open && !openEffectHasRun.current ? [] : operations

  return {
    groups,
    operations: operationsEffective,
    selectedGroupId,
    setSelectedGroupId,
    loadingGroups,
    loadingOperations,
    errorGroups,
    errorOperations,
  }
}
