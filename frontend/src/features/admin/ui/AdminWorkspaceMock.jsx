import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const mockRows = [
  { id: 1, colA: 'Запись A', colB: '12', colC: 'черновик' },
  { id: 2, colA: 'Запись B', colB: '34', colC: 'готово' },
  { id: 3, colA: 'Запись C', colB: '56', colC: 'ожидает' },
]

const selectedRowId = 1

const detailFieldLabels = [
  'Поле 1',
  'Поле 2',
  'Поле 3',
  'Поле 4',
  'Поле 5',
  'Поле 6',
  'Поле 7',
  'Поле 8',
]

/**
 * Статичный макет основной рабочей зоны: 3:2, фильтр, таблица, форма — без бизнес-логики и API.
 */
export function AdminWorkspaceMock() {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={0}
      alignItems="stretch"
      sx={{ flex: 1, minHeight: 0 }}
    >
      <Box
        sx={(theme) => ({
          flex: { md: '3 1 0' },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(1.5),
          p: 2,
          borderRight: { md: `1px solid ${theme.palette.divider}` },
          borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
        })}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          spacing={1}
          columnGap={2}
          rowGap={1.5}
          alignItems="center"
        >
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="admin-workspace-mock-select-label">Раздел</InputLabel>
            <Select
              labelId="admin-workspace-mock-select-label"
              id="admin-workspace-mock-select"
              label="Раздел"
              defaultValue="all"
            >
              <MenuItem value="all">Все разделы</MenuItem>
              <MenuItem value="one">Раздел 1</MenuItem>
              <MenuItem value="two">Раздел 2</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox defaultChecked size="small" />}
            label={<Typography variant="body2">Опция A</Typography>}
          />
          <FormControlLabel
            control={<Checkbox size="small" />}
            label={<Typography variant="body2">Опция B</Typography>}
          />
          <TextField
            size="small"
            placeholder="Поиск…"
            defaultValue=""
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" sx={{ opacity: 0.8 }} />
                </InputAdornment>
              ),
            }}
            sx={(theme) => ({
              minWidth: { xs: '100%', sm: 220 },
              flex: { sm: '1 1 200px' },
              maxWidth: { sm: 320 },
            })}
          />
        </Stack>
        <TableContainer
          sx={(theme) => ({
            flex: 1,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 0,
            maxHeight: { xs: 360, md: 'none' },
            overflow: 'auto',
            bgcolor: theme.palette.background.paper,
          })}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Наименование</TableCell>
                <TableCell align="right">Кол-во</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockRows.map((row) => {
                const isSelected = row.id === selectedRowId
                return (
                  <TableRow
                    key={row.id}
                    sx={(theme) =>
                      isSelected
                        ? { bgcolor: theme.palette.action.selected }
                        : { '&:nth-of-type(even)': { bgcolor: theme.palette.action.hover } }
                    }
                  >
                    <TableCell>{row.colA}</TableCell>
                    <TableCell align="right">{row.colB}</TableCell>
                    <TableCell>{row.colC}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={(theme) => ({
          flex: { md: '2 1 0' },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          overflow: 'auto',
        })}
      >
        <Stack spacing={2}>
          {detailFieldLabels.map((label, i) => (
            <TextField
              key={label}
              size="small"
              label={label}
              defaultValue={selectedRowId ? `Значение ${i + 1} (макет)` : ''}
              fullWidth
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}
