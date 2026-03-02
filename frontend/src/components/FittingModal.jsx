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

function FittingModal({
  open,
  isEditMode,
  selectedRowId,
  formData: initialFormData,
  preformTypesFiltered,
  partyList,
  preformError,
  saveError,
  onClose,
  onSave,
  tip,
}) {
  const isPatrubok = tip === 1
  const label = isPatrubok ? 'Патрубок' : 'Труба'
  const titleEdit = isPatrubok ? 'Редактирование патрубка' : 'Редактирование трубы'
  const titleAdd = isPatrubok ? 'Добавление патрубка' : 'Добавление трубы'
  const transitionsLabel = isPatrubok
    ? 'Переходы при изготовлении патрубка'
    : 'Переходы при изготовлении трубы'

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
        <Typography variant="subtitle1" fontWeight={600}>{label}</Typography>
        {isEditMode && (
          <Typography variant="body2" color="text.secondary">{selectedRowId}</Typography>
        )}
      </Box>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ minWidth: 100 }}>Наименование</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              <TextField size="small" value={draft.nm} onChange={handleFieldChange('nm')} sx={{ width: 96, minWidth: 64 }} />
              <Typography color="text.secondary">-</Typography>
              <TextField size="small" type="number" value={draft.d} onChange={handleFieldChange('d')} sx={{ width: 96, minWidth: 64 }} />
              {isPatrubok && (
                <>
                  <Typography color="text.secondary">x</Typography>
                  <TextField size="small" type="number" value={draft.th} onChange={handleFieldChange('th')} sx={{ width: 96, minWidth: 64 }} />
                </>
              )}
            </Box>
          </Box>

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
            label="Масса, кг"
            type="number"
            value={draft.mass}
            onChange={handleFieldChange('mass')}
          />

          {isPatrubok && (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>Заготовка</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Наименование</InputLabel>
                <Select value={draft.idPreform} label="Наименование" onChange={handleFieldChange('idPreform')}>
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
                label="Длина, мм"
                type="number"
                value={draft.lPreform}
                onChange={handleFieldChange('lPreform')}
              />
            </>
          )}

          <TextField
            fullWidth
            size="small"
            label="Коэф. жесткости, ГПа"
            type="number"
            value={draft.phPreform}
            onChange={handleFieldChange('phPreform')}
          />
          <TextField
            fullWidth
            size="small"
            label="Наибольший диаметр изделия"
            type="number"
            value={draft.dStan}
            onChange={handleFieldChange('dStan')}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Количество деталей в партии, шт.</InputLabel>
            <Select value={draft.cnt ?? ''} label="Количество деталей в партии, шт." onChange={handleFieldChange('cnt')}>
              <MenuItem value="">Выберите</MenuItem>
              {partyList.map((item) => (
                <MenuItem key={item.colParty} value={item.colParty}>
                  {item.colParty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      {saveError && (
        <Box sx={{ px: 3, py: 1.5, bgcolor: 'secondary.light', borderTop: 1, borderColor: 'divider' }} role="alert">
          <Typography variant="body2" color="text.secondary">{saveError}</Typography>
        </Box>
      )}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="primary">{transitionsLabel}</Button>
        <Button variant="contained" color="primary" startIcon={<Check />} onClick={() => onSave(draft)}>Ок</Button>
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  )
}

export default FittingModal
