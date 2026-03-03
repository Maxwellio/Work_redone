import { useEffect, useMemo, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Close from '@mui/icons-material/Close'
import { getSubstituteDetails } from '../api'
import '../styles/Home.css'

const COLUMNS = [
  { key: 'seqNumOper', label: '№' },
  { key: 'nmOperations', label: 'Переход' },
  { key: 'd', label: 'Диам. наруж. мм' },
  { key: 'lCalc', label: 'Длина обраб. Поверх. мм' },
  { key: 'valueMeas', label: 'Измер. велич. мм' },
  { key: 'depthCut', label: 'Глубиа резания мм' },
  { key: 'i', label: 'Число проходов' },
  { key: 's', label: 'Подача мм/об' },
  { key: 'n', label: 'Обороты шп. мм' },
  { key: 'vRez', label: 'Vрез м/мин' },
  { key: 'tMach', label: 'Tмаш м/мин' },
  { key: 'tVp', label: 'Tвсп мин' },
  { key: 'tSum', label: 'Tобщ мин' },
]

const formatCell = (value) => (value == null ? '—' : String(value))

const toNumeric = (value) => {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const mapRow = (row) => {
  const lCalc = row.lCur ?? row.l
  const tMachNum = toNumeric(row.tMach)
  const tVpNum = toNumeric(row.tVp)
  const fallbackTSum = tMachNum == null && tVpNum == null ? null : (tMachNum ?? 0) + (tVpNum ?? 0)
  return {
    ...row,
    lCalc,
    tSum: row.tSum ?? fallbackTSum,
  }
}

function SubstituteTransitionsModal({ open, substituteId, substituteName, onClose }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || substituteId == null) return
    let isMounted = true
    setLoading(true)
    setError(null)
    getSubstituteDetails(substituteId)
      .then((data) => {
        if (!isMounted) return
        const mapped = (Array.isArray(data) ? data : []).map(mapRow)
        setRows(mapped)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.message || 'Ошибка загрузки переходов')
        setRows([])
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [open, substituteId])

  const rowsSorted = useMemo(
    () => [...rows].sort((a, b) => (a.seqNumOper ?? 0) - (b.seqNumOper ?? 0)),
    [rows]
  )

  const titleName = substituteName ? ` ${substituteName}` : ''

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {`Переходы по переводнику${titleName}`}
        <IconButton onClick={onClose} aria-label="Закрыть" size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TableContainer sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'secondary.main', borderRadius: 1 }}>
          {error && <Box className="home-table-message home-table-message_error">{error}</Box>}
          {loading && <Box className="home-table-message">Загрузка…</Box>}
          {!loading && !error && (
            <Table
              size="small"
              stickyHeader
              sx={{
                '& .MuiTableRow-root:not(:last-of-type) > .MuiTableCell-root': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
                '& .MuiTableCell-root:not(:last-of-type)': {
                  borderRight: '1px solid',
                  borderColor: 'divider',
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.key}>{col.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsSorted.map((row) => (
                  <TableRow key={row.idMakeSubstitute ?? `${row.seqNumOper}-${row.idOperations}`}>
                    {COLUMNS.map((col) => (
                      <TableCell key={col.key}>{formatCell(row[col.key])}</TableCell>
                    ))}
                  </TableRow>
                ))}
                {!rowsSorted.length && (
                  <TableRow>
                    <TableCell colSpan={COLUMNS.length}>
                      <Typography variant="body2" color="text.secondary">
                        Нет переходов для выбранного переводника
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="primary">Добавить переход</Button>
        <Button variant="contained" color="primary">Изменить переход</Button>
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubstituteTransitionsModal
