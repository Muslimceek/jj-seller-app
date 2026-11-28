// Таблицы соответствия размеров (Одежда, Обувь, Кольца, Цепочки/Колье, Браслеты, Объём, Вес, Текстиль).
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
    id: 'rings',
    name: 'Yüzük ölçüsü',
    base: 'tr',
    measureLabel: { tr: 'Çap (mm)', ru: 'Диаметр (мм)' },
    rows: [
      { tr: '10', ru: '15.5', int: '5', cm: '15.7' },
      { tr: '12', ru: '16.0', int: '6', cm: '16.5' },
      { tr: '14', ru: '16.5', int: '6.5', cm: '16.9' },
      { tr: '15', ru: '17.0', int: '7', cm: '17.3' },
      { tr: '16', ru: '17.5', int: '7.5', cm: '17.7' },
      { tr: '17', ru: '18.0', int: '8', cm: '18.1' },
      { tr: '18', ru: '18.5', int: '8.5', cm: '18.5' },
      { tr: '20', ru: '19.0', int: '9', cm: '19.0' },
      { tr: '22', ru: '20.0', int: '10', cm: '19.8' },
    ],
  },
  {
    id: 'chains',
    name: 'Kolye / Zincir boyu',
    base: 'int',
    measureLabel: { tr: 'Duruş', ru: 'Посадка' },
    rows: [
      { int: '40 cm', ru: '40 см', cm: 'Choker / Чокер' },
      { int: '42 cm', ru: '42 см', cm: 'Köprücük / Ключица' },
      { int: '45 cm', ru: '45 см', cm: 'Klasik / Классика' },
      { int: '50 cm', ru: '50 см', cm: 'Orta / Средняя' },
      { int: '55 cm', ru: '55 см', cm: 'Uzun / Удлинённая' },
      { int: '60 cm', ru: '60 см', cm: 'Matine / Длинная' },
    ],
  },
  {
    id: 'bracelets',
    name: 'Bileklik / Bilezik',
    base: 'int',
    measureLabel: { tr: 'Bilek (cm)', ru: 'Запястье (см)' },
    rows: [
      { int: '16 cm', ru: '16 см', cm: '14–15' },
      { int: '17 cm', ru: '17 см', cm: '15–16' },
      { int: '18 cm', ru: '18 см', cm: '16–17' },
      { int: '19 cm', ru: '19 см', cm: '17–18' },
      { int: '20 cm', ru: '20 см', cm: '18–19' },
      { int: '21 cm', ru: '21 см', cm: '19–20' },
    ],
  },
  {
    id: 'volume',
    name: 'Hacim (ml)',
    base: 'int',
    measureLabel: { tr: 'Boy', ru: 'Формат' },
    rows: [
      { int: '30 ml', ru: '30 мл', cm: 'Travel / Мини' },
      { int: '50 ml', ru: '50 мл', cm: 'Standart' },
      { int: '100 ml', ru: '100 мл', cm: 'Klasik' },
      { int: '200 ml', ru: '200 мл', cm: 'Büyük / Большой' },
      { int: '500 ml', ru: '500 мл', cm: 'Ekonomik' },
    ],
  },
  {
    id: 'weightPack',
    name: 'Gramaj / Paket',
    base: 'int',
    measureLabel: { tr: 'Paket', ru: 'Упаковка' },
    rows: [
      { int: '100 g', ru: '100 г', cm: 'Mini' },
      { int: '250 g', ru: '250 г', cm: 'Standart' },
      { int: '500 g', ru: '500 г', cm: 'Aile / Семейная' },
      { int: '1 kg', ru: '1 кг', cm: 'Ekonomik' },
      { int: '60 pcs', ru: '60 капс', cm: '1–2 ay / мес' },
    ],
  },
  {
    id: 'homeText',
    name: 'Ev tekstili ölçüsü',
    base: 'tr',
    measureLabel: { tr: 'Ölçü (cm)', ru: 'Размер (см)' },
    rows: [
      { tr: 'Tek Kişilik', ru: '1.5-спальный', cm: '160×220' },
      { tr: 'Çift Kişilik', ru: '2-спальный', cm: '200×220' },
      { tr: 'King / Battal', ru: 'Евро / King', cm: '220×240' },
      { tr: 'El Havlusu', ru: 'Для рук', cm: '50×90' },
      { tr: 'Banyo Havlusu', ru: 'Банное', cm: '70×140' },
    ],
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
  if (/yüzük|alyans|tektaş|кольц/.test(p)) return by('rings')
  if (/kolye|zincir|halhal|колье|цепоч|анклет/.test(p)) return by('chains')
  if (/bileklik|bilezik|kelepçe|браслет/.test(p)) return by('bracelets')
  if (p.includes('ayakkab') || /loafer|babet|sneaker|bot|çizme|topuklu|klasik|sandalet|terlik|mokasen|обув|лофер|кроссов|сапог|балет/.test(p)) return by('shoes')
  if (/kot|jean|pantolon|джинс|брюк/.test(p)) return by('jeans')
  if (p.startsWith('çocuk') || p.includes('bebek') || p.includes('дет')) return by('kids')
  if (p.startsWith('erkek') || p.includes('муж')) return by('men')
  if (p.startsWith('kadın') || p.includes('жен')) return by('women')
  if (p.startsWith('güzellik') || p.startsWith('ev temizlik') || /parfüm|cilt|saç|deterjan/.test(p)) return by('volume')
  if (p.startsWith('gıda') || p.startsWith('diyet') || /kahve|çay|lokum|vitamin|kolajen/.test(p)) return by('weightPack')
  if (/nevresim|havlu|battaniye|halı|perde|ev tekstil/.test(p)) return by('homeText')
  return by('one')
}

export const systemsOf = (t: SizeTable): SizeSys[] =>
  (['tr', 'ru', 'int'] as SizeSys[]).filter((s) => t.rows.some((r) => r[s]))

export const equivalents = (t: SizeTable, row: number, except: SizeSys) =>
  systemsOf(t)
    .filter((s) => s !== except && t.rows[row][s])
    .map((s) => `${s === 'tr' ? 'TR' : SYS_LABEL[s]} ${t.rows[row][s]}`)
    .join(' · ')

export const USD_PER_TRY = 1 / 36
export const TRY_PER_USD = 36
export const RATE_KZT = { TRY: 8.89, USD: 500, KZT: 1 }
export const RATE_TRY = { TRY: 1, USD: 36 }
export const RATE_USD = { TRY: 1 / 36, USD: 1 }
