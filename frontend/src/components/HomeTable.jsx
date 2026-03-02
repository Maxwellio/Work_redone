import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import '../styles/Home.css'

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
}) {
  return (
    <TableContainer className="home-table-wrap" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'secondary.main', borderRadius: 1 }}>
      {error && (
        <Box className="home-table-message home-table-message_error">{error}</Box>
      )}
      {loading && (
        <Box className="home-table-message">Загрузка…</Box>
      )}
      {!loading && !error && (
        <Table size="small" stickyHeader className="home-table">
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
