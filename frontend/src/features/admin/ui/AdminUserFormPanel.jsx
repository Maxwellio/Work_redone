import CloseIcon from '@mui/icons-material/Close'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useState } from 'react'
import { saveAdminUser } from '../api/adminUsers'
import { ensureAdminOrgStruct, ensureAdminRoles } from '../api/adminReferenceCache'
import { NM_USER } from '../constants'

const DEFAULT_ORG_ID = 30

/** Сегодня в локальном календаре, YYYY-MM-DD (согласовано с `input type=date`, без сдвига к UTC). */
function today() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Правая панель: форма полей пользователя, данные с записи в таблице (без сохранения на сервер).
 * @param {{ selectedUser: object | null, isNewUserDraft?: boolean, onSaved?: () => Promise<void> | void }} props
 */
export function AdminUserFormPanel({ selectedUser, isNewUserDraft = false, onSaved }) {
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
  const [dtenter, setDtenter] = useState(() => today())
  const [dtout, setDtout] = useState('2100-01-01')
  const [note, setNote] = useState('')
  const [active, setActive] = useState(true)
  const [isFirstLogin, setIsFirstLogin] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const applyDefaultsForAdd = useCallback((roleList) => {
    if (!roleList || roleList.length === 0) return
    const userRole = roleList.find((r) => r.nm === NM_USER)
    setRoleId(userRole ? userRole.id : roleList[0].id)
    setFio('')
    setOrgId(DEFAULT_ORG_ID)
    setUserName('')
    setPassword('')
    setTelefon('')
    setDtenter(today())
    setDtout('2100-01-01')
    setNote('')
    setActive(true)
    setIsFirstLogin(true)
  }, [])

  useEffect(() => {
    let cancel = false
    async function run() {
      setRefsLoading(true)
      setRefsError(null)
      const [rRoles, rOrg] = await Promise.all([ensureAdminRoles(), ensureAdminOrgStruct()])
      if (cancel) return
      setRoles(rRoles.data)
      setOrgChoices(rOrg.data)
      if (!rRoles.ok || !rOrg.ok) {
        const parts = [rRoles.ok ? null : rRoles.error, rOrg.ok ? null : rOrg.error].filter(Boolean)
        setRefsError(parts.length > 0 ? parts.join(' ') : 'Не удалось загрузить справочники')
      } else {
        setRefsError(null)
      }
      setRefsLoading(false)
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
      setDtenter(selectedUser.dtenter ? selectedUser.dtenter.slice(0, 10) : today())
      setDtout(selectedUser.dtout ? selectedUser.dtout.slice(0, 10) : '2100-01-01')
      setNote(selectedUser.note ?? '')
      setActive(selectedUser.active === 1)
      setIsFirstLogin(selectedUser.isFirstLogin === true)
    } else if (roles.length > 0) {
      applyDefaultsForAdd(roles)
    }
  }, [selectedUser, roles, applyDefaultsForAdd])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaveError(null)
    try {
      await saveAdminUser({
        usersId: selectedUser?.usersId ?? null,
        roleId: roleId === '' ? null : Number(roleId),
        orgId: orgId == null ? null : Number(orgId),
        fio,
        userName,
        password,
        telefon,
        dtenter: dtenter || null,
        dtout: dtout || null,
        note,
        active,
        isFirstLogin,
      })
      if (onSaved) {
        await onSaved()
      }
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Не удалось сохранить пользователя')
    } finally {
      setSaving(false)
    }
  }, [active, dtenter, dtout, fio, isFirstLogin, note, onSaved, orgId, password, roleId, selectedUser?.usersId, telefon, userName])

  const title = isNewUserDraft
    ? 'Новый пользователь'
    : `Пользователь #${selectedUser.usersId}`

  const isAddSaveReady = fio.trim() !== '' && userName.trim() !== '' && password.trim() !== ''
  const isSaveDisabled = saving || (isNewUserDraft && !isAddSaveReady)

  if (refsLoading) {
    return <Typography color="text.secondary">Загрузка формы…</Typography>
  }
  if (refsError) {
    return <Typography color="error">{refsError}</Typography>
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>

      {saveError && <Alert severity="error">{saveError}</Alert>}

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

      <Stack direction="row" spacing={0.5} alignItems="flex-start">
        <TextField
          size="small"
          label="Дата подключения"
          type="date"
          value={dtenter}
          onChange={(e) => setDtenter(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Tooltip title="Сбросить на сегодня">
          <IconButton
            size="small"
            aria-label="Сбросить дату подключения на сегодня"
            onClick={() => setDtenter(today())}
            sx={{ mt: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack direction="row" spacing={0.5} alignItems="flex-start">
        <TextField
          size="small"
          label="Дата отключения"
          type="date"
          value={dtout}
          onChange={(e) => setDtout(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Tooltip title="Сбросить на сегодня">
          <IconButton
            size="small"
            aria-label="Сбросить дату отключения на сегодня"
            onClick={() => setDtout(today())}
            sx={{ mt: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

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

      <Button
        type="button"
        variant="contained"
        size="medium"
        fullWidth
        disabled={isSaveDisabled}
        onClick={handleSave}
      >
        {saving ? 'Сохранение…' : isNewUserDraft ? 'Добавить' : 'Сохранить'}
      </Button>
    </Stack>
  )
}
