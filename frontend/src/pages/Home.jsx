import HomeModals from '../components/HomeModals'
import HomeToolbar from '../components/HomeToolbar'
import HomeTable from '../components/HomeTable'
import HomeTabs from '../components/HomeTabs'
import { useHomePage } from '../hooks/useHomePage'
import { formatCell, getRowId } from '../utils/format'
import '../styles/Home.css'

function Home() {
  const home = useHomePage()
  const { activeTab, data, actions } = home

  return (
    <div className="home">
      <HomeToolbar
        activeTab={activeTab}
        searchQuery={home.searchQuery}
        showMyRecords={home.showMyRecords}
        onAdd={home.handleAdd}
        onEdit={home.handleEdit}
        onTransitions={() => console.log('Переходы по трубе', { activeTab })}
        onOpenTransitionsRef={home.openTransitionsRefModal}
        onDelete={actions.handleDelete}
        onCalcNorms={actions.handleCalcNorms}
        onPrint={actions.handlePrint}
        onToggleMyRecords={home.toggleMyRecords}
        onSearchChange={home.setSearchQuery}
      />

      <HomeTabs activeTab={activeTab} onChange={home.setActiveTab} />

      <HomeTable
        columns={home.columns}
        listData={data.listData}
        activeTab={activeTab}
        selectedRowId={data.selectedRowId}
        loading={data.loading}
        error={data.error}
        getRowId={getRowId}
        formatCell={formatCell}
        onSelectRow={data.setSelectedRowId}
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
        substituteForm={home.substituteForm}
        fittingForm={home.fittingForm}
        hydrotestForm={home.hydrotestForm}
        transitionsRef={home.transitionsRef}
      />
    </div>
  )
}

export default Home
