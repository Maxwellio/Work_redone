import SearchIcon from '@mui/icons-material/Search'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useMemo, useState } from 'react'
import '../../../styles/Home.css'
import { fetchAdminUsers } from '../api/adminUsers'
import { AdminUserFormPanel } from './AdminUserFormPanel'

const tableRowClickable = {
  cursor: 'pointer',
  '&:hover': { background: 'var(--color-sand-light)' },
  '&.Mui-selected': { background: 'rgba(0, 142, 185, 0.08)' },
  '&.Mui-selected:hover': { background: 'rgba(0, 142, 185, 0.12)' },
}

function formatDate(isoOrNull) {
  if (isoOrNull == null || isoOrNull === '') return '—'
  const d = typeof isoOrNull === 'string' ? isoOrNull.slice(0, 10) : String(isoOrNull)
  return d
}

function activeLabel(active) {
  return active === 1 ? 'Да' : 'Нет'
}

/**
 * Рабочая зона админки: список пользователей слева (данные с API), форма-заглушка справа.
 * orgId приходит в данных для будущих экранов, в таблице не показывается.
 */
export function AdminWorkspaceMock() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsersId, setSelectedUsersId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить список')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => {
      const hay = [
        u.userName,
        u.fio,
        u.mail,
        u.telefon,
        u.roleName,
        u.note,
        String(u.usersId),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [users, searchQuery])

  const selected = useMemo(
    () => users.find((u) => u.usersId === selectedUsersId) ?? null,
    [users, selectedUsersId],
  )

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={0}
      alignItems="stretch"
      sx={{ flex: 1, minHeight: 0 }}
    >
      <Box
        sx={(theme) => ({
          flex: { md: '7 1 0' },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: { md: `1px solid ${theme.palette.divider}` },
          borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
        })}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          spacing={1}
          columnGap={2}
          rowGap={1.5}
          alignItems="center"
          sx={(theme) => ({
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            flexShrink: 0,
          })}
        >
          <TextField
            size="small"
            placeholder="Поиск по списку…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" sx={{ opacity: 0.8 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: '100%', sm: 220 },
              flex: { sm: '1 1 200px' },
              maxWidth: { sm: 400 },
            }}
          />
        </Stack>

        {error && (
          <Box sx={{ px: 2, py: 1 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <TableContainer
            className="home-table-wrap"
            sx={{
              flex: 1,
              minHeight: 0,
              m: 0,
              mt: 1,
              mx: 2,
              mb: 2,
              overflow: 'auto',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'secondary.main',
              borderRadius: 1,
            }}
          >
            <Table className="home-table" size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 56 }}>ID</TableCell>
                  <TableCell>Логин</TableCell>
                  <TableCell>ФИО</TableCell>
                  <TableCell>Почта</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell align="center">Активен</TableCell>
                  <TableCell>Подключён</TableCell>
                  <TableCell>Отключён</TableCell>
                  <TableCell>Заметка</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <Typography variant="body2" color="text.secondary">
                        {users.length === 0 ? 'Нет пользователей' : 'Ничего не найдено'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => {
                    const isSelected = row.usersId === selectedUsersId
                    return (
                      <TableRow
                        key={row.usersId}
                        data-row-id={row.usersId}
                        selected={isSelected}
                        onClick={() => setSelectedUsersId(isSelected ? null : row.usersId)}
                        sx={tableRowClickable}
                      >
                        <TableCell>{row.usersId}</TableCell>
                        <TableCell>{row.userName}</TableCell>
                        <TableCell>{row.fio ?? '—'}</TableCell>
                        <TableCell>{row.mail ?? '—'}</TableCell>
                        <TableCell>{row.telefon ?? '—'}</TableCell>
                        <TableCell>{row.roleName ?? '—'}</TableCell>
                        <TableCell align="center">{activeLabel(row.active)}</TableCell>
                        <TableCell>{formatDate(row.dtenter)}</TableCell>
                        <TableCell>{formatDate(row.dtout)}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 220,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={row.note || ''}
                        >
                          {row.note || '—'}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Box
        sx={{
          flex: { md: '3 1 0' },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          overflow: 'auto',
        }}
      >
        <AdminUserFormPanel selectedUser={selected} />
      </Box>
    </Stack>
  )
}
