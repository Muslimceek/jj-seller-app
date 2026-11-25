// Таблицы соответствия размеров (TR / EU, RU, INT + мерки в см для понятного урока).
// Продавец выбирает размер в привычной системе, остальные подставляются автоматически.

export type SizeSys = 'tr' | 'ru' | 'int'

export const SYS_LABEL: Record<SizeSys, string> = {
  tr: 'TR / EU',
  ru: 'RU',
  int: 'INT',
}

export interface SizeRow {
  tr?: string
  ru?: string
  int?: string
  cm?: string
}

export interface SizeTable {
  id: string
  name: string
  base: SizeSys
  measureLabel: { tr: string; ru: string }
  rows: SizeRow[]
}

const women = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL']
const womenCm = ['78–82', '82–86', '86–90', '90–94', '94–98', '98–104', '104–110', '110–116', '116–122', '122–128']
const men = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']
const menCm = ['88–92', '92–96', '96–100', '100–104', '104–108', '108–114', '114–120', '120–126']

export const SIZE_TABLES: SizeTable[] = [
  {
    id: 'women',
    name: 'Kadın giyim',
    base: 'tr',
    measureLabel: { tr: 'Göğüs (cm)', ru: 'Грудь (см)' },
    rows: women.map((int, i) => {
      const eu = 32 + i * 2
      return { tr: String(eu), ru: String(eu + 6), int, cm: womenCm[i] }
    }),
  },
  {
    id: 'men',
    name: 'Erkek giyim',
    base: 'tr',
    measureLabel: { tr: 'Göğüs (cm)', ru: 'Грудь (см)' },
    rows: men.map((int, i) => {
      const eu = 44 + i * 2
      return { tr: String(eu), ru: String(eu), int, cm: menCm[i] }
    }),
  },
  {
    id: 'jeans',
    name: 'Jean / pantolon',
    base: 'tr',
    measureLabel: { tr: 'Bel (cm)', ru: 'Талия (см)' },
    rows: [32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54].map((eu, i) => ({
      tr: String(eu),
      ru: String(eu + 6),
      int: ['XXS', 'XS', 'XS', 'S', 'S', 'M', 'M', 'L', 'L', 'XL', 'XL', 'XXL'][i],
      cm: `${60 + i * 4}–${64 + i * 4}`,
    })),
  },
  {
    id: 'shoes',
    name: 'Ayakkabı',
    base: 'tr',
    measureLabel: { tr: 'Ayak (cm)', ru: 'Стопа (см)' },
    rows: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((eu, i) => ({
      tr: String(eu),
      ru: String(eu - 1),
      cm: (22.5 + i * 0.6).toFixed(1).replace('.', ','),
    })),
  },
  {
    id: 'kids',
    name: 'Çocuk giyim',
    base: 'tr',
    measureLabel: { tr: 'Boy (cm)', ru: 'Рост (см)' },
    rows: [
      ['2 yaş', '92', '86–92'], ['3–4 yaş', '98–104', '98–104'], ['5–6 yaş', '110–116', '110–116'],
      ['7–8 yaş', '122–128', '122–128'], ['9–10 yaş', '134–140', '134–140'], ['11–12 yaş', '146–152', '146–152'],
      ['13–14 yaş', '158–164', '158–164'],
    ].map(([tr, ru, cm]) => ({ tr, ru, cm })),
  },
  {
    id: 'one',
    name: 'Tek beden',
    base: 'int',
    measureLabel: { tr: 'Ölçü', ru: 'Размер' },
    rows: [{ tr: 'Standart', ru: 'Единый', int: 'OS', cm: 'Universal' }],
  },
]

export function tableForCategory(path: string): SizeTable {
  const p = path.toLowerCase()
  const by = (id: string) => SIZE_TABLES.find((t) => t.id === id)!
  if (p.includes('ayakkab') || /loafer|babet|sneaker|bot|çizme|topuklu|klasik|обув|лофер|кроссов|сапог|балет/.test(p)) return by('shoes')
  if (/kot|jean|pantolon|джинс|брюк/.test(p)) return by('jeans')
  if (p.startsWith('çocuk') || p.includes('bebek') || p.includes('дет')) return by('kids')
  if (p.startsWith('erkek') || p.includes('муж')) return by('men')
  if (p.startsWith('kadın') || p.includes('жен')) return by('women')
  return by('one')
}

export const systemsOf = (t: SizeTable): SizeSys[] =>
  (['tr', 'ru', 'int'] as SizeSys[]).filter((s) => t.rows.some((r) => r[s]))

export const equivalents = (t: SizeTable, row: number, except: SizeSys) =>
  systemsOf(t)
    .filter((s) => s !== except && t.rows[row][s])
    .map((s) => `${s === 'tr' ? 'EU' : SYS_LABEL[s]} ${t.rows[row][s]}`)
    .join(' · ')

/** Курсы валют JJ (₺ TRY, $ USD, ₸ KZT) */
export const USD_PER_TRY = 1 / 36
export const TRY_PER_USD = 36
export const RATE_KZT = { TRY: 8.89, USD: 500, KZT: 1 }
export const RATE_TRY = { TRY: 1, USD: 36 }
export const RATE_USD = { TRY: 1 / 36, USD: 1 }
