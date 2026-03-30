import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { COLUMNS } from '../models/tableConfig'
import { useFittingForm } from './useFittingForm'
import { useHomeActions } from './useHomeActions'
import { useHomeData } from './useHomeData'
import { useHydrotestForm } from './useHydrotestForm'
import { useSubstituteForm } from './useSubstituteForm'
import { usePreformRef } from './usePreformRef'
import { useTransitionsRef } from './useTransitionsRef'
import { isSmallFormOperationId, isLargeFormOperationId } from '../utils/operationCategory'

export function useHomePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMyRecords, setShowMyRecords] = useState(false)
  const [isTransitionsRefModalOpen, setIsTransitionsRefModalOpen] = useState(false)
  const [transitionsRefContext, setTransitionsRefContext] = useState({
    ownerType: null, // 'substitute' | 'fitting' | null
    tip: null, // for fitting: 1 = patrubok, 2 = tube
    mode: null, // 'add' | 'edit' | null
    transitionRecordId: null, // id записи, которая будет редактироваться (для future)
  })
  const [isPreformRefModalOpen, setIsPreformRefModalOpen] = useState(false)
  const [substituteTransitionsModal, setSubstituteTransitionsModal] = useState({
    isOpen: false,
    idSubstitutePrepared: null,
    substituteName: '',
  })
  const [fittingTransitionsModal, setFittingTransitionsModal] = useState({
    isOpen: false,
    idFiting: null,
    fittingName: '',
    tip: null,
  })
  const [transitionSmallForm, setTransitionSmallForm] = useState({
    open: false,
    idOperations: null,
    nmOperations: '',
    isEditMode: false,
    ownerType: null,
    tip: null,
    idSubstitutePrepared: null,
    idFiting: null,
    transitionRecordId: null,
  })
  const [transitionLargeForm, setTransitionLargeForm] = useState({
    open: false,
    idOperations: null,
    nmOperations: '',
    isEditMode: false,
    ownerType: null,
    tip: null,
    idSubstitutePrepared: null,
    idFiting: null,
    transitionRecordId: null,
  })

  const data = useHomeData({
    activeTab,
    searchQuery,
    showMyRecords,
    user,
  })

  const openSubstituteTransitions = ({ idSubstitutePrepared, name }) => {
    setSubstituteTransitionsModal({
      isOpen: true,
      idSubstitutePrepared,
      substituteName: name || '',
    })
  }

  const closeSubstituteTransitions = () => {
    setSubstituteTransitionsModal((prev) => ({ ...prev, isOpen: false }))
  }

  const openFittingTransitions = ({ idFiting, name, tip }) => {
    setFittingTransitionsModal({
      isOpen: true,
      idFiting,
      fittingName: name || '',
      tip: tip ?? null,
    })
  }

  const closeFittingTransitions = () => {
    setFittingTransitionsModal((prev) => ({ ...prev, isOpen: false }))
  }

  const substituteForm = useSubstituteForm({
    activeTab,
    selectedRowId: data.selectedRowId,
    listData: data.listData,
    user,
    loadData: data.loadData,
    setSelectedRowId: data.setSelectedRowId,
    setPendingScrollToId: data.setPendingScrollToId,
    onOpenTransitions: openSubstituteTransitions,
  })

  const fittingForm = useFittingForm({
    activeTab,
    selectedRowId: data.selectedRowId,
    listData: data.listData,
    partyList: data.partyList,
    user,
    loadData: data.loadData,
    setSelectedRowId: data.setSelectedRowId,
    setPendingScrollToId: data.setPendingScrollToId,
    onOpenTransitions: openFittingTransitions,
  })

  const hydrotestForm = useHydrotestForm({
    activeTab,
    selectedRowId: data.selectedRowId,
    listData: data.listData,
    user,
    loadData: data.loadData,
    setSelectedRowId: data.setSelectedRowId,
    setPendingScrollToId: data.setPendingScrollToId,
  })

  const actions = useHomeActions({
    activeTab,
    selectedRowId: data.selectedRowId,
    listData: data.listData,
    loadData: data.loadData,
    setSelectedRowId: data.setSelectedRowId,
    setPendingScrollToId: data.setPendingScrollToId,
  })

  const disallowedGroupIds = useMemo(() => {
    if (transitionsRefContext.ownerType === 'substitute') {
      // У переводников нет группы 16
      return [16]
    }

    if (transitionsRefContext.ownerType === 'fitting') {
      // tip: 1 = патрубки, 2 = трубы
      if (transitionsRefContext.tip === 1) return [2, 4, 13, 14]
      if (transitionsRefContext.tip === 2) return [1, 2, 3, 4, 13, 14]
    }

    // В открытии из меню показываем все группы
    return []
  }, [transitionsRefContext.ownerType, transitionsRefContext.tip])

  const transitionsRef = useTransitionsRef(isTransitionsRefModalOpen, disallowedGroupIds)
  const preformRef = usePreformRef(isPreformRefModalOpen)

  const handleTabChange = (nextTab) => {
    if (nextTab === activeTab) return
    data.beginLoading()
    setActiveTab(nextTab)
  }

  const handleAdd = () => {
    if (activeTab === 0) substituteForm.openAdd()
    else if (activeTab === 1 || activeTab === 2) fittingForm.openAdd()
    else if (activeTab === 3) hydrotestForm.openAdd()
  }

  const handleEdit = () => {
    if (activeTab === 0) substituteForm.openEdit()
    else if (activeTab === 1 || activeTab === 2) fittingForm.openEdit()
    else if (activeTab === 3) hydrotestForm.openEdit()
  }

  const handleOpenTransitions = () => {
    if (activeTab === 0) {
      if (data.selectedRowId == null) {
        window.alert('Выберите переводник')
        return
      }
      const selectedRow = data.listData.find((row) => row.idSubstitutePrepared === data.selectedRowId)
      if (!selectedRow) return
      openSubstituteTransitions({
        idSubstitutePrepared: data.selectedRowId,
        name: selectedRow.name || '',
      })
      return
    }

    if (activeTab === 1 || activeTab === 2) {
      if (data.selectedRowId == null) {
        if (activeTab === 1) {
          window.alert('Выберите патрубок')
        } else if (activeTab === 2) {
          window.alert('Выберите трубу')
        }
        return
      }
      const selectedRow = data.listData.find((row) => row.idFiting === data.selectedRowId)
      if (!selectedRow) return
      const tip = selectedRow.tip ?? (activeTab === 1 ? 1 : 2)
      openFittingTransitions({
        idFiting: data.selectedRowId,
        name: selectedRow.nm || '',
        tip,
      })
    }
  }

  const openTransitionsRefModal = (ctx = {}) => {
    setTransitionsRefContext({
      ownerType: ctx.ownerType ?? null,
      tip: ctx.tip ?? null,
      mode: ctx.mode ?? null,
      transitionRecordId: ctx.transitionRecordId ?? null,
    })
    setIsTransitionsRefModalOpen(true)
  }

  const closeTransitionsRefModal = () => {
    setIsTransitionsRefModalOpen(false)
    setTransitionsRefContext({
      ownerType: null,
      tip: null,
      mode: null,
      transitionRecordId: null,
    })
  }

  const closeTransitionSmallForm = () => {
    setTransitionSmallForm({
      open: false,
      idOperations: null,
      nmOperations: '',
      isEditMode: false,
      ownerType: null,
      tip: null,
      idSubstitutePrepared: null,
      idFiting: null,
      transitionRecordId: null,
    })
  }

  const closeTransitionLargeForm = () => {
    setTransitionLargeForm({
      open: false,
      idOperations: null,
      nmOperations: '',
      isEditMode: false,
      ownerType: null,
      tip: null,
      idSubstitutePrepared: null,
      idFiting: null,
      transitionRecordId: null,
    })
  }

  const handleTransitionsRefOk = (selectedOperationId) => {
    const op = transitionsRef.operations.find((o) => o.idOperations === selectedOperationId)
    const modeEdit = transitionsRefContext.mode === 'edit'
    const ctx = { ...transitionsRefContext }

    setIsTransitionsRefModalOpen(false)
    setTransitionsRefContext({
      ownerType: null,
      tip: null,
      mode: null,
      transitionRecordId: null,
    })

    const ownerType = ctx.ownerType
    const idSubstitutePrepared = ownerType === 'substitute' ? substituteTransitionsModal.idSubstitutePrepared : null
    const idFiting = ownerType === 'fitting' ? fittingTransitionsModal.idFiting : null
    const tip = ownerType === 'fitting' ? (ctx.tip ?? fittingTransitionsModal.tip) : null

    const payload = {
      open: true,
      idOperations: selectedOperationId,
      nmOperations: op?.nmOperations ?? '',
      isEditMode: modeEdit,
      ownerType,
      tip,
      idSubstitutePrepared,
      idFiting,
      transitionRecordId: ctx.transitionRecordId,
    }

    if (isSmallFormOperationId(selectedOperationId)) {
      setTimeout(() => {
        setTransitionSmallForm(payload)
      }, 0)
      return
    }

    if (isLargeFormOperationId(selectedOperationId)) {
      setTimeout(() => {
        setTransitionLargeForm(payload)
      }, 0)
      return
    }

    window.alert('Для выбранной операции предусмотрена другая форма (пока не реализована).')
  }

  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    showMyRecords,
    toggleMyRecords: () => setShowMyRecords((prev) => !prev),
    isTransitionsRefModalOpen,
    openTransitionsRefModal,
    closeTransitionsRefModal,
    transitionSmallForm,
    closeTransitionSmallForm,
    transitionLargeForm,
    closeTransitionLargeForm,
    handleTransitionsRefOk,
    isPreformRefModalOpen,
    openPreformRefModal: () => setIsPreformRefModalOpen(true),
    closePreformRefModal: () => setIsPreformRefModalOpen(false),
    substituteTransitionsModal,
    closeSubstituteTransitions,
    fittingTransitionsModal,
    closeFittingTransitions,
    columns: COLUMNS[activeTab],
    data,
    actions,
    substituteForm,
    fittingForm,
    hydrotestForm,
    transitionsRef,
    preformRef,
    handleAdd,
    handleEdit,
    handleOpenTransitions,
  }
}
