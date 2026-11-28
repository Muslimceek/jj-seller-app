// Демо-данные кабинета продавца (как в записи экрана).
// Личные данные покупателя и продавца заменены на условные.

import type { Lang } from './i18n'
import { FULL_CATEGORIES, type Cat } from './categoryProfiles'
export type { Cat }

export const img = (n: string) => `/img/${n}.jpg`

export const seller = {
  name: 'Jadyra',
  surname: '',
  shop: 'Jadyra Boutique',
  district: 'İstanbul · Laleli',
  phone: '+90 555 000 00 00',
  phoneShort: '5550000000',
  email: 'seller@example.com',
  balance: 15824,
}

export type CountryCode = 'KZ' | 'RU' | 'KG' | 'UZ'
export const ALL_COUNTRIES: CountryCode[] = ['KZ', 'RU', 'KG', 'UZ']

export interface SellerProfile {
  shop: string
  name: string
  surname: string
  district: string
  phone: string
  email: string
  countries: CountryCode[]
}

const PROF_KEY = 'jj-seller-profile'
export function loadSellerProfile(): SellerProfile {
  let savedShop = ''
  try { savedShop = localStorage.getItem('jj-seller-shop') || '' } catch {}
  try {
    const raw = localStorage.getItem(PROF_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      return {
        shop: p.shop || savedShop || seller.shop,
        name: p.name || seller.name,
        surname: p.surname ?? seller.surname,
        district: p.district || seller.district,
        phone: p.phone || seller.phone,
        email: p.email || seller.email,
        countries: Array.isArray(p.countries) && p.countries.length ? p.countries : ALL_COUNTRIES,
      }
    }
  } catch {}
  return {
    shop: savedShop || seller.shop,
    name: seller.name,
    surname: seller.surname,
    district: seller.district,
    phone: seller.phone,
    email: seller.email,
    countries: ALL_COUNTRIES,
  }
}

export function saveSellerProfile(p: SellerProfile) {
  try {
    localStorage.setItem(PROF_KEY, JSON.stringify(p))
    if (p.shop.trim()) localStorage.setItem('jj-seller-shop', p.shop.trim())
  } catch {}
}

export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  title: string
  image: string
  qty: number
  total: number
  date: string
  dateLong: string
  status: OrderStatus
  buyerName: string
  buyerPhone: string
  buyerEmail: string
  countryCode: CountryCode
  city: string
  streetHouse: string
  apartment: string
  addressLabel: string
}

export const orders: Order[] = [
  {
    id: '2848160319', title: 'Лоферы', image: img('lofer'), qty: 1, total: 11391,
    date: '24.11.2026, 10:34', dateLong: '24.11.2026 · 10:34', status: 'new',
    buyerName: 'Айгерим Саматова', buyerPhone: '+7 701 412 88 90', buyerEmail: 'aigerim.s@example.com',
    countryCode: 'KZ', city: 'Алматы', streetHouse: 'мкр. Айнабулак-2, д. 45', apartment: 'кв. 18', addressLabel: 'Дом',
  },
  {
    id: '2984122545', title: 'Куртка', image: img('kurtka'), qty: 4, total: 72112,
    date: '23.11.2026, 20:16', dateLong: '23.11.2026 · 20:16', status: 'processing',
    buyerName: 'Анна Соколова', buyerPhone: '+7 916 482 19 30', buyerEmail: 'anna.s@example.com',
    countryCode: 'RU', city: 'Москва', streetHouse: 'ул. Тверская, д. 18', apartment: 'кв. 42', addressLabel: 'ЖК Центр',
  },
  {
    id: '5574963067', title: 'Балетки', image: img('baletki'), qty: 1, total: 15824,
    date: '21.11.2026, 13:26', dateLong: '21.11.2026 · 13:26', status: 'shipped',
    buyerName: 'Алина Токтогулова', buyerPhone: '+996 555 310 442', buyerEmail: 'alina.t@example.com',
    countryCode: 'KG', city: 'Бишкек', streetHouse: 'пр. Чуй, д. 124', apartment: 'кв. 15', addressLabel: 'Дом',
  },
  {
    id: '2881262078', title: 'Двойка', image: img('dvoyka'), qty: 1, total: 15824,
    date: '19.11.2026, 13:28', dateLong: '19.11.2026 · 13:28', status: 'delivered',
    buyerName: 'Мадина Каримова', buyerPhone: '+998 90 551 09 34', buyerEmail: 'madina.k@example.com',
    countryCode: 'UZ', city: 'Ташкент', streetHouse: 'пр. Амира Темура, д. 68', apartment: 'кв. 27', addressLabel: 'Офис',
  },
  {
    id: '2881262011', title: 'Двойка', image: img('dvoyka'), qty: 1, total: 15824,
    date: '17.11.2026, 13:20', dateLong: '17.11.2026 · 13:20', status: 'cancelled',
    buyerName: 'Динара Нурланова', buyerPhone: '+7 702 884 19 20', buyerEmail: 'dinara.n@example.com',
    countryCode: 'KZ', city: 'Астана', streetHouse: 'пр. Мангилик Ел, д. 52', apartment: 'кв. 114', addressLabel: 'Дом',
  },
]

export const customer = {
  name: 'Айгерим Саматова',
  phone: '7000000000',
  email: 'customer@example.com',
  addressLabel: 'Дом',
  address: 'Kazakhstan, Almati, Айнабулак 2',
}

export const cargoAddress =
  'Balabanağa Mah. Fethibey Cad. Laleli Galeria İş Merkezi No: 96, Laleli-Fatih / İstanbul'

export interface Variant { name: string; price: string; qty: number; image: string }

export interface Product {
  id: string
  title: string
  price: string
  stock: number
  variants: number
  image: string
  hidden?: boolean
  gallery?: string
  variantList?: Variant[]
}

const rubashkaVariants: Variant[] = [
  ['Коричневый, S', 'rubashka'], ['Коричневый, M', 'rubashka'], ['Коричневый, L', 'rubashka'], ['Коричневый, XL', 'rubashka'],
  ['Хаки, M', 'rubashka'], ['Красный, XL', 'kurtka_pop'], ['Красный, M', 'kurtka_pop'], ['Красный, S', 'kurtka_pop'],
  ['Хаки, S', 'rubashka'], ['Тёмно-синий, M', 'rubashka'],
].map(([name, im]) => ({ name, price: '1 000 ₺', qty: 5, image: img(im) }))

export const products: Product[] = [
  { id: 'p1', title: 'Рубашка женская', price: '1 000 ₺', stock: 80, variants: 16, image: img('rubashka'), gallery: img('gallery'), variantList: rubashkaVariants },
  { id: 'p2', title: 'Кроссовки', price: '1 250 ₺', stock: 200, variants: 40, image: img('krossovki1') },
  { id: 'p3', title: 'Кроссовки белые', price: '1 250 ₺', stock: 20, variants: 4, image: img('krossovki2') },
  { id: 'p4', title: 'Кроссовки чёрные', price: '1 300 ₺', stock: 8, variants: 5, image: img('krossovki_b') },
  { id: 'p5', title: 'Сапоги высокие', price: '1 950 ₺', stock: 20, variants: 4, image: img('sapogi1') },
  { id: 'p6', title: 'Сапоги зимние', price: '2 150 ₺', stock: 25, variants: 4, image: img('sapogi2') },
  { id: 'p7', title: 'Сапоги классика', price: '1 950 ₺', stock: 5, variants: 3, image: img('sapogi3') },
  { id: 'p8', title: 'Женские лоферы', price: '1 450 ₺', stock: 20, variants: 5, image: img('lofer_pop') },
  { id: 'p9', title: 'Балетки', price: '1 350 ₺', stock: 20, variants: 5, image: img('baletki_pop') },
  { id: 'p10', title: 'Куртка', price: '2 490 ₺', stock: 20, variants: 8, image: img('kurtka_pop') },
  { id: 'p11', title: 'Двойка', price: '1 650 ₺', stock: 15, variants: 6, image: img('dvoyka') },
  { id: 'p12', title: 'Лоферы', price: '1 450 ₺', stock: 18, variants: 5, image: img('lofer') },
  { id: 'p13', title: 'Балетки мягкие', price: '1 290 ₺', stock: 12, variants: 4, image: img('baletki') },
  { id: 'p14', title: 'Кроссовки спорт', price: '1 250 ₺', stock: 30, variants: 5, image: img('krossovki3') },
]

export interface PopularProduct {
  id: string
  title: string
  stock: number
  sold: number
  revenue: number
  rating: number
  views: number
  carts: number
  deltaPct: number
  image: string
  series: number[]
  cities: { name: string; pct: number }[]
  sizes: { size: string; sold: number }[]
}

export const popular: PopularProduct[] = [
  {
    id: 'pop1', title: 'Женские лоферы', stock: 20, sold: 14, revenue: 159474, rating: 4.9,
    views: 312, carts: 58, deltaPct: 24.5, image: img('lofer_pop'),
    series: [1, 2, 1, 3, 2, 3, 2],
    cities: [{ name: 'Алматы (KZ)', pct: 42 }, { name: 'Москва (RU)', pct: 31 }, { name: 'Ташкент (UZ)', pct: 27 }],
    sizes: [{ size: '37', sold: 5 }, { size: '38', sold: 5 }, { size: '39', sold: 4 }],
  },
  {
    id: 'pop2', title: 'Куртка', stock: 20, sold: 11, revenue: 198308, rating: 4.8,
    views: 274, carts: 46, deltaPct: 19.2, image: img('kurtka_pop'),
    series: [1, 1, 2, 1, 3, 2, 1],
    cities: [{ name: 'Москва (RU)', pct: 44 }, { name: 'Астана (KZ)', pct: 34 }, { name: 'Бишкек (KG)', pct: 22 }],
    sizes: [{ size: 'M', sold: 5 }, { size: 'L', sold: 4 }, { size: 'S', sold: 2 }],
  },
  {
    id: 'pop3', title: 'Балетки', stock: 20, sold: 9, revenue: 142416, rating: 4.9,
    views: 218, carts: 39, deltaPct: 15.8, image: img('baletki_pop'),
    series: [1, 0, 2, 2, 1, 2, 1],
    cities: [{ name: 'Бишкек (KG)', pct: 40 }, { name: 'Алматы (KZ)', pct: 35 }, { name: 'Ташкент (UZ)', pct: 25 }],
    sizes: [{ size: '37', sold: 4 }, { size: '38', sold: 3 }, { size: '36', sold: 2 }],
  },
  {
    id: 'pop4', title: 'Кроссовки спорт', stock: 25, sold: 8, revenue: 88900, rating: 4.7,
    views: 195, carts: 31, deltaPct: 11.4, image: img('krossovki3'),
    series: [0, 1, 1, 2, 1, 2, 1],
    cities: [{ name: 'Ташкент (UZ)', pct: 46 }, { name: 'Алматы (KZ)', pct: 34 }, { name: 'Москва (RU)', pct: 20 }],
    sizes: [{ size: '39', sold: 3 }, { size: '40', sold: 3 }, { size: '38', sold: 2 }],
  },
  {
    id: 'pop5', title: 'Сапоги зимние', stock: 5, sold: 6, revenue: 114680, rating: 4.8,
    views: 164, carts: 27, deltaPct: 28.0, image: img('sapogi2'),
    series: [1, 0, 1, 1, 1, 1, 1],
    cities: [{ name: 'Москва (RU)', pct: 52 }, { name: 'Астана (KZ)', pct: 28 }, { name: 'Бишкек (KG)', pct: 20 }],
    sizes: [{ size: '38', sold: 3 }, { size: '39', sold: 2 }, { size: '37', sold: 1 }],
  },
  {
    id: 'pop6', title: 'Сапоги классика', stock: 20, sold: 4, revenue: 69340, rating: 4.6,
    views: 128, carts: 19, deltaPct: 8.6, image: img('sapogi3'),
    series: [0, 1, 0, 1, 1, 0, 1],
    cities: [{ name: 'Алматы (KZ)', pct: 50 }, { name: 'Ташкент (UZ)', pct: 50 }],
    sizes: [{ size: '37', sold: 2 }, { size: '38', sold: 2 }],
  },
]

export type Period = 'Gün' | 'Hafta' | 'Ay' | 'Çeyrek'
export const periods: Period[] = ['Gün', 'Hafta', 'Ay', 'Çeyrek']

export interface StatPoint {
  label: string
  fullLabel: string
  sum: number
  count: number
}

export interface PeriodStats {
  sum: number
  prevSum: number
  count: number
  deltaPct: number
  avgOrder: number
  conversion: number
  views: number
  carts: number
  subtitle: string
  labels: string[]
  peak: number
  points: StatPoint[]
}

export const stats: Record<Period, PeriodStats> = {
  'Gün': {
    sum: 27215,
    prevSum: 23830,
    count: 2,
    deltaPct: 14.2,
    avgOrder: 13608,
    conversion: 4.8,
    views: 42,
    carts: 9,
    subtitle: '00:00 – 21:00',
    labels: ['09:00', '13:00', '17:00', '21:00'],
    peak: 0.72,
    points: [
      { label: '09:00', fullLabel: '09:00', sum: 0, count: 0 },
      { label: '11:00', fullLabel: '11:00', sum: 11391, count: 1 },
      { label: '13:00', fullLabel: '13:00', sum: 4200, count: 0 },
      { label: '15:00', fullLabel: '15:00', sum: 0, count: 0 },
      { label: '17:00', fullLabel: '17:00', sum: 15824, count: 1 },
      { label: '19:00', fullLabel: '19:00', sum: 9400, count: 0 },
      { label: '21:00', fullLabel: '21:00', sum: 12100, count: 0 },
    ],
  },
  'Hafta': {
    sum: 87936,
    prevSum: 71725,
    count: 6,
    deltaPct: 22.6,
    avgOrder: 14656,
    conversion: 5.4,
    views: 112,
    carts: 24,
    subtitle: '18–24.11',
    labels: ['18.11', '20.11', '22.11', '24.11'],
    peak: 0.85,
    points: [
      { label: '18', fullLabel: '18.11', sum: 11391, count: 1 },
      { label: '19', fullLabel: '19.11', sum: 6400, count: 0 },
      { label: '20', fullLabel: '20.11', sum: 15824, count: 1 },
      { label: '21', fullLabel: '21.11', sum: 12659, count: 1 },
      { label: '22', fullLabel: '22.11', sum: 24980, count: 2 },
      { label: '23', fullLabel: '23.11', sum: 9850, count: 1 },
      { label: '24', fullLabel: '24.11', sum: 6832, count: 0 },
    ],
  },
  'Ay': {
    sum: 130975,
    prevSum: 110620,
    count: 9,
    deltaPct: 18.4,
    avgOrder: 14553,
    conversion: 5.1,
    views: 176,
    carts: 38,
    subtitle: '01–28.11',
    labels: ['1', '10', '19', '28'],
    peak: 0.92,
    points: [
      { label: '01', fullLabel: '01–05.11', sum: 12570, count: 1 },
      { label: '06', fullLabel: '06–10.11', sum: 18400, count: 1 },
      { label: '12', fullLabel: '11–16.11', sum: 15824, count: 1 },
      { label: '18', fullLabel: '17–21.11', sum: 48620, count: 4 },
      { label: '24', fullLabel: '22–25.11', sum: 24170, count: 1 },
      { label: '28', fullLabel: '26–28.11', sum: 11391, count: 1 },
    ],
  },
  'Çeyrek': {
    sum: 348420,
    prevSum: 264350,
    count: 24,
    deltaPct: 31.8,
    avgOrder: 14518,
    conversion: 5.7,
    views: 421,
    carts: 92,
    subtitle: '09–11.2026',
    labels: ['09', '10', '11'],
    peak: 0.96,
    points: [
      { label: '09.1', fullLabel: '09.2026 (1)', sum: 38200, count: 3 },
      { label: '09.2', fullLabel: '09.2026 (2)', sum: 52400, count: 4 },
      { label: '10.1', fullLabel: '10.2026 (1)', sum: 46900, count: 3 },
      { label: '10.2', fullLabel: '10.2026 (2)', sum: 79945, count: 5 },
      { label: '11.1', fullLabel: '11.2026 (1)', sum: 61800, count: 4 },
      { label: '11.2', fullLabel: '11.2026 (2)', sum: 69175, count: 5 },
    ],
  },
}

export interface Transaction {
  id: string
  type: 'in' | 'out'
  title: string
  sub: string
  amount: number
  date: string
}

export const transactions: Transaction[] = [
  { id: 'tx1', type: 'in', title: 'Лоферы · #160319', sub: 'Алматы (KZ) · Айгерим С.', amount: 11391, date: '24.11.2026' },
  { id: 'tx2', type: 'out', title: 'Test Bank ·••• 1326', sub: 'IBAN', amount: 45000, date: '22.11.2026' },
  { id: 'tx3', type: 'in', title: 'Куртка · #122545', sub: 'Москва (RU) · Анна С.', amount: 57690, date: '21.11.2026' },
  { id: 'tx4', type: 'in', title: 'Балетки · #963067', sub: 'Бишкек (KG) · Алина Т.', amount: 12659, date: '19.11.2026' },
  { id: 'tx5', type: 'out', title: 'Test Bank ·••• 1326', sub: 'IBAN', amount: 25000, date: '18.11.2026' },
  { id: 'tx6', type: 'in', title: 'Двойка · #262078', sub: 'Ташкент (UZ) · Мадина К.', amount: 12659, date: '17.11.2026' },
]

export const categories: Cat[] = FULL_CATEGORIES

/* ---------- Полный 100% перевод демо-товаров, городов, адресов и транзакций (TR ↔ RU) ---------- */
const TITLE_TR: Record<string, string> = {
  'Лоферы': 'Loafer Ayakkabı',
  'Куртка': 'Şişme Mont',
  'Балетки': 'Babet Ayakkabı',
  'Двойка': 'İkili Takım',
  'Рубашка женская': 'Kadın Gömlek',
  'Кроссовки': 'Sneaker Spor Ayakkabı',
  'Кроссовки белые': 'Beyaz Sneaker',
  'Кроссовки чёрные': 'Siyah Sneaker',
  'Сапоги высокие': 'Uzun Çizme',
  'Сапоги зимние': 'Kışlık Çizme',
  'Сапоги классика': 'Klasik Çizme',
  'Женские лоферы': 'Kadın Loafer',
  'Балетки мягкие': 'Yumuşak Babet',
  'Кроссовки спорт': 'Spor Sneaker',
}

const CITY_TR: Record<string, string> = {
  'Алматы': 'Almatı',
  'Астана': 'Astana',
  'Шымкент': 'Şımkent',
  'Москва': 'Moskova',
  'Бишкек': 'Bişkek',
  'Ташкент': 'Taşkent',
  'Караганда': 'Karaganda',
}

const ADDR_LBL_TR: Record<string, string> = {
  'Дом': 'Ev',
  'ЖК Центр': 'Rezidans',
  'ЖК Арман': 'Rezidans Arman',
  'Офис': 'Ofis',
}

const COLOR_WORD_TR: Record<string, string> = {
  'Коричневый': 'Kahverengi',
  'Хаки': 'Haki',
  'Красный': 'Kırmızı',
  'Тёмно-синий': 'Lacivert',
  'Чёрный': 'Siyah',
  'Белый': 'Beyaz',
}

export const locTitle = (s: string, lang: Lang): string =>
  lang === 'ru' ? s : (TITLE_TR[s] ?? s)

export const locCity = (s: string, lang: Lang): string => {
  if (lang === 'ru') return s
  let out = s
  for (const [ru, tr] of Object.entries(CITY_TR)) out = out.replace(ru, tr)
  return out
}

export const locAddrLabel = (s: string, lang: Lang): string =>
  lang === 'ru' ? s : (ADDR_LBL_TR[s] ?? s)

export const locStreet = (s: string, lang: Lang): string =>
  lang === 'ru'
    ? s
    : s
        .replace('мкр.', 'Mah.')
        .replace('ул.', 'Cad.')
        .replace('пр.', 'Bulv.')
        .replace(', д.', ', No:')

export const locApt = (s: string, lang: Lang): string =>
  lang === 'ru' ? s : s.replace('кв.', 'Daire')

export const locVariant = (s: string, lang: Lang): string => {
  if (lang === 'ru') return s
  let out = s
  for (const [ru, tr] of Object.entries(COLOR_WORD_TR)) out = out.replace(ru, tr)
  return out
}

export const locTxTitle = (s: string, lang: Lang): string => {
  if (lang === 'ru') return s
  let out = s
  for (const [ru, tr] of Object.entries(TITLE_TR)) out = out.replace(ru, tr)
  return out
}

export const locTxSub = (s: string, lang: Lang): string => {
  if (lang === 'ru') return s
  return locCity(s, lang)
}

export const brands = ['ABLAZZE', 'ARTICULARIUS', 'Ayshara', 'Azalea', 'BIOPLEX', 'BLUBELLE', 'DERMAMINE', 'dionisos', 'Diva', 'emintekstil', 'Fast step', 'Grand Oxford', 'Grandoxford', 'Imago', 'IMAGO LUXURY', 'Iskra', 'Kiğılı', 'Missmamma', 'Polo Garage']

export const tags = [
  { name: 'Gerçek deri', color: '#9A6A3A', bg: '#F6EEE6' },
  { name: 'El yapımı', color: '#B65AF7', bg: '#F5E9FE' },
  { name: '%100 pamuk', color: '#22A55B', bg: '#E8F7EE' },
  { name: 'Su geçirmez', color: '#2F80ED', bg: '#E8F1FD' },
  { name: 'Türkiye üretimi', color: '#E5484D', bg: '#FDECEC' },
  { name: 'Organik', color: '#3E9B4F', bg: '#EAF6EC' },
]

export const colors = [
  ['Siyah', '#111'], ['Beyaz', '#fff'], ['Gri', '#9e9e9e'], ['Koyu gri', '#4a4a4a'], ['Açık gri', '#d4d4d4'], ['Melanj', '#bdbdbd'],
  ['Kırmızı', '#e53935'], ['Bordo', '#7b1027'], ['Pembe', '#f48fb1'], ['Pudra', '#f3c9c0'], ['Fuşya', '#e91e63'], ['Turuncu', '#fb8c00'],
  ['Kahverengi', '#6d4c41'], ['Haki', '#c8bb6c'], ['Lacivert', '#1a237e'],
]

export const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL']
export const stockTypes = ['Adet', 'Çift', 'cm', 'Düzine', 'gram', 'kg', 'Kişi', 'm2', 'metre', 'Paket']

export const fmt = (n: number) => n.toLocaleString('ru-RU').replace(/,/g, ' ')
