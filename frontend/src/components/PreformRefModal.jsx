import DraggableDialog from './DraggableDialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Close from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'
import { refModalTableContainerSx, refModalTableSx, tablePlaceholderMessageSx } from '../theme'

function PreformRefModal({ open, onClose, list, loading, error }) {
  const theme = useTheme()
  const formatCell = (value) => (value == null ? '—' : String(value))
  const sorted = [...(list || [])].sort((a, b) => (a.idPreform ?? 0) - (b.idPreform ?? 0))

  return (
    <DraggableDialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { maxHeight: 'calc(100vh - 48px)' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Справочник заготовок
        <IconButton onClick={onClose} aria-label="Закрыть" size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <TableContainer sx={refModalTableContainerSx}>
          {loading && (
            <Box sx={tablePlaceholderMessageSx(theme, { nestedInWrap: true })}>Загрузка…</Box>
          )}
          {error && (
            <Box sx={tablePlaceholderMessageSx(theme, { emphasized: true, nestedInWrap: true })}>
              {error}
            </Box>
          )}
          {!loading && !error && (
            <Table size="small" sx={(t) => refModalTableSx(t)}>
              <TableHead>
                <TableRow>
                  <TableCell>Наименование</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sorted.map((row) => (
                  <TableRow key={row.idPreform}>
                    <TableCell>{formatCell(row.nmPreform)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose}>
          Закрыть
        </Button>
      </DialogActions>
    </DraggableDialog>
  )
}

export default PreformRefModal
