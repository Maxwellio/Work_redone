import { useCallback, useEffect, useRef, useState } from 'react'
import { getOperationGroups, getOperations } from '../api'

export function useTransitionsRef(open) {
  const openEffectHasRun = useRef(false)
  const [groups, setGroups] = useState([])
  const [operationsByGroup, setOperationsByGroup] = useState({})
  const [selectedGroupIdState, setSelectedGroupIdState] = useState(null)
  const [displayedOps, setDisplayedOps] = useState([])
  const [displayedGroupId, setDisplayedGroupId] = useState(null)
  const [loadingGroups, setLoadingGroups] = useState(false)
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
    setDisplayedOps([])
    setDisplayedGroupId(null)
    setOperationsByGroup({})
    getOperationGroups()
      .then((data) => {
        const groupList = Array.isArray(data) ? data : []
        setGroups(groupList)
        setLoadingGroups(false)
        // Prefetch all group operations in parallel, updating the cache incrementally
        groupList.forEach((group) => {
          getOperations(group.idGroupOperations)
            .then((ops) => {
              const safeOps = Array.isArray(ops) ? ops : []
              setOperationsByGroup((prev) => ({ ...prev, [group.idGroupOperations]: safeOps }))
            })
            .catch(() => {
              setOperationsByGroup((prev) => ({ ...prev, [group.idGroupOperations]: [] }))
            })
        })
      })
      .catch((err) => {
        setErrorGroups(err.message || 'Ошибка загрузки групп')
        setLoadingGroups(false)
      })
    openEffectHasRun.current = true
  }, [open])

  useEffect(() => {
    if (!open || selectedGroupIdState == null) {
      setDisplayedOps([])
      setDisplayedGroupId(null)
      setErrorOperations(null)
      return
    }

    const cached = operationsByGroup[selectedGroupIdState]
    if (cached !== undefined) {
      setDisplayedOps(cached)
      setDisplayedGroupId(selectedGroupIdState)
      setErrorOperations(null)
      return
    }

    // Not in cache yet (race condition: user clicked before prefetch completed)
    // Fetch on-demand and update cache + display when ready
    getOperations(selectedGroupIdState)
      .then((data) => {
        const safeData = Array.isArray(data) ? data : []
        setOperationsByGroup((prev) => ({ ...prev, [selectedGroupIdState]: safeData }))
        setDisplayedOps(safeData)
        setDisplayedGroupId(selectedGroupIdState)
        setErrorOperations(null)
      })
      .catch((err) => {
        setErrorOperations(err.message || 'Ошибка загрузки операций')
      })
  }, [open, selectedGroupIdState, operationsByGroup])

  const setSelectedGroupId = useCallback((id) => {
    setSelectedGroupIdState(id)
  }, [])

  const selectedGroupId = open && !openEffectHasRun.current ? null : selectedGroupIdState
  const operationsEffective = open && !openEffectHasRun.current ? [] : displayedOps
  const displayedGroupIdEffective = open && !openEffectHasRun.current ? null : displayedGroupId

  return {
    groups,
    operations: operationsEffective,
    selectedGroupId,
    displayedGroupId: displayedGroupIdEffective,
    setSelectedGroupId,
    loadingGroups,
    errorGroups,
    errorOperations,
  }
}
