import { useEffect, useState } from 'react'
import { getPreformTypes } from '../api'

export function usePreformRef(open) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    setList([])
    getPreformTypes()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Ошибка загрузки типов заготовок'))
      .finally(() => setLoading(false))
  }, [open])

  return {
    list,
    loading,
    error,
  }
}
