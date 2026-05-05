import { useEffect, useMemo, useState } from 'react'
import {
  ensureOperationGroups,
  ensureOperations,
  isOperationReferenceCacheWarm,
} from '../api/staticReferenceCache'

function operationsToByGroup(ops) {
  if (!Array.isArray(ops)) return {}
  return ops.reduce((acc, op) => {
    const groupId = op?.idGroupOperations
    if (groupId == null) return acc
    const key = String(groupId)
    if (!acc[key]) acc[key] = []
    acc[key].push(op)
    return acc
  }, {})
}

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
    let cancelled = false
    const warm = isOperationReferenceCacheWarm()

    if (!warm) {
      setLoadingRefData(true)
      setErrorRefData(null)
      setGroups([])
      setOperationsByGroup({})
    } else {
      setErrorRefData(null)
      setLoadingRefData(false)
    }
    setSelectedGroupId(null)

    ;(async () => {
      const [gRes, oRes] = await Promise.all([ensureOperationGroups(), ensureOperations()])
      if (cancelled) return

      if (!gRes.ok) {
        setErrorRefData(gRes.error || 'Ошибка загрузки переходов')
        setGroups([])
        setOperationsByGroup({})
        setLoadingRefData(false)
        return
      }

      const groupsSafe = gRes.data || []
      setGroups(groupsSafe)
      if (!groupsSafe.length) {
        setOperationsByGroup({})
        setLoadingRefData(false)
        return
      }

      const map = oRes.ok ? operationsToByGroup(oRes.data) : {}
      setOperationsByGroup(map)
      setLoadingRefData(false)
    })()

    return () => {
      cancelled = true
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
