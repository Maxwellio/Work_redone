import { createTheme, alpha } from '@mui/material/styles'

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
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
  },
})

/** Ссылки вне компонента `Link`/MUI (сырой тег `<a>`), как в корпоративном index.css */
export function globalLegacyAnchorStyles(theme) {
  return {
    'html': {
      fontSize: `${theme.typography.htmlFontSize}px`,
    },
    '#root': {
      minHeight: '100vh',
    },
    'body': {
      minHeight: '100vh',
    },
    'a, a:link': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    'a:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline',
    },
  }
}

/** Общие паттерны таблиц без отдельного CSS */

export function homeGridTableSx(theme) {
  return {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: theme.typography.body1.fontSize,
    '& thead .MuiTableCell-head': {
      backgroundColor: theme.palette.secondary.light,
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      borderRight: `1px solid ${theme.palette.secondary.main}`,
      fontWeight: 600,
      color: theme.palette.text.primary,
      py: '0.75rem',
      px: '1rem',
      '&:last-of-type': { borderRight: 'none' },
    },
    '& tbody .MuiTableCell-root': {
      py: '0.7rem',
      px: '1rem',
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      borderRight: `1px solid ${theme.palette.secondary.main}`,
      color: theme.palette.text.primary,
      '&:last-of-type': { borderRight: 'none' },
    },
    '& tbody tr:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  }
}

/** Таблица в модалках справочников (без sticky-шапки) */
export function refModalTableSx(theme) {
  return {
    width: '100%',
    borderCollapse: 'collapse',
    '& thead .MuiTableCell-root': {
      backgroundColor: theme.palette.secondary.light,
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      borderRight: `1px solid ${theme.palette.secondary.main}`,
      '&:last-of-type': { borderRight: 'none' },
    },
    '& tbody .MuiTableCell-root': {
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      borderRight: `1px solid ${theme.palette.secondary.main}`,
      '&:last-of-type': { borderRight: 'none' },
    },
  }
}

/** Плоская сетка пользователей в админке (border-radius 0) */
export function adminDenseTableSx(theme) {
  return {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
    tableLayout: 'auto',
    '& .MuiTableCell-root': {
      borderBottom: `1px solid ${theme.palette.divider}`,
      borderRight: `1px solid ${theme.palette.divider}`,
      padding: '0.5rem 0.6rem',
      color: theme.palette.text.primary,
      '&:last-of-type': {
        borderRight: 'none',
      },
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      fontWeight: 600,
      backgroundColor: theme.palette.secondary.light,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  }
}

export function tablePlaceholderMessageSx(theme, { emphasized = false, nestedInWrap = false } = {}) {
  return {
    p: nestedInWrap ? 2 : 3,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...(emphasized && { fontWeight: 500 }),
  }
}

export function adminTableWrapSx(theme) {
  return {
    boxSizing: 'border-box',
    borderRadius: 0,
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    flex: 1,
    minHeight: 0,
  }
}

/** MUI TextField `sx`: вычисляемые числовые поля (read-only), визуально не как disabled и не как обычный ввод */
export function computedNumericFieldSx(theme) {
  return {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'rgba(0, 142, 185, 0.07)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 142, 185, 0.35)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 142, 185, 0.55)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },
      '& .MuiInputBase-input': {
        color: theme.palette.text.primary,
        cursor: 'default',
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
  }
}

/** DataGrid на главной странице — аналог homeGridTableSx с виртуализацией */
export function homeDataGridSx(theme) {
  const border = `1px solid ${theme.palette.secondary.main}`
  return {
    border: 'none',
    borderRadius: 0,
    flex: 1,
    minHeight: 0,
    fontSize: theme.typography.body1.fontSize,

    // Header background and typography
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: theme.palette.secondary.light,
    },
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: theme.palette.secondary.light,
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
    // Column separator between headers (left border on every header except first)
    '& .MuiDataGrid-columnHeader + .MuiDataGrid-columnHeader': {
      borderLeft: border,
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
      color: theme.palette.text.primary,
      fontSize: theme.typography.body1.fontSize,
    },
    // Hide resize handle (matches static column look of current table)
    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
    // Hide sort button icons (sorting is disabled)
    '& .MuiDataGrid-iconButtonContainer': {
      display: 'none',
    },
    // Scrollbar area filler in header — no extra border
    '& .MuiDataGrid-scrollbarFiller': {
      borderLeft: 'none',
    },

    // Data cells
    '& .MuiDataGrid-cell': {
      color: theme.palette.text.primary,
      paddingLeft: '1rem',
      paddingRight: '1rem',
      fontSize: theme.typography.body1.fontSize,
    },
    // Column separator between cells (same pattern as header)
    '& .MuiDataGrid-cell + .MuiDataGrid-cell': {
      borderLeft: border,
    },

    // Row appearance
    '& .MuiDataGrid-row': {
      cursor: 'pointer',
      userSelect: 'none',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: `${theme.palette.secondary.light} !important`,
    },
    '& .MuiDataGrid-row.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    '& .MuiDataGrid-row.Mui-selected:hover': {
      backgroundColor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
    },

    // Remove focus outline from cells and headers
    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
      outline: 'none',
    },
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
      outline: 'none',
    },
  }
}

/** Контейнер таблицы в модалках справочников (не admin) */
export const refModalTableContainerSx = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'secondary.main',
  borderRadius: 1,
}
