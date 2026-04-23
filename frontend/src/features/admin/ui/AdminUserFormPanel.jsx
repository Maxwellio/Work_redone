import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useCallback, useEffect, useState } from 'react'
import { fetchAdminOrgChoices, fetchAdminRoles } from '../api/adminReferences'

dayjs.locale('ru')

const NM_USER = 'Пользователь'
const DEFAULT_ORG_ID = 30

/**
 * Правая панель: форма полей пользователя, данные с записи в таблице (без сохранения на сервер).
 * @param {{ selectedUser: object | null }} props
 */
export function AdminUserFormPanel({ selectedUser }) {
  const [roles, setRoles] = useState([])
  const [orgChoices, setOrgChoices] = useState([])
  const [refsLoading, setRefsLoading] = useState(true)
  const [refsError, setRefsError] = useState(null)

  const [roleId, setRoleId] = useState('')
  const [fio, setFio] = useState('')
  const [orgId, setOrgId] = useState(DEFAULT_ORG_ID)
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [telefon, setTelefon] = useState('')
  const [mail, setMail] = useState('')
  const [dtenter, setDtenter] = useState(() => dayjs())
  const [dtout, setDtout] = useState(() => dayjs('2100-01-01'))
  const [note, setNote] = useState('')
  const [active, setActive] = useState(true)
  const [isFirstLogin, setIsFirstLogin] = useState(true)

  const applyDefaultsForAdd = useCallback((roleList) => {
    if (!roleList || roleList.length === 0) return
    const userRole = roleList.find((r) => r.nm === NM_USER)
    setRoleId(userRole ? userRole.id : roleList[0].id)
    setFio('')
    setOrgId(DEFAULT_ORG_ID)
    setUserName('')
    setPassword('')
    setTelefon('')
    setMail('')
    setDtenter(dayjs())
    setDtout(dayjs('2100-01-01'))
    setNote('')
    setActive(true)
    setIsFirstLogin(true)
  }, [])

  useEffect(() => {
    let cancel = false
    async function run() {
      setRefsLoading(true)
      setRefsError(null)
      try {
        const [r, o] = await Promise.all([fetchAdminRoles(), fetchAdminOrgChoices()])
        if (cancel) return
        setRoles(Array.isArray(r) ? r : [])
        setOrgChoices(Array.isArray(o) ? o : [])
      } catch (e) {
        if (!cancel) {
          setRefsError(e instanceof Error ? e.message : 'Не удалось загрузить справочники')
        }
      } finally {
        if (!cancel) setRefsLoading(false)
      }
    }
    run()
    return () => {
      cancel = true
    }
  }, [])

  useEffect(() => {
    if (selectedUser) {
      setRoleId(selectedUser.roleId != null ? selectedUser.roleId : '')
      setFio(selectedUser.fio ?? '')
      setOrgId(selectedUser.orgId != null ? selectedUser.orgId : DEFAULT_ORG_ID)
      setUserName(selectedUser.userName ?? '')
      setPassword('')
      setTelefon(selectedUser.telefon ?? '')
      setMail(selectedUser.mail ?? '')
      setDtenter(selectedUser.dtenter ? dayjs(selectedUser.dtenter) : dayjs())
      setDtout(selectedUser.dtout ? dayjs(selectedUser.dtout) : dayjs('2100-01-01'))
      setNote(selectedUser.note ?? '')
      setActive(selectedUser.active === 1)
      setIsFirstLogin(selectedUser.isFirstLogin === true)
    } else if (roles.length > 0) {
      applyDefaultsForAdd(roles)
    }
  }, [selectedUser, roles, applyDefaultsForAdd])

  const title = selectedUser
    ? `Пользователь #${selectedUser.usersId}`
    : 'Новый пользователь (значения по умолчанию)'

  if (refsLoading) {
    return <Typography color="text.secondary">Загрузка формы…</Typography>
  }
  if (refsError) {
    return <Typography color="error">{refsError}</Typography>
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>

        <FormControl size="small" fullWidth>
          <InputLabel id="admin-form-role-label">Роль пользователя программы</InputLabel>
          <Select
            labelId="admin-form-role-label"
            id="admin-form-role"
            label="Роль пользователя программы"
            value={roleId === '' ? '' : roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.nm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Полное ФИО"
          value={fio}
          onChange={(e) => setFio(e.target.value)}
          fullWidth
        />

        <FormControl size="small" fullWidth>
          <InputLabel id="admin-form-org-label">Подразделение</InputLabel>
          <Select
            labelId="admin-form-org-label"
            id="admin-form-org"
            label="Подразделение"
            value={orgId}
            onChange={(e) => setOrgId(Number(e.target.value))}
          >
            {orgChoices.map((o) => (
              <MenuItem key={o.id} value={o.id} title={o.fullnm || ''}>
                {o.nm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Логин"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
        />

        <TextField
          size="small"
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
          helperText="Для существующего пользователя: оставьте пустым или введите новый пароль. Хэш не подставляется."
        />

        <TextField
          size="small"
          label="Номер телефона"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          fullWidth
        />

        <TextField
          size="small"
          label="Почта"
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          fullWidth
        />

        <DatePicker
          label="Дата подключения"
          value={dtenter}
          onChange={(v) => v && setDtenter(v)}
          renderInput={(params) => <TextField size="small" fullWidth {...params} />}
        />

        <DatePicker
          label="Дата отключения"
          value={dtout}
          onChange={(v) => v && setDtout(v)}
          renderInput={(params) => <TextField size="small" fullWidth {...params} />}
        />

        <TextField
          size="small"
          label="Примечание"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
          multiline
          minRows={4}
        />

        <Stack direction="row" flexWrap="wrap" alignItems="center" useFlexGap columnGap={2} rowGap={0.5}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            }
            label="Подключен"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isFirstLogin}
                onChange={(e) => setIsFirstLogin(e.target.checked)}
              />
            }
            label="Первое подключение"
          />
        </Stack>
      </Stack>
    </LocalizationProvider>
  )
}
