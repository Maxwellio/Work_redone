import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { COLUMNS } from '../models/tableConfig'
import { useFittingForm } from './useFittingForm'
import { useHomeActions } from './useHomeActions'
import { useHomeData } from './useHomeData'
import { useHydrotestForm } from './useHydrotestForm'
import { useSubstituteForm } from './useSubstituteForm'
import { usePreformRef } from './usePreformRef'
import { useTransitionsRef } from './useTransitionsRef'

export function useHomePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMyRecords, setShowMyRecords] = useState(false)
  const [isTransitionsRefModalOpen, setIsTransitionsRefModalOpen] = useState(false)
  const [isPreformRefModalOpen, setIsPreformRefModalOpen] = useState(false)
  const [substituteTransitionsModal, setSubstituteTransitionsModal] = useState({
    isOpen: false,
    idSubstitutePrepared: null,
    substituteName: '',
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

  const transitionsRef = useTransitionsRef(isTransitionsRefModalOpen)
  const preformRef = usePreformRef(isPreformRefModalOpen)

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
    if (activeTab !== 0) return
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
  }

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    showMyRecords,
    toggleMyRecords: () => setShowMyRecords((prev) => !prev),
    isTransitionsRefModalOpen,
    openTransitionsRefModal: () => setIsTransitionsRefModalOpen(true),
    closeTransitionsRefModal: () => setIsTransitionsRefModalOpen(false),
    isPreformRefModalOpen,
    openPreformRefModal: () => setIsPreformRefModalOpen(true),
    closePreformRefModal: () => setIsPreformRefModalOpen(false),
    substituteTransitionsModal,
    closeSubstituteTransitions,
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
