import { useState } from 'react'
import { saveSubstitute } from '../api'
import { EMPTY_SUBSTITUTE_FORM, mapSubstituteToForm } from '../models/forms'
import { getRowId, parseNum } from '../utils/format'

export function useSubstituteForm({
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
  const [formData, setFormData] = useState(EMPTY_SUBSTITUTE_FORM)
  const [saveError, setSaveError] = useState(null)

  const openAdd = () => {
    setSaveError(null)
    setIsEditMode(false)
    setFormData(EMPTY_SUBSTITUTE_FORM)
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
    setFormData(mapSubstituteToForm(selectedRow))
    setIsModalOpen(true)
  }

  const close = () => {
    setSaveError(null)
    setIsModalOpen(false)
  }

  const handleSave = async (draft) => {
    setSaveError(null)
    const source = draft ?? formData
    const nameFields = [source.nmSub1, source.nmSub2, source.nmSub3, source.nmSub4, source.nmSub5]
    const hasName = nameFields.some((v) => v != null && String(v).trim() !== '')
    if (!hasName) {
      setSaveError('Заполните хотя бы одно поле наименования')
      return
    }
    const payload = {
      id: isEditMode ? selectedRowId : null,
      nmSub1: source.nmSub1 || null,
      nmSub2: source.nmSub2 || null,
      nmSub3: source.nmSub3 || null,
      nmSub4: source.nmSub4 || null,
      nmSub5: source.nmSub5 || null,
      dSubstituteOut: parseNum(source.dSubstituteOut),
      dSubstituteIn: parseNum(source.dSubstituteIn),
      lSubstiute: parseNum(source.lSubstiute),
      idPreform: source.idPreform === '' || source.idPreform == null ? 1 : parseNum(source.idPreform),
      dPreformOut: parseNum(source.dPreformOut),
      dPreformIn: source.idPreform === '1' || source.idPreform === 1 ? null : parseNum(source.dPreformIn),
      lPreform: parseNum(source.lPreform),
      ph: parseNum(source.ph),
      massPreform: parseNum(source.massPreform),
      ...(isEditMode ? {} : { idUserCreator: user?.userId ?? null }),
    }
    try {
      const { id } = await saveSubstitute(payload)
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
    handleSave,
  }
}
