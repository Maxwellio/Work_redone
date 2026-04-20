/** MUI TextField `sx` for numeric fields filled by calculation (read-only), distinct from editable inputs and from disabled state. */
export const computedNumericFieldSx = (theme) => ({
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
})
