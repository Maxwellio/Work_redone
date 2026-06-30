import { useEffect, useMemo, useState } from 'react'
import { ensureOperations } from '../api/staticReferenceCache'
import { getOperationsInSameGroup } from '../utils/operationGroup'

export function useTransitionGroupOperations(open, idOperations, nmOperations) {
  const [allOperations, setAllOperations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || idOperations == null) {
      setAllOperations([])
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    ensureOperations()
      .then((result) => {
        if (cancelled) return
        if (!result.ok) {
          setAllOperations([])
          setError(result.error || 'Ошибка загрузки переходов')
          return
        }
        setAllOperations(Array.isArray(result.data) ? result.data : [])
      })
      .catch((err) => {
        if (!cancelled) {
          setAllOperations([])
          setError(err.message || 'Ошибка загрузки переходов')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, idOperations])

  const options = useMemo(() => {
    if (idOperations == null) return []
    const groupOps = getOperationsInSameGroup(allOperations, idOperations)
    if (groupOps.length > 0) {
      return groupOps.map((op) => ({
        idOperations: op.idOperations,
        nmOperations: op.nmOperations ?? '',
      }))
    }
    if (nmOperations != null || idOperations != null) {
      return [{ idOperations, nmOperations: nmOperations ?? '' }]
    }
    return []
  }, [allOperations, idOperations, nmOperations])

  return { options, loading, error }
}
