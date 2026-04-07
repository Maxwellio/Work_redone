import { useCallback, useEffect, useState } from 'react'
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
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Close from '@mui/icons-material/Close'
import Calculate from '@mui/icons-material/Calculate'
import { getNtkForTransition } from '../api/fittingsApi'

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
  ownerType = null,
  tip = null,
  dStan = null,
}) {
  const showNtkPanel = ownerType === 'fitting' && (tip === 1 || tip === 2)
  const title = isEditMode ? 'Редактирование перехода' : 'Добавление перехода'
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [ntkRows, setNtkRows] = useState([])
  const [ntkLoading, setNtkLoading] = useState(false)
  const [ntkError, setNtkError] = useState(null)
  const [checkedNtkIds, setCheckedNtkIds] = useState(() => new Set())

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
    setDraft({
      ...emptyDraft(),
      seqNumOper: initialValues?.seqNumOper != null ? String(initialValues.seqNumOper) : '',
    })
  }, [open, idOperations, isEditMode, initialValues])

  useEffect(() => {
    if (!open) {
      setCheckedNtkIds(new Set())
    }
  }, [open])

  useEffect(() => {
    if (!open || !showNtkPanel || dStan == null) {
      setNtkRows([])
      setNtkError(null)
      setNtkLoading(false)
      return
    }
    let cancelled = false
    setNtkLoading(true)
    setNtkError(null)
    getNtkForTransition(dStan)
      .then((rows) => {
        if (!cancelled) setNtkRows(Array.isArray(rows) ? rows : [])
      })
      .catch((err) => {
        if (!cancelled) setNtkError(err.message || 'Ошибка загрузки')
      })
      .finally(() => {
        if (!cancelled) setNtkLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, showNtkPanel, dStan])

  const handleNtkToggle = useCallback((idNtk) => {
    if (idNtk == null) return
    setCheckedNtkIds((prev) => {
      const next = new Set(prev)
      if (next.has(idNtk)) next.delete(idNtk)
      else next.add(idNtk)
      return next
    })
  }, [])

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

  const formGrid = (
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
  )

  const ntkPanel = showNtkPanel ? (
    <Box
      sx={{
        flex: { md: '1 1 0' },
        minWidth: 0,
        borderTop: { xs: 1, md: 0 },
        borderLeft: { md: 1 },
        borderColor: 'divider',
        pt: { xs: 2, md: 0 },
        pl: { md: 2 },
        maxHeight: { md: 480 },
        overflow: 'auto',
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        НТК
      </Typography>
      {dStan == null && (
        <Typography variant="body2" color="text.secondary">
          Нет станочного диаметра (dStan) для детали — список недоступен.
        </Typography>
      )}
      {dStan != null && ntkLoading && (
        <Typography variant="body2" color="text.secondary">
          Загрузка…
        </Typography>
      )}
      {dStan != null && ntkError && (
        <Typography variant="body2" color="error">
          {ntkError}
        </Typography>
      )}
      {dStan != null && !ntkLoading && !ntkError && (
        <List dense disablePadding>
          {ntkRows.map((row) => {
            const id = row.idNtk
            const key = id != null ? String(id) : row.nm
            const label = row.nm ?? '—'
            return (
              <ListItem key={key} disableGutters sx={{ py: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={id != null && checkedNtkIds.has(id)}
                      onChange={() => handleNtkToggle(id)}
                    />
                  }
                  label={label}
                  sx={{ alignItems: 'flex-start', mr: 0 }}
                />
              </ListItem>
            )
          })}
          {!ntkRows.length && (
            <Typography variant="body2" color="text.secondary">
              Нет записей для выбранного диаметра.
            </Typography>
          )}
        </List>
      )}
    </Box>
  ) : null

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth={showNtkPanel ? 'lg' : 'md'}
      fullWidth
      PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}
    >
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
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ flex: showNtkPanel ? { md: '2 1 0' } : 1, minWidth: 0 }}>{formGrid}</Box>
          {ntkPanel}
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
