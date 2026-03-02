import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '../context/AuthContext'
import '../styles/Layout.css'

function Layout({ children, chrome }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <div className="layout-sticky">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              Патрубки
            </Typography>
            {user && (
              <>
                <Typography variant="body2" sx={{ opacity: 0.9, mr: 1 }}>
                  {user.username}
                </Typography>
                <Button
                  color="inherit"
                  variant="outlined"
                  size="small"
                  onClick={handleLogout}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.8)', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Выйти
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        {chrome}
      </div>
      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}

export default Layout
