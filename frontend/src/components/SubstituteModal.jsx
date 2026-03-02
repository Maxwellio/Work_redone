import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import '../styles/SubstituteModal.css'

function SubstituteModal({
  open,
  isEditMode,
  selectedRowId,
  formData,
  preformTypesFiltered,
  preformError,
  saveError,
  onClose,
  onFormChange,
  onSave,
}) {
  if (!open) return null

  return (
    <div
      className="home-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-modal-title"
      title={isEditMode ? 'Редактирование переводника' : 'Добавление переводника'}
    >
      <div className="home-modal__backdrop" onClick={onClose} />
      <div className="home-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="home-modal__header">
          <h2 id="home-modal-title" className="home-modal__title">
            {isEditMode ? 'Редактирование переводника' : 'Добавление переводника'}
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
          <span className="home-modal__subheader-label">Переводник</span>
          {isEditMode && (
            <span className="home-modal__id" aria-hidden="true">
              {selectedRowId}
            </span>
          )}
        </div>

        <div className="home-modal__body">
          <div className="home-modal__section">
            <div className="home-modal__name-row">
              <span className="home-modal__name-label">Наименование</span>
              <div className="home-modal__name-inputs">
                <input
                  type="text"
                  className="home-modal__name-inp"
                  value={formData.nmSub1}
                  onChange={onFormChange('nmSub1')}
                  aria-label="nm1"
                />
                <span className="home-modal__name-sep">-</span>
                <input
                  type="text"
                  className="home-modal__name-inp"
                  value={formData.nmSub2}
                  onChange={onFormChange('nmSub2')}
                  aria-label="nm2"
                />
                <span className="home-modal__name-sep">-</span>
                <input
                  type="text"
                  className="home-modal__name-inp"
                  value={formData.nmSub3}
                  onChange={onFormChange('nmSub3')}
                  aria-label="nm3"
                />
                <span className="home-modal__name-sep">/</span>
                <input
                  type="text"
                  className="home-modal__name-inp"
                  value={formData.nmSub4}
                  onChange={onFormChange('nmSub4')}
                  aria-label="nm4"
                />
                <span className="home-modal__name-sep">-</span>
                <input
                  type="text"
                  className="home-modal__name-inp"
                  value={formData.nmSub5}
                  onChange={onFormChange('nmSub5')}
                  aria-label="nm5"
                />
              </div>
            </div>

            <label className="home-modal__field">
              <span>Диаметр наружный переводника, мм</span>
              <input
                type="number"
                value={formData.dSubstituteOut}
                onChange={onFormChange('dSubstituteOut')}
              />
            </label>
            <label className="home-modal__field">
              <span>Диаметр внутренний переводника, мм</span>
              <input
                type="number"
                value={formData.dSubstituteIn}
                onChange={onFormChange('dSubstituteIn')}
              />
            </label>
            <label className="home-modal__field">
              <span>Длина, мм переводника</span>
              <input
                type="number"
                value={formData.lSubstiute}
                onChange={onFormChange('lSubstiute')}
              />
            </label>

            <h3 className="home-modal__section-title">Заготовка</h3>

            <label className="home-modal__field">
              <span>Наименование</span>
              <select value={formData.idPreform} onChange={onFormChange('idPreform')}>
                <option value="">Выберите тип</option>
                {preformTypesFiltered.map((item) => (
                  <option key={item.idPreform} value={item.idPreform}>
                    {item.nmPreform}
                  </option>
                ))}
              </select>
              {preformError && (
                <span className="home-modal__hint">{preformError}</span>
              )}
            </label>
            <label className="home-modal__field">
              <span>Диаметр наружный заготовки, мм</span>
              <input
                type="number"
                value={formData.dPreformOut}
                onChange={onFormChange('dPreformOut')}
              />
            </label>
            <label className="home-modal__field">
              <span>Диаметр внутренний заготовки, мм</span>
              <input
                type="number"
                value={formData.dPreformIn}
                onChange={onFormChange('dPreformIn')}
                disabled={formData.idPreform === '1' || formData.idPreform === 1}
              />
            </label>
            <label className="home-modal__field">
              <span>Длина, мм заготовки</span>
              <input
                type="number"
                value={formData.lPreform}
                onChange={onFormChange('lPreform')}
              />
            </label>
            <label className="home-modal__field">
              <span>Коэф. жесткости, ГПа</span>
              <input
                type="number"
                value={formData.ph}
                onChange={onFormChange('ph')}
              />
            </label>
            <label className="home-modal__field">
              <span>Масса заготовки</span>
              <input
                type="number"
                value={formData.massPreform}
                onChange={onFormChange('massPreform')}
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
          <button type="button" className="home-modal__btn home-modal__btn_outline">
            Переходы при изготовлении переводника
          </button>
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

export default SubstituteModal
