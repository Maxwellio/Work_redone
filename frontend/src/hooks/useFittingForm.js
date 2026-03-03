import { useState } from 'react'
import { saveFitting } from '../api'
import {
  EMPTY_FITTING_FORM_PATRUBOK,
  EMPTY_FITTING_FORM_TRUBA,
  mapFittingToForm,
} from '../models/forms'
import { getRowId, parseNum } from '../utils/format'

export function useFittingForm({
  activeTab,
  selectedRowId,
  listData,
  partyList,
  user,
  loadData,
  setSelectedRowId,
  setPendingScrollToId,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FITTING_FORM_PATRUBOK)
  const [saveError, setSaveError] = useState(null)

  const openAdd = () => {
    setSaveError(null)
    setIsEditMode(false)
    const emptyForm = activeTab === 1 ? EMPTY_FITTING_FORM_PATRUBOK : EMPTY_FITTING_FORM_TRUBA
    const initialForm = { ...emptyForm }
    if (partyList.length > 0 && partyList[0]?.colParty) {
      initialForm.cnt = partyList[0].colParty
    }
    setFormData(initialForm)
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
    setFormData(mapFittingToForm(selectedRow))
    setIsModalOpen(true)
  }

  const close = () => {
    setSaveError(null)
    setIsModalOpen(false)
    const emptyForm = activeTab === 1 ? EMPTY_FITTING_FORM_PATRUBOK : EMPTY_FITTING_FORM_TRUBA
    setFormData(emptyForm)
  }

  const handleSave = async (draft) => {
    setSaveError(null)
    const tip = activeTab === 1 ? 1 : 2
    const source = draft ?? formData
    const hasNm = source.nm != null && String(source.nm).trim() !== ''
    if (!hasNm) {
      setSaveError('Заполните хотя бы одно поле наименования')
      return
    }
    const payload = {
      id: isEditMode ? selectedRowId : null,
      tip,
      nm: source.nm || null,
      d: parseNum(source.d),
      th: tip === 1 ? parseNum(source.th) : null,
      l: parseNum(source.l),
      mass: parseNum(source.mass),
      idPreform:
        tip === 1 && source.idPreform !== '' && source.idPreform != null
          ? parseNum(source.idPreform)
          : null,
      lPreform: tip === 1 ? parseNum(source.lPreform) : null,
      phPreform: parseNum(source.phPreform),
      dStan: parseNum(source.dStan),
      cnt: source.cnt || null,
      ...(isEditMode ? {} : { idUserCreator: user?.userId ?? null }),
    }
    try {
      const { id } = await saveFitting(payload)
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
