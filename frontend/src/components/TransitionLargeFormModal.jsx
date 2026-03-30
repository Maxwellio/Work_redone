import { useEffect, useState } from 'react'
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
import Close from '@mui/icons-material/Close'

const NUMERIC_FIELDS = new Set([
  'd',
  'l',
  'valueMeas',
  'depthCut',
  'i',
  's',
  'n',
  'vRez',
  'tMach',
  'tVp',
  'seqNumOper',
  'tSum',
])

const emptyDraft = () => ({
  d: '',
  l: '',
  valueMeas: '',
  depthCut: '',
  i: '',
  s: '',
  n: '',
  vRez: '',
  tMach: '',
  tVp: '',
  seqNumOper: '',
  tSum: '',
})

function TransitionLargeFormModal({ open, onClose, isEditMode, idOperations, nmOperations }) {
  const title = isEditMode ? 'Редактирование перехода' : 'Добавление перехода'
  const [draft, setDraft] = useState(emptyDraft)

  useEffect(() => {
    if (!open) return
    setDraft(emptyDraft())
  }, [open, idOperations])

  const handleFieldChange = (field) => (event) => {
    let { value } = event.target
    if (NUMERIC_FIELDS.has(field)) {
      if (value !== '') {
        value = String(value).replace(',', '.')
        value = value.replace(/[^0-9.]/g, '')
        if (value.length > 10) {
          value = value.slice(0, 10)
        }
      }
    }
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
      <Box sx={{ px: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1, minWidth: 0 }}>
          {nmOperations || '—'}
        </Typography>
        {idOperations != null && (
          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
            {idOperations}
          </Typography>
        )}
      </Box>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField fullWidth size="small" label="Длина наруж, мм" type="number" value={draft.d} onChange={handleFieldChange('d')} />
          <TextField fullWidth size="small" label="Длина, мм" type="number" value={draft.l} onChange={handleFieldChange('l')} />
          <TextField fullWidth size="small" label="Измер велич, мм" type="number" value={draft.valueMeas} onChange={handleFieldChange('valueMeas')} />
          <TextField fullWidth size="small" label="Глубина резания, мм" type="number" value={draft.depthCut} onChange={handleFieldChange('depthCut')} />
          <TextField fullWidth size="small" label="Число проходов" type="number" value={draft.i} onChange={handleFieldChange('i')} />
          <TextField fullWidth size="small" label="Подача, мм/об" type="number" value={draft.s} onChange={handleFieldChange('s')} />
          <TextField fullWidth size="small" label="Обороты шп., об/мин" type="number" value={draft.n} onChange={handleFieldChange('n')} />
          <TextField fullWidth size="small" label="Vрез, м/мин" type="number" value={draft.vRez} onChange={handleFieldChange('vRez')} />
          <TextField fullWidth size="small" label="Tмаш, мин" type="number" value={draft.tMach} onChange={handleFieldChange('tMach')} />
          <TextField fullWidth size="small" label="Твсп, мин" type="number" value={draft.tVp} onChange={handleFieldChange('tVp')} />
          <TextField fullWidth size="small" label="Порядковый номер операции" type="number" value={draft.seqNumOper} onChange={handleFieldChange('seqNumOper')} />
          <TextField fullWidth size="small" label="Норма времени, мин" type="number" value={draft.tSum} onChange={handleFieldChange('tSum')} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="primary" onClick={onClose}>
          ОК
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Отменить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransitionLargeFormModal
