import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { saveSubstituteDetail, saveFittingDetail } from '../api/transitionDetailsApi'
import { getSubstituteDetails } from '../api/operationsApi'
import { getFittingDetails } from '../api/fittingsApi'
import { COLUMNS } from '../models/tableConfig'
import { useFittingForm } from './useFittingForm'
import { useHomeActions } from './useHomeActions'
import { useHomeData } from './useHomeData'
import { useHydrotestForm } from './useHydrotestForm'
import { useSubstituteForm } from './useSubstituteForm'
import { usePreformRef } from './usePreformRef'
import { useTransitionsRef } from './useTransitionsRef'
import { isSmallFormOperationId, isLargeFormOperationId } from '../utils/operationCategory'

function parseNum(v) {
  if (v === '' || v == null) return null
  const n = Number(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function parseIntOrNull(v) {
  const n = parseNum(v)
  if (n == null) return null
  return Math.round(n)
}

/** Следующий порядковый номер операции: max(seqNumOper) + 1, или 1 если переходов нет. */
function computeNextSeqNumOper(rows) {
  const nums = (Array.isArray(rows) ? rows : [])
    .map((r) => r.seqNumOper)
    .map((v) => (v == null || v === '' ? NaN : Number(v)))
    .filter((n) => Number.isFinite(n))
  const maxSeq = nums.length ? Math.max(...nums) : 0
  return maxSeq + 1
}

export function useHomePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMyRecords, setShowMyRecords] = useState(false)
  const [isTransitionsRefModalOpen, setIsTransitionsRefModalOpen] = useState(false)
  const [resetTransitionsRefContextOnClose, setResetTransitionsRefContextOnClose] = useState(false)
  const [transitionsRefContext, setTransitionsRefContext] = useState({
    ownerType: null, // 'substitute' | 'fitting' | null
    tip: null, // for fitting: 1 = patrubok, 2 = tube
    mode: null, // 'add' | 'edit' | null
    transitionRecordId: null, // id записи, которая будет редактироваться (для future)
    selectedOperationId: null,
    selectedOperationName: '',
    transitionDraft: null,
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
    initialValues: null,
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
    initialValues: null,
  })
  const [transitionsListRefreshKey, setTransitionsListRefreshKey] = useState(0)

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

  const clearTransitionsRefContext = () => {
    setTransitionsRefContext({
      ownerType: null,
      tip: null,
      mode: null,
      transitionRecordId: null,
      selectedOperationId: null,
      selectedOperationName: '',
      transitionDraft: null,
    })
  }

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
    if (ctx.mode === 'edit') {
      const selectedOperationId = ctx.selectedOperationId ?? null
      const selectedOperationName = ctx.selectedOperationName ?? ''
      const ownerType = ctx.ownerType ?? null
      const idSubstitutePrepared = ownerType === 'substitute' ? substituteTransitionsModal.idSubstitutePrepared : null
      const idFiting = ownerType === 'fitting' ? fittingTransitionsModal.idFiting : null
      const tip = ownerType === 'fitting' ? (ctx.tip ?? fittingTransitionsModal.tip) : null
      const payloadBase = {
        open: true,
        idOperations: selectedOperationId,
        nmOperations: selectedOperationName,
        isEditMode: true,
        ownerType,
        tip,
        idSubstitutePrepared,
        idFiting,
        transitionRecordId: ctx.transitionRecordId ?? null,
        initialValues: ctx.transitionDraft ?? null,
      }

      setIsTransitionsRefModalOpen(false)
      setResetTransitionsRefContextOnClose(false)
      clearTransitionsRefContext()

      if (isSmallFormOperationId(selectedOperationId)) {
        setTimeout(() => {
          setTransitionSmallForm(payloadBase)
        }, 0)
        return
      }

      if (isLargeFormOperationId(selectedOperationId)) {
        setTimeout(() => {
          setTransitionLargeForm(payloadBase)
        }, 0)
        return
      }

      window.alert('Для выбранной операции предусмотрена другая форма (пока не реализована).')
      return
    }

    transitionsRef.beginLoadingRef()
    setResetTransitionsRefContextOnClose(false)
    setTransitionsRefContext({
      ownerType: ctx.ownerType ?? null,
      tip: ctx.tip ?? null,
      mode: ctx.mode ?? null,
      transitionRecordId: ctx.transitionRecordId ?? null,
      selectedOperationId: ctx.selectedOperationId ?? null,
      selectedOperationName: ctx.selectedOperationName ?? '',
      transitionDraft: ctx.transitionDraft ?? null,
    })
    setIsTransitionsRefModalOpen(true)
  }

  const closeTransitionsRefModal = () => {
    setIsTransitionsRefModalOpen(false)
    setResetTransitionsRefContextOnClose(true)
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
      initialValues: null,
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
      initialValues: null,
    })
  }

  const handleTransitionsRefOk = async (selectedOperationId) => {
    if (!transitionsRefContext.ownerType) return

    const op = transitionsRef.operations.find((o) => o.idOperations === selectedOperationId)
    const modeEdit = transitionsRefContext.mode === 'edit'
    const ctx = { ...transitionsRefContext }

    setIsTransitionsRefModalOpen(false)
    setResetTransitionsRefContextOnClose(true)

    const ownerType = ctx.ownerType
    const idSubstitutePrepared = ownerType === 'substitute' ? substituteTransitionsModal.idSubstitutePrepared : null
    const idFiting = ownerType === 'fitting' ? fittingTransitionsModal.idFiting : null
    const tip = ownerType === 'fitting' ? (ctx.tip ?? fittingTransitionsModal.tip) : null

    let initialValues = null
    if (!modeEdit) {
      try {
        let list = []
        if (ownerType === 'substitute' && idSubstitutePrepared != null) {
          list = await getSubstituteDetails(idSubstitutePrepared)
        } else if (ownerType === 'fitting' && idFiting != null) {
          list = await getFittingDetails(idFiting)
        }
        const nextSeq = computeNextSeqNumOper(list)
        initialValues = { seqNumOper: String(nextSeq) }
      } catch (e) {
        console.error('Не удалось загрузить переходы для автонумерации', e)
        initialValues = null
      }
    }

    const payloadBase = {
      open: true,
      idOperations: selectedOperationId,
      nmOperations: op?.nmOperations ?? '',
      isEditMode: modeEdit,
      ownerType,
      tip,
      idSubstitutePrepared,
      idFiting,
      transitionRecordId: ctx.transitionRecordId,
      initialValues: modeEdit ? null : initialValues,
    }

    if (isSmallFormOperationId(selectedOperationId)) {
      setTimeout(() => {
        setTransitionSmallForm(payloadBase)
      }, 0)
      return
    }

    if (isLargeFormOperationId(selectedOperationId)) {
      setTimeout(() => {
        setTransitionLargeForm(payloadBase)
      }, 0)
      return
    }

    window.alert('Для выбранной операции предусмотрена другая форма (пока не реализована).')
  }

  const handleTransitionsRefModalExited = () => {
    if (!resetTransitionsRefContextOnClose) return
    clearTransitionsRefContext()
    setResetTransitionsRefContextOnClose(false)
  }

  const handleSaveTransitionSmall = async (draft) => {
    const s = transitionSmallForm
    if (!s.ownerType || s.idOperations == null) {
      throw new Error('Недостаточно данных для сохранения')
    }
    const idUserCreator = s.isEditMode ? null : user?.userId ?? null
    const emptyGeom = {
      d: null,
      l: null,
      valueMeas: null,
      i: null,
      depthCut: null,
      n: null,
      s: null,
    }

    if (s.ownerType === 'substitute') {
      if (s.idSubstitutePrepared == null) {
        throw new Error('Не выбран переводник')
      }
      await saveSubstituteDetail({
        id: s.isEditMode ? s.transitionRecordId : null,
        idSubstitutePrepared: s.idSubstitutePrepared,
        idOperations: s.idOperations,
        ...emptyGeom,
        masCur: parseNum(draft.masCur),
        lCur: parseNum(draft.lCur),
        seqNumOper: parseIntOrNull(draft.seqNumOper),
        idUserCreator,
      })
    } else if (s.ownerType === 'fitting') {
      if (s.idFiting == null) {
        throw new Error('Не выбрана деталь')
      }
      await saveFittingDetail({
        id: s.isEditMode ? s.transitionRecordId : null,
        idFiting: s.idFiting,
        idOperations: s.idOperations,
        ...emptyGeom,
        masCur: parseNum(draft.masCur),
        lCur: parseNum(draft.lCur),
        seqNumOper: parseIntOrNull(draft.seqNumOper),
        idUserCreator,
      })
    }

    setTransitionsListRefreshKey((k) => k + 1)
    closeTransitionSmallForm()
  }

  const handleSaveTransitionLarge = async (draft) => {
    const s = transitionLargeForm
    if (!s.ownerType || s.idOperations == null) {
      throw new Error('Недостаточно данных для сохранения')
    }
    const idUserCreator = s.isEditMode ? null : user?.userId ?? null
    const payloadBase = {
      d: parseNum(draft.d),
      l: parseNum(draft.l),
      valueMeas: parseNum(draft.valueMeas),
      i: parseIntOrNull(draft.i),
      depthCut: parseNum(draft.depthCut),
      n: parseNum(draft.n),
      s: parseNum(draft.s),
      masCur: null,
      lCur: null,
      seqNumOper: parseIntOrNull(draft.seqNumOper),
      idUserCreator,
    }

    if (s.ownerType === 'substitute') {
      if (s.idSubstitutePrepared == null) {
        throw new Error('Не выбран переводник')
      }
      await saveSubstituteDetail({
        id: s.isEditMode ? s.transitionRecordId : null,
        idSubstitutePrepared: s.idSubstitutePrepared,
        idOperations: s.idOperations,
        ...payloadBase,
      })
    } else if (s.ownerType === 'fitting') {
      if (s.idFiting == null) {
        throw new Error('Не выбрана деталь')
      }
      const idNtk = Array.isArray(draft.idNtk)
        ? draft.idNtk
            .map((n) => (typeof n === 'number' ? n : parseInt(String(n), 10)))
            .filter((n) => Number.isInteger(n))
        : []
      await saveFittingDetail({
        id: s.isEditMode ? s.transitionRecordId : null,
        idFiting: s.idFiting,
        idOperations: s.idOperations,
        ...payloadBase,
        idNtk,
      })
    }

    setTransitionsListRefreshKey((k) => k + 1)
    closeTransitionLargeForm()
  }

  const refreshTransitionsList = () => setTransitionsListRefreshKey((k) => k + 1)

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
    handleTransitionsRefModalExited,
    transitionSmallForm,
    closeTransitionSmallForm,
    transitionLargeForm,
    closeTransitionLargeForm,
    handleTransitionsRefOk,
    transitionsRefContext,
    handleSaveTransitionSmall,
    handleSaveTransitionLarge,
    refreshTransitionsList,
    transitionsListRefreshKey,
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
