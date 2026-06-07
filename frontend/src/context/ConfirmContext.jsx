import { createContext, useCallback, useContext, useRef, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'

const ConfirmContext = createContext(null)

const DEFAULT_ACTION = 'удаление'

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Удалить',
    cancelLabel: 'Отмена',
  })
  const resolveRef = useRef(null)

  const close = useCallback((result) => {
    setState((prev) => ({ ...prev, open: false }))
    const resolve = resolveRef.current
    resolveRef.current = null
    resolve?.(result)
  }, [])

  const confirm = useCallback((message, options = {}) => {
    const {
      action = DEFAULT_ACTION,
      confirmLabel = 'Удалить',
      cancelLabel = 'Отмена',
    } = options

    return new Promise((resolve) => {
      resolveRef.current = resolve
      setState({
        open: true,
        title: `Подтвердите ${action}`,
        message,
        confirmLabel,
        cancelLabel,
      })
    })
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return confirm
}
