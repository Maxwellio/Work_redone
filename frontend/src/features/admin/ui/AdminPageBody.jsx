import { Outlet } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

/**
 * Основная область админки: заглушка и вложенные маршруты (`Outlet`).
 */
export function AdminPageBody() {
  return (
    <Stack
      component="section"
      spacing={2}
      sx={(theme) => ({
        px: { xs: 2, sm: 3 },
        py: 3,
        maxWidth: theme.breakpoints.values.lg,
        mx: 'auto',
        width: '100%',
      })}
    >
      <Paper variant="adminShell" sx={(theme) => ({ p: theme.spacing(3) })}>
        <Stack spacing={2}>
          <Typography variant="adminPageStub" color="text.secondary" component="p">
            Разделы админ-панели будут добавлены здесь. Сейчас это каркас страницы.
          </Typography>
          <Outlet />
        </Stack>
      </Paper>
    </Stack>
  )
}
