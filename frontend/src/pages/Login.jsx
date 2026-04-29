import { useNavigate, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useAuth } from '../context/AuthContext'
import ChangePasswordForm from '../components/ChangePasswordForm'
import { useLogin } from '../hooks/useLogin'
import { userHasAdminRole } from '../utils/userRoles'
import '../styles/Login.css'

/**
 * Страница входа: форма логин/пароль, вызов POST /api/login (form-urlencoded),
 * после успеха — getCurrentUser и редирект на `/` или `/admin` при роли администратора.
 * При заходе на /login авторизованного пользователя — редирект по той же логике.
 */
function Login() {
  const navigate = useNavigate()
  const { user, fetchUser } = useAuth()
  const {
    username,
    password,
    error,
    changePasswordError,
    submitting,
    changingPassword,
    sessionChecked,
    firstLoginPending,
    setUsername,
    setPassword,
    handleSubmit,
    handleFirstLoginPasswordSubmit,
    handleCancelFirstLogin,
  } = useLogin(fetchUser, navigate)

  if (!sessionChecked) {
    return (
      <Box className="login-page">
        <Card className="login-card">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Проверка авторизации…
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  if (user && !user?.isFirstLogin) {
    return <Navigate to={userHasAdminRole(user) ? '/admin' : '/'} replace />
  }

  const showFirstLoginChangePassword = firstLoginPending || Boolean(user?.isFirstLogin)

  return (
    <Box className="login-page">
      <Card className="login-card">
        <CardContent>
          <Typography variant="h6" component="h2" className="login-title">
            {showFirstLoginChangePassword ? 'Смена пароля' : 'Вход'}
          </Typography>
          {showFirstLoginChangePassword ? (
            <Box className="login-form">
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                При первом входе в ПС необходимо сменить выданный пароль
              </Typography>
              {changePasswordError && (
                <Typography
                  variant="body2"
                  role="alert"
                  sx={{
                    mb: 1,
                    p: 1,
                    color: '#8b3a3a',
                    bgcolor: '#faf0f0',
                    borderRadius: 1,
                  }}
                >
                  {changePasswordError}
                </Typography>
              )}
              <ChangePasswordForm
                onSubmit={handleFirstLoginPasswordSubmit}
                onCancel={handleCancelFirstLogin}
                requireCurrentPassword={!firstLoginPending}
                submitLabel={changingPassword ? 'Сохранение…' : 'Сменить пароль'}
                cancelLabel="Отменить вход"
              />
            </Box>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                disabled={submitting}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={submitting}
                margin="normal"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Проверяйте вводимые данные
              </Typography>
              {error && (
                <Typography
                  variant="body2"
                  role="alert"
                  sx={{
                    mt: 1,
                    p: 1,
                    color: '#8b3a3a',
                    bgcolor: '#faf0f0',
                    borderRadius: 1,
                  }}
                >
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={submitting}
                sx={{ mt: 2 }}
              >
                {submitting ? 'Вход…' : 'Войти'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
