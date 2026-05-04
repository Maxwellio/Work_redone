import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { TABS } from '../models/tableConfig'
function HomeTabs({ activeTab, onChange }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0,
        borderBottom: 1,
        borderColor: 'secondary.main',
        bgcolor: 'background.paper',
        px: 3,
      }}
    >
      <Tabs value={activeTab} onChange={(_, v) => onChange(v)}>
        {TABS.map((tab) => (
          <Tab key={tab.id} label={tab.label} value={tab.id} />
        ))}
      </Tabs>
    </Box>
  )
}

export default HomeTabs
