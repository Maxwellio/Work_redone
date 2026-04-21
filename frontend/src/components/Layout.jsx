import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useAuth } from '../context/AuthContext'
import { userHasAdminRole } from '../utils/userRoles'
import ChangePasswordDialog from './ChangePasswordDialog'
import '../styles/Layout.css'

function Layout({ children, chrome, title = 'Патрубки' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const onAdminRoute = pathname.startsWith('/admin')
  const showAdminPanelItem = userHasAdminRole(user) && !onAdminRoute
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  const isUserMenuOpen = Boolean(userMenuAnchorEl)

  const handleUserClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true)
  }

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false)
  }

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
              {title}
            </Typography>
            {user && (
              <>
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleUserClick}
                  sx={{ textTransform: 'none', mr: 1, opacity: 0.9 }}
                >
                  {user.username}
                </Button>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={isUserMenuOpen}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {onAdminRoute && (
                    <MenuItem
                      onClick={() => {
                        handleUserMenuClose()
                        navigate('/')
                      }}
                    >
                      К патрубкам
                    </MenuItem>
                  )}
                  {showAdminPanelItem && (
                    <MenuItem
                      onClick={() => {
                        handleUserMenuClose()
                        navigate('/admin')
                      }}
                    >
                      Админ-панель
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose()
                      handleOpenChangePassword()
                    }}
                  >
                    Сменить пароль
                  </MenuItem>
                </Menu>
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
        <ChangePasswordDialog
          open={isChangePasswordOpen}
          onClose={handleCloseChangePassword}
          onSubmit={() => {
            // функционал смены пароля будет добавлен позже
            handleCloseChangePassword()
          }}
        />
        {chrome}
      </div>
      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}

export default Layout
