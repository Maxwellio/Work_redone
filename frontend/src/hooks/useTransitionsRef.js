import { useCallback, useEffect, useRef, useState } from 'react'
import { getOperationGroups, getOperations } from '../api'

export function useTransitionsRef(open) {
  const [groups, setGroups] = useState([])
  const [operationsByGroup, setOperationsByGroup] = useState({})
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [loadingRefData, setLoadingRefData] = useState(false)
  const [errorRefData, setErrorRefData] = useState(null)

  useEffect(() => {
    if (!open) {
      return
    }
    let isMounted = true
    setLoadingRefData(true)
    setErrorRefData(null)
    setGroups([])
    setOperationsByGroup({})
    setSelectedGroupId(null)

    getOperationGroups()
      .then(async (data) => {
        if (!isMounted) return
        const groupsSafe = Array.isArray(data) ? data : []
        setGroups(groupsSafe)
        if (!groupsSafe.length) return
        const operationsEntries = await Promise.all(
          groupsSafe.map(async (g) => {
            try {
              const ops = await getOperations(g.idGroupOperations)
              return [g.idGroupOperations, Array.isArray(ops) ? ops : []]
            } catch {
              return [g.idGroupOperations, []]
            }
          })
        )
        if (!isMounted) return
        const map = operationsEntries.reduce((acc, [id, ops]) => {
          acc[id] = ops
          return acc
        }, {})
        setOperationsByGroup(map)
      })
      .catch((err) => {
        if (!isMounted) return
        setErrorRefData(err.message || 'Ошибка загрузки переходов')
      })
      .finally(() => {
        if (!isMounted) return
        setLoadingRefData(false)
      })

    return () => {
      isMounted = false
    }
  }, [open])

  const operations = selectedGroupId == null ? [] : (operationsByGroup[selectedGroupId] || [])

  return {
    groups,
    operations,
    selectedGroupId,
    setSelectedGroupId,
    loadingRefData,
    errorRefData,
  }
}
