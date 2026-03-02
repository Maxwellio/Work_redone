import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#008eb9',
      dark: '#006b8f',
    },
    secondary: {
      main: '#e5dfd2',
      light: '#f5f2eb',
    },
    divider: '#e5dfd2',
    background: {
      default: '#f5f2eb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
  },
})
