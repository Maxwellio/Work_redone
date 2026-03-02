export const EMPTY_SUBSTITUTE_FORM = {
  nmSub1: '',
  nmSub2: '',
  nmSub3: '',
  nmSub4: '',
  nmSub5: '',
  dSubstituteOut: '',
  dSubstituteIn: '',
  lSubstiute: '',
  idPreform: '1',
  dPreformOut: '',
  dPreformIn: '',
  lPreform: '',
  ph: '',
  massPreform: '',
}

export const EMPTY_FITTING_FORM_PATRUBOK = {
  nm: '',
  d: '',
  th: '',
  l: '',
  mass: '',
  idPreform: '3',
  lPreform: '',
  phPreform: '',
  dStan: '',
  cnt: '',
}

export const EMPTY_FITTING_FORM_TRUBA = {
  nm: '',
  d: '',
  l: '',
  mass: '',
  phPreform: '',
  dStan: '',
  cnt: '',
}

export const EMPTY_HYDROTEST_FORM = {
  nh: '',
  d: '',
  th: '',
  l: '',
  testtime: '',
  mass: '',
  l1: '',
  l2: '',
  nv: '',
}

export function toInputValue(value) {
  if (value == null) return ''
  return String(value)
}

export function mapSubstituteToForm(row) {
  return {
    nmSub1: toInputValue(row.nmSub1),
    nmSub2: toInputValue(row.nmSub2),
    nmSub3: toInputValue(row.nmSub3),
    nmSub4: toInputValue(row.nmSub4),
    nmSub5: toInputValue(row.nmSub5),
    dSubstituteOut: toInputValue(row.dSubstituteOut),
    dSubstituteIn: toInputValue(row.dSubstituteIn),
    lSubstiute: toInputValue(row.lSubstiute),
    idPreform: toInputValue(row.idPreform),
    dPreformOut: toInputValue(row.dPreformOut),
    dPreformIn: toInputValue(row.dPreformIn),
    lPreform: toInputValue(row.lPreform),
    ph: toInputValue(row.ph),
    massPreform: toInputValue(row.massPreform),
  }
}

export function mapFittingToForm(row) {
  return {
    nm: toInputValue(row.nm),
    d: toInputValue(row.d),
    th: toInputValue(row.th),
    l: toInputValue(row.l),
    mass: toInputValue(row.mass),
    idPreform: toInputValue(row.idPreform),
    lPreform: toInputValue(row.lPreform),
    phPreform: toInputValue(row.phPreform),
    dStan: toInputValue(row.dStan),
    cnt: toInputValue(row.cnt),
  }
}

export function mapHydrotestToForm(row) {
  return {
    nh: toInputValue(row.nh),
    d: toInputValue(row.d),
    th: toInputValue(row.th),
    l: toInputValue(row.l),
    testtime: toInputValue(row.testtime),
    mass: toInputValue(row.mass),
    l1: toInputValue(row.l1),
    l2: toInputValue(row.l2),
    nv: toInputValue(row.nv),
  }
}
