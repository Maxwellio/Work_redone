import { formatDate } from '../utils/format'

export const TABS = [
    { id: 0, label: 'Изготовление переводника' },
    { id: 1, label: 'Изготовление патрубка' },
    { id: 2, label: 'Ремонт труб' },
    { id: 3, label: 'Гидроиспытания' },
  ]
  
  export const COLUMNS = {
    0: [
        { key: 'idSubstitutePrepared', label: 'ID', sortable: true},
        { key: 'name', label: 'Переводник', sortable: true },
        { key: 'nmPreform', label: 'Заготовка' },
        { key: 'dsubstituteOut', label: 'Диам. наруж., мм' },
        { key: 'dsubstituteIn', label: 'Диам. внутр., мм' },
        { key: 'lsubstitute', label: 'Длина, мм' },
        { key: 'tsum', label: 'Время, чел.час' },
        { key: 'transitionCount', label: 'Количество переходов' },
        { key: 'createdAt', label: 'Дата создания расчета', sortable: true, getValue: (row) => formatDate(row.createdAt) },
      ],
      1: [
        { key: 'idFiting', label: 'ID', sortable: true },
        { key: 'nm', label: 'Патрубок', sortable: true, getValue: (row) => [row.nm, row.d, row.th].filter (v => v !=null && v !== '').join('-') || row.nm },
        { key: 'l', label: 'Длина, мм' },
        { key: 'mass', label: 'Масса, кг' },
        { key: 'tsum', label: 'Время, чел.час' },
        { key: 'transitionCount', label: 'Количество переходов' },
        { key: 'createdAt', label: 'Дата создания расчета', sortable: true, getValue: (row) => formatDate(row.createdAt) },
      ],
      2: [
        { key: 'idFiting', label: 'ID', sortable: true },
        { key: 'nm', label: 'Труба', sortable: true, getValue: (row) => [row.nm, row.d].filter (v => v !=null && v !== '').join('-') || row.nm },
        { key: 'l', label: 'Длина, мм' },
        { key: 'mass', label: 'Масса, кг' },
        { key: 'tsum', label: 'Время, чел.час' },
        { key: 'transitionCount', label: 'Количество переходов' },
        { key: 'createdAt', label: 'Дата создания расчета', sortable: true, getValue: (row) => formatDate(row.createdAt) },
      ],
      3: [
        { key: 'idHydrotest', label: 'ID', sortable: true },
        { key: 'nh', label: 'Гидроиспытание', sortable: true },
        { key: 'l', label: 'Длина, мм' },
        { key: 'nv', label: 'Время, чел.час' },
        { key: 'createdAt', label: 'Дата создания расчета', sortable: true, getValue: (row) => formatDate(row.createdAt) },
      ],
  }
