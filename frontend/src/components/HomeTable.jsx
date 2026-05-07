import { useEffect, useMemo, useCallback } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { homeDataGridSx, tablePlaceholderMessageSx } from '../theme'

function NoRowsOverlay() {
  const theme = useTheme()
  return (
    <Box sx={tablePlaceholderMessageSx(theme)}>Нет данных</Box>
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
  pendingScrollToId,
  onScrollComplete,
}) {
  const apiRef = useGridApiRef()

  // Adapt (row) => id from the existing (row, activeTab) => id utility
  const gridGetRowId = useCallback(
    (row) => getRowId(row, activeTab),
    [getRowId, activeTab]
  )

  // Convert tableConfig {key, label, getValue?} to DataGrid {field, headerName, valueGetter}
  // valueGetter signature in DataGrid v7: (value, row) => displayValue
  const gridColumns = useMemo(
    () =>
      columns.map((col) => ({
        field: col.key,
        headerName: col.label,
        flex: 1,
        minWidth: 80,
        sortable: false,
        valueGetter: (value, row) =>
          col.getValue ? formatCell(col.getValue(row)) : formatCell(value),
      })),
    [columns, formatCell]
  )

  const rowSelectionModel = useMemo(
    () => (selectedRowId != null ? [selectedRowId] : []),
    [selectedRowId]
  )

  // Toggle selection: clicking an already-selected row deselects it
  const handleRowClick = useCallback(
    (params) => {
      onSelectRow(selectedRowId === params.id ? null : params.id)
    },
    [selectedRowId, onSelectRow]
  )

  const handleRowDoubleClickCb = useCallback(
    (params) => {
      onRowDoubleClick?.(params.id)
    },
    [onRowDoubleClick]
  )

  // Scroll to a row after create/edit using DataGrid apiRef (replaces DOM querySelector)
  useEffect(() => {
    if (pendingScrollToId == null) return
    const rowIndex = listData.findIndex((row) => gridGetRowId(row) === pendingScrollToId)
    if (rowIndex >= 0 && apiRef.current?.scrollToIndexes) {
      apiRef.current.scrollToIndexes({ rowIndex })
    }
    onScrollComplete?.()
  }, [pendingScrollToId, listData, gridGetRowId, apiRef, onScrollComplete])

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        mt: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'secondary.main',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {error && (
        <Box sx={(t) => tablePlaceholderMessageSx(t, { emphasized: true })}>{error}</Box>
      )}
      {!error && (
        <DataGrid
          apiRef={apiRef}
          rows={listData}
          columns={gridColumns}
          getRowId={gridGetRowId}
          loading={loading}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={() => {}}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          onRowDoubleClick={handleRowDoubleClickCb}
          disableColumnMenu
          hideFooter
          slots={{ noRowsOverlay: NoRowsOverlay }}
          sx={(t) => homeDataGridSx(t)}
        />
      )}
    </Box>
  )
}

export default HomeTable
