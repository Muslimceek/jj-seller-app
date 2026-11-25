export type Lang = 'tr' | 'ru'

export const LANG_META: { code: Lang; short: string; label: string }[] = [
  { code: 'tr', short: 'TR', label: 'Türkçe' },
  { code: 'ru', short: 'RU', label: 'Русский' },
]

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('jj_lang')
    if (saved === 'tr' || saved === 'ru') return saved
  } catch {}
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (/istanbul|turkey/i.test(tz)) return 'tr'
    if (typeof navigator !== 'undefined') {
      const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''])
        .map((s) => s.toLowerCase())
      if (langs.some((l) => l.startsWith('tr'))) return 'tr'
      if (langs.some((l) => l.startsWith('ru'))) return 'ru'
    }
    if (/moscow|almaty|bishkek|tashkent|samarkand|novosibirsk|yekaterinburg/i.test(tz)) return 'ru'
  } catch {}
  return 'tr'
}

export function saveLang(l: Lang) {
  try {
    localStorage.setItem('jj_lang', l)
  } catch {}
}

export interface Dict {
  tabs: { home: string; products: string; orders: string; analytics: string; profile: string }
  all: string
  search: string
  clear: string
  cancel: string
  save: string
  saved: string
  edit: string
  delete: string
  back: string
  continue: string
  apply: string
  change: string
  pieces: string
  noResults: string
  noResultsSub: string
  language: string
  notificationsNone: string
  notificationsTitle: string
  newOrderNotif: string
  copied: string
  copyAddress: string
  callBuyer: string
  openOrder: string
  city: string
  house: string
  apartment: string
  recipient: string
  routeFromTo: string
  inProcessing: string
  thisMonth: string
  txAll: string
  txIn: string
  txOut: string
  txCredited: string
  txPaidOut: string
  withdrawAll: string
  linkedAccount: string
  productAnalytics: string
  inCart: string
  topCities: string
  topSizes: string
  tapForStats: string
  countries: Record<'KZ' | 'RU' | 'KG' | 'UZ', string>
  fourCountriesLine: string
  swipeLangHint: string
  cdek: {
    title: string
    sub: string
    apiReady: string
    tabQr: string
    tabBarcode: string
    trackCode: string
    waybill: string
    copyTrack: string
    scanHint: string
    code128Note: string
    fullScreen: string
    fullTitle: string
    downloadLabel: string
    downloaded: string
    apiData: string
  }
  editProfile: {
    storeSection: string
    contactsSection: string
    geoSection: string
    geoSub: string
    securitySection: string
    shopName: string
    shopPh: string
    cityDistrict: string
    cityDistrictPh: string
    verified: string
    deleteConfirmTitle: string
    deleteConfirmSub: string
    passTitle: string
    passCur: string
    passNew: string
  }
  home: {
    welcome: string
    storeSuffix: string
    verified: string
    balance: string
    available: string
    withdraw: string
    docsTitle: string
    docsSub: string
    quickTitle: string
    addProduct: string
    pendingOrders: string
    inProgress: string
    lowStock: string
    delivered: string
    salesPerf: string
    liveMonitor: string
    today: string
    last7d: string
    ordersLbl: string
    todaySales: string
    weekSales: string
    recentOrders: string
    seeAll: string
    finance: string
    shippingTo: string
  }
  products: {
    title: string
    searchPh: string
    kpiTotal: string
    kpiActive: string
    kpiLow: string
    tabAll: string
    tabActive: string
    tabLow: string
    tabHidden: string
    active: string
    hidden: string
    stock: string
    variants: string
    lowBadge: string
    hide: string
    show: string
    hiddenToast: string
    shownToast: string
    addBtn: string
    sortNewest: string
    sortStock: string
    sortTitle: string
    actions: string
    duplicate: string
    share: string
    copiedToast: string
    detailTitle: string
    stockHistory: string
    stockHistoryEmpty: string
    detailStatus: string
    detailPrice: string
    detailTotalStock: string
    detailVariantsCnt: string
    detailFullPhoto: string
    detailCropHint: string
    detailLastMove: string
  }
  orders: {
    title: string
    searchPh: string
    empty: string
    emptySub: string
    tabs: { all: string; new: string; processing: string; shipped: string; delivered: string; cancelled: string }
    status: { new: string; processing: string; shipped: string; delivered: string; cancelled: string }
    confirm: string
    ship: string
    confirmedToast: string
    shippedToast: string
    detailTitle: string
    deliveryAddr: string
    cargoAddr: string
    cargoHint: string
    orderAmount: string
    delivery: string
    total: string
    payment: string
    paid: string
    refunded: string
    customerInfo: string
    timeline: string
    created: string
    paidRef: string
  }
  analytics: {
    title: string
    statsTitle: string
    report: string
    periods: Record<'Gün' | 'Hafta' | 'Ay' | 'Çeyrek', string>
    revenue: string
    orders: string
    avgOrder: string
    conversion: string
    prev: string
    views: string
    currentPeriod: string
    prevPeriod: string
    tapHint: string
    funnelTitle: string
    funnelViews: string
    funnelCart: string
    funnelOrders: string
    popularTitle: string
    sold: string
    stock: string
  }
  profile: {
    title: string
    storeActive: string
    statProducts: string
    statRating: string
    statBalance: string
    secBusiness: string
    secApp: string
    secSupport: string
    finance: string
    documents: string
    brandDocs: string
    reviews: string
    settings: string
    support: string
    faq: string
    rules: string
    agreements: string
    logout: string
    logoutToast: string
    editTitle: string
    name: string
    surname: string
    phone: string
    email: string
    changePhone: string
    changeEmail: string
    unverified: string
    changePass: string
    deleteAcc: string
    saveChanges: string
  }
  finance: {
    title: string
    currentBalance: string
    linkCard: string
    linkCardSub: string
    requestPayout: string
    history: string
    withdrawTitle: string
    amount: string
    amountPh: string
    selectBank: string
    sendReq: string
    reqSent: string
    enterAmount: string
    pickBank: string
    payoutCurrency: string
    addCardBtn: string
    addCardTitle: string
    bankNameLbl: string
    bankNamePh: string
    cardNumLbl: string
    cardNumPh: string
    cardAdded: string
    cardDeleted: string
    noCards: string
    rateNote: string
  }
  sub: {
    docsList: string[]
    brandDocsReqs: string[]
    brandDocsWarn: string
    rulesSections: { h: string; p: string }[]
    faqs: [string, string][]
    agreements: string[]
    agreementHeading: string
    agreementBody: string
  }
  pf: {
    newProduct: string
    editProduct: string
    stepOf: string
    draft: string
    draftSaved: string
    steps: [string, string, string, string, string, string]
    heads: [string, string, string, string, string, string]
    subs: [string, string, string, string, string, string]
    nextPrefix: string
    publish: string
    saveChanges: string
    publishedToast: string
    catSearchPh: string
    selectedCat: string
    sizeAuto: string
    recent: string
    allCats: string
    sections: string
    subCount: string
    directPick: string
    subPickHint: string
    noCatTitle: string
    noCatSub: string
    photoTitle: string
    photoGreat: string
    photoRec: string
    dropTitle: string
    dropSub: string
    fromGallery: string
    camera: string
    demoPhotos: string
    demoAdded: string
    cover: string
    makeCover: string
    moveLeft: string
    moveRight: string
    photoGuide: string
    cropBtn: string
    cropTitle: string
    cropSub: string
    cropRatio34: string
    cropRatio11: string
    cropRatioFree: string
    cropFitFull: string
    cropFreeHint: string
    cropTopFocus: string
    cropZoom: string
    cropRotate: string
    cropApply: string
    cropSaved: string
    cropSafeZone: string
    videoTitle: string
    videoSub: string
    addVideo: string
    autoTranslate: string
    prodName: string
    prodNamePh: string
    suggestTitle: string
    titleApplied: string
    brand: string
    brandPh: string
    brandless: string
    desc: string
    descPh: string
    aiDesc: string
    aiDescToast: string
    attrsTitle: string
    attrsFilled: string
    filterBadge: string
    multiBadge: string
    tagsTitle: string
    tagsSub: string
    colorsTitle: string
    colorsSub: string
    colorsSelected: string
    colorSearchPh: string
    colorPaletteBtn: string
    colorPaletteTitle: string
    colorCustomNamePh: string
    colorAddBtn: string
    colorShowMore: string
    colorShowLess: string
    sizesTitle: string
    sizesAutoSub: string
    oneSizeNote: string
    sizesAutoTip: string
    popularSizes: string
    sizeSearchAddPh: string
    sizeAddCustom: string
    sizeCustomAdded: string
    showTable: string
    hideTable: string
    sizeLessonTitle: string
    sizeLessonSteps: [string, string, string]
    sizeTapRowHint: string
    otherTables: string
    variantsReady: string
    oneColor: string
    colorWord: string
    sizeWord: string
    priceTitle: string
    priceSub: string
    quickDiscount: string
    noDiscount: string
    discountLbl: string
    discountedPrice: string
    buyerPrice: string
    rateLbl: string
    stockTitle: string
    bulkQuick: string
    bulkCustom: string
    skuHint: string
    logisticsTitle: string
    stockUnit: string
    stockUnits: string[]
    weight: string
    boxTitle: string
    boxSub: string
    boxLen: string
    boxWid: string
    boxHei: string
    unitCm: string
    unitMm: string
    minOrder: string
    maxOrder: string
    minMaxHelpTitle: string
    minHelpText: string
    maxHelpText: string
    previewTitle: string
    noPrice: string
    noName: string
    sumVariants: string
    sumStock: string
    sumSellerPrice: string
    qualityTitle: string
    qGreat: string
    qGood: string
    qLow: string
    qGreatSub: string
    qLowSub: string
    fillBtn: string
    errCat: string
    errPhoto: string
    errName: string
    errSize: string
    errPrice: string
    errStock: string
    hideProduct: string
    hideProductSub: string
    deleteProduct: string
    originOpts: [string, string, string]
    sizeTableNames: Record<string, string>
    colorNames: Record<string, string>
    tagNames: Record<string, string>
    catNames: Record<string, string>
    attrLabels: Record<string, string>
    attrOpts: Record<string, string[]>
  }
}

const CAT_RU: Record<string, string> = {
  'Kadın': 'Женщинам',
  'Elbiseler': 'Платья',
  'Kadın Dış Giyim': 'Женская верхняя одежда',
  'Kadın Bluz ve Tişörtleri': 'Блузы и футболки',
  'Bluz ve Gömlek': 'Блузы и рубашки',
  'Kadın Pantolon ve Kotları': 'Брюки и джинсы',
  'Kot Pantolon': 'Джинсы',
  'Kadın Etek': 'Юбки',
  'Kadın Triko': 'Трикотаж',
  'Erkek': 'Мужчинам',
  'Erkek Tişört': 'Мужские футболки',
  'Erkek Gömlek': 'Мужские рубашки',
  'Erkek Pantolon': 'Мужские брюки',
  'Erkek Dış Giyim': 'Мужская верхняя одежда',
  'Erkek Takım Elbise': 'Костюмы',
  'Çocuk': 'Детям',
  'Kız Çocuk': 'Девочкам',
  'Erkek Çocuk': 'Мальчикам',
  'Bebek': 'Малышам',
  'Kadın ayakkabısı': 'Женская обувь',
  'Loafer': 'Лоферы',
  'Babet': 'Балетки',
  'Sneaker': 'Кроссовки',
  'Bot': 'Ботинки',
  'Çizme': 'Сапоги',
  'Topuklu Ayakkabı': 'Туфли на каблуке',
  'Erkek ayakkabısı': 'Мужская обувь',
  'Klasik': 'Классика',
  'Çocuk ayakkabısı': 'Детская обувь',
  'Kız Çocuk Ayakkabı': 'Обувь для девочек',
  'Erkek Çocuk Ayakkabı': 'Обувь для мальчиков',
  'Çantalar ve Aksesuarlar': 'Сумки и аксессуары',
  'Kadın Çanta': 'Женские сумки',
  'Cüzdan': 'Кошельки',
  'Kemer': 'Ремни',
  'Şal ve Eşarp': 'Шали и платки',
  'Güzellik ve Bakım': 'Красота и уход',
  'Cilt Bakımı': 'Уход за кожей',
  'Makyaj': 'Макияж',
  'Parfüm': 'Парфюмерия',
  'Diyet takviyeleri ve vitaminler': 'Витамины и БАДы',
  'Vitaminler': 'Витамины',
  'Mineraller': 'Минералы',
  'Ev ve Yaşam': 'Дом и уют',
  'Ev Tekstili': 'Домашний текстиль',
  'Mutfak': 'Кухня',
  'Dekorasyon': 'Декор',
  'Takılar': 'Украшения',
  'Kolye': 'Колье',
  'Gıda Ürünleri': 'Продукты питания',
  'Oto Yedek Parça': 'Автозапчасти',
  'Ev Temizlik Ürünleri': 'Товары для уборки',
}

const COLOR_RU: Record<string, string> = {
  'Siyah': 'Чёрный',
  'Beyaz': 'Белый',
  'Gri': 'Серый',
  'Koyu gri': 'Тёмно-серый',
  'Açık gri': 'Светло-серый',
  'Melanj': 'Меланж',
  'Kırmızı': 'Красный',
  'Bordo': 'Бордовый',
  'Pembe': 'Розовый',
  'Pudra': 'Пудровый',
  'Fuşya': 'Фуксия',
  'Turuncu': 'Оранжевый',
  'Kahverengi': 'Коричневый',
  'Haki': 'Хаки',
  'Lacivert': 'Тёмно-синий',
}

const COLOR_TR: Record<string, string> = Object.fromEntries(Object.keys(COLOR_RU).map((k) => [k, k]))

const TAG_RU: Record<string, string> = {
  'Gerçek deri': 'Натуральная кожа',
  'El yapımı': 'Ручная работа',
  '%100 pamuk': '100% хлопок',
  'Su geçirmez': 'Водоотталкивающий',
  'Türkiye üretimi': 'Сделано в Турции',
  'Organik': 'Органик',
}
const TAG_TR: Record<string, string> = Object.fromEntries(Object.keys(TAG_RU).map((k) => [k, k]))

const TR: Dict = {
  tabs: { home: 'Ana Sayfa', products: 'Ürünler', orders: 'Siparişler', analytics: 'Analiz', profile: 'Profil' },
  all: 'Tümü',
  search: 'Ara',
  clear: 'Temizle',
  cancel: 'İptal',
  save: 'Kaydet',
  saved: 'Kaydedildi',
  edit: 'Düzenle',
  delete: 'Sil',
  back: 'Geri',
  continue: 'Devam',
  apply: 'Uygula',
  change: 'Değiştir',
  pieces: 'adet',
  noResults: 'Sonuç bulunamadı',
  noResultsSub: 'Aramanızı veya filtrelerinizi değiştirip tekrar deneyin',
  language: 'Dil',
  notificationsNone: 'Yeni bildirim yok',
  notificationsTitle: 'Sipariş bildirimleri',
  newOrderNotif: 'Yeni sipariş geldi',
  copied: 'Kopyalandı',
  copyAddress: 'Adresi kopyala',
  callBuyer: 'Ara',
  openOrder: 'Siparişi aç',
  city: 'Şehir',
  house: 'Adres / Bina',
  apartment: 'Daire',
  recipient: 'Alıcı',
  routeFromTo: 'Teslimat rotası',
  inProcessing: 'Beklemede',
  thisMonth: 'Bu ay gelir',
  txAll: 'Tümü',
  txIn: 'Gelirler',
  txOut: 'Çekimler',
  txCredited: 'Hesaba geçti',
  txPaidOut: 'Ödendi',
  withdrawAll: 'Tümü',
  linkedAccount: 'Bağlı banka hesabı',
  productAnalytics: 'Ürün analizi',
  inCart: 'Sepette',
  topCities: 'Sipariş gelen şehirler',
  topSizes: 'En çok satılan bedenler',
  tapForStats: 'Detay için dokunun',
  countries: { KZ: 'Kazakistan', RU: 'Rusya', KG: 'Kırgızistan', UZ: 'Özbekistan' },
  fourCountriesLine: 'Kazakistan · Rusya · Kırgızistan · Özbekistan',
  swipeLangHint: 'Sola / sağa kaydırarak dili değiştirin',
  cdek: {
    title: 'CDEK Kargo Kodu',
    sub: 'CDEK API’den otomatik alındı',
    apiReady: 'API · Hazır',
    tabQr: 'QR Kod',
    tabBarcode: 'Barkod',
    trackCode: 'CDEK Takip Kodu',
    waybill: 'İrsaliye',
    copyTrack: 'Kopyala',
    scanHint: 'CDEK şubesinde taratın veya pakete yapıştırın',
    code128Note: 'Code 128 · Barkod okuyucu uyumlu',
    fullScreen: 'Tam ekran',
    fullTitle: 'CDEK Teslimat Kodu',
    downloadLabel: 'Etiketi indir',
    downloaded: 'CDEK etiketi indirildi',
    apiData: 'CDEK API verisi',
  },
  editProfile: {
    storeSection: 'Mağaza bilgileri',
    contactsSection: 'İletişim bilgileri',
    geoSection: 'Satış yapılan 4 ülke',
    geoSub: 'Türkiye’den tüm 4 ülkeye doğrudan satış',
    securitySection: 'Güvenlik',
    shopName: 'Mağaza adı',
    shopPh: 'Örn: Lale Boutique',
    cityDistrict: 'Şehir / Semt (Türkiye)',
    cityDistrictPh: 'İstanbul · Laleli',
    verified: 'Doğrulandı',
    deleteConfirmTitle: 'Hesabı silmek istiyor musunuz?',
    deleteConfirmSub: 'Mağaza ve sipariş geçmişi kalıcı olarak kaldırılır.',
    passTitle: 'Şifreyi değiştir',
    passCur: 'Mevcut şifre',
    passNew: 'Yeni şifre (6+ karakter)',
  },
  home: {
    welcome: 'Hoş geldiniz,',
    storeSuffix: 'Mağazası',
    verified: 'Aktif mağaza',
    balance: 'Bakiye',
    available: 'çekilebilir',
    withdraw: 'Para çek',
    docsTitle: 'Mağaza doğrulaması',
    docsSub: 'Pasaport, lisans ve banka bilgilerini yükleyin',
    quickTitle: 'Hızlı işlemler',
    addProduct: 'Ürün ekle',
    pendingOrders: 'Yeni sipariş',
    inProgress: 'Hazırlanan',
    lowStock: 'Az stok',
    delivered: 'Teslim edildi',
    salesPerf: 'Satış performansı',
    liveMonitor: 'Canlı analiz',
    today: 'Bugün',
    last7d: 'Son 7 gün',
    ordersLbl: 'Siparişler',
    todaySales: 'Bugünkü ciro',
    weekSales: 'Haftalık ciro',
    recentOrders: 'Son siparişler',
    seeAll: 'Tümü',
    finance: 'Finans',
    shippingTo: 'Gönderim',
  },
  products: {
    title: 'Ürünlerim',
    searchPh: 'Ürün adı ile ara…',
    kpiTotal: 'Toplam',
    kpiActive: 'Satışta',
    kpiLow: 'Az stok',
    tabAll: 'Tümü',
    tabActive: 'Satışta',
    tabLow: 'Az stok',
    tabHidden: 'Gizli',
    active: 'Aktif',
    hidden: 'Gizli',
    stock: 'Stok',
    variants: 'varyant',
    lowBadge: 'Az stok',
    hide: 'Gizle',
    show: 'Yayınla',
    hiddenToast: 'Ürün gizlendi',
    shownToast: 'Ürün tekrar satışta',
    addBtn: 'Yeni ürün ekle',
    sortNewest: 'Sıralama: En yeni',
    sortStock: 'Sıralama: Az stok önce',
    sortTitle: 'Sıralama: A–Z',
    actions: 'İşlemler',
    duplicate: 'Kopyala',
    share: 'Paylaş',
    copiedToast: 'Kopyalandı',
    detailTitle: 'Ürün Detayları',
    stockHistory: 'Stok geçmişi',
    stockHistoryEmpty: 'Son hareket: +5 adet eklendi',
    detailStatus: 'Durum',
    detailPrice: 'Fiyat',
    detailTotalStock: 'Toplam stok',
    detailVariantsCnt: 'Varyant',
    detailFullPhoto: '3:4 tam görünüm',
    detailCropHint: 'Görsel kesilmeden 3:4 oranında gösterilir',
    detailLastMove: 'Stok hareketi',
  },
  orders: {
    title: 'Siparişler',
    searchPh: 'Sipariş no veya ürün ara…',
    empty: 'Bu durumda sipariş yok',
    emptySub: 'Yeni siparişler geldiğinde burada görünecek',
    tabs: { all: 'Tümü', new: 'Yeni', processing: 'Hazırlanıyor', shipped: 'Kargoda', delivered: 'Teslim', cancelled: 'İptal' },
    status: { new: 'Yeni', processing: 'Hazırlanıyor', shipped: 'Kargoda', delivered: 'Teslim edildi', cancelled: 'İptal edildi' },
    confirm: 'Onayla',
    ship: 'Kargoya ver',
    confirmedToast: 'Sipariş onaylandı',
    shippedToast: 'Kargoya verildi olarak işaretlendi',
    detailTitle: 'Sipariş',
    deliveryAddr: 'Teslimat Adresi',
    cargoAddr: 'Kargo teslim adresi',
    cargoHint: 'Hazırladığınız siparişi bu adrese gönderin.',
    orderAmount: 'Sipariş tutarı',
    delivery: 'Teslimat',
    total: 'Toplam',
    payment: 'Ödeme Yöntemi',
    paid: 'Ödendi',
    refunded: 'Ücret iadesi',
    customerInfo: 'Müşteri Bilgileri',
    timeline: 'Sipariş geçmişi',
    created: 'Sipariş oluşturuldu',
    paidRef: 'Ödeme başarılı (tolepay)',
  },
  analytics: {
    title: 'Analiz',
    statsTitle: 'Satış istatistikleri',
    report: 'Rapor',
    periods: { 'Gün': 'Gün', 'Hafta': 'Hafta', 'Ay': 'Ay', 'Çeyrek': 'Çeyrek' },
    revenue: 'Ciro',
    orders: 'Siparişler',
    avgOrder: 'Ort. sepet',
    conversion: 'Dönüşüm',
    prev: 'Önceki',
    views: 'görüntüleme',
    currentPeriod: 'Bu dönem',
    prevPeriod: 'Önceki',
    tapHint: 'Detay için sütuna dokunun',
    funnelTitle: 'Satış hunisi',
    funnelViews: 'Görüntüleme',
    funnelCart: 'Sepete ekleme',
    funnelOrders: 'Sipariş',
    popularTitle: 'En popüler ürünler',
    sold: 'satış',
    stock: 'Stok',
  },
  profile: {
    title: 'Profil',
    storeActive: 'Aktif satıcı',
    statProducts: 'Ürün',
    statRating: 'Puan',
    statBalance: 'Bakiye',
    secBusiness: 'Mağaza ve finans',
    secApp: 'Uygulama ve dil',
    secSupport: 'Destek ve kurallar',
    finance: 'Finans',
    documents: 'Mağaza belgeleri',
    brandDocs: 'Marka belgeleri',
    reviews: 'Değerlendirmeler',
    settings: 'Bildirim ayarları',
    support: 'Destek hattı',
    faq: 'Sıkça sorulan sorular',
    rules: 'Ürün listeleme kuralları',
    agreements: 'Kullanıcı sözleşmesi',
    logout: 'Çıkış Yap',
    logoutToast: 'Çıkış yapıldı',
    editTitle: 'Profili Düzenle',
    name: 'Ad',
    surname: 'Soyad',
    phone: 'Telefon',
    email: 'E-posta',
    changePhone: 'Değiştir',
    changeEmail: 'Değiştir',
    unverified: 'Doğrulanmadı',
    changePass: 'Şifreyi Değiştir',
    deleteAcc: 'Hesabı Sil',
    saveChanges: 'Değişiklikleri Kaydet',
  },
  finance: {
    title: 'Finans',
    currentBalance: 'Güncel bakiye',
    linkCard: 'Banka kartı bağla',
    linkCardSub: 'Para çekmek için kart veya IBAN ekleyin',
    requestPayout: 'Ödeme talep et',
    history: 'İşlem geçmişi',
    withdrawTitle: 'Para Çekme',
    amount: 'Çekim tutarı',
    amountPh: 'Tutarı girin',
    selectBank: 'Kartlarım ve IBAN hesaplarım',
    sendReq: 'Çekim talebi gönder',
    reqSent: 'Çekim talebiniz alındı',
    enterAmount: 'Çekim tutarını girin',
    pickBank: 'Bir kart veya IBAN seçin',
    payoutCurrency: 'Çekim para birimi',
    addCardBtn: 'Yeni kart / IBAN ekle',
    addCardTitle: 'Kart veya IBAN ekle',
    bankNameLbl: 'Banka adı',
    bankNamePh: 'Örn: Garanti BBVA, Ziraat, İş Bankası',
    cardNumLbl: 'IBAN veya kart numarası',
    cardNumPh: 'TR00 0000 0000 0000 0000 0000 00',
    cardAdded: 'Kart eklendi',
    cardDeleted: 'Kart silindi',
    noCards: 'Henüz kayıtlı kart yok — aşağıdan ekleyin',
    rateNote: 'Güncel kur ile otomatik dönüştürülür',
  },
  sub: {
    docsList: ['Pasaport / Kimlik', 'Ticaret Lisansı', 'Banka / IBAN'],
    brandDocsReqs: [
      'Satın alma belgeleri: üreticiden fatura, tedarik sözleşmesi, resmi distribütörden irsaliyeler',
      'Ürünün orijinalliğini ve menşeini kanıtlayan belgeler',
      'İthalat ve satışın yasal olduğunu gösteren belgeler',
      'Uygunluk ve etiketleme belgeleri',
    ],
    brandDocsWarn: 'Türkiye’deki bir mağazadan alınmış tek bir fiş yeterli değildir.',
    rulesSections: [
      { h: '1. Genel kurallar', p: 'Platformda yalnızca orijinal, yasal olarak satılabilen ve açıklamasıyla birebir uyumlu ürünler listelenebilir.' },
      { h: '2. Yasaklı ürünler', p: 'Silah, ilaç, alkol, tütün ürünleri, sahte belgeler ve mevzuata aykırı ürünler listelenemez.' },
      { h: '3. Belge gerektiren markalar', p: 'Bazı markalar yalnızca belge onayıyla satılabilir. Belgeler onaylanana kadar ürünler moderasyonda kalır.' },
    ],
    faqs: [
      ['Platformda nasıl satıcı olunur?', 'JJ Seller uygulamasında kayıt olun, mağaza belgelerinizi yükleyin ve ürün eklemeye başlayın.'],
      ['Sipariş durumu nasıl takip edilir?', '«Siparişler» bölümünde her siparişin güncel durumunu ve teslimat adresini görebilirsiniz.'],
      ['Uygun beden nasıl seçilir?', 'Ürün kartına beden tablosu ekleyin — TR / RU / INT sistemleri otomatik eşleşir.'],
    ],
    agreements: ['Gizlilik politikası', 'İade politikası', 'Kişisel verilerin korunması', 'Ödeme ve iade', 'Teslimat koşulları', 'Üyelik sözleşmesi'],
    agreementHeading: 'GİZLİLİK POLİTİKASI',
    agreementBody: 'İşbu Gizlilik Politikası, JJ Market mobil uygulamasını kullanan satıcıların kişisel verilerinin korunması ve işlenmesine ilişkin esasları belirler.',
  },
  pf: {
    newProduct: 'Yeni ürün',
    editProduct: 'Ürünü düzenle',
    stepOf: 'Adım',
    draft: 'Taslak',
    draftSaved: 'Taslak kaydedildi',
    steps: ['Kategori', 'Fotoğraflar', 'Bilgiler', 'Varyantlar', 'Fiyat & Stok', 'Önizleme'],
    heads: ['Ürün ne?', 'Fotoğraflar', 'Ürün bilgileri', 'Renk ve beden', 'Fiyat ve stok', 'Kontrol ve yayın'],
    subs: [
      'Doğru kategori, ürünün aramada bulunmasını ve doğru beden tablosunu sağlar.',
      'İlk fotoğraf kapak olur. Yüklediğiniz fotoğrafı 3:4 oranında kırpıp hizalayın.',
      'Ad ve özellikler alıcının aradığı kelimelerle eşleşmeli.',
      'Renkleri paletten seçin, bedenleri listeden veya kendiniz ekleyin.',
      'Fiyatı ₺ TRY veya $ USD girin, stok ve kargo kutu ölçülerini belirleyin.',
      'Kart kalitesini kontrol edin ve moderasyona gönderin.',
    ],
    nextPrefix: 'Devam',
    publish: 'Moderasyona gönder',
    saveChanges: 'Değişiklikleri kaydet',
    publishedToast: 'Ürün moderasyona gönderildi',
    catSearchPh: 'Ne satıyorsunuz? Örn: gömlek, loafer, kot…',
    selectedCat: 'Seçilen kategori',
    sizeAuto: 'Beden',
    recent: 'Son kullanılanlar',
    allCats: 'Tüm kategoriler',
    sections: 'bölüm',
    subCount: 'alt kategori',
    directPick: 'Doğrudan seçim',
    subPickHint: 'birini seçin',
    noCatTitle: 'için sonuç bulunamadı',
    noCatSub: 'Popüler kategorilerden birini deneyin:',
    photoTitle: 'Ürün fotoğrafları',
    photoGreat: 'Harika!',
    photoRec: 'önerilen: 3+',
    dropTitle: 'Ürün fotoğraflarını ekleyin',
    dropSub: 'Yükledikten sonra 3:4 çerçevede kırpın — modelin başı ve ürün kesilmeden net görünsün.',
    fromGallery: 'Galeriden seç',
    camera: 'Kamera',
    demoPhotos: 'Hızlı test için örnek fotoğraf ekle',
    demoAdded: 'Örnek fotoğraflar eklendi',
    cover: 'Kapak',
    makeCover: 'Kapak fotoğrafı yap',
    moveLeft: 'Sola taşı',
    moveRight: 'Sağa taşı',
    photoGuide: 'Fotoğraf çerçeve rehberi',
    cropBtn: 'Kırp / Hizala',
    cropTitle: 'Fotoğrafı kırp ve hizala',
    cropSub: 'Fotoğrafı sürükleyin — baş ve ürün tamamen çerçevede kalsın',
    cropRatio34: '3:4',
    cropRatio11: '1:1',
    cropRatioFree: 'Serbest',
    cropFitFull: 'Sığdır',
    cropFreeHint: 'Köşelerden veya kenarlardan tutup istediğiniz gibi kırpın',
    cropTopFocus: 'Üst (yüz)',
    cropZoom: 'Yakınlaştır',
    cropRotate: 'Döndür',
    cropApply: 'Kırpmayı uygula',
    cropSaved: 'Fotoğraf 3:4 oranında kaydedildi',
    cropSafeZone: 'Güvenli vitrin alanı (3:4)',
    videoTitle: 'Ürün videosu',
    videoSub: 'İsteğe bağlı · en fazla 3 video · 60 sn · 150 MB',
    addVideo: 'Video ekle',
    autoTranslate: 'Ürün adı ve açıklaması alıcılar için TR · RU dillerine otomatik çevrilir.',
    prodName: 'Ürün adı',
    prodNamePh: 'Örn: Kadın pamuklu oversize gömlek',
    suggestTitle: 'Kategoriden başlık öner',
    titleApplied: 'Başlık önerisi uygulandı',
    brand: 'Marka',
    brandPh: 'Marka seçin veya arayın',
    brandless: 'Markasız',
    desc: 'Açıklama',
    descPh: 'Yumuşak pamuklu kumaştan, rahat kesimli…',
    aiDesc: 'Otomatik açıklama oluştur',
    aiDescToast: 'Açıklama oluşturuldu',
    attrsTitle: 'Özellikler',
    attrsFilled: 'dolduruldu · filtrelerde görünürlüğü arttırır',
    filterBadge: 'Filtre',
    multiBadge: 'çoklu seçim',
    tagsTitle: 'Öne çıkan etiketler',
    tagsSub: 'Alıcı kartında rozet olarak görünür',
    colorsTitle: 'Renkler',
    colorsSub: 'Arayın veya paletten kendi tonunuzu seçin',
    colorsSelected: 'renk seçildi',
    colorSearchPh: 'Renk ara (örn: siyah, bordo, bej)…',
    colorPaletteBtn: 'Palet',
    colorPaletteTitle: 'Renk paletinden özel ton seçin',
    colorCustomNamePh: 'Renk adı (örn: Zümrüt, Krem)',
    colorAddBtn: 'Rengi ekle',
    colorShowMore: 'Tüm renkler',
    colorShowLess: 'Daralt',
    sizesTitle: 'Bedenler',
    sizesAutoSub: 'tablosu · kategoriye göre otomatik',
    oneSizeNote: 'Bu kategoride beden yok — ürün «Tek beden» olarak satılır.',
    sizesAutoTip: 'TR / RU / INT sistemleri otomatik eşleşir',
    popularSizes: 'Popüler bedenler',
    sizeSearchAddPh: 'Beden ara veya yaz (örn: 46, 37.5, 2XL)',
    sizeAddCustom: 'Ekle',
    sizeCustomAdded: 'Özel beden eklendi',
    showTable: 'Beden rehberi ve tablosu',
    hideTable: 'Beden rehberini gizle',
    sizeLessonTitle: 'Beden tablosu nasıl okunur?',
    sizeLessonSteps: [
      '1. Etiketteki TR / EU bedeninizi seçin',
      '2. Alıcılar kendi alışık olduğu RU / INT bedenini otomatik görür',
      '3. Tabloda herhangi bir satıra dokunarak bedeni hemen seçebilirsiniz',
    ],
    sizeTapRowHint: 'Seçmek için satıra dokunun',
    otherTables: 'Diğer tablolar:',
    variantsReady: 'varyant hazır',
    oneColor: 'Tek renk',
    colorWord: 'renk',
    sizeWord: 'beden',
    priceTitle: 'Satış fiyatı',
    priceSub: '₺ TRY veya $ USD girin · fiyatlar otomatik hesaplanır',
    quickDiscount: 'Hızlı indirim:',
    noDiscount: 'Yok',
    discountLbl: 'İndirim (%)',
    discountedPrice: 'İndirimli fiyat',
    buyerPrice: 'Dönüştürülen fiyat',
    rateLbl: 'Kur',
    stockTitle: 'Stok yönetimi',
    bulkQuick: 'Hepsine tek tıkla:',
    bulkCustom: 'Özel adet',
    skuHint: 'Stok kodu (SKU) her varyant için otomatik oluşturulur.',
    logisticsTitle: 'Kargo, kutu ölçüsü ve sipariş',
    stockUnit: 'Stok birimi',
    stockUnits: ['Adet', 'Çift', 'Paket', 'Takım', 'Düzine', 'kg', 'gram', 'metre', 'cm'],
    weight: 'Ağırlık (kg)',
    boxTitle: 'Kargo kutu ölçüleri',
    boxSub: 'Kargo hacim hesabı için paket ölçüsünü girin',
    boxLen: 'Uzunluk',
    boxWid: 'Genişlik',
    boxHei: 'Yükseklik',
    unitCm: 'cm',
    unitMm: 'mm',
    minOrder: 'Min. sipariş',
    maxOrder: 'Maks. sipariş',
    minMaxHelpTitle: 'Min. ve Maks. sipariş ne işe yarar?',
    minHelpText: 'Min. sipariş — müşterinin tek seferde alabileceği en az adet (tekli satış için 1, seri/paket için 3–5).',
    maxHelpText: 'Maks. sipariş — tek siparişte alınabilecek üst sınır; stoğunuzun tek kişi tarafından aniden bitmesini önler.',
    previewTitle: 'Alıcı vitrin önizlemesi',
    noPrice: 'Fiyat girilmedi',
    noName: 'Ürün adı girilmedi',
    sumVariants: 'Varyant',
    sumStock: 'Toplam stok',
    sumSellerPrice: 'Satıcı fiyatı',
    qualityTitle: 'Kart kalitesi',
    qGreat: 'Mükemmel',
    qGood: 'İyi',
    qLow: 'Eksikler var',
    qGreatSub: 'Harika — ürün aramada üst sıralarda görünür',
    qLowSub: 'Eksik maddelere dokunup hızlıca tamamlayın',
    fillBtn: 'Doldur',
    errCat: 'Kategori seçin',
    errPhoto: 'En az 1 fotoğraf ekleyin',
    errName: 'Ürün adını girin',
    errSize: 'En az 1 beden seçin',
    errPrice: 'Fiyat girin',
    errStock: 'Stok adedini girin',
    hideProduct: 'Ürünü gizle',
    hideProductSub: 'Alıcılar ürünü görmez, stok korunur',
    deleteProduct: 'Ürünü sil',
    originOpts: ['Türkiye', 'Diğer', 'El yapımı'],
    sizeTableNames: {
      women: 'Kadın giyim',
      men: 'Erkek giyim',
      jeans: 'Jean / pantolon',
      shoes: 'Ayakkabı',
      kids: 'Çocuk giyim',
      one: 'Tek beden',
    },
    colorNames: COLOR_TR,
    tagNames: TAG_TR,
    catNames: Object.fromEntries(Object.keys(CAT_RU).map((k) => [k, k])),
    attrLabels: {
      mat: 'Malzeme',
      season: 'Sezon',
      fit: 'Kalıp',
      pattern: 'Desen',
      sleeve: 'Kol boyu',
      origin: 'Menşei',
    },
    attrOpts: {
      mat: ['Pamuk', 'Polyester', 'Viskon', 'Keten', 'Yün', 'Deri', 'Süet', 'Denim', 'Elastan'],
      season: ['İlkbahar/Yaz', 'Sonbahar/Kış', 'Dört mevsim'],
      fit: ['Dar', 'Normal', 'Oversize'],
      pattern: ['Düz', 'Ekose', 'Çizgili', 'Çiçekli', 'Baskılı'],
      sleeve: ['Kolsuz', 'Kısa kol', 'Uzun kol'],
    },
  },
}

const RU: Dict = {
  tabs: { home: 'Главная', products: 'Товары', orders: 'Заказы', analytics: 'Аналитика', profile: 'Профиль' },
  all: 'Все',
  search: 'Поиск',
  clear: 'Очистить',
  cancel: 'Отмена',
  save: 'Сохранить',
  saved: 'Сохранено',
  edit: 'Изменить',
  delete: 'Удалить',
  back: 'Назад',
  continue: 'Далее',
  apply: 'Применить',
  change: 'Изменить',
  pieces: 'шт',
  noResults: 'Ничего не найдено',
  noResultsSub: 'Попробуйте изменить запрос или фильтры',
  language: 'Язык',
  notificationsNone: 'Новых уведомлений нет',
  notificationsTitle: 'Уведомления о заказах',
  newOrderNotif: 'Новый заказ',
  copied: 'Скопировано',
  copyAddress: 'Скопировать адрес',
  callBuyer: 'Позвонить',
  openOrder: 'Открыть заказ',
  city: 'Город',
  house: 'Улица и дом',
  apartment: 'Квартира',
  recipient: 'Получатель',
  routeFromTo: 'Маршрут доставки',
  inProcessing: 'В обработке',
  thisMonth: 'За месяц',
  txAll: 'Все',
  txIn: 'Поступления',
  txOut: 'Выводы',
  txCredited: 'Зачислено',
  txPaidOut: 'Выплачено',
  withdrawAll: 'Всё',
  linkedAccount: 'Привязанный счёт',
  productAnalytics: 'Аналитика товара',
  inCart: 'В корзине',
  topCities: 'Города заказов',
  topSizes: 'Популярные размеры',
  tapForStats: 'Нажмите для анализа',
  countries: { KZ: 'Казахстан', RU: 'Россия', KG: 'Кыргызстан', UZ: 'Узбекистан' },
  fourCountriesLine: 'Казахстан · Россия · Кыргызстан · Узбекистан',
  swipeLangHint: 'Смахните влево / вправо для смены языка',
  cdek: {
    title: 'Код СДЭК · Карго',
    sub: 'Автоматически получен по API СДЭК',
    apiReady: 'API · Готов',
    tabQr: 'QR-код',
    tabBarcode: 'Штрихкод',
    trackCode: 'Трек-код СДЭК',
    waybill: 'Накладная',
    copyTrack: 'Копировать',
    scanHint: 'Покажите на пункте СДЭК или распечатайте на коробку',
    code128Note: 'Code 128 · Для сканера и принтера',
    fullScreen: 'На весь экран',
    fullTitle: 'Этикетка СДЭК',
    downloadLabel: 'Скачать этикетку',
    downloaded: 'Этикетка СДЭК скачана',
    apiData: 'Ответ API СДЭК',
  },
  editProfile: {
    storeSection: 'Данные магазина',
    contactsSection: 'Контакты',
    geoSection: 'География продаж (4 страны)',
    geoSub: 'Прямые продажи из Турции во все 4 страны',
    securitySection: 'Безопасность',
    shopName: 'Название магазина',
    shopPh: 'Напр: Lale Boutique',
    cityDistrict: 'Город / Район (Турция)',
    cityDistrictPh: 'İstanbul · Laleli',
    verified: 'Подтверждён',
    deleteConfirmTitle: 'Удалить аккаунт?',
    deleteConfirmSub: 'Данные магазина и история заказов будут удалены.',
    passTitle: 'Сменить пароль',
    passCur: 'Текущий пароль',
    passNew: 'Новый пароль (6+ символов)',
  },
  home: {
    welcome: 'Добро пожаловать,',
    storeSuffix: 'Магазин',
    verified: 'Активный магазин',
    balance: 'Баланс',
    available: 'доступно к выводу',
    withdraw: 'Вывести',
    docsTitle: 'Верификация магазина',
    docsSub: 'Загрузите паспорт, лицензию и реквизиты',
    quickTitle: 'Быстрые действия',
    addProduct: 'Добавить товар',
    pendingOrders: 'Новые заказы',
    inProgress: 'В сборке',
    lowStock: 'Мало на складе',
    delivered: 'Доставлено',
    salesPerf: 'Динамика продаж',
    liveMonitor: 'Аналитика',
    today: 'Сегодня',
    last7d: '7 дней',
    ordersLbl: 'Заказы',
    todaySales: 'Выручка сегодня',
    weekSales: 'Выручка за неделю',
    recentOrders: 'Последние заказы',
    seeAll: 'Все',
    finance: 'Финансы',
    shippingTo: 'Доставка',
  },
  products: {
    title: 'Мои товары',
    searchPh: 'Поиск по названию товара…',
    kpiTotal: 'Всего',
    kpiActive: 'В продаже',
    kpiLow: 'Мало',
    tabAll: 'Все',
    tabActive: 'В продаже',
    tabLow: 'Мало стока',
    tabHidden: 'Скрытые',
    active: 'Активен',
    hidden: 'Скрыт',
    stock: 'Остаток',
    variants: 'вар.',
    lowBadge: 'Мало',
    hide: 'Скрыть',
    show: 'Показать',
    hiddenToast: 'Товар скрыт с витрины',
    shownToast: 'Товар снова в продаже',
    addBtn: 'Добавить товар',
    sortNewest: 'Сортировка: Сначала новые',
    sortStock: 'Сортировка: Меньше остатка',
    sortTitle: 'Сортировка: По алфавиту',
    actions: 'Действия',
    duplicate: 'Дублировать',
    share: 'Поделиться',
    copiedToast: 'Скопировано',
    detailTitle: 'Карточка товара',
    stockHistory: 'История остатков',
    stockHistoryEmpty: 'Последнее движение: +5 шт добавлено',
    detailStatus: 'Статус',
    detailPrice: 'Цена',
    detailTotalStock: 'Общий остаток',
    detailVariantsCnt: 'Варианты',
    detailFullPhoto: 'Полный кадр 3:4',
    detailCropHint: 'Фото показано целиком в формате 3:4 без обрезки',
    detailLastMove: 'Движение склада',
  },
  orders: {
    title: 'Заказы',
    searchPh: 'Поиск по номеру или товару…',
    empty: 'Заказов в этом статусе нет',
    emptySub: 'Новые заказы появятся здесь автоматически',
    tabs: { all: 'Все', new: 'Новые', processing: 'В сборке', shipped: 'Отправлены', delivered: 'Доставлены', cancelled: 'Отменены' },
    status: { new: 'Новый', processing: 'В сборке', shipped: 'В пути', delivered: 'Доставлен', cancelled: 'Отменён' },
    confirm: 'Принять',
    ship: 'Отправить',
    confirmedToast: 'Заказ принят в сборку',
    shippedToast: 'Заказ передан в доставку',
    detailTitle: 'Заказ',
    deliveryAddr: 'Адрес доставки',
    cargoAddr: 'Пункт сдачи карго',
    cargoHint: 'Отправьте собранный заказ на этот адрес.',
    orderAmount: 'Сумма заказа',
    delivery: 'Доставка',
    total: 'Итого',
    payment: 'Оплата',
    paid: 'Оплачено',
    refunded: 'Возврат средств',
    customerInfo: 'Покупатель',
    timeline: 'История статусов',
    created: 'Заказ создан',
    paidRef: 'Оплата прошла (tolepay)',
  },
  analytics: {
    title: 'Аналитика',
    statsTitle: 'Статистика продаж',
    report: 'Отчёт',
    periods: { 'Gün': 'День', 'Hafta': 'Неделя', 'Ay': 'Месяц', 'Çeyrek': 'Квартал' },
    revenue: 'Выручка',
    orders: 'Заказы',
    avgOrder: 'Ср. чек',
    conversion: 'Конверсия',
    prev: 'Прошл.',
    views: 'просмотров',
    currentPeriod: 'Этот период',
    prevPeriod: 'Прошлый',
    tapHint: 'Нажмите на столбец для деталей',
    funnelTitle: 'Воронка продаж',
    funnelViews: 'Просмотры',
    funnelCart: 'В корзину',
    funnelOrders: 'Заказы',
    popularTitle: 'Популярные товары',
    sold: 'продаж',
    stock: 'Остаток',
  },
  profile: {
    title: 'Профиль',
    storeActive: 'Активный продавец',
    statProducts: 'Товары',
    statRating: 'Рейтинг',
    statBalance: 'Баланс',
    secBusiness: 'Магазин и финансы',
    secApp: 'Приложение и язык',
    secSupport: 'Поддержка и правила',
    finance: 'Финансы',
    documents: 'Документы магазина',
    brandDocs: 'Документы брендов',
    reviews: 'Отзывы',
    settings: 'Уведомления',
    support: 'Служба поддержки',
    faq: 'Частые вопросы',
    rules: 'Правила размещения',
    agreements: 'Соглашения',
    logout: 'Выйти из аккаунта',
    logoutToast: 'Выход выполнен',
    editTitle: 'Редактировать профиль',
    name: 'Имя',
    surname: 'Фамилия',
    phone: 'Телефон',
    email: 'E-mail',
    changePhone: 'Изменить',
    changeEmail: 'Изменить',
    unverified: 'Не подтверждён',
    changePass: 'Сменить пароль',
    deleteAcc: 'Удалить аккаунт',
    saveChanges: 'Сохранить изменения',
  },
  finance: {
    title: 'Финансы',
    currentBalance: 'Текущий баланс',
    linkCard: 'Привязать карту',
    linkCardSub: 'Добавьте карту или IBAN для вывода средств',
    requestPayout: 'Запросить выплату',
    history: 'История операций',
    withdrawTitle: 'Вывод средств',
    amount: 'Сумма вывода',
    amountPh: 'Введите сумму',
    selectBank: 'Ваши карты и счета IBAN',
    sendReq: 'Отправить заявку на вывод',
    reqSent: 'Заявка на вывод отправлена',
    enterAmount: 'Введите сумму вывода',
    pickBank: 'Выберите карту или IBAN',
    payoutCurrency: 'Валюта вывода',
    addCardBtn: 'Добавить карту / IBAN',
    addCardTitle: 'Новая карта или IBAN',
    bankNameLbl: 'Название банка',
    bankNamePh: 'Напр: Garanti BBVA, Ziraat, Kaspi',
    cardNumLbl: 'IBAN или номер карты',
    cardNumPh: 'TR00 0000 0000 0000 0000 0000 00',
    cardAdded: 'Карта добавлена',
    cardDeleted: 'Карта удалена',
    noCards: 'Нет привязанных карт — добавьте ниже',
    rateNote: 'Конвертация по актуальному курсу JJ',
  },
  sub: {
    docsList: ['Паспорт / ID', 'Лицензия / ИП', 'Банк / IBAN'],
    brandDocsReqs: [
      'Документы о закупке: счёт-фактура от производителя, договор поставки, накладные официального дистрибьютора',
      'Документы, подтверждающие оригинальность и происхождение товара',
      'Документы о праве на экспорт и продажу',
      'Сертификаты соответствия и маркировки',
    ],
    brandDocsWarn: 'Одного кассового чека из розничного магазина в Турции недостаточно.',
    rulesSections: [
      { h: '1. Общие правила', p: 'На площадке разрешено размещать только оригинальные товары, полностью соответствующие фото и описанию.' },
      { h: '2. Запрещённые товары', p: 'Запрещены оружие, лекарства, алкоголь, табак, поддельные документы и иные товары, ограниченные законом.' },
      { h: '3. Бренды с проверкой', p: 'Отдельные бренды публикуются после подтверждения документов. До проверки карточки находятся на модерации.' },
    ],
    faqs: [
      ['Как стать продавцом на JJ Market?', 'Зарегистрируйтесь в приложении JJ Seller, загрузите документы магазина в разделе «Профиль» и начните добавлять товары.'],
      ['Как отслеживать заказы?', 'В разделе «Заказы» виден текущий статус, город покупателя и полная история по каждому заказу.'],
      ['Как правильно указать размеры?', 'Выберите категорию — таблица размеров подберётся сама, а системы TR / RU / INT синхронизируются автоматически.'],
    ],
    agreements: ['Политика конфиденциальности', 'Политика возврата', 'Защита персональных данных', 'Оплата и выплаты', 'Условия доставки', 'Пользовательское соглашение'],
    agreementHeading: 'ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ',
    agreementBody: 'Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных продавцов приложения JJ Seller.',
  },
  pf: {
    newProduct: 'Новый товар',
    editProduct: 'Редактировать товар',
    stepOf: 'Шаг',
    draft: 'Черновик',
    draftSaved: 'Черновик сохранён',
    steps: ['Категория', 'Фото', 'Описание', 'Варианты', 'Цена и сток', 'Превью'],
    heads: ['Что за товар?', 'Фотографии', 'Информация о товаре', 'Цвета и размеры', 'Цена и остатки', 'Проверка и публикация'],
    subs: [
      'Точная категория помогает покупателям найти товар и подбирает таблицу размеров.',
      'Первое фото — обложка. Обрежьте и выровняйте кадр 3:4, чтобы товар и голова модели не обрезались.',
      'Название и характеристики влияют на выдачу в поиске.',
      'Найдите цвет в поиске или палитре, выберите размеры или добавьте свой.',
      'Укажите цену в ₺ TRY или $ USD, остатки и габариты коробки для карго.',
      'Проверьте качество карточки перед отправкой на модерацию.',
    ],
    nextPrefix: 'Далее',
    publish: 'Отправить на модерацию',
    saveChanges: 'Сохранить изменения',
    publishedToast: 'Товар отправлен на модерацию',
    catSearchPh: 'Что продаёте? Напр: рубашка, лоферы, джинсы…',
    selectedCat: 'Выбранная категория',
    sizeAuto: 'Размеры',
    recent: 'Недавние',
    allCats: 'Все категории',
    sections: 'разделов',
    subCount: 'подкатегорий',
    directPick: 'Выбор сразу',
    subPickHint: 'выберите раздел',
    noCatTitle: '— ничего не найдено',
    noCatSub: 'Попробуйте популярные запросы:',
    photoTitle: 'Фотографии товара',
    photoGreat: 'Отлично!',
    photoRec: 'рекомендуется 3+',
    dropTitle: 'Добавьте фото товара',
    dropSub: 'После загрузки обрежьте фото в формате 3:4 — так товар и модель будут видны целиком без обрезанной головы.',
    fromGallery: 'Из галереи',
    camera: 'Камера',
    demoPhotos: 'Добавить демо-фото для теста',
    demoAdded: 'Демо-фото добавлены',
    cover: 'Обложка',
    makeCover: 'Сделать обложкой',
    moveLeft: 'Сдвинуть влево',
    moveRight: 'Сдвинуть вправо',
    photoGuide: 'Требования к кадру',
    cropBtn: 'Обрезать / Кадр',
    cropTitle: 'Обрезка и кадрирование',
    cropSub: 'Подвиньте фото пальцем, чтобы модель и товар целиком поместились в рамку',
    cropRatio34: '3:4',
    cropRatio11: '1:1',
    cropRatioFree: 'Свободно',
    cropFitFull: 'Всё фото',
    cropFreeHint: 'Тяните за углы, края или саму рамку для свободной обрезки',
    cropTopFocus: 'Верх (лицо)',
    cropZoom: 'Масштаб',
    cropRotate: 'Повернуть',
    cropApply: 'Сохранить кадр',
    cropSaved: 'Фото обрезано в размер 3:4',
    cropSafeZone: 'Зона видимости витрины (3:4)',
    videoTitle: 'Видео товара',
    videoSub: 'Необязательно · до 3 видео · 60 сек · 150 МБ',
    addVideo: 'Добавить видео',
    autoTranslate: 'Название и описание автоматически переводятся на TR · RU.',
    prodName: 'Название товара',
    prodNamePh: 'Напр: Женская хлопковая рубашка оверсайз',
    suggestTitle: 'Предложить название',
    titleApplied: 'Название подставлено',
    brand: 'Бренд',
    brandPh: 'Выберите или найдите бренд',
    brandless: 'Без бренда',
    desc: 'Описание',
    descPh: 'Мягкая хлопковая ткань, свободный крой…',
    aiDesc: 'Создать описание автоматически',
    aiDescToast: 'Описание создано',
    attrsTitle: 'Характеристики',
    attrsFilled: 'заполнено · помогают в фильтрах',
    filterBadge: 'Фильтр',
    multiBadge: 'несколько',
    tagsTitle: 'Теги товара',
    tagsSub: 'Отображаются бейджами на карточке',
    colorsTitle: 'Цвета',
    colorsSub: 'Найдите в поиске или выберите свой оттенок в палитре',
    colorsSelected: 'цв. выбрано',
    colorSearchPh: 'Поиск цвета (напр: чёрный, бордо, хаки)…',
    colorPaletteBtn: 'Палитра',
    colorPaletteTitle: 'Выбор своего оттенка из палитры',
    colorCustomNamePh: 'Название цвета (напр: Изумрудный, Беж)',
    colorAddBtn: 'Добавить цвет',
    colorShowMore: 'Все цвета',
    colorShowLess: 'Свернуть',
    sizesTitle: 'Размеры',
    sizesAutoSub: '— таблица подобрана по категории',
    oneSizeNote: 'Для этой категории размер не требуется — «Единый размер».',
    sizesAutoTip: 'Системы TR / RU / INT синхронизируются автоматически',
    popularSizes: 'Популярные',
    sizeSearchAddPh: 'Найти или ввести свой размер (напр: 46, 37.5, 2XL)',
    sizeAddCustom: 'Добавить',
    sizeCustomAdded: 'Свой размер добавлен',
    showTable: 'Таблица соответствия и урок по размерам',
    hideTable: 'Скрыть таблицу размеров',
    sizeLessonTitle: 'Как работает таблица размеров?',
    sizeLessonSteps: [
      '1. Выберите размер с турецкой бирки (TR / EU)',
      '2. Покупатели в KZ, RU, KG, UZ увидят привычный размер (RU / INT)',
      '3. Нажмите на любую строку таблицы — размер сразу добавится в товар',
    ],
    sizeTapRowHint: 'Нажмите на строку, чтобы выбрать размер',
    otherTables: 'Другие таблицы:',
    variantsReady: 'вариантов готово',
    oneColor: 'Один цвет',
    colorWord: 'цв.',
    sizeWord: 'разм.',
    priceTitle: 'Цена продажи',
    priceSub: 'Вводите в ₺ TRY или $ USD · пересчёт автоматический',
    quickDiscount: 'Скидка:',
    noDiscount: 'Нет',
    discountLbl: 'Скидка (%)',
    discountedPrice: 'Цена со скидкой',
    buyerPrice: 'Эквивалент цены',
    rateLbl: 'Курс',
    stockTitle: 'Остатки на складе',
    bulkQuick: 'Всем в 1 клик:',
    bulkCustom: 'Своё кол-во',
    skuHint: 'Артикул (SKU) создаётся автоматически для каждого варианта.',
    logisticsTitle: 'Логистика, коробка и заказ',
    stockUnit: 'Ед. учёта',
    stockUnits: ['Штука', 'Пара', 'Упаковка', 'Комплект', 'Дюжина', 'кг', 'г', 'метр', 'см'],
    weight: 'Вес (кг)',
    boxTitle: 'Габариты коробки для карго',
    boxSub: 'Укажите размеры упаковки товара для расчёта доставки карго',
    boxLen: 'Длина',
    boxWid: 'Ширина',
    boxHei: 'Высота',
    unitCm: 'см',
    unitMm: 'мм',
    minOrder: 'Мин. заказ',
    maxOrder: 'Макс. заказ',
    minMaxHelpTitle: 'Зачем указывать Мин. и Макс. заказ?',
    minHelpText: 'Мин. заказ — минимальное количество штук в одном заказе (1 шт — для розницы, 3–5 шт — если продаёте серией или упаковкой).',
    maxHelpText: 'Макс. заказ — ограничение в одни руки за один заказ, чтобы один покупатель не выкупил сразу весь остаток.',
    previewTitle: 'Как увидит покупатель',
    noPrice: 'Цена не указана',
    noName: 'Название не указано',
    sumVariants: 'Варианты',
    sumStock: 'Всего остаток',
    sumSellerPrice: 'Цена продавца',
    qualityTitle: 'Качество карточки',
    qGreat: 'Отлично',
    qGood: 'Хорошо',
    qLow: 'Есть пробелы',
    qGreatSub: 'Отлично — карточка будет выше в поиске',
    qLowSub: 'Нажмите на незаполненный пункт, чтобы дополнить',
    fillBtn: 'Заполнить',
    errCat: 'Выберите категорию',
    errPhoto: 'Добавьте хотя бы 1 фото',
    errName: 'Введите название товара',
    errSize: 'Выберите хотя бы 1 размер',
    errPrice: 'Укажите цену',
    errStock: 'Укажите остаток',
    hideProduct: 'Скрыть товар',
    hideProductSub: 'Покупатели не увидят товар, остатки сохранятся',
    deleteProduct: 'Удалить товар',
    originOpts: ['Турция', 'Другая', 'Ручная работа'],
    sizeTableNames: {
      women: 'Женская одежда',
      men: 'Мужская одежда',
      jeans: 'Джинсы / брюки',
      shoes: 'Обувь',
      kids: 'Детская одежда',
      one: 'Единый размер',
    },
    colorNames: COLOR_RU,
    tagNames: TAG_RU,
    catNames: CAT_RU,
    attrLabels: {
      mat: 'Материал',
      season: 'Сезон',
      fit: 'Посадка',
      pattern: 'Узор',
      sleeve: 'Рукав',
      origin: 'Производство',
    },
    attrOpts: {
      mat: ['Хлопок', 'Полиэстер', 'Вискоза', 'Лён', 'Шерсть', 'Кожа', 'Замша', 'Деним', 'Эластан'],
      season: ['Весна/Лето', 'Осень/Зима', 'Всесезон'],
      fit: ['Облегающий', 'Обычный', 'Оверсайз'],
      pattern: ['Однотонный', 'Клетка', 'Полоска', 'Цветочный', 'Принт'],
      sleeve: ['Без рукавов', 'Короткий рукав', 'Длинный рукав'],
    },
  },
}

export const DICTS: Record<Lang, Dict> = { tr: TR, ru: RU }
export const getDict = (lang: string): Dict => DICTS[lang === 'ru' ? 'ru' : 'tr']
