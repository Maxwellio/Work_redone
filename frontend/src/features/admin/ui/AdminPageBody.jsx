import { Outlet } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import { AdminWorkspaceMock } from './AdminWorkspaceMock'

/**
 * Основная область админки: макет рабочей зоны, вложенные маршруты (`Outlet`).
 */
export function AdminPageBody() {
  return (
    <Stack
      component="section"
      spacing={2}
      sx={(theme) => ({
        px: { xs: 2, sm: 3 },
        py: 3,
        maxWidth: theme.breakpoints.values.xl,
        mx: 'auto',
        width: '100%',
      })}
    >
      <Paper variant="adminShell" sx={(theme) => ({ p: theme.spacing(3) })}>
        <Stack spacing={2}>
          <AdminWorkspaceMock />
          <Outlet />
        </Stack>
      </Paper>
    </Stack>
  )
}
