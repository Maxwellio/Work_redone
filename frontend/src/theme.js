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
    htmlFontSize: 18,
    fontSize: 18,
    h1: { fontSize: '1.75rem' },
    h2: { fontSize: '1.5rem' },
    h3: { fontSize: '1.25rem' },
    h4: { fontSize: '1.125rem' },
    h5: { fontSize: '1.0625rem' },
    h6: { fontSize: '1rem' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.9375rem' },
    button: { fontSize: '1rem' },
    caption: { fontSize: '0.875rem' },
    /** Зона под AppBar на `/admin` (без навигации) */
    adminChromeTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      lineHeight: 1.4,
    },
    /** Текст заглушки основной области админки */
    adminPageStub: {
      fontSize: '1rem',
      lineHeight: 1.55,
      fontWeight: 400,
    },
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: 'adminShell' },
          style: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
        },
      },
    },
  },
})
