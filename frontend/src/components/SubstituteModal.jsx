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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'

function SubstituteModal({
  open,
  isEditMode,
  selectedRowId,
  formData: initialFormData,
  preformTypesFiltered,
  preformError,
  saveError,
  onClose,
  onSave,
}) {
  const title = isEditMode ? 'Редактирование переводника' : 'Добавление переводника'
  const [draft, setDraft] = useState(initialFormData)

  useEffect(() => {
    if (!open) return
    setDraft({ ...initialFormData })
  }, [open, initialFormData])

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target
    setDraft((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'idPreform' && (value === '1' || value === 1)) {
        next.dPreformIn = ''
      }
      return next
    })
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
        <Typography variant="subtitle1" fontWeight={600}>Переводник</Typography>
        {isEditMode && (
          <Typography variant="body2" color="text.secondary">{selectedRowId}</Typography>
        )}
      </Box>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ minWidth: 100 }}>Наименование</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              <TextField size="small" value={draft.nmSub1} onChange={handleFieldChange('nmSub1')} sx={{ width: 96, minWidth: 64 }} />
              <Typography color="text.secondary">-</Typography>
              <TextField size="small" value={draft.nmSub2} onChange={handleFieldChange('nmSub2')} sx={{ width: 96, minWidth: 64 }} />
              <Typography color="text.secondary">-</Typography>
              <TextField size="small" value={draft.nmSub3} onChange={handleFieldChange('nmSub3')} sx={{ width: 96, minWidth: 64 }} />
              <Typography color="text.secondary">/</Typography>
              <TextField size="small" value={draft.nmSub4} onChange={handleFieldChange('nmSub4')} sx={{ width: 96, minWidth: 64 }} />
              <Typography color="text.secondary">-</Typography>
              <TextField size="small" value={draft.nmSub5} onChange={handleFieldChange('nmSub5')} sx={{ width: 96, minWidth: 64 }} />
            </Box>
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Диаметр наружный переводника, мм"
            type="number"
            value={draft.dSubstituteOut}
            onChange={handleFieldChange('dSubstituteOut')}
          />
          <TextField
            fullWidth
            size="small"
            label="Диаметр внутренний переводника, мм"
            type="number"
            value={draft.dSubstituteIn}
            onChange={handleFieldChange('dSubstituteIn')}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина, мм переводника"
            type="number"
            value={draft.lSubstiute}
            onChange={handleFieldChange('lSubstiute')}
          />

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>Заготовка</Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Наименование</InputLabel>
            <Select
              value={draft.idPreform}
              label="Наименование"
              onChange={handleFieldChange('idPreform')}
            >
              <MenuItem value="">Выберите тип</MenuItem>
              {preformTypesFiltered.map((item) => (
                <MenuItem key={item.idPreform} value={item.idPreform}>
                  {item.nmPreform}
                </MenuItem>
              ))}
            </Select>
            {preformError && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>{preformError}</Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            size="small"
            label="Диаметр наружный заготовки, мм"
            type="number"
            value={draft.dPreformOut}
            onChange={handleFieldChange('dPreformOut')}
          />
          <TextField
            fullWidth
            size="small"
            label="Диаметр внутренний заготовки, мм"
            type="number"
            value={draft.dPreformIn}
            onChange={handleFieldChange('dPreformIn')}
            disabled={draft.idPreform === '1' || draft.idPreform === 1}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина, мм заготовки"
            type="number"
            value={draft.lPreform}
            onChange={handleFieldChange('lPreform')}
          />
          <TextField
            fullWidth
            size="small"
            label="Коэф. жесткости, ГПа"
            type="number"
            value={draft.ph}
            onChange={handleFieldChange('ph')}
          />
          <TextField
            fullWidth
            size="small"
            label="Масса заготовки"
            type="number"
            value={draft.massPreform}
            onChange={handleFieldChange('massPreform')}
          />
        </Stack>
      </DialogContent>

      {saveError && (
        <Box sx={{ px: 3, py: 1.5, bgcolor: 'secondary.light', borderTop: 1, borderColor: 'divider' }} role="alert">
          <Typography variant="body2" color="text.secondary">{saveError}</Typography>
        </Box>
      )}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="primary">Переходы при изготовлении переводника</Button>
        <Button variant="contained" color="primary" startIcon={<Check />} onClick={() => onSave(draft)}>Ок</Button>
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubstituteModal
