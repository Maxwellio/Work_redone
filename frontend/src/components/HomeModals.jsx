import FittingModal from './FittingModal'
import HydrotestModal from './HydrotestModal'
import PreformRefModal from './PreformRefModal'
import SubstituteModal from './SubstituteModal'
import SubstituteTransitionsModal from './SubstituteTransitionsModal'
import FittingTransitionsModal from './FittingTransitionsModal'
import TransitionsRefModal from './TransitionsRefModal'
import TransitionSmallFormModal from './TransitionSmallFormModal'
import TransitionLargeFormModal from './TransitionLargeFormModal'

function HomeModals({
  activeTab,
  selectedRowId,
  preformTypesFiltered,
  preformTypesFilteredFitting,
  preformError,
  partyList,
  isTransitionsRefModalOpen,
  onCloseTransitionsRef,
  onTransitionsRefExited,
  onOpenTransitionsRefModal,
  onTransitionsRefOk,
  transitionsRefContext,
  transitionSmallForm,
  onCloseTransitionSmallForm,
  onSaveTransitionSmall,
  transitionLargeForm,
  onCloseTransitionLargeForm,
  onSaveTransitionLarge,
  transitionsListRefreshKey,
  onTransitionsListChange,
  isPreformRefModalOpen,
  onClosePreformRef,
  preformRef,
  substituteTransitionsModal,
  onCloseSubstituteTransitions,
  fittingTransitionsModal,
  onCloseFittingTransitions,
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
        onOpenTransitions={fittingForm.handleSaveAndOpenTransitions}
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
        onExited={onTransitionsRefExited}
        groups={transitionsRef.groups}
        operations={transitionsRef.operations}
        selectedGroupId={transitionsRef.selectedGroupId}
        onSelectGroup={transitionsRef.setSelectedGroupId}
        loadingRefData={transitionsRef.loadingRefData}
        errorRefData={transitionsRef.errorRefData}
        onOk={onTransitionsRefOk}
        showOkButton={Boolean(transitionsRefContext?.ownerType)}
      />

      <TransitionSmallFormModal
        open={transitionSmallForm.open}
        onClose={onCloseTransitionSmallForm}
        isEditMode={transitionSmallForm.isEditMode}
        idOperations={transitionSmallForm.idOperations}
        nmOperations={transitionSmallForm.nmOperations}
        initialValues={transitionSmallForm.initialValues}
        onSave={onSaveTransitionSmall}
        ownerType={transitionSmallForm.ownerType}
      />

      <TransitionLargeFormModal
        open={transitionLargeForm.open}
        onClose={onCloseTransitionLargeForm}
        isEditMode={transitionLargeForm.isEditMode}
        idOperations={transitionLargeForm.idOperations}
        nmOperations={transitionLargeForm.nmOperations}
        initialValues={transitionLargeForm.initialValues}
        onSave={onSaveTransitionLarge}
        ownerType={transitionLargeForm.ownerType}
        tip={transitionLargeForm.tip}
        idFiting={transitionLargeForm.idFiting}
        transitionRecordId={transitionLargeForm.transitionRecordId}
      />

      <PreformRefModal
        open={isPreformRefModalOpen}
        onClose={onClosePreformRef}
        list={preformRef.list}
        loading={preformRef.loading}
        error={preformRef.error}
      />

      <SubstituteTransitionsModal
        open={substituteTransitionsModal.isOpen}
        substituteId={substituteTransitionsModal.idSubstitutePrepared}
        substituteName={substituteTransitionsModal.substituteName}
        onClose={onCloseSubstituteTransitions}
        onOpenTransitionsRefModal={onOpenTransitionsRefModal}
        transitionsListRefreshKey={transitionsListRefreshKey}
        onTransitionsListChange={onTransitionsListChange}
      />

      <FittingTransitionsModal
        open={fittingTransitionsModal.isOpen}
        fittingId={fittingTransitionsModal.idFiting}
        fittingName={fittingTransitionsModal.fittingName}
        tip={fittingTransitionsModal.tip}
        onClose={onCloseFittingTransitions}
        onOpenTransitionsRefModal={onOpenTransitionsRefModal}
        transitionsListRefreshKey={transitionsListRefreshKey}
        onTransitionsListChange={onTransitionsListChange}
      />
    </>
  )
}

export default HomeModals
