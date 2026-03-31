import { useEffect, useMemo, useState } from 'react'
import { getOperationGroups, getOperations } from '../api'

export function useTransitionsRef(open, disallowedGroupIds = []) {
  const [groups, setGroups] = useState([])
  const [operationsByGroup, setOperationsByGroup] = useState({})
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [loadingRefData, setLoadingRefData] = useState(false)
  const [errorRefData, setErrorRefData] = useState(null)

  const disallowedGroupIdSet = useMemo(() => new Set((disallowedGroupIds || []).map(String)), [disallowedGroupIds])

  const beginLoadingRef = () => {
    setLoadingRefData(true)
    setErrorRefData(null)
    setGroups([])
    setOperationsByGroup({})
    setSelectedGroupId(null)
  }

  useEffect(() => {
    if (!open) {
      return
    }
    let isMounted = true
    beginLoadingRef()

    getOperationGroups()
      .then(async (data) => {
        if (!isMounted) return
        const groupsSafe = Array.isArray(data) ? data : []
        setGroups(groupsSafe)
        if (!groupsSafe.length) return

        // Загружаем все операции одним запросом и группируем на клиенте.
        try {
          const ops = await getOperations()
          if (!isMounted) return
          const map = Array.isArray(ops)
            ? ops.reduce((acc, op) => {
                const groupId = op?.idGroupOperations
                if (groupId == null) return acc
                const key = String(groupId)
                if (!acc[key]) acc[key] = []
                acc[key].push(op)
                return acc
              }, {})
            : {}
          setOperationsByGroup(map)
        } catch {
          // Если операции не удалось загрузить, оставляем группы, а операции будут пустыми.
          if (!isMounted) return
          setOperationsByGroup({})
        }
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

  // Если текущая выбранная группа попала в запрещенные - сбрасываем выбор.
  useEffect(() => {
    if (selectedGroupId == null) return
    if (!disallowedGroupIdSet.has(String(selectedGroupId))) return
    setSelectedGroupId(null)
  }, [disallowedGroupIdSet, selectedGroupId])

  const operations =
    selectedGroupId == null ? [] : (operationsByGroup[String(selectedGroupId)] || [])

  const groupsFiltered =
    disallowedGroupIdSet.size === 0
      ? groups
      : groups.filter((g) => {
          const groupId = g?.idGroupOperations
          if (groupId == null) return true
          return !disallowedGroupIdSet.has(String(groupId))
        })

  return {
    groups: groupsFiltered,
    operations,
    selectedGroupId,
    setSelectedGroupId,
    beginLoadingRef,
    loadingRefData,
    errorRefData,
  }
}
