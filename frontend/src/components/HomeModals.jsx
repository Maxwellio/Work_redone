import FittingModal from './FittingModal'
import HydrotestModal from './HydrotestModal'
import SubstituteModal from './SubstituteModal'
import SubstituteTransitionsModal from './SubstituteTransitionsModal'
import TransitionsRefModal from './TransitionsRefModal'

function HomeModals({
  activeTab,
  selectedRowId,
  preformTypesFiltered,
  preformTypesFilteredFitting,
  preformError,
  partyList,
  isTransitionsRefModalOpen,
  onCloseTransitionsRef,
  substituteTransitionsModal,
  onCloseSubstituteTransitions,
  substituteForm,
  fittingForm,
  hydrotestForm,
  transitionsRef,
}) {
  return (
    <>
      <SubstituteModal
        open={substituteForm.isModalOpen && activeTab === 0}
        isEditMode={substituteForm.isEditMode}
        selectedRowId={selectedRowId}
        formData={substituteForm.formData}
        preformTypesFiltered={preformTypesFiltered}
        preformError={preformError}
        saveError={substituteForm.saveError}
        onClose={substituteForm.close}
        onSave={substituteForm.handleSave}
        onOpenTransitions={substituteForm.handleSaveAndOpenTransitions}
      />

      <FittingModal
        open={fittingForm.isModalOpen && (activeTab === 1 || activeTab === 2)}
        isEditMode={fittingForm.isEditMode}
        selectedRowId={selectedRowId}
        formData={fittingForm.formData}
        preformTypesFiltered={preformTypesFilteredFitting}
        partyList={partyList}
        preformError={activeTab === 1 ? preformError : null}
        saveError={fittingForm.saveError}
        onClose={fittingForm.close}
        onSave={fittingForm.handleSave}
        tip={activeTab === 1 ? 1 : 2}
      />

      <HydrotestModal
        open={hydrotestForm.isModalOpen && activeTab === 3}
        isEditMode={hydrotestForm.isEditMode}
        selectedRowId={selectedRowId}
        formData={hydrotestForm.formData}
        saveError={hydrotestForm.saveError}
        onClose={hydrotestForm.close}
        onSave={hydrotestForm.handleSave}
      />

      <TransitionsRefModal
        open={isTransitionsRefModalOpen}
        onClose={onCloseTransitionsRef}
        groups={transitionsRef.groups}
        operations={transitionsRef.operations}
        selectedGroupId={transitionsRef.selectedGroupId}
        onSelectGroup={transitionsRef.setSelectedGroupId}
        loadingGroups={transitionsRef.loadingGroups}
        loadingOperations={transitionsRef.loadingOperations}
        errorGroups={transitionsRef.errorGroups}
        errorOperations={transitionsRef.errorOperations}
      />

      <SubstituteTransitionsModal
        open={substituteTransitionsModal.isOpen}
        substituteId={substituteTransitionsModal.idSubstitutePrepared}
        substituteName={substituteTransitionsModal.substituteName}
        onClose={onCloseSubstituteTransitions}
      />
    </>
  )
}

export default HomeModals
