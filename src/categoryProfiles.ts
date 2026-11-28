// Полное дерево категорий турецкого маркетплейса (14 разделов, 160+ подкатегорий)
// + умные профили категорий для адаптации всех шагов конструктора товара (включая золото/украшения).

import type { Lang } from './i18n'

export interface Cat {
  name: string
  count?: number
  children?: Cat[]
}

const leaf = (name: string): Cat => ({ name })

export const FULL_CATEGORIES: Cat[] = [
  {
    name: 'Kadın',
    children: [
      'Elbiseler', 'Abiye & Mezuniyet', 'Tesettür Giyim', 'Kadın Dış Giyim', 'Trençkot & Kaban',
      'Takım & İkili Takım', 'Kadın Bluz ve Tişörtleri', 'Bluz ve Gömlek', 'Kadın Pantolon ve Kotları',
      'Kot Pantolon', 'Kadın Etek', 'Kadın Triko', 'Sweatshirt & Hoodie', 'Spor Giyim',
      'Ev Giyim & Pijama', 'İç Giyim', 'Plaj & Mayo', 'Büyük Beden',
    ].map(leaf),
  },
  {
    name: 'Erkek',
    children: [
      'Erkek Tişört', 'Polo Yaka Tişört', 'Erkek Gömlek', 'Erkek Pantolon', 'Erkek Kot Pantolon',
      'Erkek Dış Giyim', 'Mont & Kaban', 'Erkek Takım Elbise', 'Ceket', 'Triko & Kazak',
      'Erkek Sweatshirt', 'Eşofman Takımı', 'Şort', 'Erkek Ev Giyim', 'Erkek İç Giyim',
    ].map(leaf),
  },
  {
    name: 'Çocuk',
    children: [
      'Kız Çocuk', 'Erkek Çocuk', 'Bebek', 'Yenidoğan Set', 'Çocuk Elbise', 'Çocuk Takım',
      'Çocuk Mont & Kaban', 'Okul Kıyafeti', 'Çocuk Triko', 'Çocuk Pijama', 'Çocuk Spor',
    ].map(leaf),
  },
  {
    name: 'Kadın ayakkabısı',
    children: [
      'Loafer', 'Babet', 'Sneaker', 'Bot', 'Çizme', 'Topuklu Ayakkabı', 'Sandalet',
      'Terlik & Mule', 'Espadril', 'Kar Botu & Ugg', 'Kadın Spor Ayakkabı',
    ].map(leaf),
  },
  {
    name: 'Erkek ayakkabısı',
    children: [
      'Sneaker', 'Klasik', 'Bot', 'Loafer', 'Mokasen', 'Günlük Ayakkabı',
      'Erkek Sandalet', 'Erkek Terlik', 'Erkek Spor Ayakkabı', 'Kışlık Bot',
    ].map(leaf),
  },
  {
    name: 'Çocuk ayakkabısı',
    children: [
      'Kız Çocuk Ayakkabı', 'Erkek Çocuk Ayakkabı', 'Çocuk Sneaker', 'Çocuk Bot',
      'Çocuk Sandalet', 'İlk Adım & Patik', 'Ortopedik Ayakkabı', 'Okul Ayakkabısı',
    ].map(leaf),
  },
  {
    name: 'Çantalar ve Aksesuarlar',
    children: [
      'Kadın Çanta', 'Omuz & Çapraz Çanta', 'Clutch & Abiye Çanta', 'Sırt Çantası',
      'Erkek Çanta', 'Valiz & Bavul', 'Cüzdan', 'Kartlık', 'Kemer',
      'Şal ve Eşarp', 'Güneş Gözlüğü', 'Şapka & Bere', 'Saat',
    ].map(leaf),
  },
  {
    name: 'Takılar',
    children: [
      'Kolye', 'Yüzük', 'Alyans', 'Tektaş & Baget Yüzük', 'Küpe', 'Bileklik',
      'Bilezik & Kelepçe', 'Zincir', 'Kolye Ucu', 'Takı Seti', 'Düğün Seti',
      'Broş', 'Halhal', 'Piercing', 'Erkek Takı & Kol Düğmesi',
      'Çeyrek & Gram Altın', '925 Gümüş Takı', 'Bijuteri',
    ].map(leaf),
  },
  {
    name: 'Güzellik ve Bakım',
    children: [
      'Cilt Bakımı', 'Makyaj', 'Parfüm', 'Saç Bakımı', 'Vücut Bakımı',
      'Tırnak & Manikür', 'Güneş Koruyucu', 'Doğal Kozmetik', 'Tıraş & Erkek Bakım', 'Bakım Setleri',
    ].map(leaf),
  },
  {
    name: 'Diyet takviyeleri ve vitaminler',
    children: [
      'Vitaminler', 'Mineraller', 'Kolajen', 'Omega-3', 'Probiyotik',
      'Sporcu Besini', 'Bağışıklık Desteği', 'Bitkisel Takviye',
    ].map(leaf),
  },
  {
    name: 'Ev ve Yaşam',
    children: [
      'Ev Tekstili', 'Nevresim Takımı', 'Havlu & Bornoz', 'Battaniye & Pike',
      'Halı & Kilim', 'Perde', 'Mutfak', 'Çay & Kahve Seti',
      'Dekorasyon', 'Aydınlatma', 'Düzenleyici', 'Oda Kokusu & Mum',
    ].map(leaf),
  },
  {
    name: 'Gıda Ürünleri',
    children: [
      'Türk Kahvesi', 'Türk Çayı', 'Lokum & Tatlı', 'Baklava', 'Zeytinyağı',
      'Baharat', 'Kuruyemiş & Kuru Meyve', 'Bal & Pekmez', 'Zeytin', 'Sos & Salça',
    ].map(leaf),
  },
  {
    name: 'Oto Yedek Parça',
    children: [
      'Filtreler', 'Fren Sistemi', 'Süspansiyon', 'Aydınlatma & Far',
      'Motor Yağı & Bakım', 'Paspas & Kılıf', 'Oto Aksesuar', 'Silecek',
    ].map(leaf),
  },
  {
    name: 'Ev Temizlik Ürünleri',
    children: [
      'Çamaşır Deterjanı', 'Bulaşık Temizliği', 'Yüzey Temizleyici', 'Leke Çıkarıcı',
      'Bez & Sünger', 'Doğal Temizlik', 'Hava & Kumaş Ferahlatıcı', 'Temizlik Gereçleri',
    ].map(leaf),
  },
]

export const CAT_RU_MAP: Record<string, string> = {
  // Kadın
  'Kadın': 'Женщинам',
  'Elbiseler': 'Платья',
  'Abiye & Mezuniyet': 'Вечерние платья',
  'Tesettür Giyim': 'Мусульманская одежда (Хиджаб)',
  'Kadın Dış Giyim': 'Верхняя одежда',
  'Trençkot & Kaban': 'Тренчи и пальто',
  'Takım & İkili Takım': 'Костюмы и двойки',
  'Kadın Bluz ve Tişörtleri': 'Блузы и футболки',
  'Bluz ve Gömlek': 'Блузы и рубашки',
  'Kadın Pantolon ve Kotları': 'Брюки и джинсы',
  'Kot Pantolon': 'Джинсы',
  'Kadın Etek': 'Юбки',
  'Kadın Triko': 'Трикотаж и свитеры',
  'Sweatshirt & Hoodie': 'Свитшоты и худи',
  'Spor Giyim': 'Спортивная одежда',
  'Ev Giyim & Pijama': 'Домашняя одежда и пижамы',
  'İç Giyim': 'Нижнее бельё',
  'Plaj & Mayo': 'Купальники и пляж',
  'Büyük Beden': 'Большие размеры (Plus Size)',
  // Erkek
  'Erkek': 'Мужчинам',
  'Erkek Tişört': 'Мужские футболки',
  'Polo Yaka Tişört': 'Футболки поло',
  'Erkek Gömlek': 'Мужские рубашки',
  'Erkek Pantolon': 'Мужские брюки',
  'Erkek Kot Pantolon': 'Мужские джинсы',
  'Erkek Dış Giyim': 'Мужская верхняя одежда',
  'Mont & Kaban': 'Куртки и пальто',
  'Erkek Takım Elbise': 'Деловые костюмы',
  'Ceket': 'Пиджаки',
  'Triko & Kazak': 'Свитеры и кардиганы',
  'Erkek Sweatshirt': 'Худи и свитшоты',
  'Eşofman Takımı': 'Спортивные костюмы',
  'Şort': 'Шорты',
  'Erkek Ev Giyim': 'Домашняя одежда',
  'Erkek İç Giyim': 'Нижнее бельё',
  // Çocuk
  'Çocuk': 'Детям',
  'Kız Çocuk': 'Девочкам',
  'Erkek Çocuk': 'Мальчикам',
  'Bebek': 'Малышам (0–24 мес)',
  'Yenidoğan Set': 'Наборы для новорождённых',
  'Çocuk Elbise': 'Детские платья',
  'Çocuk Takım': 'Детские костюмы',
  'Çocuk Mont & Kaban': 'Детская верхняя одежда',
  'Okul Kıyafeti': 'Школьная форма',
  'Çocuk Triko': 'Детский трикотаж',
  'Çocuk Pijama': 'Детские пижамы',
  'Çocuk Spor': 'Детский спорт',
  // Kadın ayakkabısı
  'Kadın ayakkabısı': 'Женская обувь',
  'Loafer': 'Лоферы',
  'Babet': 'Балетки',
  'Sneaker': 'Кроссовки',
  'Bot': 'Ботинки',
  'Çizme': 'Сапоги',
  'Topuklu Ayakkabı': 'Туфли на каблуке',
  'Sandalet': 'Босоножки и сандалии',
  'Terlik & Mule': 'Мюли и шлёпанцы',
  'Espadril': 'Эспадрильи',
  'Kar Botu & Ugg': 'Угги и зимние сапоги',
  'Kadın Spor Ayakkabı': 'Спортивная обувь',
  // Erkek ayakkabısı
  'Erkek ayakkabısı': 'Мужская обувь',
  'Klasik': 'Классические туфли',
  'Mokasen': 'Мокасины',
  'Günlük Ayakkabı': 'Кеды и повседневная',
  'Erkek Sandalet': 'Сандалии',
  'Erkek Terlik': 'Шлёпанцы',
  'Erkek Spor Ayakkabı': 'Спортивная обувь',
  'Kışlık Bot': 'Зимние ботинки',
  // Çocuk ayakkabısı
  'Çocuk ayakkabısı': 'Детская обувь',
  'Kız Çocuk Ayakkabı': 'Обувь для девочек',
  'Erkek Çocuk Ayakkabı': 'Обувь для мальчиков',
  'Çocuk Sneaker': 'Детские кроссовки',
  'Çocuk Bot': 'Детские ботинки',
  'Çocuk Sandalet': 'Детские сандалии',
  'İlk Adım & Patik': 'Пинетки (первые шаги)',
  'Ortopedik Ayakkabı': 'Ортопедическая обувь',
  'Okul Ayakkabısı': 'Школьная обувь',
  // Çantalar ve Aksesuarlar
  'Çantalar ve Aksesuarlar': 'Сумки и аксессуары',
  'Kadın Çanta': 'Женские сумки',
  'Omuz & Çapraz Çanta': 'Сумки через плечо',
  'Clutch & Abiye Çanta': 'Клатчи и вечерние',
  'Sırt Çantası': 'Рюкзаки',
  'Erkek Çanta': 'Мужские сумки',
  'Valiz & Bavul': 'Чемоданы',
  'Cüzdan': 'Кошельки',
  'Kartlık': 'Картхолдеры',
  'Kemer': 'Ремни',
  'Şal ve Eşarp': 'Шали и платки',
  'Güneş Gözlüğü': 'Солнцезащитные очки',
  'Şapka & Bere': 'Шапки и кепки',
  'Saat': 'Часы',
  // Takılar
  'Takılar': 'Украшения',
  'Kolye': 'Колье и ожерелья',
  'Yüzük': 'Кольца',
  'Alyans': 'Обручальные кольца',
  'Tektaş & Baget Yüzük': 'Кольца с камнем (Солитёр / Багет)',
  'Küpe': 'Серьги',
  'Bileklik': 'Браслеты',
  'Bilezik & Kelepçe': 'Жёсткие браслеты и бэнглы',
  'Zincir': 'Цепочки',
  'Kolye Ucu': 'Подвески и кулоны',
  'Takı Seti': 'Комплекты украшений',
  'Düğün Seti': 'Свадебные наборы',
  'Broş': 'Броши',
  'Halhal': 'Браслеты на ногу (Анклеты)',
  'Piercing': 'Пирсинг',
  'Erkek Takı & Kol Düğmesi': 'Мужские украшения и запонки',
  'Çeyrek & Gram Altın': 'Золотые монеты и слитки',
  '925 Gümüş Takı': 'Серебро 925 пробы',
  'Bijuteri': 'Бижутерия',
  // Güzellik ve Bakım
  'Güzellik ve Bakım': 'Красота и уход',
  'Cilt Bakımı': 'Уход за кожей',
  'Makyaj': 'Макияж',
  'Parfüm': 'Парфюмерия',
  'Saç Bakımı': 'Уход за волосами',
  'Vücut Bakımı': 'Уход за телом',
  'Tırnak & Manikür': 'Маникюр и ногти',
  'Güneş Koruyucu': 'Солнцезащитные средства',
  'Doğal Kozmetik': 'Натуральная косметика',
  'Tıraş & Erkek Bakım': 'Бритьё и мужской уход',
  'Bakım Setleri': 'Подарочные наборы',
  // Diyet takviyeleri
  'Diyet takviyeleri ve vitaminler': 'Витамины и БАДы',
  'Vitaminler': 'Витамины',
  'Mineraller': 'Минералы',
  'Kolajen': 'Коллаген',
  'Omega-3': 'Омега-3',
  'Probiyotik': 'Пробиотики',
  'Sporcu Besini': 'Спортивное питание',
  'Bağışıklık Desteği': 'Для иммунитета',
  'Bitkisel Takviye': 'Травяные комплексы',
  // Ev ve Yaşam
  'Ev ve Yaşam': 'Дом и уют',
  'Ev Tekstili': 'Домашний текстиль',
  'Nevresim Takımı': 'Постельное бельё',
  'Havlu & Bornoz': 'Полотенца и халаты',
  'Battaniye & Pike': 'Пледы и покрывала',
  'Halı & Kilim': 'Ковры и килимы',
  'Perde': 'Шторы',
  'Mutfak': 'Кухня и посуда',
  'Çay & Kahve Seti': 'Чайные и кофейные сервизы',
  'Dekorasyon': 'Декор',
  'Aydınlatma': 'Освещение',
  'Düzenleyici': 'Органайзеры и хранение',
  'Oda Kokusu & Mum': 'Ароматы для дома и свечи',
  // Gıda
  'Gıda Ürünleri': 'Продукты питания',
  'Türk Kahvesi': 'Турецкий кофе',
  'Türk Çayı': 'Турецкий чай',
  'Lokum & Tatlı': 'Лукум и восточные сладости',
  'Baklava': 'Пахлава',
  'Zeytinyağı': 'Оливковое масло',
  'Baharat': 'Специи и приправы',
  'Kuruyemiş & Kuru Meyve': 'Орехи и сухофрукты',
  'Bal & Pekmez': 'Мёд и пекмез',
  'Zeytin': 'Оливки',
  'Sos & Salça': 'Соусы и пасты',
  // Oto
  'Oto Yedek Parça': 'Автозапчасти',
  'Filtreler': 'Фильтры',
  'Fren Sistemi': 'Тормозная система',
  'Süspansiyon': 'Подвеска и ходовая',
  'Aydınlatma & Far': 'Фары и освещение',
  'Motor Yağı & Bakım': 'Масла и автохимия',
  'Paspas & Kılıf': 'Коврики и чехлы',
  'Oto Aksesuar': 'Автоаксессуары',
  'Silecek': 'Щётки стеклоочистителя',
  // Temizlik
  'Ev Temizlik Ürünleri': 'Товары для уборки',
  'Çamaşır Deterjanı': 'Для стирки',
  'Bulaşık Temizliği': 'Для посуды',
  'Yüzey Temizleyici': 'Для поверхностей и пола',
  'Leke Çıkarıcı': 'Пятновыводители',
  'Bez & Sünger': 'Салфетки и губки',
  'Doğal Temizlik': 'Эко-средства',
  'Hava & Kumaş Ferahlatıcı': 'Освежители воздуха и ткани',
  'Temizlik Gereçleri': 'Инвентарь для уборки',
}

export type CatDomain =
  | 'jewelry'
  | 'clothing'
  | 'shoes'
  | 'bags'
  | 'beauty'
  | 'supplements'
  | 'home'
  | 'food'
  | 'auto'
  | 'cleaning'

export function domainForCategory(path: string): CatDomain {
  const root = (path.split(' > ')[0] || '').toLowerCase()
  const p = path.toLowerCase()
  if (root.includes('takı') || /kolye|yüzük|alyans|küpe|bileklik|bilezik|zincir|altın|gümüş|bijuteri|broş|halhal|piercing/.test(p)) return 'jewelry'
  if (root.includes('ayakkab') || /loafer|babet|sneaker|bot|çizme|topuklu|sandalet|terlik|mokasen/.test(p)) return 'shoes'
  if (root.includes('çanta') || /cüzdan|kemer|şal|gözlük|saat|valiz|şapka/.test(p)) return 'bags'
  if (root.includes('güzellik') || /parfüm|makyaj|cilt|saç|kozmetik/.test(p)) return 'beauty'
  if (root.includes('diyet') || /vitamin|kolajen|omega|probiyotik/.test(p)) return 'supplements'
  if (root.includes('ev ve yaşam') || /tekstil|nevresim|havlu|halı|perde|mutfak|dekor/.test(p)) return 'home'
  if (root.includes('gıda') || /kahve|çay|lokum|baklava|zeytin|baharat|bal/.test(p)) return 'food'
  if (root.includes('oto') || /filtre|fren|süspansiyon|paspas|silecek/.test(p)) return 'auto'
  if (root.includes('temizlik') || /deterjan|bulaşık|leke|sünger/.test(p)) return 'cleaning'
  return 'clothing'
}

export interface SmartAttr {
  k: string
  l: string
  opts: string[]
  multi?: boolean
  filter?: boolean
}

export interface SmartProfile {
  domain: CatDomain
  badge: string
  photoTip: string
  namePh: string
  descPh: string
  attrs: SmartAttr[]
  tags: { key: string; label: string; color: string; bg: string }[]
  priorityColors: [string, string][]
  defaultBox: { l: string; w: string; h: string; unit: 'cm' | 'mm'; weightHint: string }
}

export const JEWELRY_METALS: Record<Lang, string[]> = {
  tr: [
    'Altın 14 Ayar (585)', 'Altın 18 Ayar (750)', 'Altın 22 Ayar (916)', 'Altın 24 Ayar (999)',
    '925 Ayar Gümüş', 'Beyaz Altın 14K', 'Rose Altın 14K', '18K Altın Kaplama', '316L Çelik',
  ],
  ru: [
    'Золото 585 (14K)', 'Золото 750 (18K)', 'Золото 916 (22K)', 'Золото 999 (24K)',
    'Серебро 925', 'Белое золото 585', 'Розовое золото 585', 'Позолота 18K', 'Сталь 316L',
  ],
}

export const JEWELRY_STONES: Record<Lang, string[]> = {
  tr: ['Taşsız', 'Pırlanta', 'Zirkon', 'Zümrüt', 'Yakut', 'Safir', 'İnci', 'Oniks', 'Topaz'],
  ru: ['Без камня', 'Бриллиант', 'Фианит / Циркон', 'Изумруд', 'Рубин', 'Сапфир', 'Жемчуг', 'Оникс', 'Топаз'],
}

export const JEWELRY_GRAM_PRESETS = ['1.5', '2.5', '3.8', '5.0', '8.0', '12.0']

export function getSmartProfile(path: string, lang: Lang): SmartProfile {
  const domain = domainForCategory(path)
  const ru = lang === 'ru'

  if (domain === 'jewelry') {
    return {
      domain,
      badge: ru ? 'Ювелирный режим · Граммы и проба' : 'Mücevher modu · Gram ve ayar',
      photoTip: ru
        ? 'Сделайте макро-фото украшения, фото на руке/шее, клеймо пробы и подарочную коробку (3:4)'
        : 'Ürünün makro fotoğrafı, elde/boyunda duruşu, ayar damgası ve hediye kutusunu ekleyin (3:4)',
      namePh: ru ? 'Напр: Золотое колье 585 (14K) с бриллиантом, 3.45 г' : 'Örn: 14 Ayar (585) Pırlanta Altın Kolye, 3.45 gr',
      descPh: ru
        ? 'Опишите плетение, замок, огранку камня, наличие пробирного клейма и сертификата…'
        : 'Zincir modeli, kilit tipi, taş kesimi, ayar damgası ve sertifika bilgilerini yazın…',
      attrs: [
        { k: 'finish', l: ru ? 'Обработка' : 'Yüzey / Kaplama', opts: ru ? ['Полировка', 'Алмазная грань', 'Родирование', 'Матовое', 'Чернение'] : ['Parlak', 'Kalemli', 'Rodyum', 'Mat', 'Oksitli'], filter: true },
        { k: 'clasp', l: ru ? 'Замок / Застёжка' : 'Kilit tipi', opts: ru ? ['Карабин', 'Шпрингельный', 'Английский', 'Гвоздик (пусет)', 'Кольцо-конго'] : ['Papağan kilit', 'Halka kilit', 'İngiliz kilit', 'Vidalı / Çivili', 'Klipsli'] },
        { k: 'gender', l: ru ? 'Для кого' : 'Cinsiyet', opts: ru ? ['Женские', 'Мужские', 'Унисекс', 'Детские'] : ['Kadın', 'Erkek', 'Unisex', 'Çocuk'], filter: true },
        { k: 'origin', l: ru ? 'Производство' : 'Menşei', opts: ru ? ['Турция (Стамбул · Гранд-Базар)', 'Турция', 'Италия', 'Ручная работа'] : ['Türkiye (İstanbul · Kapalıçarşı)', 'Türkiye', 'İtalya', 'El yapımı'] },
      ],
      tags: [
        { key: 'gold585', label: ru ? 'Проба 585 / 14K' : '14 Ayar (585)', color: '#B45309', bg: '#FEF3C7' },
        { key: 'hallmark', label: ru ? 'Клеймо пробы' : 'Ayar damgalı', color: '#7E22CE', bg: '#F3E8FF' },
        { key: 'cert', label: ru ? 'Сертификат' : 'Sertifikalı', color: '#15803D', bg: '#DCFCE7' },
        { key: 'giftbox', label: ru ? 'Подарочная коробка' : 'Hediye kutulu', color: '#BE185D', bg: '#FCE7F3' },
        { key: 'handmade', label: ru ? 'Ручная работа' : 'El yapımı', color: '#4338CA', bg: '#E0E7FF' },
      ],
      priorityColors: [
        [ru ? 'Жёлтое золото' : 'Sarı Altın', '#E5B84B'],
        [ru ? 'Белое золото' : 'Beyaz Altın', '#E8ECF2'],
        [ru ? 'Розовое золото' : 'Rose Altın', '#E5A198'],
        [ru ? 'Серебро 925' : '925 Gümüş', '#CFD6E0'],
        [ru ? 'Биколор' : 'İki Renk Altın', '#DFC58A'],
        [ru ? 'Чёрный родий' : 'Siyah Rodyum', '#2C2F36'],
      ],
      defaultBox: { l: '8', w: '8', h: '4', unit: 'cm', weightHint: '0,05' },
    }
  }

  if (domain === 'shoes') {
    return {
      domain,
      badge: ru ? 'Обувь · Размеры TR/EU и стелька' : 'Ayakkabı · TR/EU beden & kalıp',
      photoTip: ru
        ? 'Сфотографируйте пару сбоку, спереди, подошву и на ноге при дневном свете (3:4)'
        : 'Yan açı, ön açı, taban detayı ve ayakta duruş fotoğrafı ekleyin (3:4)',
      namePh: ru ? 'Напр: Женские лоферы из натуральной кожи, чёрные' : 'Örn: Kadın hakiki deri siyah loafer ayakkabı',
      descPh: ru ? 'Опишите материал верха, мягкость стельки, высоту каблука и маломерит/большемерит ли пара…' : 'Dış materyal, iç taban rahatlığı, topuk boyu ve kalıp bilgisini yazın…',
      attrs: [
        { k: 'mat', l: ru ? 'Материал верха' : 'Dış materyal', opts: ru ? ['Натуральная кожа', 'Замша', 'Нубук', 'Экокожа', 'Текстиль'] : ['Hakiki deri', 'Süet', 'Nubuk', 'Suni deri', 'Tekstil'], multi: true, filter: true },
        { k: 'sole', l: ru ? 'Подошва' : 'Taban tipi', opts: ru ? ['Полиуретан', 'Резина', 'ТЭП', 'Кожаная', 'Платформа'] : ['Poliüretan', 'Kauçuk', 'Termo', 'Kösele', 'Platform'], filter: true },
        { k: 'heel', l: ru ? 'Каблук' : 'Topuk boyu', opts: ru ? ['Без каблука', 'Низкий (1–4 см)', 'Средний (5–7 см)', 'Высокий (8+ см)'] : ['Düz taban', 'Kısa (1–4 cm)', 'Orta (5–7 cm)', 'Yüksek (8+ cm)'] },
        { k: 'season', l: ru ? 'Сезон' : 'Sezon', opts: ru ? ['Весна/Осень', 'Лето', 'Зима (мех)', 'Всесезон'] : ['Mevsimlik', 'Yazlık', 'Kışlık (kürklü)', 'Dört mevsim'], filter: true },
      ],
      tags: [
        { key: 'leather', label: ru ? 'Натуральная кожа' : 'Hakiki deri', color: '#9A6A3A', bg: '#F6EEE6' },
        { key: 'ortho', label: ru ? 'Анатомическая стелька' : 'Ortopedik taban', color: '#15803D', bg: '#E8F7EE' },
        { key: 'tr', label: ru ? 'Сделано в Турции' : 'Türkiye üretimi', color: '#E5484D', bg: '#FDECEC' },
        { key: 'waterproof', label: ru ? 'Водоотталкивающие' : 'Su geçirmez', color: '#2F80ED', bg: '#E8F1FD' },
      ],
      priorityColors: [],
      defaultBox: { l: '32', w: '21', h: '12', unit: 'cm', weightHint: '0,9' },
    }
  }

  if (domain === 'bags') {
    return {
      domain,
      badge: ru ? 'Сумки и аксессуары · Размеры и материал' : 'Çanta & Aksesuar · Ölçü ve materyal',
      photoTip: ru ? 'Покажите сумку спереди, внутри (отделения), фурнитуру и размер рядом с моделью (3:4)' : 'Ön açı, iç bölmeler, metal aksesuarlar ve elde duruş fotoğrafı ekleyin (3:4)',
      namePh: ru ? 'Напр: Женская кожаная сумка через плечо с ремнём' : 'Örn: Kadın hakiki deri çapraz omuz çantası',
      descPh: ru ? 'Укажите количество отделений, длину ремня, вместимость (помещается ли А4/телефон)…' : 'Bölme sayısı, askı uzunluğu ve iç hacim bilgilerini yazın…',
      attrs: [
        { k: 'mat', l: ru ? 'Материал' : 'Materyal', opts: ru ? ['Натуральная кожа', 'Экокожа', 'Замша', 'Текстиль', 'Нейлон', 'Шёлк', 'Кашемир'] : ['Hakiki deri', 'Suni deri', 'Süet', 'Tekstil', 'Naylon', 'İpek', 'Kaşmir'], filter: true },
        { k: 'size', l: ru ? 'Размер' : 'Boyut', opts: ru ? ['Мини', 'Средняя', 'Большая (формат А4)', 'Дорожная'] : ['Mini', 'Orta', 'Büyük (A4 uyumlu)', 'Seyahat'], filter: true },
        { k: 'strap', l: ru ? 'Ремень / Ручка' : 'Askı tipi', opts: ru ? ['Через плечо', 'Короткие ручки', 'Цепочка', 'Съёмный ремень'] : ['Çapraz askı', 'El tutmalı', 'Zincir askı', 'Çıkarılabilir askı'] },
      ],
      tags: [
        { key: 'leather', label: ru ? 'Натуральная кожа' : 'Hakiki deri', color: '#9A6A3A', bg: '#F6EEE6' },
        { key: 'handmade', label: ru ? 'Ручная работа' : 'El yapımı', color: '#B65AF7', bg: '#F5E9FE' },
        { key: 'tr', label: ru ? 'Сделано в Турции' : 'Türkiye üretimi', color: '#E5484D', bg: '#FDECEC' },
      ],
      priorityColors: [],
      defaultBox: { l: '30', w: '24', h: '12', unit: 'cm', weightHint: '0,6' },
    }
  }

  if (domain === 'beauty' || domain === 'supplements') {
    const isSup = domain === 'supplements'
    return {
      domain,
      badge: isSup
        ? (ru ? 'Витамины и БАДы · Дозировка и состав' : 'Takviye & Vitamin · Form ve içerik')
        : (ru ? 'Красота и уход · Объём и тип кожи' : 'Kozmetik & Bakım · Hacim ve cilt tipi'),
      photoTip: ru
        ? 'Сфотографируйте флакон/упаковку спереди, состав на обороте и срок годности (3:4)'
        : 'Ürün ön yüzü, arka içerik listesi ve son kullanma tarihini net çekin (3:4)',
      namePh: isSup
        ? (ru ? 'Напр: Морской коллаген + витамин C, 60 капсул' : 'Örn: Deniz Kolajeni + C Vitamini, 60 kapsül')
        : (ru ? 'Напр: Увлажняющая сыворотка с гиалуроновой кислотой, 50 мл' : 'Örn: Hyaluronik Asit Nemlendirici Serum, 50 ml'),
      descPh: ru ? 'Укажите состав, способ применения, объём/количество порций и срок годности…' : 'İçerik, kullanım şekli, hacim/porsiyon ve saklama koşullarını yazın…',
      attrs: isSup
        ? [
            { k: 'form', l: ru ? 'Форма выпуска' : 'Form', opts: ru ? ['Капсулы', 'Таблетки', 'Порошок', 'Капли / Сироп', 'Мармелад'] : ['Kapsül', 'Tablet', 'Toz', 'Damla / Şurup', 'Çiğneme'], filter: true },
            { k: 'goal', l: ru ? 'Назначение' : 'Amaç', opts: ru ? ['Иммунитет', 'Кожа и волосы', 'Суставы', 'Энергия', 'Сон и нервы'] : ['Bağışıklık', 'Cilt & Saç', 'Eklem', 'Enerji', 'Uyku'], multi: true, filter: true },
            { k: 'diet', l: ru ? 'Особенности' : 'Özellik', opts: ru ? ['Халяль', 'Без сахара', 'Без глютена', 'Веган'] : ['Helal', 'Şekersiz', 'Glutensiz', 'Vegan'], multi: true },
          ]
        : [
            { k: 'skin', l: ru ? 'Тип кожи / волос' : 'Cilt / Saç tipi', opts: ru ? ['Все типы', 'Сухая', 'Жирная', 'Комбинированная', 'Чувствительная'] : ['Tüm tipler', 'Kuru', 'Yağlı', 'Karma', 'Hassas'], multi: true, filter: true },
            { k: 'effect', l: ru ? 'Эффект' : 'Etki', opts: ru ? ['Увлажнение', 'Питание', 'Очищение', 'Антивозрастной', 'SPF-защита'] : ['Nemlendirme', 'Besleyici', 'Arındırıcı', 'Yaşlanma karşıtı', 'SPF koruma'], multi: true },
            { k: 'origin', l: ru ? 'Производство' : 'Menşei', opts: ru ? ['Турция', 'Корея', 'Франция', 'Италия'] : ['Türkiye', 'Kore', 'Fransa', 'İtalya'] },
          ],
      tags: [
        { key: 'organic', label: ru ? 'Натуральный состав' : 'Doğal içerik', color: '#15803D', bg: '#DCFCE7' },
        { key: 'halal', label: ru ? 'Халяль сертификат' : 'Helal sertifikalı', color: '#0369A1', bg: '#E0F2FE' },
        { key: 'tr', label: ru ? 'Сделано в Турции' : 'Türkiye üretimi', color: '#E5484D', bg: '#FDECEC' },
      ],
      priorityColors: [],
      defaultBox: { l: '14', w: '10', h: '8', unit: 'cm', weightHint: '0,25' },
    }
  }

  if (domain === 'home') {
    return {
      domain,
      badge: ru ? 'Дом и текстиль · Размеры и ткань' : 'Ev & Tekstil · Ölçü ve kumaş',
      photoTip: ru ? 'Покажите изделие в интерьере, крупный план ткани/фактуры и упаковку (3:4)' : 'İç mekanda görünüm, kumaş dokusu yakından ve paket fotoğrafı ekleyin (3:4)',
      namePh: ru ? 'Напр: Постельное бельё сатин 100% хлопок, Евро' : 'Örn: %100 Pamuk Saten Çift Kişilik Nevresim Takımı',
      descPh: ru ? 'Укажите комплектацию, плотность ткани, размеры и рекомендации по стирке…' : 'Set içeriği, kumaş dokuma sıklığı, ölçüler ve yıkama talimatını yazın…',
      attrs: [
        { k: 'mat', l: ru ? 'Материал' : 'Materyal', opts: ru ? ['100% Хлопок', 'Сатин', 'Ранфорс', 'Бамбук', 'Лён', 'Микрофибра', 'Керамика', 'Стекло'] : ['%100 Pamuk', 'Saten', 'Ranforce', 'Bambu', 'Keten', 'Mikrofiber', 'Seramik', 'Cam'], multi: true, filter: true },
        { k: 'care', l: ru ? 'Уход' : 'Bakım', opts: ru ? ['Стирка 30°C', 'Стирка 40°C', 'Ручная мойка', 'Посудомойка OK'] : ['30°C yıkama', '40°C yıkama', 'Elde yıkama', 'Bulaşık makinesi'] },
        { k: 'origin', l: ru ? 'Производство' : 'Menşei', opts: ru ? ['Турция (Денизли)', 'Турция (Бурса)', 'Турция'] : ['Türkiye (Denizli)', 'Türkiye (Bursa)', 'Türkiye'] },
      ],
      tags: [
        { key: 'cotton', label: ru ? '100% хлопок' : '%100 pamuk', color: '#22A55B', bg: '#E8F7EE' },
        { key: 'tr', label: ru ? 'Сделано в Турции' : 'Türkiye üretimi', color: '#E5484D', bg: '#FDECEC' },
        { key: 'gift', label: ru ? 'В подарочной коробке' : 'Hediyelik kutu', color: '#9333EA', bg: '#F3E8FF' },
      ],
      priorityColors: [],
      defaultBox: { l: '38', w: '28', h: '10', unit: 'cm', weightHint: '1,4' },
    }
  }

  if (domain === 'food' || domain === 'auto' || domain === 'cleaning') {
    const isFood = domain === 'food'
    const isAuto = domain === 'auto'
    return {
      domain,
      badge: isFood
        ? (ru ? 'Продукты из Турции · Вес и свежесть' : 'Gıda · Gramaj ve tazelik')
        : isAuto
          ? (ru ? 'Автозапчасти · OEM и совместимость' : 'Oto Parça · OEM ve uyumluluk')
          : (ru ? 'Уборка и дом · Объём и формула' : 'Temizlik · Hacim ve formül'),
      photoTip: ru ? 'Сфотографируйте упаковку спереди, этикетку со сроком/артикулом и содержимое (3:4)' : 'Paket ön yüzü, etiket/kod bilgisi ve ürün detayını net çekin (3:4)',
      namePh: isFood
        ? (ru ? 'Напр: Турецкий кофе мелкого помола, 500 г' : 'Örn: Geleneksel Türk Kahvesi Orta Kavrulmuş, 500 gr')
        : isAuto
          ? (ru ? 'Напр: Воздушный фильтр салона (OEM), комплект' : 'Örn: Polen & Hava Filtresi Seti (OEM)')
          : (ru ? 'Напр: Эко-гель для стирки цветного белья, 2 л' : 'Örn: Renkliler İçin Doğal Sıvı Çamaşır Deterjanı, 2 L'),
      descPh: ru ? 'Опишите характеристики, вес/объём и условия хранения или совместимость…' : 'Ürün özelliklerini, gramaj/hacim ve kullanım detaylarını yazın…',
      attrs: isFood
        ? [
            { k: 'diet', l: ru ? 'Состав' : 'İçerik', opts: ru ? ['Халяль', '100% натуральный', 'Без сахара', 'Без ГМО', 'Свежий урожай'] : ['Helal', '%100 Doğal', 'Şekersiz', 'GDO’suz', 'Yeni mahsul'], multi: true, filter: true },
            { k: 'pack', l: ru ? 'Упаковка' : 'Ambalaj', opts: ru ? ['Вакуум', 'Жестяная банка', 'Стекло', 'Подарочная коробка'] : ['Vakumlu', 'Teneke kutu', 'Cam kavanoz', 'Hediye kutusu'] },
          ]
        : isAuto
          ? [
              { k: 'type', l: ru ? 'Тип детали' : 'Parça tipi', opts: ru ? ['Оригинал (OEM)', 'Аналог премиум', 'Универсальная'] : ['Orijinal (OEM)', 'Premium muadil', 'Üniversal'], filter: true },
              { k: 'brand', l: ru ? 'Марка авто' : 'Araç markası', opts: ru ? ['Toyota', 'Hyundai / Kia', 'VW / Audi', 'BMW / Mercedes', 'Renault', 'Универсально'] : ['Toyota', 'Hyundai / Kia', 'VW / Audi', 'BMW / Mercedes', 'Renault', 'Üniversal'], multi: true, filter: true },
            ]
          : [
              { k: 'form', l: ru ? 'Форма' : 'Form', opts: ru ? ['Гель', 'Порошок', 'Спрей', 'Капсулы', 'Концентрат'] : ['Sıvı / Jel', 'Toz', 'Sprey', 'Kapsül', 'Konsantre'], filter: true },
              { k: 'eco', l: ru ? 'Свойства' : 'Özellik', opts: ru ? ['Гипоаллергенно', 'Эко-формула', 'Для детского белья', 'Без хлора'] : ['Hipoalerjenik', 'Doğal formül', 'Bebekler için', 'Klorsuz'], multi: true },
            ],
      tags: [
        { key: 'tr', label: ru ? 'Сделано в Турции' : 'Türkiye üretimi', color: '#E5484D', bg: '#FDECEC' },
        { key: 'organic', label: ru ? 'Проверено' : 'Onaylı ürün', color: '#15803D', bg: '#DCFCE7' },
      ],
      priorityColors: [],
      defaultBox: { l: '24', w: '18', h: '12', unit: 'cm', weightHint: '0,8' },
    }
  }

  // Default: clothing (Kadın / Erkek / Çocuk)
  return {
    domain: 'clothing',
    badge: ru ? 'Одежда · Размеры TR / RU / INT' : 'Giyim · TR / RU / INT beden',
    photoTip: ru
      ? 'Сфотографируйте вещь спереди, сзади и крупно ткань — обрежьте в 3:4, чтобы голова модели не обрезалась'
      : 'Ön, arka ve kumaş detayı ekleyin — 3:4 oranında kırparak modelin tamamını net gösterin',
    namePh: ru ? 'Напр: Женская хлопковая рубашка оверсайз' : 'Örn: Kadın pamuklu oversize gömlek',
    descPh: ru ? 'Мягкая хлопковая ткань, свободный крой, приятная к телу…' : 'Yumuşak pamuklu kumaştan, rahat kesimli, nefes alan doku…',
    attrs: [
      { k: 'mat', l: ru ? 'Материал' : 'Malzeme', opts: ru ? ['Хлопок', 'Полиэстер', 'Вискоза', 'Лён', 'Шерсть', 'Кожа', 'Замша', 'Деним', 'Эластан'] : ['Pamuk', 'Polyester', 'Viskon', 'Keten', 'Yün', 'Deri', 'Süet', 'Denim', 'Elastan'], multi: true, filter: true },
      { k: 'season', l: ru ? 'Сезон' : 'Sezon', opts: ru ? ['Весна/Лето', 'Осень/Зима', 'Всесезон'] : ['İlkbahar/Yaz', 'Sonbahar/Kış', 'Dört mevsim'], filter: true },
      { k: 'fit', l: ru ? 'Посадка' : 'Kalıp', opts: ru ? ['Облегающий', 'Обычный', 'Оверсайз'] : ['Dar', 'Normal', 'Oversize'], filter: true },
      { k: 'pattern', l: ru ? 'Узор' : 'Desen', opts: ru ? ['Однотонный', 'Клетка', 'Полоска', 'Цветочный', 'Принт'] : ['Düz', 'Ekose', 'Çizgili', 'Çiçekli', 'Baskılı'] },
      { k: 'sleeve', l: ru ? 'Рукав' : 'Kol boyu', opts: ru ? ['Без рукавов', 'Короткий рукав', 'Длинный рукав'] : ['Kolsuz', 'Kısa kol', 'Uzun kol'] },
      { k: 'origin', l: ru ? 'Производство' : 'Menşei', opts: ru ? ['Турция', 'Другая', 'Ручная работа'] : ['Türkiye', 'Diğer', 'El yapımı'] },
    ],
    tags: [
      { key: '%100 pamuk', label: ru ? '100% хлопок' : '%100 pamuk', color: '#22A55B', bg: '#E8F7EE' },
      { key: 'Türkiye üretimi', label: ru ? 'Сделано в Турции' : 'Türkiye üretimi', color: '#E5484D', bg: '#FDECEC' },
      { key: 'Gerçek deri', label: ru ? 'Натуральная кожа' : 'Gerçek deri', color: '#9A6A3A', bg: '#F6EEE6' },
      { key: 'El yapımı', label: ru ? 'Ручная работа' : 'El yapımı', color: '#B65AF7', bg: '#F5E9FE' },
      { key: 'Organik', label: ru ? 'Органик' : 'Organik', color: '#3E9B4F', bg: '#EAF6EC' },
    ],
    priorityColors: [],
    defaultBox: { l: '34', w: '24', h: '6', unit: 'cm', weightHint: '0,5' },
  }
}
