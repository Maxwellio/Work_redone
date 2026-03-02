import '../styles/Home.css'

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
}) {
  return (
    <div className="home-table-wrap">
      {error && (
        <div className="home-table-message home-table-message_error">{error}</div>
      )}
      {loading && (
        <div className="home-table-message">Загрузка…</div>
      )}
      {!loading && !error && (
        <table className="home-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listData.map((row) => {
              const id = getRowId(row, activeTab)
              return (
                <tr
                  key={id}
                  data-row-id={id}
                  className={selectedRowId === id ? 'home-table-row_selected' : ''}
                  onClick={() => onSelectRow(selectedRowId === id ? null : id)}
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {formatCell(col.getValue ? col.getValue(row) : row[col.key])}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default HomeTable
