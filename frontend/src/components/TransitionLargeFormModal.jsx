import { useCallback, useEffect, useState } from 'react'
import DraggableDialog from './DraggableDialog'
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
import { calcFittingDetailLargeForm, calcSubstituteDetailLargeForm } from '../api'
import { getFittingDetailNtk, getNtkForTransition } from '../api/fittingsApi'
import {
  isIrazmUsedInLargeFormCalc,
  isValueMeasUsedInLargeFormCalc,
} from '../utils/operationCategory'
import { computedNumericFieldSx } from '../theme'

const disabledReadonlyFieldSx = {
  '& .MuiOutlinedInput-root.Mui-disabled': {
    bgcolor: 'action.disabledBackground',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'divider',
    },
  },
}

const NUMERIC_FIELDS = new Set([
  'd',
  'l',
  'irazm',
  'valueMeas',
  'depthCut',
  'i',
  's',
  'n',
])

const emptyDraft = () => ({
  d: '',
  l: '',
  irazm: '',
  valueMeas: '',
  depthCut: '',
  i: '',
  s: '',
  n: '',
  vRez: '',
  tMach: '',
  tVp: '',
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
  idFiting = null,
  idSubstitutePrepared = null,
  transitionRecordId = null,
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
  const [ntkLinksError, setNtkLinksError] = useState(null)

  const irazmEnabled = isIrazmUsedInLargeFormCalc(idOperations)
  const valueMeasEnabled = isValueMeasUsedInLargeFormCalc(idOperations)

  useEffect(() => {
    if (!open) return
    setSaveError(null)
    if (isEditMode && initialValues) {
      setDraft({
        d: initialValues.d ?? '',
        l: initialValues.l ?? '',
        irazm: irazmEnabled ? initialValues.irazm ?? '' : '',
        valueMeas: valueMeasEnabled ? initialValues.valueMeas ?? '' : '',
        depthCut: initialValues.depthCut ?? '',
        i: initialValues.i ?? '',
        s: initialValues.s ?? '',
        n: initialValues.n ?? '',
        vRez: initialValues.vRez ?? '',
        tMach: initialValues.tMach ?? '',
        tVp: initialValues.tVp ?? '',
        tSum: initialValues.tSum ?? '',
      })
      return
    }
    setDraft(emptyDraft())
  }, [open, idOperations, isEditMode, initialValues, irazmEnabled, valueMeasEnabled])

  useEffect(() => {
    if (!open) {
      setCheckedNtkIds(new Set())
      setNtkLinksError(null)
    }
  }, [open])

  useEffect(() => {
    if (!open || !showNtkPanel || !isEditMode || transitionRecordId == null) {
      return
    }
    let cancelled = false
    setNtkLinksError(null)
    getFittingDetailNtk(transitionRecordId)
      .then((rows) => {
        if (cancelled) return
        const ids = new Set(
          (Array.isArray(rows) ? rows : [])
            .map((r) => r.idNtk)
            .filter((id) => id != null && Number.isInteger(Number(id)))
            .map((id) => Number(id))
        )
        setCheckedNtkIds(ids)
      })
      .catch((err) => {
        if (!cancelled) setNtkLinksError(err.message || 'Не удалось загрузить отмеченные НТК')
      })
    return () => {
      cancelled = true
    }
  }, [open, showNtkPanel, isEditMode, transitionRecordId])

  const hasNtkCatalogKey = idFiting != null && idFiting !== ''
  const canLoadNtkCatalog = showNtkPanel && hasNtkCatalogKey

  useEffect(() => {
    if (!open || !canLoadNtkCatalog) {
      setNtkRows([])
      setNtkError(null)
      setNtkLoading(false)
      return
    }
    let cancelled = false
    setNtkLoading(true)
    setNtkError(null)
    getNtkForTransition(idFiting)
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
  }, [open, canLoadNtkCatalog, idFiting])

  const handleNtkToggle = useCallback((idNtk) => {
    if (idNtk == null || idNtk === '') return
    const id = typeof idNtk === 'number' ? idNtk : parseInt(String(idNtk), 10)
    if (!Number.isInteger(id)) return
    setCheckedNtkIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
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

  const parseNumOrNull = (v) => {
    if (v === '' || v == null) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }

  const parseIntOrNull = (v) => {
    if (v === '' || v == null) return null
    const n = parseInt(String(v), 10)
    return Number.isInteger(n) ? n : null
  }

  const canRunLargeFormCalc =
    idOperations != null &&
    (ownerType === 'substitute' || (ownerType === 'fitting' && showNtkPanel))

  const handleCalculateLargeForm = async () => {
    if (!canRunLargeFormCalc) return
    setSaveError(null)
    setSaving(true)
    try {
      const basePayload = {
        idOperations,
        i: parseIntOrNull(draft.i),
        s: parseNumOrNull(draft.s),
        d: parseNumOrNull(draft.d),
        n: parseNumOrNull(draft.n),
        l: parseNumOrNull(draft.l),
        valueMeas: valueMeasEnabled ? parseNumOrNull(draft.valueMeas) : null,
        irazm: irazmEnabled ? parseNumOrNull(draft.irazm) : null,
      }
      const result =
        ownerType === 'substitute'
          ? await calcSubstituteDetailLargeForm({
              ...basePayload,
              idSubstitutePrepared,
            })
          : await calcFittingDetailLargeForm({
              ...basePayload,
              idFiting,
              idNtk: Array.from(checkedNtkIds),
            })
      setDraft((prev) => ({
        ...prev,
        tVp: result?.tVp ?? '',
        vRez: result?.vRez ?? '',
        tMach: result?.tMach ?? '',
        tSum: result?.tSum ?? '',
      }))
    } catch (err) {
      setSaveError(err.message || 'Ошибка расчета')
    } finally {
      setSaving(false)
    }
  }

  const handleOk = async () => {
    setSaveError(null)
    if (typeof onSave === 'function') {
      setSaving(true)
      try {
        const payload =
          showNtkPanel && ownerType === 'fitting'
            ? { ...draft, idNtk: Array.from(checkedNtkIds) }
            : draft
        await onSave(payload)
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
        <TextField
          fullWidth
          size="small"
          label="Измеряемый размер, мм"
          type="number"
          value={draft.irazm}
          onChange={handleFieldChange('irazm')}
          disabled={!irazmEnabled}
          sx={disabledReadonlyFieldSx}
        />
        <TextField
          fullWidth
          size="small"
          label="Измер велич, мм"
          type="number"
          value={draft.valueMeas}
          onChange={handleFieldChange('valueMeas')}
          disabled={!valueMeasEnabled}
          sx={disabledReadonlyFieldSx}
        />
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
          sx={computedNumericFieldSx}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth
          size="small"
          label="Vрез, м/мин"
          type="number"
          value={draft.vRez}
          sx={computedNumericFieldSx}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth
          size="small"
          label="Твсп, мин"
          type="number"
          value={draft.tVp}
          sx={computedNumericFieldSx}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth
          size="small"
          label="Норма времени, мин"
          type="number"
          value={draft.tSum}
          sx={computedNumericFieldSx}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label="Расчёт"
                  size="small"
                  onClick={handleCalculateLargeForm}
                  disabled={saving || !canRunLargeFormCalc}
                >
                  <Calculate fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  )

  const ntkPanel = showNtkPanel ? (
    <Box
      sx={{
        flex: { md: '1.5 1 0' },
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
      {ntkLinksError && (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {ntkLinksError}
        </Typography>
      )}
      {!hasNtkCatalogKey && (
        <Typography variant="body2" color="text.secondary">
          Не выбрана деталь — список НТК недоступен.
        </Typography>
      )}
      {hasNtkCatalogKey && ntkLoading && (
        <Typography variant="body2" color="text.secondary">
          Загрузка…
        </Typography>
      )}
      {hasNtkCatalogKey && ntkError && (
        <Typography variant="body2" color="error">
          {ntkError}
        </Typography>
      )}
      {hasNtkCatalogKey && !ntkLoading && !ntkError && (
        <List dense disablePadding>
          {ntkRows.map((row) => {
            const rawId = row.idNtk
            const id =
              rawId != null && rawId !== '' ? parseInt(String(rawId), 10) : null
            const key = id != null && Number.isInteger(id) ? String(id) : row.nm
            const label = row.nm ?? '—'
            return (
              <ListItem key={key} disableGutters sx={{ py: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={id != null && Number.isInteger(id) && checkedNtkIds.has(id)}
                      onChange={() => handleNtkToggle(rawId)}
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
    <DraggableDialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth={showNtkPanel ? 'xl' : 'md'}
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
          <Box sx={{ flex: showNtkPanel ? { md: '1 1 0' } : 1, minWidth: 0 }}>{formGrid}</Box>
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
    </DraggableDialog>
  )
}

export default TransitionLargeFormModal
