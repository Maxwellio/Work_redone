import SearchIcon from '@mui/icons-material/Search'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminDenseTableSx, adminTableWrapSx } from '../../../theme'
import { ensureAdminOrgStruct } from '../api/adminReferenceCache'
import { fetchAdminUsers } from '../api/adminUsers'
import { NM_ADMIN, NM_USER } from '../constants'
import { AdminUserFormPanel } from './AdminUserFormPanel'

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
  const theme = useTheme()
  const tableRowClickableSx = useMemo(
    () => ({
      cursor: 'pointer',
      '&:hover': { backgroundColor: theme.palette.secondary.light },
      '&.Mui-selected': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
      '&.Mui-selected:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.12) },
    }),
    [theme],
  )
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsersId, setSelectedUsersId] = useState(null)
  const [orgChoices, setOrgChoices] = useState([])
  const [orgRefsLoading, setOrgRefsLoading] = useState(true)
  const [orgRefsError, setOrgRefsError] = useState(null)
  const [orgFilterId, setOrgFilterId] = useState(null)
  const [roleFilter, setRoleFilter] = useState('none')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

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

  useEffect(() => {
    let cancel = false
    async function run() {
      setOrgRefsLoading(true)
      setOrgRefsError(null)
      const r = await ensureAdminOrgStruct()
      if (cancel) return
      setOrgChoices(r.data)
      if (!r.ok) {
        setOrgRefsError(r.error ?? 'Не удалось загрузить подразделения')
      }
      setOrgRefsLoading(false)
    }
    run()
    return () => {
      cancel = true
    }
  }, [])

  const filtered = useMemo(() => {
    let list = users
    if (orgFilterId != null) {
      list = list.filter((u) => u.orgId === orgFilterId)
    }
    if (roleFilter === 'admin') {
      list = list.filter((u) => u.roleName === NM_ADMIN)
    } else if (roleFilter === 'user') {
      list = list.filter((u) => u.roleName === NM_USER)
    }
    const q = searchQuery.trim().toLowerCase()
    if (!q) return list
    return list.filter((u) => {
      const hay = [
        u.userName,
        u.fio,
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
  }, [users, orgFilterId, roleFilter, searchQuery])

  const selected = useMemo(
    () => users.find((u) => u.usersId === selectedUsersId) ?? null,
    [users, selectedUsersId],
  )

  const handleUserSaved = useCallback(async () => {
    await load()
    setSelectedUsersId(null)
    setIsAddUserOpen(false)
  }, [load])

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={0}
      alignItems="stretch"
      sx={{ flex: 1, minHeight: 0 }}
    >
      <Box
        sx={(theme) => ({
          flex: { md: '8 1 0' },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
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
          <FormControl size="small" sx={{ minWidth: 240 }} disabled={orgRefsLoading}>
            <InputLabel id="admin-toolbar-org-label">Подразделение</InputLabel>
            <Select
              labelId="admin-toolbar-org-label"
              id="admin-toolbar-org"
              label="Подразделение"
              value={orgFilterId == null ? '' : orgFilterId}
              onChange={(e) => {
                const v = e.target.value
                setOrgFilterId(v === '' ? null : Number(v))
              }}
            >
              <MenuItem value="">
                <em>Все подразделения</em>
              </MenuItem>
              {orgChoices.map((o) => (
                <MenuItem key={o.id} value={o.id} title={o.fullnm || ''}>
                  {o.nm}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={roleFilter === 'admin'}
                onChange={(_, c) => setRoleFilter(c ? 'admin' : 'none')}
              />
            }
            label="Только администраторы"
            sx={{ m: 0, ml: 0.5 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={roleFilter === 'user'}
                onChange={(_, c) => setRoleFilter(c ? 'user' : 'none')}
              />
            }
            label="Только пользователи"
            sx={{ m: 0 }}
          />
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={() => {
              if (isAddUserOpen && selectedUsersId == null) {
                setIsAddUserOpen(false)
              } else {
                setIsAddUserOpen(true)
                setSelectedUsersId(null)
              }
            }}
            sx={{ ml: { xs: 0, sm: 'auto' }, flexShrink: 0 }}
          >
            Добавить пользователя
          </Button>
        </Stack>

        {orgRefsError && (
          <Box sx={{ px: 2, py: 0.5 }}>
            <Alert severity="warning" sx={{ py: 0.5 }}>{orgRefsError}</Alert>
          </Box>
        )}

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
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              pt: 1,
              px: 2,
              pb: 2,
            }}
          >
            <TableContainer sx={(t) => adminTableWrapSx(t)}>
              <Table size="small" sx={(t) => adminDenseTableSx(t)}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 56 }}>ID</TableCell>
                    <TableCell>Логин</TableCell>
                    <TableCell>ФИО</TableCell>
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
                      <TableCell colSpan={9}>
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
                          onClick={() => {
                            if (isSelected) {
                              setSelectedUsersId(null)
                            } else {
                              setIsAddUserOpen(false)
                              setSelectedUsersId(row.usersId)
                            }
                          }}
                          sx={tableRowClickableSx}
                        >
                          <TableCell>{row.usersId}</TableCell>
                          <TableCell>{row.userName}</TableCell>
                          <TableCell>{row.fio ?? '—'}</TableCell>
                          <TableCell>{row.telefon ?? '—'}</TableCell>
                          <TableCell>{row.roleName ?? '—'}</TableCell>
                          <TableCell align="center">{activeLabel(row.active)}</TableCell>
                          <TableCell>{formatDate(row.dtenter)}</TableCell>
                          <TableCell>{formatDate(row.dtout)}</TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              verticalAlign: 'top',
                            }}
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
          </Box>
        )}
      </Box>

      {(selected != null || isAddUserOpen) && (
        <Box
          sx={{
            flex: { md: '2 1 0' },
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            overflow: 'auto',
          }}
        >
          <AdminUserFormPanel
            selectedUser={selected}
            isNewUserDraft={isAddUserOpen && selected == null}
            onSaved={handleUserSaved}
          />
        </Box>
      )}
    </Stack>
  )
}
