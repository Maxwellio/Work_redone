import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import { AdminWorkspaceMock } from './AdminWorkspaceMock'

/**
 * Основная область админки: макет рабочей зоны, вложенные маршруты (`Outlet`).
 */
export function AdminPageBody() {
  return (
    <Box
      component="section"
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <AdminWorkspaceMock />
      <Outlet />
    </Box>
  )
}
