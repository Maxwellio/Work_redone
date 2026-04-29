import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const passwordRulesTooltipContent = (
  <Box sx={{ maxWidth: 280, py: 0.25 }}>
    <Typography variant="caption" color="inherit" display="block" sx={{ mb: 0.5, fontWeight: 600 }}>
      Пароль должен:
    </Typography>
    <Typography variant="caption" color="inherit" display="block" component="span">
      • иметь минимум 14 символов
      <br />• содержать хотя бы 1 заглавную (A-Z)
      <br />• содержать хотя бы 1 строчную (a-z)
      <br />• содержать хотя бы 1 цифру (0-9)
      <br />• содержать хотя бы 1 спецсимвол (например, !@#$%^&*)
    </Typography>
  </Box>
)

function ChangePasswordForm({
  onSubmit,
  onCancel,
  requireCurrentPassword = true,
  submitLabel = 'Ок',
  cancelLabel = 'Отмена',
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const newPasswordMissingCriteria = []
  if (newPassword.length < 14) newPasswordMissingCriteria.push('минимум 14 символов')
  if (!/[A-Z]/.test(newPassword)) newPasswordMissingCriteria.push('заглавная латинская буква A-Z')
  if (!/[a-z]/.test(newPassword)) newPasswordMissingCriteria.push('строчная латинская буква a-z')
  if (!/[0-9]/.test(newPassword)) newPasswordMissingCriteria.push('минимум 1 цифра 0-9')
  if (!/[^A-Za-z0-9]/.test(newPassword)) newPasswordMissingCriteria.push('минимум 1 спецсимвол')

  const isNewPasswordValid = newPasswordMissingCriteria.length === 0
  const isConfirmMismatch = Boolean(confirmNewPassword) && confirmNewPassword !== newPassword

  const newPasswordHelperText =
    newPassword && !isNewPasswordValid
      ? `Пароль должен содержать: ${newPasswordMissingCriteria.join(', ')}`
      : undefined

  const isSubmitDisabled =
    (requireCurrentPassword && !currentPassword) ||
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
        {requireCurrentPassword && (
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
        )}

        <Tooltip title={passwordRulesTooltipContent} placement="top" arrow enterTouchDelay={0}>
          <Box
            component="span"
            tabIndex={0}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'help',
              color: 'text.secondary',
              alignSelf: 'flex-start',
            }}
            aria-label="Требования к паролю"
          >
            <InfoOutlined sx={{ fontSize: '1rem', opacity: 0.85 }} aria-hidden />
            <Typography variant="caption" color="inherit" component="span">
              Требования к паролю
            </Typography>
          </Box>
        </Tooltip>

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
            {cancelLabel}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitDisabled}>
            {submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChangePasswordForm

