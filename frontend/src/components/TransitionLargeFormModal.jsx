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
import InputAdornment from '@mui/material/InputAdornment'
import Close from '@mui/icons-material/Close'
import Calculate from '@mui/icons-material/Calculate'

const NUMERIC_FIELDS = new Set([
  'd',
  'l',
  'valueMeas',
  'depthCut',
  'i',
  's',
  'n',
  'seqNumOper',
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

function TransitionLargeFormModal({
  open,
  onClose,
  isEditMode,
  idOperations,
  nmOperations,
  initialValues,
  onSave,
}) {
  const title = isEditMode ? 'Редактирование перехода' : 'Добавление перехода'
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)

  useEffect(() => {
    if (!open) return
    setSaveError(null)
    if (isEditMode && initialValues) {
      setDraft({
        d: initialValues.d ?? '',
        l: initialValues.l ?? '',
        valueMeas: initialValues.valueMeas ?? '',
        depthCut: initialValues.depthCut ?? '',
        i: initialValues.i ?? '',
        s: initialValues.s ?? '',
        n: initialValues.n ?? '',
        vRez: initialValues.vRez ?? '',
        tMach: initialValues.tMach ?? '',
        tVp: initialValues.tVp ?? '',
        seqNumOper: initialValues.seqNumOper ?? '',
        tSum: initialValues.tSum ?? '',
      })
      return
    }
    setDraft(emptyDraft())
  }, [open, idOperations, isEditMode, initialValues])

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

  const handleOk = async () => {
    setSaveError(null)
    if (typeof onSave === 'function') {
      setSaving(true)
      try {
        await onSave(draft)
      } catch (err) {
        setSaveError(err.message || 'Ошибка сохранения')
      } finally {
        setSaving(false)
      }
      return
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="md" fullWidth PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton onClick={onClose} aria-label="Закрыть" size="small" disabled={saving}>
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
        {saveError && (
          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
            {saveError}
          </Typography>
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <Stack spacing={2}>
            <TextField fullWidth size="small" label="Длина наруж, мм" type="number" value={draft.d} onChange={handleFieldChange('d')} />
            <TextField fullWidth size="small" label="Длина, мм" type="number" value={draft.l} onChange={handleFieldChange('l')} />
            <TextField fullWidth size="small" label="Измер велич, мм" type="number" value={draft.valueMeas} onChange={handleFieldChange('valueMeas')} />
            <TextField fullWidth size="small" label="Глубина резания, мм" type="number" value={draft.depthCut} onChange={handleFieldChange('depthCut')} />
            <TextField fullWidth size="small" label="Число проходов" type="number" value={draft.i} onChange={handleFieldChange('i')} />
            <TextField fullWidth size="small" label="Подача, мм/об" type="number" value={draft.s} onChange={handleFieldChange('s')} />
            <TextField fullWidth size="small" label="Обороты шп., об/мин" type="number" value={draft.n} onChange={handleFieldChange('n')} />
          </Stack>

          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Tмаш, мин"
              type="number"
              value={draft.tMach}
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" aria-label="Расчёт" size="small" onClick={() => {}}>
                      <Calculate fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField fullWidth size="small" label="Vрез, м/мин" type="number" value={draft.vRez} disabled />
            <TextField fullWidth size="small" label="Твсп, мин" type="number" value={draft.tVp} disabled />
            <TextField fullWidth size="small" label="Норма времени, мин" type="number" value={draft.tSum} disabled />
            <TextField
              fullWidth
              size="small"
              label="Порядковый номер операции"
              type="number"
              value={draft.seqNumOper}
              onChange={handleFieldChange('seqNumOper')}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOk} disabled={saving}>
          ОК
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>
          Отменить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransitionLargeFormModal
