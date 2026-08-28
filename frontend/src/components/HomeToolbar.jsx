import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import CloseIcon from '@mui/icons-material/Close'
import MonthFilterField from './MonthFilterField'

function HomeToolbar({
  activeTab,
  selectedRowId,
  searchQuery,
  monthFilter,
  showMyRecords,
  onAdd,
  onEdit,
  onTransitions,
  onOpenTransitionsRef,
  onOpenPreformRef,
  onDelete,
  onCopy,
  onCalcNorms,
  onPrint,
  onToggleMyRecords,
  onSearchChange,
  onMonthFilterChange,
}) {
  const [refMenuAnchor, setRefMenuAnchor] = useState(null)
  const transitionsLabel = 'Переходы'
  const hasSelection = selectedRowId != null

  const handleRefMenuOpen = (e) => setRefMenuAnchor(e.currentTarget)
  const handleRefMenuClose = () => setRefMenuAnchor(null)
  const handleOpenTransitionsRef = () => {
    handleRefMenuClose()
    onOpenTransitionsRef()
  }
  const handleOpenPreformRef = () => {
    handleRefMenuClose()
    onOpenPreformRef()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        py: 1.5,
        px: 3,
        borderBottom: 1,
        borderColor: 'secondary.main',
        bgcolor: 'background.paper',
      }}
    >
      {(activeTab === 0 || activeTab === 1 || activeTab === 2 || activeTab === 3) && (
        <>
          <Button variant="contained" color="primary" size="small" onClick={onAdd}>
            Добавить
          </Button>
          <Button variant="contained" color="primary" size="small" disabled={!hasSelection} onClick={() => onEdit()}>
            Редактировать
          </Button>
        </>
      )}
      {activeTab !== 3 && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={!hasSelection}
          onClick={onTransitions}
        >
          {transitionsLabel}
        </Button>
      )}
      <Button variant="contained" color="primary" size="small" disabled={!hasSelection} onClick={onCopy}>
        Копировать запись
      </Button>
      <Button variant="contained" color="primary" size="small" disabled={!hasSelection} onClick={onDelete}>
        Удалить
      </Button>
      <Button variant="contained" color="primary" size="small" disabled={!hasSelection} onClick={onCalcNorms}>
        Расчёт норм времени
      </Button>
      <Button variant="contained" color="primary" size="small" disabled={!hasSelection} onClick={onPrint}>
        Печать отчёта
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={onToggleMyRecords}
        sx={
          showMyRecords
            ? { bgcolor: 'primary.dark', fontWeight: 600, '&:hover': { bgcolor: 'primary.dark' } }
            : {}
        }
      >
        Мои записи
      </Button>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="flex-start">
          <MonthFilterField
            value={monthFilter}
            onChange={onMonthFilterChange}
          />
          <Tooltip title="Сбросить фильтр по месяцу">
            <span>
              <IconButton
                size="small"
                aria-label="Сбросить фильтр по месяцу"
                onClick={() => onMonthFilterChange('')}
                disabled={!monthFilter}
                sx={{ mt: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <TextField
          type="search"
          size="small"
          placeholder="Поиск по записям"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Поиск по записям"
          sx={{ minWidth: 200 }}
        />
      </Box>
      <Button variant="contained" color="primary" size="small" onClick={handleRefMenuOpen} aria-haspopup="true" aria-expanded={!!refMenuAnchor}>
        Справочники
      </Button>
      <Menu anchorEl={refMenuAnchor} open={!!refMenuAnchor} onClose={handleRefMenuClose}>
        <MenuItem onClick={handleOpenTransitionsRef}>Справочник переходов</MenuItem>
        <MenuItem onClick={handleOpenPreformRef}>Справочник заготовок</MenuItem>
      </Menu>
    </Box>
  )
}

export default HomeToolbar
