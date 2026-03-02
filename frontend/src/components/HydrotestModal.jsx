import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'

function HydrotestModal({
  open,
  isEditMode,
  selectedRowId,
  formData: initialFormData,
  saveError,
  onClose,
  onSave,
}) {
  const titleEdit = 'Редактирование гидроиспытания'
  const titleAdd = 'Добавление гидроиспытания'
  const title = isEditMode ? titleEdit : titleAdd
  const [draft, setDraft] = useState(initialFormData)

  useEffect(() => {
    if (!open) return
    setDraft({ ...initialFormData })
  }, [open, initialFormData])

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton onClick={onClose} aria-label="Закрыть" size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <Box sx={{ px: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight={600}>Гидроиспытание</Typography>
        {isEditMode && (
          <Typography variant="body2" color="text.secondary">{selectedRowId}</Typography>
        )}
      </Box>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Наименование"
            value={draft.nh}
            onChange={handleFieldChange('nh')}
          />
          <TextField
            fullWidth
            size="small"
            label="Диаметр, мм"
            type="number"
            value={draft.d}
            onChange={handleFieldChange('d')}
          />
          <TextField
            fullWidth
            size="small"
            label="Толщина стенки, мм"
            type="number"
            value={draft.th}
            onChange={handleFieldChange('th')}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина, мм"
            type="number"
            value={draft.l}
            onChange={handleFieldChange('l')}
          />
          <TextField
            fullWidth
            size="small"
            label="Время на испытание, сек"
            type="number"
            value={draft.testtime}
            onChange={handleFieldChange('testtime')}
          />
          <TextField
            fullWidth
            size="small"
            label="Масса, кг"
            type="number"
            value={draft.mass}
            onChange={handleFieldChange('mass')}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина резьбовой поверхности 1, мм"
            type="number"
            value={draft.l1}
            onChange={handleFieldChange('l1')}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина резьбовой поверхности 2, мм"
            type="number"
            value={draft.l2}
            onChange={handleFieldChange('l2')}
          />
          <TextField
            fullWidth
            size="small"
            label="Норма времени, чел.ч"
            type="number"
            value={draft.nv}
            InputProps={{ readOnly: true }}
          />
        </Stack>
      </DialogContent>

      {saveError && (
        <Box sx={{ px: 3, py: 1.5, bgcolor: 'secondary.light', borderTop: 1, borderColor: 'divider' }} role="alert">
          <Typography variant="body2" color="text.secondary">{saveError}</Typography>
        </Box>
      )}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="primary" startIcon={<Check />} onClick={() => onSave(draft)}>Ок</Button>
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  )
}

export default HydrotestModal
