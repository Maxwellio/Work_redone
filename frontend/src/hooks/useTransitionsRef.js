import { useEffect, useState } from 'react'
import { getOperationGroups, getOperations } from '../api'

export function useTransitionsRef(open) {
  const [groups, setGroups] = useState([])
  const [operations, setOperations] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingOperations, setLoadingOperations] = useState(false)
  const [errorGroups, setErrorGroups] = useState(null)
  const [errorOperations, setErrorOperations] = useState(null)

  useEffect(() => {
    if (!open) return
    setLoadingGroups(true)
    setErrorGroups(null)
    setGroups([])
    setSelectedGroupId(null)
    setOperations([])
    getOperationGroups()
      .then((data) => setGroups(Array.isArray(data) ? data : []))
      .catch((err) => setErrorGroups(err.message || 'Ошибка загрузки групп'))
      .finally(() => setLoadingGroups(false))
  }, [open])

  useEffect(() => {
    if (!open || selectedGroupId == null) {
      setOperations([])
      return
    }
    setLoadingOperations(true)
    setErrorOperations(null)
    getOperations(selectedGroupId)
      .then((data) => setOperations(Array.isArray(data) ? data : []))
      .catch((err) => setErrorOperations(err.message || 'Ошибка загрузки операций'))
      .finally(() => setLoadingOperations(false))
  }, [open, selectedGroupId])

  return {
    groups,
    operations,
    selectedGroupId,
    setSelectedGroupId,
    loadingGroups,
    loadingOperations,
    errorGroups,
    errorOperations,
  }
}
