import { useEffect, useState } from 'react'
import DraggableDialog from './DraggableDialog'
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
import { useTheme } from '@mui/material/styles'
import { refModalTableContainerSx, refModalTableSx, tablePlaceholderMessageSx } from '../theme'

function TransitionsRefModal({
  open,
  onClose,
  onExited,
  groups,
  operations,
  selectedGroupId,
  onSelectGroup,
  loadingRefData,
  errorRefData,
  onOk,
  showOkButton = true,
}) {
  const theme = useTheme()
  const formatCell = (value) => (value == null ? '—' : String(value))
  const groupsSorted = [...groups].sort((a, b) => (a.idGroupOperations ?? 0) - (b.idGroupOperations ?? 0))
  const operationsSorted = [...operations].sort((a, b) => (a.idOperations ?? 0) - (b.idOperations ?? 0))
  const [selectedOperationId, setSelectedOperationId] = useState(null)

  useEffect(() => {
    if (!open) setSelectedOperationId(null)
  }, [open])

  useEffect(() => {
    setSelectedOperationId(null)
  }, [selectedGroupId])

  const rowPointerSx = {
    cursor: 'pointer',
    '&:hover': { backgroundColor: theme.palette.secondary.light },
  }

  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}
      TransitionProps={{ onExited }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Справочник переходов
        <IconButton onClick={onClose} aria-label="Закрыть" size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ px: 3, py: 2 }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1.5fr' },
            gap: 3,
            minHeight: { sm: 280 },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ m: '0 0 0.5rem' }}>
              Группа
            </Typography>
            <TableContainer sx={refModalTableContainerSx}>
              {loadingRefData && (
                <Box sx={tablePlaceholderMessageSx(theme, { nestedInWrap: true })}>Загрузка…</Box>
              )}
              {!loadingRefData && errorRefData && (
                <Box sx={tablePlaceholderMessageSx(theme, { emphasized: true, nestedInWrap: true })}>
                  {errorRefData}
                </Box>
              )}
              {!loadingRefData && !errorRefData && (
                <Table size="small" sx={(t) => refModalTableSx(t)}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Группа</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupsSorted.map((g) => (
                      <TableRow
                        key={g.idGroupOperations}
                        selected={selectedGroupId === g.idGroupOperations}
                        onClick={() => onSelectGroup(selectedGroupId === g.idGroupOperations ? null : g.idGroupOperations)}
                        sx={rowPointerSx}
                      >
                        <TableCell>{formatCell(g.nmGroupOperations)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ m: '0 0 0.5rem' }}>
              Операции
            </Typography>
            <TableContainer sx={refModalTableContainerSx}>
              {loadingRefData && (
                <Box sx={tablePlaceholderMessageSx(theme, { nestedInWrap: true })}>Загрузка…</Box>
              )}
              {!loadingRefData && errorRefData && (
                <Box sx={tablePlaceholderMessageSx(theme, { emphasized: true, nestedInWrap: true })}>
                  {errorRefData}
                </Box>
              )}
              {!loadingRefData && !errorRefData && selectedGroupId == null && (
                <Box sx={tablePlaceholderMessageSx(theme, { nestedInWrap: true })}>Выберите группу слева</Box>
              )}
              {!loadingRefData && !errorRefData && selectedGroupId != null && (
                <Table size="small" sx={(t) => refModalTableSx(t)}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Наименование перехода</TableCell>
                      <TableCell>Tk, мин</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {operationsSorted.map((op) => (
                      <TableRow
                        key={op.idOperations}
                        selected={selectedOperationId === op.idOperations}
                        onClick={() => setSelectedOperationId(op.idOperations)}
                        sx={rowPointerSx}
                      >
                        <TableCell>{formatCell(op.nmOperations)}</TableCell>
                        <TableCell>{formatCell(op.tk)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {showOkButton && (
          <Button
            variant="contained"
            color="primary"
            disabled={selectedOperationId == null}
            onClick={() => onOk?.(selectedOperationId)}
          >
            ОК
          </Button>
        )}
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>
          Закрыть
        </Button>
      </DialogActions>
    </DraggableDialog>
  )
}

export default TransitionsRefModal
