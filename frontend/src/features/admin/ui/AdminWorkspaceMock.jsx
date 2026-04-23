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
  { id: 1, colA: 'Запись A', colB: '12', colC: 'черновик', colD: 'Тип 1' },
  { id: 2, colA: 'Запись B', colB: '34', colC: 'готово', colD: 'Тип 2' },
  { id: 3, colA: 'Запись C', colB: '56', colC: 'ожидает', colD: 'Тип 1' },
  { id: 4, colA: 'Запись D', colB: '78', colC: 'готово', colD: 'Тип 3' },
]

const selectedRowId = 1

const detailFieldLabels = [
  'Поле 1',
  'Поле 2',
  'Поле 3',
  'Поле 4',
  'Поле 5',
]

/**
 * Статичный макет основной рабочей зоны: фильтры + таблица слева, форма справа.
 */
export function AdminWorkspaceMock() {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={0}
      alignItems="stretch"
      sx={{ flex: 1, minHeight: 0 }}
    >
      {/* Left panel: filters + table */}
      <Box
        sx={(theme) => ({
          flex: { md: '7 1 0' },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
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
          sx={(theme) => ({
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            flexShrink: 0,
          })}
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
            sx={{
              minWidth: { xs: '100%', sm: 220 },
              flex: { sm: '1 1 200px' },
              maxWidth: { sm: 320 },
            }}
          />
        </Stack>
        <TableContainer
          sx={{
            flex: 1,
            borderRadius: 0,
            overflow: 'auto',
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 48 }}>№</TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Кол-во</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Тип</TableCell>
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
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.colA}</TableCell>
                    <TableCell>{row.colB}</TableCell>
                    <TableCell>{row.colC}</TableCell>
                    <TableCell>{row.colD}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Right panel: detail form */}
      <Box
        sx={{
          flex: { md: '3 1 0' },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          overflow: 'auto',
        }}
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
          <TextField
            size="small"
            label="Поле 6"
            defaultValue={selectedRowId ? 'Значение 6 (макет)' : ''}
            fullWidth
            multiline
            minRows={4}
          />
        </Stack>
      </Box>
    </Stack>
  )
}
