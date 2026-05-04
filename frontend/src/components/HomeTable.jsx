import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { homeGridTableSx, tablePlaceholderMessageSx } from '../theme'

function HomeTable({
  columns,
  listData,
  activeTab,
  selectedRowId,
  loading,
  error,
  getRowId,
  formatCell,
  onSelectRow,
  onRowDoubleClick,
}) {
  const theme = useTheme()
  return (
    <TableContainer
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        mt: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'secondary.main',
        borderRadius: 1,
      }}
    >
      {error && (
        <Box sx={tablePlaceholderMessageSx(theme, { emphasized: true })}>{error}</Box>
      )}
      {loading && !error && (
        <Box sx={tablePlaceholderMessageSx(theme)}>Загрузка…</Box>
      )}
      {!loading && !error && (
        <Table size="small" stickyHeader sx={(t) => homeGridTableSx(t)}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {listData.map((row) => {
              const id = getRowId(row, activeTab)
              return (
                <TableRow
                  key={id}
                  data-row-id={id}
                  selected={selectedRowId === id}
                  onClick={() => onSelectRow(selectedRowId === id ? null : id)}
                  onDoubleClick={() => onRowDoubleClick?.(id)}
                  sx={{ cursor: 'pointer' }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {formatCell(col.getValue ? col.getValue(row) : row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  )
}

export default HomeTable
