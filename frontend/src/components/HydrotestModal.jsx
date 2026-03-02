import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import '../styles/SubstituteModal.css'

function HydrotestModal({
  open,
  isEditMode,
  selectedRowId,
  formData,
  saveError,
  onClose,
  onFormChange,
  onSave,
}) {
  if (!open) return null

  const titleEdit = 'Редактирование гидроиспытания'
  const titleAdd = 'Добавление гидроиспытания'

  return (
    <div
      className="home-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-hydrotest-modal-title"
      title={isEditMode ? titleEdit : titleAdd}
    >
      <div className="home-modal__backdrop" onClick={onClose} />
      <div className="home-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="home-modal__header">
          <h2 id="home-hydrotest-modal-title" className="home-modal__title">
            {isEditMode ? titleEdit : titleAdd}
          </h2>
          <button
            type="button"
            className="home-modal__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="home-modal__subheader">
          <span className="home-modal__subheader-label">Гидроиспытание</span>
          {isEditMode && (
            <span className="home-modal__id" aria-hidden="true">
              {selectedRowId}
            </span>
          )}
        </div>

        <div className="home-modal__body">
          <div className="home-modal__section">
            <label className="home-modal__field">
              <span>Наименование</span>
              <input
                type="text"
                value={formData.nh}
                onChange={onFormChange('nh')}
              />
            </label>
            <label className="home-modal__field">
              <span>Диаметр, мм</span>
              <input
                type="number"
                value={formData.d}
                onChange={onFormChange('d')}
              />
            </label>
            <label className="home-modal__field">
              <span>Толщина стенки, мм</span>
              <input
                type="number"
                value={formData.th}
                onChange={onFormChange('th')}
              />
            </label>
            <label className="home-modal__field">
              <span>Длина, мм</span>
              <input
                type="number"
                value={formData.l}
                onChange={onFormChange('l')}
              />
            </label>
            <label className="home-modal__field">
              <span>Время на испытание, сек</span>
              <input
                type="number"
                value={formData.testtime}
                onChange={onFormChange('testtime')}
              />
            </label>
            <label className="home-modal__field">
              <span>Масса, кг</span>
              <input
                type="number"
                value={formData.mass}
                onChange={onFormChange('mass')}
              />
            </label>
            <label className="home-modal__field">
              <span>Длина резьбовой поверхности 1, мм</span>
              <input
                type="number"
                value={formData.l1}
                onChange={onFormChange('l1')}
              />
            </label>
            <label className="home-modal__field">
              <span>Длина резьбовой поверхности 2, мм</span>
              <input
                type="number"
                value={formData.l2}
                onChange={onFormChange('l2')}
              />
            </label>
            <label className="home-modal__field">
              <span>Норма времени, чел.ч</span>
              <input
                type="number"
                value={formData.nv}
                readOnly
              />
            </label>
          </div>
        </div>

        {saveError && (
          <div className="home-modal__save-error" role="alert">
            {saveError}
          </div>
        )}
        <div className="home-modal__footer">
          <button type="button" className="home-modal__btn" onClick={onSave}>
            <Check className="home-modal__btn-icon" fontSize="small" />
            Ок
          </button>
          <button
            type="button"
            className="home-modal__btn home-modal__btn_secondary"
            onClick={onClose}
          >
            <Close className="home-modal__btn-icon" fontSize="small" />
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

export default HydrotestModal
