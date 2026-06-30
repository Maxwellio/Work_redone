import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { calcFitTime, calcSubTime } from '../api'
import { saveSubstituteDetail, saveFittingDetail } from '../api/transitionDetailsApi'
import { COLUMNS } from '../models/tableConfig'
import { useFittingForm } from './useFittingForm'
import { useHomeActions } from './useHomeActions'
import { useHomeData } from './useHomeData'
import { useHydrotestForm } from './useHydrotestForm'
import { useSubstituteForm } from './useSubstituteForm'
import { usePreformRef } from './usePreformRef'
import { useTransitionsRef } from './useTransitionsRef'
import {
  isAssignmentOperationId,
  isSmallFormOperationId,
  isLargeFormOperationId,
  isIrazmUsedInLargeFormCalc,
  isValueMeasUsedInLargeFormCalc,
} from '../utils/operationCategory'

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

export function useHomePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [monthFilter, setMonthFilter] = useState('')
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
  const [pendingTransitionFocus, setPendingTransitionFocus] = useState(null)

  const clearPendingTransitionFocus = useCallback(() => {
    setPendingTransitionFocus(null)
  }, [])

  const data = useHomeData({
    activeTab,
    searchQuery,
    monthFilter,
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
    setPendingTransitionFocus((prev) => (prev?.ownerType === 'substitute' ? null : prev))
    let idToCalc = null
    setSubstituteTransitionsModal((prev) => {
      if (prev.isOpen && prev.idSubstitutePrepared != null) {
        idToCalc = prev.idSubstitutePrepared
      }
      return { ...prev, isOpen: false }
    })
    if (idToCalc != null) {
      void calcSubTime(idToCalc)
        .then(() => data.loadData())
        .then(() => {
          data.setPendingScrollToId(idToCalc)
        })
        .catch((err) => window.alert(err.message || 'Ошибка перерасчёта времени'))
    }
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
    setPendingTransitionFocus((prev) => (prev?.ownerType === 'fitting' ? null : prev))
    let idToCalc = null
    setFittingTransitionsModal((prev) => {
      if (prev.isOpen && prev.idFiting != null) {
        idToCalc = prev.idFiting
      }
      return { ...prev, isOpen: false }
    })
    if (idToCalc != null) {
      void calcFitTime(idToCalc)
        .then(() => data.loadData())
        .then(() => {
          data.setPendingScrollToId(idToCalc)
        })
        .catch((err) => window.alert(err.message || 'Ошибка перерасчёта времени'))
    }
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

  useEffect(() => {
    if (!substituteForm.isModalOpen || activeTab !== 0) return
    void data.ensurePreformLoaded()
  }, [substituteForm.isModalOpen, activeTab, data.ensurePreformLoaded])

  useEffect(() => {
    if (!fittingForm.isModalOpen || (activeTab !== 1 && activeTab !== 2)) return
    void data.ensurePreformLoaded()
    void data.ensurePartyLoaded()
  }, [fittingForm.isModalOpen, activeTab, data.ensurePreformLoaded, data.ensurePartyLoaded])

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

  const handleEdit = (rowIdOverride) => {
    if (activeTab === 0) substituteForm.openEdit(rowIdOverride)
    else if (activeTab === 1 || activeTab === 2) fittingForm.openEdit(rowIdOverride)
    else if (activeTab === 3) hydrotestForm.openEdit(rowIdOverride)
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
      if (isSmallFormOperationId(selectedOperationId)) {
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
        setTimeout(() => {
          setTransitionSmallForm(payloadBase)
        }, 0)
        return
      }

      if (isLargeFormOperationId(selectedOperationId)) {
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
        setTimeout(() => {
          setTransitionLargeForm(payloadBase)
        }, 0)
        return
      }
    }

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

  const saveAssignmentTransitionDirect = async ({
    ownerType,
    idSubstitutePrepared,
    idFiting,
    operationId,
    isEditMode,
    transitionRecordId,
    seqNumOper,
  }) => {
    const idUserCreator = isEditMode ? null : user?.userId ?? null

    if (ownerType === 'substitute') {
      if (idSubstitutePrepared == null) {
        throw new Error('Не выбран переводник')
      }
      return saveSubstituteDetail({
        id: isEditMode ? transitionRecordId : null,
        idSubstitutePrepared,
        idOperations: operationId,
        d: null,
        l: null,
        irazm: null,
        valueMeas: null,
        i: null,
        depthCut: null,
        n: null,
        s: null,
        masCur: null,
        lCur: null,
        seqNumOper,
        idUserCreator,
      })
    }

    if (ownerType === 'fitting') {
      if (idFiting == null) {
        throw new Error('Не выбрана деталь')
      }
      return saveFittingDetail({
        id: isEditMode ? transitionRecordId : null,
        idFiting,
        idOperations: operationId,
        d: null,
        l: null,
        irazm: null,
        valueMeas: null,
        i: null,
        depthCut: null,
        n: null,
        s: null,
        masCur: null,
        lCur: null,
        seqNumOper,
        idUserCreator,
      })
    }

    throw new Error('Не определен тип владельца перехода')
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

    const initialValues = modeEdit
      ? { seqNumOper: ctx.transitionDraft?.seqNumOper ?? '' }
      : null

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
      initialValues,
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

    if (isAssignmentOperationId(selectedOperationId)) {
      try {
        const result = await saveAssignmentTransitionDirect({
          ownerType,
          idSubstitutePrepared,
          idFiting,
          operationId: selectedOperationId,
          isEditMode: modeEdit,
          transitionRecordId: ctx.transitionRecordId ?? null,
          seqNumOper: modeEdit ? parseIntOrNull(ctx.transitionDraft?.seqNumOper) : null,
        })
        const recordId = modeEdit ? ctx.transitionRecordId : result?.id
        if (recordId != null) {
          setPendingTransitionFocus({
            ownerType,
            kind: 'record',
            recordId,
            scrollBlock: modeEdit ? 'center' : 'end',
          })
        }
        setTransitionsListRefreshKey((k) => k + 1)
      } catch (err) {
        window.alert(err?.message || 'Ошибка сохранения перехода')
      }
      return
    }

    window.alert('Для выбранной операции не настроен сценарий ввода.')
  }

  const handleTransitionsRefModalExited = () => {
    if (!resetTransitionsRefContextOnClose) return
    clearTransitionsRefContext()
    setResetTransitionsRefContextOnClose(false)
  }

  const handleSaveTransitionSmall = async (savePayload) => {
    const s = transitionSmallForm
    const draft = savePayload?.draft ?? savePayload
    const operationId = savePayload?.idOperations ?? s.idOperations
    if (!s.ownerType || operationId == null) {
      throw new Error('Недостаточно данных для сохранения')
    }
    const idUserCreator = s.isEditMode ? null : user?.userId ?? null
    const seqNumOper = s.isEditMode ? parseIntOrNull(s.initialValues?.seqNumOper) : null
    const emptyGeom = {
      d: null,
      l: null,
      valueMeas: null,
      i: null,
      depthCut: null,
      n: null,
      s: null,
    }

    let savedId = null
    if (s.ownerType === 'substitute') {
      if (s.idSubstitutePrepared == null) {
        throw new Error('Не выбран переводник')
      }
      const result = await saveSubstituteDetail({
        id: s.isEditMode ? s.transitionRecordId : null,
        idSubstitutePrepared: s.idSubstitutePrepared,
        idOperations: operationId,
        ...emptyGeom,
        masCur: parseNum(draft.masCur),
        lCur: parseNum(draft.lCur),
        seqNumOper,
        idUserCreator,
      })
      savedId = result?.id
    } else if (s.ownerType === 'fitting') {
      if (s.idFiting == null) {
        throw new Error('Не выбрана деталь')
      }
      const result = await saveFittingDetail({
        id: s.isEditMode ? s.transitionRecordId : null,
        idFiting: s.idFiting,
        idOperations: operationId,
        ...emptyGeom,
        masCur: parseNum(draft.masCur),
        lCur: parseNum(draft.lCur),
        seqNumOper,
        idUserCreator,
      })
      savedId = result?.id
    }

    const recordId = s.isEditMode ? s.transitionRecordId : savedId
    if (recordId != null) {
      setPendingTransitionFocus({
        ownerType: s.ownerType,
        kind: 'record',
        recordId,
        scrollBlock: s.isEditMode ? 'center' : 'end',
      })
    }

    setTransitionsListRefreshKey((k) => k + 1)
    closeTransitionSmallForm()
  }

  const handleSaveTransitionLarge = async (savePayload) => {
    const s = transitionLargeForm
    const draft = savePayload?.draft ?? savePayload
    const operationId = savePayload?.idOperations ?? s.idOperations
    if (!s.ownerType || operationId == null) {
      throw new Error('Недостаточно данных для сохранения')
    }
    const idUserCreator = s.isEditMode ? null : user?.userId ?? null
    const seqNumOper = s.isEditMode ? parseIntOrNull(s.initialValues?.seqNumOper) : null
    const payloadBase = {
      d: parseNum(draft.d),
      l: parseNum(draft.l),
      irazm: isIrazmUsedInLargeFormCalc(operationId) ? parseNum(draft.irazm) : null,
      valueMeas: isValueMeasUsedInLargeFormCalc(operationId)
        ? parseNum(draft.valueMeas)
        : null,
      i: parseIntOrNull(draft.i),
      depthCut: parseNum(draft.depthCut),
      n: parseNum(draft.n),
      s: parseNum(draft.s),
      masCur: null,
      lCur: null,
      seqNumOper,
      idUserCreator,
    }

    let savedId = null
    if (s.ownerType === 'substitute') {
      if (s.idSubstitutePrepared == null) {
        throw new Error('Не выбран переводник')
      }
      const result = await saveSubstituteDetail({
        id: s.isEditMode ? s.transitionRecordId : null,
        idSubstitutePrepared: s.idSubstitutePrepared,
        idOperations: operationId,
        ...payloadBase,
      })
      savedId = result?.id
    } else if (s.ownerType === 'fitting') {
      if (s.idFiting == null) {
        throw new Error('Не выбрана деталь')
      }
      const idNtk = Array.isArray(savePayload?.idNtk)
        ? savePayload.idNtk
            .map((n) => (typeof n === 'number' ? n : parseInt(String(n), 10)))
            .filter((n) => Number.isInteger(n))
        : []
      const result = await saveFittingDetail({
        id: s.isEditMode ? s.transitionRecordId : null,
        idFiting: s.idFiting,
        idOperations: operationId,
        ...payloadBase,
        idNtk,
      })
      savedId = result?.id
    }

    const recordId = s.isEditMode ? s.transitionRecordId : savedId
    if (recordId != null) {
      setPendingTransitionFocus({
        ownerType: s.ownerType,
        kind: 'record',
        recordId,
        scrollBlock: s.isEditMode ? 'center' : 'end',
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
    monthFilter,
    setMonthFilter,
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
    pendingTransitionFocus,
    clearPendingTransitionFocus,
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
