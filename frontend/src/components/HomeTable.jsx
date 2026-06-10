import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
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
  sortField,
  sortDirection,
  onSort,
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
                <TableCell
                  key={col.key}
                  sortDirection={sortField === col.key ? sortDirection : false}
                  sx={col.sortable ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortField === col.key}
                      direction={sortField === col.key ? sortDirection : 'asc'}
                      hideSortIcon={sortField !== col.key}
                      onClick={() => onSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
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
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
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
