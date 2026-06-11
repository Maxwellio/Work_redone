import { useCallback, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import {
  HOME_TABLE_OVERSCAN,
  HOME_TABLE_ROW_HEIGHT,
  HOME_TABLE_VIRTUAL_THRESHOLD,
} from '../constants/tableLayout'
import { useVirtualRange } from '../hooks/useVirtualRange'
import { homeGridTableSx, homeGridVirtualRowSx, tablePlaceholderMessageSx } from '../theme'

function TableDataRow({
  row,
  id,
  columns,
  selectedRowId,
  formatCell,
  onSelectRow,
  onRowDoubleClick,
  virtualized,
}) {
  return (
    <TableRow
      key={id}
      data-row-id={id}
      selected={selectedRowId === id}
      onClick={() => onSelectRow(selectedRowId === id ? null : id)}
      onDoubleClick={() => onRowDoubleClick?.(id)}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        ...(virtualized ? homeGridVirtualRowSx(HOME_TABLE_ROW_HEIGHT) : undefined),
      }}
    >
      {columns.map((col) => {
        const rawValue = col.getValue ? col.getValue(row) : row[col.key]
        const displayValue = formatCell(rawValue)
        return (
          <TableCell key={col.key} title={virtualized ? displayValue : undefined}>
            {displayValue}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

function VirtualizedTableBody({
  scrollEl,
  listData,
  columns,
  activeTab,
  selectedRowId,
  getRowId,
  formatCell,
  onSelectRow,
  onRowDoubleClick,
}) {
  const { startIndex, endIndex, paddingTop, paddingBottom } = useVirtualRange(
    scrollEl,
    listData.length,
    HOME_TABLE_ROW_HEIGHT,
    HOME_TABLE_OVERSCAN
  )
  const visibleRows = listData.slice(startIndex, endIndex)

  return (
    <TableBody>
      {paddingTop > 0 && (
        <TableRow aria-hidden sx={{ height: paddingTop, pointerEvents: 'none' }}>
          <TableCell
            colSpan={columns.length}
            padding="none"
            sx={{ border: 'none', p: 0, height: paddingTop, lineHeight: 0 }}
          />
        </TableRow>
      )}
      {visibleRows.map((row, index) => {
        const id = getRowId(row, activeTab)
        return (
          <TableDataRow
            key={id ?? startIndex + index}
            row={row}
            id={id}
            columns={columns}
            selectedRowId={selectedRowId}
            formatCell={formatCell}
            onSelectRow={onSelectRow}
            onRowDoubleClick={onRowDoubleClick}
            virtualized
          />
        )
      })}
      {paddingBottom > 0 && (
        <TableRow aria-hidden sx={{ height: paddingBottom, pointerEvents: 'none' }}>
          <TableCell
            colSpan={columns.length}
            padding="none"
            sx={{ border: 'none', p: 0, height: paddingBottom, lineHeight: 0 }}
          />
        </TableRow>
      )}
    </TableBody>
  )
}

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
  scrollContainerRef,
}) {
  const theme = useTheme()
  // Элемент храним в состоянии, чтобы виртуализация перезапустилась,
  // когда контейнер появится в DOM. Колбэк мемоизирован: иначе React
  // переподвешивает ref на каждом рендере уже после layout-эффектов детей.
  const [scrollEl, setScrollEl] = useState(null)
  const virtualized = listData.length > HOME_TABLE_VIRTUAL_THRESHOLD

  const setScrollContainer = useCallback(
    (node) => {
      setScrollEl(node)
      if (scrollContainerRef) {
        scrollContainerRef.current = node
      }
    },
    [scrollContainerRef]
  )

  return (
    <TableContainer
      ref={setScrollContainer}
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
          {virtualized ? (
            <VirtualizedTableBody
              scrollEl={scrollEl}
              listData={listData}
              columns={columns}
              activeTab={activeTab}
              selectedRowId={selectedRowId}
              getRowId={getRowId}
              formatCell={formatCell}
              onSelectRow={onSelectRow}
              onRowDoubleClick={onRowDoubleClick}
            />
          ) : (
            <TableBody>
              {listData.map((row) => {
                const id = getRowId(row, activeTab)
                return (
                  <TableDataRow
                    key={id}
                    row={row}
                    id={id}
                    columns={columns}
                    selectedRowId={selectedRowId}
                    formatCell={formatCell}
                    onSelectRow={onSelectRow}
                    onRowDoubleClick={onRowDoubleClick}
                    virtualized={false}
                  />
                )
              })}
            </TableBody>
          )}
        </Table>
      )}
    </TableContainer>
  )
}

export default HomeTable
