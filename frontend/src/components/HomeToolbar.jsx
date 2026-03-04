import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import '../styles/Home.css'

function HomeToolbar({
  activeTab,
  searchQuery,
  showMyRecords,
  onAdd,
  onEdit,
  onTransitions,
  onOpenTransitionsRef,
  onOpenPreformRef,
  onDelete,
  onCalcNorms,
  onPrint,
  onToggleMyRecords,
  onSearchChange,
}) {
  const [refMenuAnchor, setRefMenuAnchor] = useState(null)
  const transitionsLabel = activeTab === 0 ? 'Переходы по переводнику' : 'Переходы по трубе'

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
    <Box className="home-toolbar">
      {(activeTab === 0 || activeTab === 1 || activeTab === 2 || activeTab === 3) && (
        <>
          <Button variant="contained" color="primary" size="small" onClick={onAdd}>
            Добавить
          </Button>
          <Button variant="contained" color="primary" size="small" onClick={onEdit}>
            Редактировать
          </Button>
        </>
      )}
      {activeTab !== 3 && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onTransitions}
          disabled={activeTab !== 0}
        >
          {transitionsLabel}
        </Button>
      )}
      <Button variant="contained" color="primary" size="small" onClick={onDelete}>
        Удалить
      </Button>
      <Button variant="contained" color="primary" size="small" onClick={onCalcNorms}>
        Расчёт норм времени
      </Button>
      <Button variant="contained" color="primary" size="small" onClick={onPrint}>
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
      <TextField
        type="search"
        size="small"
        placeholder="Поиск по записям"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Поиск по записям"
        sx={{ ml: 'auto', minWidth: 200 }}
      />
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
