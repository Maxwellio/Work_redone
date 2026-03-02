export const TABS = [
  { id: 0, label: 'Переводники' },
  { id: 1, label: 'Патрубки' },
  { id: 2, label: 'Трубы' },
  { id: 3, label: 'Гидроиспытания' },
]

export const COLUMNS = {
  0: [
    { key: 'idSubstitutePrepared', label: '№' },
    { key: 'name', label: 'Наименование' },
    { key: 'nmPreform', label: 'Тип заготовки' },
    { key: 'dPreformOut', label: 'D предформ. нар.' },
    { key: 'dPreformIn', label: 'D предформ. вн.' },
    { key: 'dSubstituteOut', label: 'D переходника нар.' },
    { key: 'dSubstituteIn', label: 'D переходника вн.' },
    { key: 'lSubstiute', label: 'L переходника' },
  ],
  1: [
    { key: 'idFiting', label: '№' },
    { key: 'nm', label: 'Наименование', getValue: (row) => [row.nm, row.d, row.th].filter(v => v != null && v !== '').join('-') || row.nm },
    { key: 'd', label: 'D' },
    { key: 'th', label: 'Толщ.' },
    { key: 'mass', label: 'Масса' },
    { key: 'l', label: 'L' },
  ],
  2: [
    { key: 'idFiting', label: '№' },
    { key: 'nm', label: 'Наименование', getValue: (row) => [row.nm, row.d].filter(v => v != null && v !== '').join('-') || row.nm },
    { key: 'd', label: 'D' },
    { key: 'th', label: 'Толщ.' },
    { key: 'mass', label: 'Масса' },
    { key: 'l', label: 'L' },
  ],
  3: [
    { key: 'idHydrotest', label: '№' },
    { key: 'nh', label: 'Наименование' },
    { key: 'd', label: 'D' },
    { key: 'l', label: 'L' },
    { key: 'th', label: 'Толщ.' },
    { key: 'testtime', label: 'Время исп.' },
    { key: 'mass', label: 'Масса' },
  ],
}
