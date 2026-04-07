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
  onOpenTransitions,
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
    if (activeTab === 1) {
      initialForm.idPreform = '3'
    }
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
    const mapped = mapFittingToForm(selectedRow)
    if (activeTab === 1) {
      const id = mapped.idPreform
      if (id !== '3' && id !== '4') {
        mapped.idPreform = '3'
      }
    }
    setFormData(mapped)
    setIsModalOpen(true)
  }

  const close = () => {
    setSaveError(null)
    setIsModalOpen(false)
    const emptyForm = activeTab === 1 ? EMPTY_FITTING_FORM_PATRUBOK : EMPTY_FITTING_FORM_TRUBA
    setFormData(emptyForm)
  }

  const handleOpenTransitions = (draft) => {
    if (onOpenTransitions == null) return
    const tip = activeTab === 1 ? 1 : 2
    const selectedRow = listData.find((row) => getRowId(row, activeTab) === selectedRowId)
    if (!selectedRow) return
    const dStan = draft != null ? parseNum(draft.dStan) : parseNum(selectedRow.dStan)
    const name =
      draft != null && draft.nm != null && String(draft.nm).trim() !== ''
        ? String(draft.nm)
        : selectedRow.nm || ''
    onOpenTransitions({
      idFiting: selectedRow.idFiting,
      name,
      tip,
      dStan,
    })
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
    handleOpenTransitions,
  }
}
