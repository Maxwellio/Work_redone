import Layout from '../components/Layout'
import HomeModals from '../components/HomeModals'
import HomeToolbar from '../components/HomeToolbar'
import HomeTable from '../components/HomeTable'
import HomeTabs from '../components/HomeTabs'
import { useHomePage } from '../hooks/useHomePage'
import Box from '@mui/material/Box'
import { formatCell, getRowId } from '../utils/format'

function Home() {
  const home = useHomePage()
  const { activeTab, data, actions } = home
  const handleRowDoubleClick = (id) => {
    data.setSelectedRowId(id)
    home.handleEdit(id)
  }

  const chrome = (
    <>
      <HomeToolbar
        activeTab={activeTab}
        selectedRowId={data.selectedRowId}
        searchQuery={home.searchQuery}
        showMyRecords={home.showMyRecords}
        onAdd={home.handleAdd}
        onEdit={home.handleEdit}
        onTransitions={home.handleOpenTransitions}
        onOpenTransitionsRef={home.openTransitionsRefModal}
        onOpenPreformRef={home.openPreformRefModal}
        onDelete={actions.handleDelete}
        onCalcNorms={actions.handleCalcNorms}
        onPrint={actions.handlePrint}
        onToggleMyRecords={home.toggleMyRecords}
        onSearchChange={home.setSearchQuery}
        monthFilter={home.monthFilter}
        onMonthFilterChange={home.setMonthFilter}
      />
      <HomeTabs activeTab={activeTab} onChange={home.handleTabChange} />
    </>
  )

  return (
    <Layout chrome={chrome}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <HomeTable
          columns={home.columns}
          listData={data.sortedListData}
          activeTab={activeTab}
          selectedRowId={data.selectedRowId}
          loading={data.loading}
          error={data.error}
          getRowId={getRowId}
          formatCell={formatCell}
          onSelectRow={data.setSelectedRowId}
          onRowDoubleClick={handleRowDoubleClick}
          sortField={data.sortField}
          sortDirection={data.sortDirection}
          onSort={data.handleSort}
          scrollContainerRef={data.scrollContainerRef}
        />

        <HomeModals
          activeTab={activeTab}
          selectedRowId={data.selectedRowId}
          preformTypesFiltered={data.preformTypesFiltered}
          preformTypesFilteredFitting={data.preformTypesFilteredFitting}
          preformError={data.preformError}
          partyList={data.partyList}
          isTransitionsRefModalOpen={home.isTransitionsRefModalOpen}
          onCloseTransitionsRef={home.closeTransitionsRefModal}
          onTransitionsRefExited={home.handleTransitionsRefModalExited}
          onOpenTransitionsRefModal={home.openTransitionsRefModal}
          onTransitionsRefOk={home.handleTransitionsRefOk}
          transitionsRefContext={home.transitionsRefContext}
          transitionSmallForm={home.transitionSmallForm}
          onCloseTransitionSmallForm={home.closeTransitionSmallForm}
          onSaveTransitionSmall={home.handleSaveTransitionSmall}
          transitionLargeForm={home.transitionLargeForm}
          onCloseTransitionLargeForm={home.closeTransitionLargeForm}
          onSaveTransitionLarge={home.handleSaveTransitionLarge}
          transitionsListRefreshKey={home.transitionsListRefreshKey}
          onTransitionsListChange={home.refreshTransitionsList}
          isPreformRefModalOpen={home.isPreformRefModalOpen}
          onClosePreformRef={home.closePreformRefModal}
          preformRef={home.preformRef}
          substituteTransitionsModal={home.substituteTransitionsModal}
          onCloseSubstituteTransitions={home.closeSubstituteTransitions}
          fittingTransitionsModal={home.fittingTransitionsModal}
          onCloseFittingTransitions={home.closeFittingTransitions}
          substituteForm={home.substituteForm}
          fittingForm={home.fittingForm}
          hydrotestForm={home.hydrotestForm}
          transitionsRef={home.transitionsRef}
        />
      </Box>
    </Layout>
  )
}

export default Home
