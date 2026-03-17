import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import ChangePasswordForm from './ChangePasswordForm'

function ChangePasswordDialog({ open, onClose, onSubmit }) {
  const handleSubmit = async (values) => {
    if (onSubmit) {
      await onSubmit(values)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Смена пароля</DialogTitle>
      <DialogContent dividers>
        <ChangePasswordForm onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordDialog

