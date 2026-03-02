import { useState } from 'react'
import { saveHydrotest } from '../api'
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
  const [formData, setFormData] = useState(EMPTY_HYDROTEST_FORM)
  const [saveError, setSaveError] = useState(null)

  const openAdd = () => {
    setSaveError(null)
    setIsEditMode(false)
    setFormData({ ...EMPTY_HYDROTEST_FORM })
    setIsModalOpen(true)
  }

  const openEdit = () => {
    if (selectedRowId == null) {
      window.alert('Выберите запись для редактирования')
      return
    }
    const selectedRow = listData.find((row) => getRowId(row, activeTab) === selectedRowId)
    if (!selectedRow) return
    setSaveError(null)
    setIsEditMode(true)
    setFormData(mapHydrotestToForm(selectedRow))
    setIsModalOpen(true)
  }

  const close = () => setIsModalOpen(false)

  const handleFormChange = (field) => (event) => {
    const { value } = event.target
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSaveError(null)
  }

  const handleSave = async () => {
    setSaveError(null)
    const hasName = formData.nh != null && String(formData.nh).trim() !== ''
    if (!hasName) {
      setSaveError('Заполните поле наименования')
      return
    }
    const payload = {
      id: isEditMode ? selectedRowId : null,
      nh: formData.nh || null,
      d: parseNum(formData.d),
      th: parseNum(formData.th),
      l: parseNum(formData.l),
      testtime: parseNum(formData.testtime),
      mass: parseNum(formData.mass),
      l1: parseNum(formData.l1),
      l2: parseNum(formData.l2),
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

  return {
    isModalOpen,
    isEditMode,
    formData,
    saveError,
    openAdd,
    openEdit,
    close,
    handleFormChange,
    handleSave,
  }
}
