import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import '../styles/SubstituteModal.css'

function FittingModal({
  open,
  isEditMode,
  selectedRowId,
  formData,
  preformTypesFiltered,
  partyList,
  preformError,
  saveError,
  onClose,
  onFormChange,
  onSave,
  tip,
}) {
  if (!open) return null

  const isPatrubok = tip === 1
  const label = isPatrubok ? 'Патрубок' : 'Труба'
  const titleEdit = isPatrubok ? 'Редактирование патрубка' : 'Редактирование трубы'
  const titleAdd = isPatrubok ? 'Добавление патрубка' : 'Добавление трубы'
  const transitionsLabel = isPatrubok
    ? 'Переходы при изготовлении патрубка'
    : 'Переходы при изготовлении трубы'

  return (
    <div
      className="home-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-fitting-modal-title"
      title={isEditMode ? titleEdit : titleAdd}
    >
      <div className="home-modal__backdrop" onClick={onClose} />
      <div className="home-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="home-modal__header">
          <h2 id="home-fitting-modal-title" className="home-modal__title">
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
          <span className="home-modal__subheader-label">{label}</span>
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
                  value={formData.nm}
                  onChange={onFormChange('nm')}
                  aria-label="nm"
                />
                <span className="home-modal__name-sep">-</span>
                <input
                  type="number"
                  className="home-modal__name-inp"
                  value={formData.d}
                  onChange={onFormChange('d')}
                  aria-label="d"
                />
                {isPatrubok && (
                  <>
                    <span className="home-modal__name-sep">x</span>
                    <input
                      type="number"
                      className="home-modal__name-inp"
                      value={formData.th}
                      onChange={onFormChange('th')}
                      aria-label="th"
                    />
                  </>
                )}
              </div>
            </div>

            <label className="home-modal__field">
              <span>Длина, мм</span>
              <input
                type="number"
                value={formData.l}
                onChange={onFormChange('l')}
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

            {isPatrubok && (
              <>
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
                  <span>Длина, мм</span>
                  <input
                    type="number"
                    value={formData.lPreform}
                    onChange={onFormChange('lPreform')}
                  />
                </label>
              </>
            )}

            <label className="home-modal__field">
              <span>Коэф. жесткости, ГПа</span>
              <input
                type="number"
                value={formData.phPreform}
                onChange={onFormChange('phPreform')}
              />
            </label>
            <label className="home-modal__field">
              <span>Наибольший диаметр изделия</span>
              <input
                type="number"
                value={formData.dStan}
                onChange={onFormChange('dStan')}
              />
            </label>

            <label className="home-modal__field">
              <span>Количество деталей в партии, шт.</span>
              <select value={formData.cnt ?? ''} onChange={onFormChange('cnt')}>
                <option value="">Выберите</option>
                {partyList.map((item) => (
                  <option key={item.colParty} value={item.colParty}>
                    {item.colParty}
                  </option>
                ))}
              </select>
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
            {transitionsLabel}
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

export default FittingModal
