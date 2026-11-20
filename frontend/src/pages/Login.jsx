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
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 360 }}>
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

  // Режим смены пароля: узкая карточка без бокового изображения (как раньше).
  if (showFirstLoginChangePassword) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 360 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ m: '0 0 1.5rem', textAlign: 'center' }}>
              Смена пароля
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                При первом входе в ПС необходимо сменить выданный пароль.
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
          </CardContent>
        </Card>
      </Box>
    )
  }

  // Обычный вход: слева колонка 3×4 под персонализирующее изображение из public/.
  // Файл: frontend/public/login-side.jpg → URL /login-side.jpg.
  return (
    <Box
  sx={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    bgcolor: 'background.default',
  }}
>
  <Card sx={{ width: '100%', maxWidth: 850, overflow: 'hidden', p: 3 }}>
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
      }}
    >
      {/* 1. НАДПИСЬ ВХОД (НАД ВСЕМ КОНТЕНТОМ) */}
      <Typography variant="h5" component="h1" sx={{ textAlign: 'center', fontWeight: 'medium', mt: 0  }}>
      Расчет норм штучного времени на токарную обработку при изготовлении переводников, патрубков и ремонте труб
      </Typography>

      {/* 2. СРЕДНЯЯ ЧАСТЬ (ИЗОБРАЖЕНИЕ И ФОРМА ДРУГ НАПРОТИВ ДРУГА) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
          alignItems: 'center', // Центрирует поля по вертикали относительно логотипа
          
        }}
      >
        {/* ЛОГОТИП */}
        <Box
          role="img"
          aria-hidden
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: 400,
            aspectRatio: '3.5 / 4',
            bgcolor: '#ffffff',
            flexShrink: 0,
            backgroundImage: 'url(/icon.ico)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />

        {/* ПОЛЯ ВВОДА И ТЕКСТ */}
        <CardContent sx={{ minWidth: 400, maxWidth: 400, width: '100%', justifySelf: { xs: 'center', sm: 'stretch' }, p: 1 }}>
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} align="center">
            Уважаемый пользователь! <br />Данное программное обеспечение <br /> и нормативные сборники по труду, <br />положенные в основу разработки,<br />являются собственностью ПАО "Сургутнефтегаз". <br />При работе с программным обеспечением необходимо соблюдать режим <br />коммерческой тайны.
          </Typography>
          {error && (
            <Typography
              variant="body2"
              role="alert"
              sx={{
                mt: 2,
                p: 1,
                color: '#8b3a3a',
                bgcolor: '#faf0f0',
                borderRadius: 1,
              }}
            >
              {error}
            </Typography>
          )}
        </CardContent>
      </Box>

      {/* 3. КНОПКА (В САМОМ НИЗУ ПОД ВСЕМ КОНТЕНТОМ) */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={submitting}
        sx={{ py: 1 }} // Немного увеличим высоту кнопки для солидности
      >
        {submitting ? 'Вход…' : 'Войти'}
      </Button>
    </Box>
  </Card>
</Box>
  )
}

export default Login
