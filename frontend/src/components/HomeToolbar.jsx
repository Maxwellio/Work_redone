import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import Add from '@mui/icons-material/Add'
import Calculate from '@mui/icons-material/Calculate'
import Print from '@mui/icons-material/Print'
import FormatListBulleted from '@mui/icons-material/FormatListBulleted'
import Portrait from '@mui/icons-material/Portrait'
import Description from '@mui/icons-material/Description'
import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopy from '@mui/icons-material/ContentCopy'

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
  onDelete,
  onCopy,
  onCalcNorms,
  onPrint,
  onToggleMyRecords,
  onSearchChange,
  onMonthFilterChange,
  onOpenPreformRef,
}) {
  const [refMenuAnchor, setRefMenuAnchor] = useState(null)
  //const transitionsLabel = activeTab === 0 ? 'Переходы по переводнику' : 'Переходы по трубе'

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
          <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={onAdd}>
            Добавить
          </Button>
          <Button variant="contained" color="primary" size="small" disabled={!hasSelection} startIcon={<Edit />} onClick={() => onEdit()}>
            Редактировать
          </Button>
        </>
      )}
      <Button variant="contained" color="primary" size="small" disabled={!hasSelection} startIcon={<Delete />} onClick={onDelete}>
        Удалить
      </Button>
      {activeTab !== 3 && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={!hasSelection}
          startIcon={<FormatListBulleted />}
          onClick={onTransitions}
        >
          Переходы
        </Button>
      )}
      <Button variant="contained" color="primary" size="small" disabled={!hasSelection} startIcon={<Calculate />} onClick={onCalcNorms}>
        Расчёт норм времени
      </Button>
      <Button variant="contained" color="primary" size="small" disabled={!hasSelection} startIcon={<ContentCopy />} onClick={onCopy}>
        Копировать запись
      </Button>
      <Button variant="contained" color="primary" size="small" disabled={!hasSelection} startIcon={<Print />} onClick={onPrint}>
        Печать отчёта
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<Portrait />}
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
          <TextField
            type="month"
            size="small"
            label="Месяц"
            value={monthFilter}
            onChange={(e) => onMonthFilterChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
            aria-label="Фильтр по месяцу"
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
      <Button variant="contained" color="primary" size="small" startIcon={<Description />} onClick={handleRefMenuOpen} aria-haspopup="true" aria-expanded={!!refMenuAnchor}>
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
