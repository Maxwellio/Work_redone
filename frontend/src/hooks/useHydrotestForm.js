import { useState } from 'react'
import { calcHydroNvForm, saveHydrotest } from '../api'
import { EMPTY_HYDROTEST_FORM, mapHydrotestToForm } from '../models/forms'
import { getRowId, parseNum } from '../utils/format'

export function useHydrotestForm({
  activeTab,
  selectedRowId,
  listData,
  user,
  loadData,
  setSelectedRowId,
  setPendingScrollToId,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingRowId, setEditingRowId] = useState(null)
  const [formData, setFormData] = useState(EMPTY_HYDROTEST_FORM)
  const [saveError, setSaveError] = useState(null)

  const openAdd = () => {
    setSaveError(null)
    setIsEditMode(false)
    setEditingRowId(null)
    setFormData({ ...EMPTY_HYDROTEST_FORM })
    setIsModalOpen(true)
  }

  const openEdit = (rowIdOverride) => {
    const targetRowId = rowIdOverride ?? selectedRowId
    if (targetRowId == null) {
      window.alert('Выберите запись для редактирования')
      return
    }
    const selectedRow = listData.find((row) => getRowId(row, activeTab) === targetRowId)
    if (!selectedRow) return
    setSaveError(null)
    setIsEditMode(true)
    setEditingRowId(targetRowId)
    setFormData(mapHydrotestToForm(selectedRow))
    setIsModalOpen(true)
  }

  const close = () => {
    setSaveError(null)
    setIsModalOpen(false)
    setEditingRowId(null)
  }

  const handleSave = async (draft) => {
    setSaveError(null)
    const source = draft ?? formData
    const hasName = source.nh != null && String(source.nh).trim() !== ''
    if (!hasName) {
      setSaveError('Заполните поле наименования')
      return
    }
    const payload = {
      id: isEditMode ? (editingRowId ?? selectedRowId) : null,
      nh: source.nh || null,
      d: parseNum(source.d),
      th: parseNum(source.th),
      l: parseNum(source.l),
      testtime: parseNum(source.testtime),
      mass: parseNum(source.mass),
      l1: parseNum(source.l1),
      l2: parseNum(source.l2),
      ...(isEditMode ? {} : { idUserCreator: user?.userId ?? null }),
    }
    try {
      const { id } = await saveHydrotest(payload)
      setIsModalOpen(false)
      await loadData()
      if (id != null && id > 0) {
        setSelectedRowId(id)
        setPendingScrollToId(id)
      }
    } catch (err) {
      setSaveError(err.message || 'Ошибка сохранения')
    }
  }

  const calcNvFromDraft = async (draft) => {
    setSaveError(null)
    const payload = {
      id: isEditMode ? (editingRowId ?? selectedRowId) : null,
      d: parseNum(draft.d),
      l: parseNum(draft.l),
      th: parseNum(draft.th),
      testtime: parseNum(draft.testtime),
      mass: parseNum(draft.mass),
      l1: parseNum(draft.l1),
      l2: parseNum(draft.l2),
    }
    try {
      const data = await calcHydroNvForm(payload)
      const nv = data?.nv
      return nv != null ? String(nv) : ''
    } catch (err) {
      setSaveError(err.message || 'Ошибка расчёта нормы времени')
      return null
    }
  }

  return {
    isModalOpen,
    isEditMode,
    formData,
    saveError,
    openAdd,
    openEdit,
    close,
    handleSave,
    calcNvFromDraft,
  }
}
