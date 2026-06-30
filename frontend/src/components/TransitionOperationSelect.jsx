import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function TransitionOperationSelect({
  value,
  options = [],
  loading = false,
  disabled = false,
  error = null,
  onChange,
}) {
  const selectValue = value != null ? String(value) : ''
  const hasOptions = options.length > 0

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <FormControl fullWidth size="small" disabled={disabled || loading || !hasOptions}>
        <InputLabel id="transition-operation-select-label">Переход</InputLabel>
        <Select
          labelId="transition-operation-select-label"
          label="Переход"
          value={hasOptions && options.some((op) => String(op.idOperations) === selectValue) ? selectValue : ''}
          onChange={(event) => {
            const next = event.target.value
            if (next === '') return
            const parsed = parseInt(String(next), 10)
            if (Number.isInteger(parsed) && typeof onChange === 'function') {
              onChange(parsed)
            }
          }}
          renderValue={(selected) => {
            const op = options.find((item) => String(item.idOperations) === String(selected))
            if (!op) return '—'
            return (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1, minWidth: 0 }}>
                  {op.nmOperations || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {op.idOperations}
                </Typography>
              </Box>
            )
          }}
        >
          {options.map((op) => (
            <MenuItem key={op.idOperations} value={String(op.idOperations)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
                  {op.nmOperations || '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {op.idOperations}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
        {error && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {error}
          </Typography>
        )}
      </FormControl>
    </Box>
  )
}

export default TransitionOperationSelect
