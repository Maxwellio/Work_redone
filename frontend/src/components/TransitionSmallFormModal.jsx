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
import { calcFittingDetailTvp, calcSubstituteDetailTvp } from '../api'
import { computedNumericFieldSx } from '../theme'

const NUMERIC_FIELDS = new Set(['masCur', 'lCur'])

function TransitionSmallFormModal({
  open,
  onClose,
  isEditMode,
  idOperations,
  nmOperations,
  initialValues,
  onSave,
  ownerType = null,
}) {
  const title = isEditMode ? 'Редактирование перехода' : 'Добавление перехода'
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState({
    masCur: '',
    lCur: '',
    tVp: '',
  })

  useEffect(() => {
    if (!open) return
    setSaveError(null)
    if (isEditMode && initialValues) {
      setDraft({
        masCur: initialValues.masCur ?? '',
        lCur: initialValues.lCur ?? '',
        tVp: initialValues.tVp ?? '',
      })
      return
    }
    setDraft({
      masCur: '',
      lCur: '',
      tVp: '',
    })
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

  const handleCalculateTvp = async () => {
    setSaveError(null)
    setSaving(true)
    try {
      const payload = {
        idOperations,
        massPreform: draft.masCur === '' ? null : Number(draft.masCur),
        lPreform: draft.lCur === '' ? null : Number(draft.lCur),
      }
      const result =
        ownerType === 'fitting'
          ? await calcFittingDetailTvp(payload)
          : await calcSubstituteDetailTvp(payload)
      setDraft((prev) => ({
        ...prev,
        tVp: result?.tVp ?? '',
      }))
    } catch (err) {
      setSaveError(err.message || 'Ошибка расчета')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}>
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
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Масса детали, кг"
            type="number"
            value={draft.masCur}
            onChange={handleFieldChange('masCur')}
          />
          <TextField
            fullWidth
            size="small"
            label="Длина, мм"
            type="number"
            value={draft.lCur}
            onChange={handleFieldChange('lCur')}
          />
          <TextField
            fullWidth
            size="small"
            label="Норма времени, мин"
            type="number"
            value={draft.tVp}
            sx={computedNumericFieldSx}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" aria-label="Расчёт" size="small" onClick={handleCalculateTvp} disabled={saving}>
                    <Calculate fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
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

export default TransitionSmallFormModal
