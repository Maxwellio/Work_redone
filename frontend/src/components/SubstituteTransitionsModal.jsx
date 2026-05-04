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
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import { getSubstituteDetails } from '../api'
import { deleteSubstituteDetail, saveSubstituteDetail } from '../api/transitionDetailsApi'
import { useTheme } from '@mui/material/styles'
import { refModalTableContainerSx, tablePlaceholderMessageSx } from '../theme'

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

const mapRow = (row) => ({
  ...row,
  lCalc: row.lCur ?? row.l,
})

const getRowKey = (row) => row.idMakeSubstitute ?? `${row.seqNumOper}-${row.idOperations}`

function SubstituteTransitionsModal({
  open,
  substituteId,
  substituteName,
  onClose,
  onOpenTransitionsRefModal,
  onTransitionsListChange,
  transitionsListRefreshKey = 0,
}) {
  const theme = useTheme()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedRowKey, setSelectedRowKey] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    if (!open) {
      setSelectedRowKey(null)
    }
  }, [open])

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
  }, [open, substituteId, transitionsListRefreshKey])

  const rowsSorted = useMemo(
    () => [...rows].sort((a, b) => (a.seqNumOper ?? 0) - (b.seqNumOper ?? 0)),
    [rows]
  )

  const titleName = substituteName ? ` ${substituteName}` : ''
  const selectedIndex = useMemo(
    () => rowsSorted.findIndex((row) => getRowKey(row) === selectedRowKey),
    [rowsSorted, selectedRowKey]
  )
  const canMoveUp = selectedIndex > 0
  const canMoveDown = selectedIndex >= 0 && selectedIndex < rowsSorted.length - 1

  const buildSavePayload = (row, seqNumOper) => ({
    id: row.idMakeSubstitute,
    idSubstitutePrepared: substituteId,
    idOperations: row.idOperations ?? null,
    d: row.d ?? null,
    l: row.l ?? null,
    irazm: row.irazm ?? null,
    valueMeas: row.valueMeas ?? null,
    i: row.i ?? null,
    depthCut: row.depthCut ?? null,
    n: row.n ?? null,
    s: row.s ?? null,
    masCur: row.masCur ?? null,
    lCur: row.lCur ?? null,
    seqNumOper,
    idUserCreator: null,
  })

  const handleMoveTransition = async (direction) => {
    if (selectedIndex < 0) {
      window.alert('Выберите переход')
      return
    }
    const targetIndex = selectedIndex + direction
    if (targetIndex < 0 || targetIndex >= rowsSorted.length) return
    const selectedRow = rowsSorted[selectedIndex]
    const neighborRow = rowsSorted[targetIndex]
    if (!selectedRow || !neighborRow) return
    if (!selectedRow.idMakeSubstitute || !neighborRow.idMakeSubstitute) {
      window.alert('Нельзя изменить порядок: отсутствует идентификатор записи')
      return
    }

    setMoving(true)
    try {
      const selectedSeq = selectedRow.seqNumOper ?? null
      const neighborSeq = neighborRow.seqNumOper ?? null
      await saveSubstituteDetail(buildSavePayload(selectedRow, neighborSeq))
      await saveSubstituteDetail(buildSavePayload(neighborRow, selectedSeq))
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.idMakeSubstitute === selectedRow.idMakeSubstitute) {
            return { ...row, seqNumOper: neighborSeq }
          }
          if (row.idMakeSubstitute === neighborRow.idMakeSubstitute) {
            return { ...row, seqNumOper: selectedSeq }
          }
          return row
        })
      )
      onTransitionsListChange?.()
    } catch (err) {
      window.alert(err.message || 'Ошибка изменения порядка переходов')
    } finally {
      setMoving(false)
    }
  }

  const handleDeleteTransition = async () => {
    if (!selectedRowKey) {
      window.alert('Выберите переход')
      return
    }
    const selectedRow = rowsSorted.find((r) => getRowKey(r) === selectedRowKey)
    if (!selectedRow) return
    const pk = selectedRow.idMakeSubstitute
    if (pk == null || pk <= 0) {
      window.alert('Нельзя удалить: отсутствует идентификатор записи')
      return
    }
    if (!window.confirm('Удалить выбранный переход?')) return
    setDeleting(true)
    try {
      await deleteSubstituteDetail(pk)
      setSelectedRowKey(null)
      onTransitionsListChange?.()
    } catch (err) {
      window.alert(err.message || 'Ошибка удаления')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {`Переходы по переводнику${titleName}`}
        <IconButton onClick={onClose} aria-label="Закрыть" size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TableContainer sx={refModalTableContainerSx}>
          {error && (
            <Box sx={tablePlaceholderMessageSx(theme, { emphasized: true, nestedInWrap: true })}>{error}</Box>
          )}
          {loading && !error && (
            <Box sx={tablePlaceholderMessageSx(theme, { nestedInWrap: true })}>Загрузка…</Box>
          )}
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
                {rowsSorted.map((row) => {
                  const rowKey = getRowKey(row)
                  const isSelected = selectedRowKey === rowKey
                  return (
                    <TableRow
                      key={rowKey}
                      selected={isSelected}
                      onClick={() => setSelectedRowKey(isSelected ? null : rowKey)}
                      sx={{
                        cursor: 'pointer',
                        // Hover-подсветка как на `Home` (включая выбранную строку).
                        '&:hover': { backgroundColor: theme.palette.secondary.light },
                      }}
                    >
                      {COLUMNS.map((col) => (
                        <TableCell key={col.key}>{formatCell(row[col.key])}</TableCell>
                      ))}
                    </TableRow>
                  )
                })}
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
        <Box sx={{ display: 'flex', gap: 1, mr: 'auto' }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowUpward />}
            disabled={deleting || moving || !canMoveUp}
            onClick={() => handleMoveTransition(-1)}
          >
            Вверх
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowDownward />}
            disabled={deleting || moving || !canMoveDown}
            onClick={() => handleMoveTransition(1)}
          >
            Вниз
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          disabled={deleting || moving}
          onClick={() =>
            onOpenTransitionsRefModal?.({
              ownerType: 'substitute',
              mode: 'add',
              transitionRecordId: null,
            })
          }
        >
          Добавить переход
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={deleting || moving}
          onClick={() => {
            if (!selectedRowKey) {
              window.alert('Выберите переход')
              return
            }
            const selectedRow = rowsSorted.find((r) => getRowKey(r) === selectedRowKey)
            if (!selectedRow) return
            onOpenTransitionsRefModal?.({
              ownerType: 'substitute',
              mode: 'edit',
              selectedOperationId: selectedRow.idOperations ?? null,
              selectedOperationName: selectedRow.nmOperations ?? '',
              transitionDraft: {
                masCur: selectedRow.masCur ?? '',
                lCur: selectedRow.lCur ?? '',
                tVp: selectedRow.tVp ?? '',
                seqNumOper: selectedRow.seqNumOper ?? '',
                d: selectedRow.d ?? '',
                l: selectedRow.l ?? '',
                irazm: selectedRow.irazm ?? '',
                valueMeas: selectedRow.valueMeas ?? '',
                depthCut: selectedRow.depthCut ?? '',
                i: selectedRow.i ?? '',
                s: selectedRow.s ?? '',
                n: selectedRow.n ?? '',
                vRez: selectedRow.vRez ?? '',
                tMach: selectedRow.tMach ?? '',
                tSum: selectedRow.tSum ?? '',
              },
              transitionRecordId: selectedRow.idMakeSubstitute ?? selectedRow.idOperations ?? null,
            })
          }}
        >
          Изменить переход
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={deleting || moving}
          onClick={handleDeleteTransition}
        >
          Удалить переход
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Close />}
          disabled={deleting || moving}
          onClick={onClose}
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubstituteTransitionsModal
