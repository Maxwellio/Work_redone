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
    <div className="home-toolbar">
      {(activeTab === 0 || activeTab === 1 || activeTab === 2 || activeTab === 3) && (
        <>
          <button type="button" className="home-toolbar-btn" onClick={onAdd}>
            Добавить
          </button>
          <button type="button" className="home-toolbar-btn" onClick={onEdit}>
            Редактировать
          </button>
        </>
      )}
      {activeTab !== 3 && (
        <button type="button" className="home-toolbar-btn" onClick={onTransitions}>
          Переходы по трубе
        </button>
      )}
      <button type="button" className="home-toolbar-btn" onClick={onDelete}>
        Удалить
      </button>
      <button type="button" className="home-toolbar-btn" onClick={onCalcNorms}>
        Расчёт норм времени
      </button>
      <button type="button" className="home-toolbar-btn" onClick={onPrint}>
        Печать отчёта
      </button>
      <button
        type="button"
        className={`home-toolbar-btn ${showMyRecords ? 'home-toolbar-btn_active' : ''}`}
        onClick={onToggleMyRecords}
      >
        Мои записи
      </button>
      <input
        type="search"
        className="home-toolbar-search"
        placeholder="Поиск по записям"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Поиск по записям"
      />
      <button
        type="button"
        className="home-toolbar-btn"
        onClick={onOpenTransitionsRef}
      >
        Справочник переходов
      </button>
    </div>
  )
}

export default HomeToolbar
