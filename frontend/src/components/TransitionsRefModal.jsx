import Close from '@mui/icons-material/Close'
import '../styles/SubstituteModal.css'
import '../styles/TransitionsRefModal.css'

function TransitionsRefModal({
  open,
  onClose,
  groups,
  operations,
  selectedGroupId,
  onSelectGroup,
  loadingGroups,
  loadingOperations,
  errorGroups,
  errorOperations,
}) {

  if (!open) return null

  const formatCell = (value) => (value == null ? '—' : String(value))
  const groupsSorted = [...groups].sort((a, b) => (a.idGroupOperations ?? 0) - (b.idGroupOperations ?? 0))
  const operationsSorted = [...operations].sort((a, b) => (a.idOperations ?? 0) - (b.idOperations ?? 0))

  return (
    <div
      className="home-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transitions-ref-modal-title"
      title="Справочник переходов"
    >
      <div className="home-modal__backdrop" onClick={onClose} />
      <div className="home-modal__panel transitions-ref-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="home-modal__header">
          <h2 id="transitions-ref-modal-title" className="home-modal__title">
            Справочник переходов
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

        <div className="home-modal__body transitions-ref-modal__body">
          <div className="transitions-ref-modal__columns">
            <div className="transitions-ref-modal__column">
              <h3 className="transitions-ref-modal__column-title">Группа</h3>
              <div className="transitions-ref-modal__table-wrap">
                {loadingGroups && <div className="home-table-message">Загрузка…</div>}
                {errorGroups && (
                  <div className="home-table-message home-table-message_error">{errorGroups}</div>
                )}
                {!loadingGroups && !errorGroups && (
                  <table className="home-table transitions-ref-modal__table">
                    <thead>
                      <tr>
                        <th>Группа</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupsSorted.map((g) => (
                        <tr
                          key={g.idGroupOperations}
                          className={selectedGroupId === g.idGroupOperations ? 'home-table-row_selected' : ''}
                          onClick={() =>
                            onSelectGroup(
                              selectedGroupId === g.idGroupOperations ? null : g.idGroupOperations
                            )
                          }
                        >
                          <td>{formatCell(g.nmGroupOperations)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="transitions-ref-modal__column">
              <h3 className="transitions-ref-modal__column-title">Операции</h3>
              <div className="transitions-ref-modal__table-wrap">
                {selectedGroupId == null && !loadingOperations && (
                  <div className="home-table-message">Выберите группу слева</div>
                )}
                {loadingOperations && <div className="home-table-message">Загрузка…</div>}
                {errorOperations && (
                  <div className="home-table-message home-table-message_error">{errorOperations}</div>
                )}
                {!loadingOperations && !errorOperations && selectedGroupId != null && (
                  <table className="home-table transitions-ref-modal__table">
                    <thead>
                      <tr>
                        <th>Наименование перехода</th>
                        <th>Tk, мин</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operationsSorted.map((op) => (
                        <tr key={op.idOperations}>
                          <td>{formatCell(op.nmOperations)}</td>
                          <td>{formatCell(op.tk)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="home-modal__footer">
          <button
            type="button"
            className="home-modal__btn home-modal__btn_secondary"
            onClick={onClose}
          >
            <Close className="home-modal__btn-icon" fontSize="small" />
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransitionsRefModal
