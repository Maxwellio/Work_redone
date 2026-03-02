import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
  onDelete,
  onCalcNorms,
  onPrint,
  onToggleMyRecords,
  onSearchChange,
}) {
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
        <Button variant="contained" color="primary" size="small" onClick={onTransitions}>
          Переходы по трубе
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
      <Button variant="contained" color="primary" size="small" onClick={onOpenTransitionsRef}>
        Справочник переходов
      </Button>
    </Box>
  )
}

export default HomeToolbar
