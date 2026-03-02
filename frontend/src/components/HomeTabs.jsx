import { TABS } from '../models/tableConfig'

function HomeTabs({ activeTab, onChange }) {
  return (
    <div className="home-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`home-tab ${activeTab === tab.id ? 'home-tab_active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default HomeTabs
