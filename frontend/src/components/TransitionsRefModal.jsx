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
import '../styles/TransitionsRefModal.css'

function TransitionsRefModal({
  open,
  onClose,
  groups,
  operations,
  selectedGroupId,
  onSelectGroup,
  loadingGroups,
  loadingOperations,
  errorGroups,
  errorOperations,
}) {
  const formatCell = (value) => (value == null ? '—' : String(value))
  const groupsSorted = [...groups].sort((a, b) => (a.idGroupOperations ?? 0) - (b.idGroupOperations ?? 0))
  const operationsSorted = [...operations].sort((a, b) => (a.idOperations ?? 0) - (b.idOperations ?? 0))

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Справочник переходов
        <IconButton onClick={onClose} aria-label="Закрыть" size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="transitions-ref-modal__body">
        <Box className="transitions-ref-modal__columns">
          <Box className="transitions-ref-modal__column">
            <Typography variant="subtitle1" fontWeight={600} className="transitions-ref-modal__column-title">
              Группа
            </Typography>
            <TableContainer className="transitions-ref-modal__table-wrap">
              {loadingGroups && (
                <Box className="home-table-message" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  Загрузка…
                </Box>
              )}
              {errorGroups && (
                <Box className="home-table-message home-table-message_error" sx={{ p: 2, textAlign: 'center', color: 'text.secondary', fontWeight: 500 }}>
                  {errorGroups}
                </Box>
              )}
              {!loadingGroups && !errorGroups && (
                <Table size="small" className="transitions-ref-modal__table">
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
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{formatCell(g.nmGroupOperations)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>

          <Box className="transitions-ref-modal__column">
            <Typography variant="subtitle1" fontWeight={600} className="transitions-ref-modal__column-title">
              Операции
            </Typography>
            <TableContainer className="transitions-ref-modal__table-wrap">
              {selectedGroupId == null && !loadingOperations && (
                <Box className="home-table-message" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  Выберите группу слева
                </Box>
              )}
              {loadingOperations && (
                <Box className="home-table-message" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  Загрузка…
                </Box>
              )}
              {errorOperations && (
                <Box className="home-table-message home-table-message_error" sx={{ p: 2, textAlign: 'center', color: 'text.secondary', fontWeight: 500 }}>
                  {errorOperations}
                </Box>
              )}
              {!loadingOperations && !errorOperations && selectedGroupId != null && (
                <Table size="small" className="transitions-ref-modal__table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Наименование перехода</TableCell>
                      <TableCell>Tk, мин</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {operationsSorted.map((op) => (
                      <TableRow key={op.idOperations}>
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
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransitionsRefModal
