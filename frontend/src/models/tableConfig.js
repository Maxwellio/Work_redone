import { formatDate } from '../utils/format'

export const TABS = [
  { id: 0, label: 'Переводники' },
  { id: 1, label: 'Патрубки' },
  { id: 2, label: 'Трубы' },
  { id: 3, label: 'Гидроиспытания' },
]

export const COLUMNS = {
  0: [
    { key: 'idSubstitutePrepared', label: '№', sortable: true },
    { key: 'name', label: 'Наименование', sortable: true },
    { key: 'nmPreform', label: 'Тип заготовки' },
    { key: 'dPreformOut', label: 'D предформ. нар.' },
    { key: 'dPreformIn', label: 'D предформ. вн.' },
    { key: 'dSubstituteOut', label: 'D переходника нар.' },
    { key: 'dSubstituteIn', label: 'D переходника вн.' },
    { key: 'lSubstitute', label: 'L переходника' },
    { key: 'transitionCount', label: 'Переходов' },
    { key: 'createdAt', label: 'Дата создания', sortable: true, getValue: (row) => formatDate(row.createdAt) },
  ],
  1: [
    { key: 'idFiting', label: '№', sortable: true },
    { key: 'nm', label: 'Наименование', sortable: true, getValue: (row) => [row.nm, row.d, row.th].filter(v => v != null && v !== '').join('-') || row.nm },
    { key: 'd', label: 'D' },
    { key: 'th', label: 'Толщ.' },
    { key: 'mass', label: 'Масса' },
    { key: 'l', label: 'L' },
    { key: 'transitionCount', label: 'Переходов' },
    { key: 'createdAt', label: 'Дата создания', sortable: true, getValue: (row) => formatDate(row.createdAt) },
  ],
  2: [
    { key: 'idFiting', label: '№', sortable: true },
    { key: 'nm', label: 'Наименование', sortable: true, getValue: (row) => [row.nm, row.d].filter(v => v != null && v !== '').join('-') || row.nm },
    { key: 'd', label: 'D' },
    { key: 'th', label: 'Толщ.' },
    { key: 'mass', label: 'Масса' },
    { key: 'l', label: 'L' },
    { key: 'transitionCount', label: 'Переходов' },
    { key: 'createdAt', label: 'Дата создания', sortable: true, getValue: (row) => formatDate(row.createdAt) },
  ],
  3: [
    { key: 'idHydrotest', label: '№', sortable: true },
    { key: 'nh', label: 'Наименование', sortable: true },
    { key: 'd', label: 'D' },
    { key: 'l', label: 'L' },
    { key: 'th', label: 'Толщ.' },
    { key: 'testtime', label: 'Время исп.' },
    { key: 'mass', label: 'Масса' },
    { key: 'createdAt', label: 'Дата создания', sortable: true, getValue: (row) => formatDate(row.createdAt) },
  ],
}
