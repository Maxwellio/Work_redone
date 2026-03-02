import { useNavigate, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useAuth } from '../context/AuthContext'
import { useLogin } from '../hooks/useLogin'
import '../styles/Login.css'

/**
 * Страница входа: форма логин/пароль, вызов POST /api/login (form-urlencoded),
 * после успеха — getCurrentUser и редирект на /.
 * При заходе на /login авторизованного пользователя — проверка сессии и редирект на главную.
 */
function Login() {
  const navigate = useNavigate()
  const { user, fetchUser } = useAuth()
  const {
    username,
    password,
    error,
    submitting,
    sessionChecked,
    setUsername,
    setPassword,
    handleSubmit,
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

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <Box className="login-page">
      <Card className="login-card">
        <CardContent>
          <Typography variant="h6" component="h2" className="login-title">
            Вход
          </Typography>
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
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
