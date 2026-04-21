import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/**
 * Полоса под AppBar на маршруте `/admin`. Без ссылок и навигации (каркас).
 */
export function AdminPageChrome() {
  return (
    <Box
      component="header"
      sx={(theme) => ({
        px: { xs: 2, sm: 3 },
        py: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.secondary.light,
      })}
    >
      <Typography variant="adminChromeTitle" color="text.primary" component="p">
        Админ-панель
      </Typography>
    </Box>
  )
}
