import { useEffect, useState } from 'react'
import { ensurePreformTypes } from '../api/staticReferenceCache'

export function usePreformRef(open) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    ensurePreformTypes()
      .then((r) => {
        setList(r.data)
        if (!r.ok) setError(r.error || 'Ошибка загрузки типов заготовок')
      })
      .finally(() => setLoading(false))
  }, [open])

  return {
    list,
    loading,
    error,
  }
}
