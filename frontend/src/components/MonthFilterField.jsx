import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

function MonthFilterField({ value, onChange, sx }) {
  const pickerValue = value ? dayjs(`${value}-01`) : null

  return (
    <DatePicker
      label="Месяц"
      views={['year', 'month']}
      openTo="month"
      format="MMMM YYYY"
      value={pickerValue}
      onChange={(newValue) => {
        onChange(newValue?.isValid() ? newValue.format('YYYY-MM') : '')
      }}
      slotProps={{
        textField: {
          size: 'small',
          InputLabelProps: { shrink: true },
          sx: { minWidth: 160, ...sx },
          inputProps: {
            readOnly: true,
            'aria-label': 'Фильтр по месяцу',
          },
        },
      }}
    />
  )
}

export default MonthFilterField
