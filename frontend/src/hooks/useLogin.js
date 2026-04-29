import { useEffect, useState } from 'react'
import { changePassword, login as apiLogin, logout as apiLogout } from '../api'
import { userHasAdminRole } from '../utils/userRoles'

export function useLogin(fetchUser, navigate) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [changePasswordError, setChangePasswordError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [firstLoginPending, setFirstLoginPending] = useState(false)
  const [firstLoginOldPassword, setFirstLoginOldPassword] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchUser().then(() => {
      if (!cancelled) setSessionChecked(true)
    })
    return () => {
      cancelled = true
    }
  }, [fetchUser])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await apiLogin(username.trim(), password)
      if (!res.ok) {
        if (res.status === 401) {
          setError('Неверный логин или пароль')
        } else {
          setError('Ошибка входа. Попробуйте позже.')
        }
        return
      }
      const u = await fetchUser()
      if (u?.isFirstLogin) {
        setFirstLoginPending(true)
        setFirstLoginOldPassword(password)
        return
      }
      navigate(userHasAdminRole(u) ? '/admin' : '/', { replace: true })
    } catch {
      setError('Ошибка соединения. Проверьте подключение.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFirstLoginPasswordSubmit = async ({ currentPassword, newPassword }) => {
    setChangePasswordError('')
    setChangingPassword(true)
    try {
      const oldPassword = firstLoginOldPassword || currentPassword || ''
      await changePassword(oldPassword, newPassword)
      setFirstLoginOldPassword('')
      setFirstLoginPending(false)
      setPassword('')
      const u = await fetchUser()
      navigate(userHasAdminRole(u) ? '/admin' : '/', { replace: true })
    } catch (e) {
      setChangePasswordError(e?.message || 'Не удалось сменить пароль')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleCancelFirstLogin = async () => {
    try {
      await apiLogout()
    } catch (_) {
      // ignore logout errors, page reload will reset state
    } finally {
      setFirstLoginOldPassword('')
      setFirstLoginPending(false)
      setPassword('')
      window.location.reload()
    }
  }

  return {
    username,
    password,
    error,
    changePasswordError,
    submitting,
    changingPassword,
    sessionChecked,
    firstLoginPending,
    setUsername,
    setPassword,
    handleSubmit,
    handleFirstLoginPasswordSubmit,
    handleCancelFirstLogin,
  }
}
