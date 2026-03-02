import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { TABS } from '../models/tableConfig'
import '../styles/Home.css'

function HomeTabs({ activeTab, onChange }) {
  return (
    <Box className="home-tabs">
      <Tabs value={activeTab} onChange={(_, v) => onChange(v)}>
        {TABS.map((tab) => (
          <Tab key={tab.id} label={tab.label} value={tab.id} />
        ))}
      </Tabs>
    </Box>
  )
}

export default HomeTabs
