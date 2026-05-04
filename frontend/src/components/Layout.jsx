import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useAuth } from '../context/AuthContext'
import { changePassword } from '../api'
import { userHasAdminRole } from '../utils/userRoles'
import ChangePasswordDialog from './ChangePasswordDialog'

function Layout({ children, chrome, title = 'Патрубки', flush = false }) {
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={(theme) => ({
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.paper,
          ...(onAdminRoute && {
            borderBottom: '1px solid #d4cfc4',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
          }),
        })}
      >
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
          onSubmit={async ({ currentPassword, newPassword }) => {
            try {
              await changePassword(currentPassword, newPassword)
              handleCloseChangePassword()
            } catch (error) {
              window.alert(error?.message || 'Не удалось сменить пароль')
            }
          }}
        />
        {chrome}
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          padding: flush ? 0 : undefined,
          ...(!flush && { px: 3, py: 3 }),
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout
