import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

function ChangePasswordForm({ onSubmit, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const [showPasswordRules, setShowPasswordRules] = useState(false)

  const newPasswordMissingCriteria = []
  if (newPassword.length < 6) newPasswordMissingCriteria.push('минимум 6 символов')
  if (!/[A-Z]/.test(newPassword)) newPasswordMissingCriteria.push('заглавная латинская буква A-Z')
  if (!/[a-z]/.test(newPassword)) newPasswordMissingCriteria.push('строчная латинская буква a-z')
  if (!/[0-9]/.test(newPassword)) newPasswordMissingCriteria.push('минимум 1 цифра 0-9')

  const isNewPasswordValid = newPasswordMissingCriteria.length === 0
  const isConfirmMismatch = Boolean(confirmNewPassword) && confirmNewPassword !== newPassword

  const newPasswordHelperText =
    newPassword && !isNewPasswordValid
      ? `Пароль должен содержать: ${newPasswordMissingCriteria.join(', ')}`
      : undefined

  const isSubmitDisabled =
    !currentPassword ||
    !newPassword ||
    !confirmNewPassword ||
    !isNewPasswordValid ||
    isConfirmMismatch

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSubmitDisabled) return
    if (onSubmit) {
      onSubmit({ currentPassword, newPassword })
    }
  }

  const handleCancel = (event) => {
    event.preventDefault()
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField
          label="Текущий пароль"
          type={showCurrentPassword ? 'text' : 'password'}
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showCurrentPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  edge="end"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography
          variant="body2"
          sx={{
            cursor: 'pointer',
            userSelect: 'none',
            color: 'primary.main',
            textDecoration: 'underline',
          }}
          onClick={() => setShowPasswordRules((v) => !v)}
        >
          Правила надежного пароля
        </Typography>

        {showPasswordRules && (
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Пароль должен:
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • иметь минимум 6 символов
              <br />• содержать хотя бы 1 заглавную (A-Z)
              <br />• содержать хотя бы 1 строчную (a-z)
              <br />• содержать хотя бы 1 цифру (0-9)
            </Typography>
          </Box>
        )}

        <TextField
          label="Новый пароль"
          type={showNewPassword ? 'text' : 'password'}
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          helperText={newPasswordHelperText}
          error={Boolean(newPasswordHelperText)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showNewPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShowNewPassword((v) => !v)}
                  edge="end"
                  tabIndex={-1}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Повторите новый пароль"
          type={showConfirmNewPassword ? 'text' : 'password'}
          fullWidth
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          helperText={isConfirmMismatch ? 'Пароли не совпадают' : undefined}
          error={isConfirmMismatch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showConfirmNewPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShowConfirmNewPassword((v) => !v)}
                  edge="end"
                  tabIndex={-1}
                >
                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="text" onClick={handleCancel}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitDisabled}>
            Ок
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChangePasswordForm

