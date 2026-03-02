import { calcHydroTime, deleteFitting, deleteHydrotest, deleteSubstitute, downloadReport } from '../api'
import { getRowId } from '../utils/format'

export function useHomeActions({
  activeTab,
  selectedRowId,
  listData,
  loadData,
  setSelectedRowId,
  setPendingScrollToId,
}) {
  const handleDelete = async () => {
    if (selectedRowId == null) {
      window.alert('Для удаления нужно выбрать запись.')
      return
    }
    const selectedRow = listData.find((row) => getRowId(row, activeTab) === selectedRowId)
    if (!selectedRow) return

    const prefixes = { 0: 'переводник ', 1: 'патрубок ', 2: 'трубу ', 3: 'гидроиспытание ' }
    const name = activeTab === 0
      ? selectedRow.name
      : activeTab === 1
        ? [selectedRow.nm, selectedRow.d, selectedRow.th].filter(v => v != null && v !== '').join('-') || selectedRow.nm
        : activeTab === 2
          ? [selectedRow.nm, selectedRow.d].filter(v => v != null && v !== '').join('-') || selectedRow.nm
          : activeTab === 3
            ? selectedRow.nh
            : selectedRow.nm
    const message = `Вы уверены, что хотите удалить ${prefixes[activeTab] || ''}${name || ''}?`
    if (!window.confirm(message)) return

    try {
      if (activeTab === 0) await deleteSubstitute(selectedRowId)
      else if (activeTab === 1 || activeTab === 2) await deleteFitting(selectedRowId)
      else await deleteHydrotest(selectedRowId)
      setSelectedRowId(null)
      await loadData()
    } catch (err) {
      window.alert(err.message || 'Не удалось удалить запись')
    }
  }

  const handleCalcNorms = async () => {
    if (activeTab !== 3) {
      console.log('Расчёт норм времени', { activeTab })
      return
    }
    if (selectedRowId == null) {
      window.alert('Выберите запись для расчёта норм времени')
      return
    }
    try {
      await calcHydroTime(selectedRowId)
      await loadData()
      setPendingScrollToId(selectedRowId)
    } catch (err) {
      window.alert(err.message || 'Ошибка расчёта норм времени')
    }
  }

  const handlePrint = async () => {
    if (selectedRowId == null) {
      window.alert('Для генерации отчёта нужно выбрать запись.')
      return
    }
    try {
      await downloadReport(activeTab, selectedRowId)
    } catch (err) {
      window.alert(err.message || 'Не удалось скачать отчёт')
    }
  }

  return { handleDelete, handleCalcNorms, handlePrint }
}
