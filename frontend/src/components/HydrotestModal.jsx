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

function HydrotestModal({
  open,
  isEditMode,
  selectedRowId,
  formData,
  saveError,
  onClose,
  onFormChange,
  onSave,
}) {
  const titleEdit = 'Редактирование гидроиспытания'
  const titleAdd = 'Добавление гидроиспытания'
  const title = isEditMode ? titleEdit : titleAdd

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
            value={formData.nh}
            onChange={onFormChange('nh')}
          />
          <TextField
            fullWidth
            size="small"
            label="Диаметр, мм"
            type="number"
            value={formData.d}
            onChange={onFormChange('d')}
          />
          <TextField
            fullWidth
            size="small"
            label="Толщина стенки, мм"
            type="number"
            value={formData.th}
            onChange={onFormChange('th')}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина, мм"
            type="number"
            value={formData.l}
            onChange={onFormChange('l')}
          />
          <TextField
            fullWidth
            size="small"
            label="Время на испытание, сек"
            type="number"
            value={formData.testtime}
            onChange={onFormChange('testtime')}
          />
          <TextField
            fullWidth
            size="small"
            label="Масса, кг"
            type="number"
            value={formData.mass}
            onChange={onFormChange('mass')}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина резьбовой поверхности 1, мм"
            type="number"
            value={formData.l1}
            onChange={onFormChange('l1')}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина резьбовой поверхности 2, мм"
            type="number"
            value={formData.l2}
            onChange={onFormChange('l2')}
          />
          <TextField
            fullWidth
            size="small"
            label="Норма времени, чел.ч"
            type="number"
            value={formData.nv}
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
        <Button variant="contained" color="primary" startIcon={<Check />} onClick={onSave}>Ок</Button>
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  )
}

export default HydrotestModal
