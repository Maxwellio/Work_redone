import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

function ChangePasswordForm({ onSubmit, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!currentPassword || !newPassword) return
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

  const isSubmitDisabled = !currentPassword || !newPassword

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField
          label="Текущий пароль"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          label="Новый пароль"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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

