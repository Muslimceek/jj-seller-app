// Таблицы соответствия размеров (только TR / EU, RU, INT — без US и CN).
// Продавец выбирает размер в привычной системе, остальные подставляются автоматически.

export type SizeSys = 'tr' | 'ru' | 'int'

export const SYS_LABEL: Record<SizeSys, string> = {
  tr: 'TR / EU',
  ru: 'RU',
  int: 'INT',
}

export interface SizeTable {
  id: string
  name: string
  /** система, в которой удобнее всего вводить по умолчанию */
  base: SizeSys
  rows: Partial<Record<SizeSys, string>>[]
}

const women = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL']
const men = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

export const SIZE_TABLES: SizeTable[] = [
  {
    id: 'women',
    name: 'Kadın giyim',
    base: 'tr',
    rows: women.map((int, i) => {
      const eu = 32 + i * 2
      return { tr: String(eu), ru: String(eu + 6), int }
    }),
  },
  {
    id: 'men',
    name: 'Erkek giyim',
    base: 'tr',
    rows: men.map((int, i) => {
      const eu = 44 + i * 2
      return { tr: String(eu), ru: String(eu), int }
    }),
  },
  {
    id: 'jeans',
    name: 'Jean / pantolon',
    base: 'tr',
    rows: [32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54].map((eu, i) => ({
      tr: String(eu),
      ru: String(eu + 6),
      int: ['XXS', 'XS', 'XS', 'S', 'S', 'M', 'M', 'L', 'L', 'XL', 'XL', 'XXL'][i],
    })),
  },
  {
    id: 'shoes',
    name: 'Ayakkabı',
    base: 'tr',
    rows: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((eu) => ({
      tr: String(eu),
      ru: String(eu - 1),
    })),
  },
  {
    id: 'kids',
    name: 'Çocuk giyim',
    base: 'tr',
    rows: [
      ['2 yaş', '92'], ['3–4 yaş', '98–104'], ['5–6 yaş', '110–116'],
      ['7–8 yaş', '122–128'], ['9–10 yaş', '134–140'], ['11–12 yaş', '146–152'],
      ['13–14 yaş', '158–164'],
    ].map(([tr, ru]) => ({ tr, ru })),
  },
  {
    id: 'one',
    name: 'Tek beden',
    base: 'int',
    rows: [{ tr: 'Standart', ru: 'Единый', int: 'OS' }],
  },
]

/** Подбираем таблицу по пути категории */
export function tableForCategory(path: string): SizeTable {
  const p = path.toLowerCase()
  const by = (id: string) => SIZE_TABLES.find((t) => t.id === id)!
  if (p.includes('ayakkab') || /loafer|babet|sneaker|bot|çizme|topuklu|klasik/.test(p)) return by('shoes')
  if (/kot|jean|pantolon/.test(p)) return by('jeans')
  if (p.startsWith('çocuk') || p.includes('bebek')) return by('kids')
  if (p.startsWith('erkek')) return by('men')
  if (p.startsWith('kadın')) return by('women')
  return by('one')
}

export const systemsOf = (t: SizeTable): SizeSys[] =>
  (['tr', 'ru', 'int'] as SizeSys[]).filter((s) => t.rows.some((r) => r[s]))

/** Короткая подпись соответствий: «RU 44 · INT M» */
export const equivalents = (t: SizeTable, row: number, except: SizeSys) =>
  systemsOf(t)
    .filter((s) => s !== except && t.rows[row][s])
    .map((s) => `${s === 'tr' ? 'EU' : SYS_LABEL[s]} ${t.rows[row][s]}`)
    .join(' · ')

/** Курсы валют JJ (₺ TRY и ₸ KZT) */
export const RATE_KZT = { TRY: 8.89, KZT: 1 }
