import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ru'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ConfirmProvider } from './context/ConfirmContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoleRoute from './components/AdminRoleRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import { AdminPage, AdminIndexOutletFallback } from './features/admin'
import { globalLegacyAnchorStyles, theme } from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <GlobalStyles styles={(t) => globalLegacyAnchorStyles(t)} />
      <CssBaseline />
      <ConfirmProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoleRoute>
                    <AdminPage />
                  </AdminRoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminIndexOutletFallback />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ConfirmProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
