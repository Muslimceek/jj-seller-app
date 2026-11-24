export type Lang = 'tr' | 'ru' | 'kk'

export const LANG_META: { code: Lang; short: string; label: string }[] = [
  { code: 'tr', short: 'TR', label: 'Türkçe' },
  { code: 'ru', short: 'RU', label: 'Русский' },
  { code: 'kk', short: 'KZ', label: 'Қазақша' },
]

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('jj_lang')
    if (saved === 'tr' || saved === 'ru' || saved === 'kk') return saved
  } catch {}
  // Автоопределение региона: если пользователь в Турции (часовой пояс Istanbul / Turkey) — сразу турецкий
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (/istanbul|turkey/i.test(tz)) return 'tr'
    if (typeof navigator !== 'undefined') {
      const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''])
        .map((s) => s.toLowerCase())
      if (langs.some((l) => l.startsWith('tr'))) return 'tr'
      if (langs.some((l) => l.startsWith('kk') || l.startsWith('kz'))) return 'kk'
      if (langs.some((l) => l.startsWith('ru'))) return 'ru'
    }
    if (/almaty|qyzylorda|aqtobe|aqtau|atyrau|oral/i.test(tz)) return 'kk'
    if (/moscow|bishkek|tashkent|samarkand|novosibirsk|yekaterinburg/i.test(tz)) return 'ru'
  } catch {}
  return 'tr'
}

export function saveLang(l: Lang) {
  try {
    localStorage.setItem('jj_lang', l)
  } catch {}
}

export interface Dict {
  // Navigation tabs
  tabs: { home: string; products: string; orders: string; analytics: string; profile: string }
  // Common
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
  cargoQrTitle: string
  cargoQrSub: string
  cargoQrGet: string
  cargoQrLoading: string
  cargoQrReady: string
  cargoQrScanHint: string
  cargoQrFullScreen: string
  cargoQrDownload: string
  cargoQrDownloaded: string
  cargoQrTrack: string
  cargoQrApiData: string
  cargoQrBtn: string
  countries: Record<'KZ' | 'RU' | 'KG' | 'UZ', string>
  fourCountriesLine: string
  swipeLangHint: string
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
  // Home
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
  }
  // Products
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
  }
  // Orders
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
  // Analytics
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
  // Profile
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
  // Subscreens
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
  }
  // Product Form
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
    sizesTitle: string
    sizesAutoSub: string
    oneSizeNote: string
    sizesAutoTip: string
    popularSizes: string
    showTable: string
    hideTable: string
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
    weight: string
    minOrder: string
    maxOrder: string
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
  }
}

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
  cargoQrTitle: 'Kargo QR etiketi',
  cargoQrSub: 'Kargo API üzerinden otomatik oluşturulur',
  cargoQrGet: 'Kargo API’den QR al',
  cargoQrLoading: 'Kargo API’den QR alınıyor…',
  cargoQrReady: 'Kargo API · Hazır',
  cargoQrScanHint: 'Kargo şubesinde taratın veya pakete yapıştırın',
  cargoQrFullScreen: 'Tam ekran QR',
  cargoQrDownload: 'Etiketi indir',
  cargoQrDownloaded: 'Kargo QR etiketi indirildi',
  cargoQrTrack: 'Takip kodu',
  cargoQrApiData: 'Kargo API verisi',
  cargoQrBtn: 'QR Kargo',
  countries: { KZ: 'Kazakistan', RU: 'Rusya', KG: 'Kırgızistan', UZ: 'Özbekistan' },
  fourCountriesLine: 'Kazakistan · Rusya · Kırgızistan · Özbekistan',
  swipeLangHint: 'Sola / sağa kaydırarak dili değiştirin',
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
    stockHistoryEmpty: 'Stok geçmişi boş',
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
    logoutToast: 'Çıkış yapıldı (demo)',
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
    withdrawTitle: 'Yeni Çekim',
    amount: 'Tutar',
    amountPh: 'Çekim tutarını girin',
    selectBank: 'Banka Hesabı Seçin',
    sendReq: 'Talebi Gönder',
    reqSent: 'Talep gönderildi',
    enterAmount: 'Çekim tutarını girin',
    pickBank: 'Banka hesabı seçin',
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
      'İlk fotoğraf kapak olur. Sıralamak için fotoğrafa dokunun.',
      'Ad ve özellikler alıcının aradığı kelimelerle eşleşmeli.',
      'Renkleri ve bedenleri seçin — varyantlar otomatik oluşur.',
      'Fiyatı ₺ veya ₸ olarak girin, alıcı fiyatı otomatik hesaplanır.',
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
    dropSub: 'İlk fotoğraf vitrin kapağı olur. En az 3 açı (önden, arkadan, detay) satışı arttırır.',
    fromGallery: 'Galeriden seç',
    camera: 'Kamera',
    demoPhotos: 'Hızlı test için örnek fotoğraf ekle',
    demoAdded: 'Örnek fotoğraflar eklendi',
    cover: 'Kapak',
    makeCover: 'Kapak fotoğrafı yap',
    moveLeft: 'Sola taşı',
    moveRight: 'Sağa taşı',
    photoGuide: 'İyi fotoğraf rehberi',
    videoTitle: 'Ürün videosu',
    videoSub: 'İsteğe bağlı · en fazla 3 video · 60 sn · 150 MB',
    addVideo: 'Video ekle',
    autoTranslate: 'Ürün adı ve açıklaması alıcılar için TR · RU · KZ dillerine otomatik çevrilir.',
    prodName: 'Ürün adı',
    prodNamePh: 'Örn: Kadın pamuklu oversize gömlek',
    suggestTitle: 'Kategoriden başlık öner',
    titleApplied: 'Başlık önerisi uygulandı',
    brand: 'Marka',
    brandPh: 'Marka seçin veya arayın',
    brandless: 'Markasız',
    desc: 'Açıklama',
    descPh: 'Yumuşak pamuklu kumaştan, rahat kesimli…',
    aiDesc: 'AI ile açıklama oluştur',
    aiDescToast: 'AI açıklama oluşturuldu',
    attrsTitle: 'Özellikler',
    attrsFilled: 'dolduruldu · filtrelerde görünürlüğü arttırır',
    filterBadge: 'Filtre',
    multiBadge: 'çoklu seçim',
    tagsTitle: 'Öne çıkan etiketler',
    tagsSub: 'Alıcı kartında rozet olarak görünür',
    colorsTitle: 'Renkler',
    colorsSub: 'Birden fazla renk seçebilirsiniz',
    colorsSelected: 'renk seçildi',
    sizesTitle: 'Bedenler',
    sizesAutoSub: 'tablosu · kategoriye göre otomatik',
    oneSizeNote: 'Bu kategoride beden yok — ürün «Tek beden» olarak satılır.',
    sizesAutoTip: 'TR / RU / INT sistemleri otomatik eşleşir',
    popularSizes: 'Popüler bedenler',
    showTable: 'Beden dönüşüm tablosunu gör',
    hideTable: 'Tabloyu gizle',
    otherTables: 'Diğer tablolar:',
    variantsReady: 'varyant hazır',
    oneColor: 'Tek renk',
    colorWord: 'renk',
    sizeWord: 'beden',
    priceTitle: 'Satış fiyatı',
    priceSub: '₺ TRY veya ₸ KZT girin · alıcı ₸ görür',
    quickDiscount: 'Hızlı indirim:',
    noDiscount: 'Yok',
    discountLbl: 'İndirim (%)',
    discountedPrice: 'İndirimli fiyat',
    buyerPrice: 'Alıcı fiyatı (KZ · RU · KG · UZ)',
    rateLbl: 'Kur',
    stockTitle: 'Stok yönetimi',
    bulkQuick: 'Hepsine tek tıkla:',
    bulkCustom: 'Özel adet',
    skuHint: 'Stok kodu (SKU) her varyant için otomatik oluşturulur.',
    logisticsTitle: 'Kargo ve sipariş ayarları',
    stockUnit: 'Stok birimi',
    weight: 'Ağırlık (kg)',
    minOrder: 'Min. sipariş',
    maxOrder: 'Maks. sipariş',
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
    originOpts: ['Türkiye', 'Kazakistan', 'Diğer'],
    sizeTableNames: {
      women: 'Kadın giyim',
      men: 'Erkek giyim',
      jeans: 'Jean / pantolon',
      shoes: 'Ayakkabı',
      kids: 'Çocuk giyim',
      one: 'Tek beden',
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
  cargoQrTitle: 'QR-код карго',
  cargoQrSub: 'Автоматически приходит из Cargo API по заказу',
  cargoQrGet: 'Получить QR из Cargo API',
  cargoQrLoading: 'Запрос QR в Cargo API…',
  cargoQrReady: 'Cargo API · Готов',
  cargoQrScanHint: 'Покажите на пункте сдачи карго или распечатайте на посылку',
  cargoQrFullScreen: 'На весь экран',
  cargoQrDownload: 'Скачать этикетку',
  cargoQrDownloaded: 'QR-этикетка скачана',
  cargoQrTrack: 'Трек-код',
  cargoQrApiData: 'Ответ Cargo API',
  cargoQrBtn: 'QR Карго',
  countries: { KZ: 'Казахстан', RU: 'Россия', KG: 'Кыргызстан', UZ: 'Узбекистан' },
  fourCountriesLine: 'Казахстан · Россия · Кыргызстан · Узбекистан',
  swipeLangHint: 'Смахните влево / вправо для смены языка',
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
    stockHistoryEmpty: 'История остатков пуста',
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
    logoutToast: 'Выход выполнен (демо)',
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
    amount: 'Сумма',
    amountPh: 'Введите сумму вывода',
    selectBank: 'Выберите банковский счёт',
    sendReq: 'Отправить заявку',
    reqSent: 'Заявка отправлена',
    enterAmount: 'Введите сумму',
    pickBank: 'Выберите счёт',
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
      'Первое фото станет обложкой. Нажмите на фото, чтобы изменить порядок.',
      'Название и характеристики влияют на выдачу в поиске.',
      'Выберите цвета и размеры — варианты создадутся автоматически.',
      'Укажите цену в ₺ или ₸ — цена для покупателя в ₸ пересчитается сама.',
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
    dropSub: 'Первое фото — обложка. Минимум 3 ракурса повышают продажи.',
    fromGallery: 'Из галереи',
    camera: 'Камера',
    demoPhotos: 'Добавить демо-фото для теста',
    demoAdded: 'Демо-фото добавлены',
    cover: 'Обложка',
    makeCover: 'Сделать обложкой',
    moveLeft: 'Сдвинуть влево',
    moveRight: 'Сдвинуть вправо',
    photoGuide: 'Требования к фото',
    videoTitle: 'Видео товара',
    videoSub: 'Необязательно · до 3 видео · 60 сек · 150 МБ',
    addVideo: 'Добавить видео',
    autoTranslate: 'Название и описание автоматически переводятся на TR · RU · KZ.',
    prodName: 'Название товара',
    prodNamePh: 'Напр: Женская хлопковая рубашка оверсайз',
    suggestTitle: 'Предложить название',
    titleApplied: 'Название подставлено',
    brand: 'Бренд',
    brandPh: 'Выберите или найдите бренд',
    brandless: 'Без бренда',
    desc: 'Описание',
    descPh: 'Мягкая хлопковая ткань, свободный крой…',
    aiDesc: 'Создать описание с AI',
    aiDescToast: 'Описание создано с AI',
    attrsTitle: 'Характеристики',
    attrsFilled: 'заполнено · помогают в фильтрах',
    filterBadge: 'Фильтр',
    multiBadge: 'несколько',
    tagsTitle: 'Теги товара',
    tagsSub: 'Отображаются бейджами на карточке',
    colorsTitle: 'Цвета',
    colorsSub: 'Можно выбрать несколько цветов',
    colorsSelected: 'цв. выбрано',
    sizesTitle: 'Размеры',
    sizesAutoSub: '— таблица подобрана по категории',
    oneSizeNote: 'Для этой категории размер не требуется — «Единый размер».',
    sizesAutoTip: 'Системы TR / RU / INT синхронизируются автоматически',
    popularSizes: 'Популярные',
    showTable: 'Таблица соответствия размеров',
    hideTable: 'Скрыть таблицу',
    otherTables: 'Другие таблицы:',
    variantsReady: 'вариантов готово',
    oneColor: 'Один цвет',
    colorWord: 'цв.',
    sizeWord: 'разм.',
    priceTitle: 'Цена продажи',
    priceSub: 'Вводите в ₺ TRY или ₸ KZT · покупатель видит ₸',
    quickDiscount: 'Скидка:',
    noDiscount: 'Нет',
    discountLbl: 'Скидка (%)',
    discountedPrice: 'Цена со скидкой',
    buyerPrice: 'Цена для покупателя (KZ · RU · KG · UZ)',
    rateLbl: 'Курс',
    stockTitle: 'Остатки на складе',
    bulkQuick: 'Всем в 1 клик:',
    bulkCustom: 'Своё кол-во',
    skuHint: 'Артикул (SKU) создаётся автоматически для каждого варианта.',
    logisticsTitle: 'Логистика и заказ',
    stockUnit: 'Ед. учёта',
    weight: 'Вес (кг)',
    minOrder: 'Мин. заказ',
    maxOrder: 'Макс. заказ',
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
    originOpts: ['Турция', 'Казахстан', 'Другая'],
    sizeTableNames: {
      women: 'Женская одежда',
      men: 'Мужская одежда',
      jeans: 'Джинсы / брюки',
      shoes: 'Обувь',
      kids: 'Детская одежда',
      one: 'Единый размер',
    },
  },
}

const KK: Dict = {
  tabs: { home: 'Басты бет', products: 'Тауарлар', orders: 'Тапсырыстар', analytics: 'Талдау', profile: 'Профиль' },
  all: 'Барлығы',
  search: 'Іздеу',
  clear: 'Тазалау',
  cancel: 'Болдырмау',
  save: 'Сақтау',
  saved: 'Сақталды',
  edit: 'Өңдеу',
  delete: 'Жою',
  back: 'Артқа',
  continue: 'Жалғастыру',
  apply: 'Қолдану',
  change: 'Өзгерту',
  pieces: 'дана',
  noResults: 'Нәтиже табылмады',
  noResultsSub: 'Іздеу сөзін немесе сүзгіні өзгертіп көріңіз',
  language: 'Тіл',
  notificationsNone: 'Жаңа хабарлама жоқ',
  notificationsTitle: 'Тапсырыс хабарламалары',
  newOrderNotif: 'Жаңа тапсырыс түсті',
  copied: 'Көшірілді',
  copyAddress: 'Мекенжайды көшіру',
  callBuyer: 'Қоңырау',
  openOrder: 'Тапсырысты ашу',
  city: 'Қала',
  house: 'Көше және үй',
  apartment: 'Пәтер',
  recipient: 'Алушы',
  routeFromTo: 'Жеткізу бағыты',
  inProcessing: 'Өңделуде',
  thisMonth: 'Осы айда',
  txAll: 'Барлығы',
  txIn: 'Түсімдер',
  txOut: 'Шығарулар',
  txCredited: 'Есептелді',
  txPaidOut: 'Төленді',
  withdrawAll: 'Барлығы',
  linkedAccount: 'Байланған шот',
  productAnalytics: 'Тауар талдауы',
  inCart: 'Себетте',
  topCities: 'Тапсырыс қалалары',
  topSizes: 'Танымал өлшемдер',
  tapForStats: 'Талдау үшін басыңыз',
  cargoQrTitle: 'Карго QR-коды',
  cargoQrSub: 'Тапсырыс бойынша Cargo API-ден автоматты алынады',
  cargoQrGet: 'Cargo API-ден QR алу',
  cargoQrLoading: 'Cargo API-ден QR алынуда…',
  cargoQrReady: 'Cargo API · Дайын',
  cargoQrScanHint: 'Карго бөлімшесінде сканерлетіңіз немесе сәлемдемеге жапсырыңыз',
  cargoQrFullScreen: 'Толық экран',
  cargoQrDownload: 'Этикетканы жүктеу',
  cargoQrDownloaded: 'QR-этикетка жүктелді',
  cargoQrTrack: 'Трек-код',
  cargoQrApiData: 'Cargo API дерегі',
  cargoQrBtn: 'QR Карго',
  countries: { KZ: 'Қазақстан', RU: 'Ресей', KG: 'Қырғызстан', UZ: 'Өзбекстан' },
  fourCountriesLine: 'Қазақстан · Ресей · Қырғызстан · Өзбекстан',
  swipeLangHint: 'Тілді ауыстыру үшін солға / оңға сырғытыңыз',
  editProfile: {
    storeSection: 'Дүкен деректері',
    contactsSection: 'Байланыс',
    geoSection: 'Сату географиясы (4 ел)',
    geoSub: 'Түркиядан 4 елге тікелей сатылым',
    securitySection: 'Қауіпсіздік',
    shopName: 'Дүкен атауы',
    shopPh: 'Мыс: Lale Boutique',
    cityDistrict: 'Қала / Аудан (Түркия)',
    cityDistrictPh: 'İstanbul · Laleli',
    verified: 'Расталған',
    deleteConfirmTitle: 'Аккаунтты жою керек пе?',
    deleteConfirmSub: 'Дүкен деректері мен тапсырыстар тарихы өшіріледі.',
    passTitle: 'Құпиясөзді өзгерту',
    passCur: 'Қазіргі құпиясөз',
    passNew: 'Жаңа құпиясөз (6+ таңба)',
  },
  home: {
    welcome: 'Қош келдіңіз,',
    storeSuffix: 'Дүкені',
    verified: 'Белсенді дүкен',
    balance: 'Баланс',
    available: 'шығаруға қолжетімді',
    withdraw: 'Шығару',
    docsTitle: 'Дүкенді растау',
    docsSub: 'Төлқұжат, лицензия және банк деректерін жүктеңіз',
    quickTitle: 'Жылдам әрекеттер',
    addProduct: 'Тауар қосу',
    pendingOrders: 'Жаңа тапсырыс',
    inProgress: 'Дайындалуда',
    lowStock: 'Қоймада аз',
    delivered: 'Жеткізілді',
    salesPerf: 'Сатылым динамикасы',
    liveMonitor: 'Талдау',
    today: 'Бүгін',
    last7d: '7 күн',
    ordersLbl: 'Тапсырыстар',
    todaySales: 'Бүгінгі айналым',
    weekSales: 'Апталық айналым',
    recentOrders: 'Соңғы тапсырыстар',
    seeAll: 'Барлығы',
    finance: 'Қаржы',
  },
  products: {
    title: 'Менің тауарларым',
    searchPh: 'Тауар атауы бойынша іздеу…',
    kpiTotal: 'Барлығы',
    kpiActive: 'Сатылымда',
    kpiLow: 'Аз қалды',
    tabAll: 'Барлығы',
    tabActive: 'Сатылымда',
    tabLow: 'Аз қалдық',
    tabHidden: 'Жасырын',
    active: 'Белсенді',
    hidden: 'Жасырын',
    stock: 'Қалдық',
    variants: 'нұсқа',
    lowBadge: 'Аз қалды',
    hide: 'Жасыру',
    show: 'Көрсету',
    hiddenToast: 'Тауар жасырылды',
    shownToast: 'Тауар қайта сатылымда',
    addBtn: 'Жаңа тауар қосу',
    sortNewest: 'Сұрыптау: Жаңалары',
    sortStock: 'Сұрыптау: Қалдығы аздар',
    sortTitle: 'Сұрыптау: Әліпби бойынша',
    actions: 'Әрекеттер',
    duplicate: 'Көшіру',
    share: 'Бөлісу',
    copiedToast: 'Көшірілді',
    detailTitle: 'Тауар деректері',
    stockHistory: 'Қалдық тарихы',
    stockHistoryEmpty: 'Қалдық тарихы бос',
  },
  orders: {
    title: 'Тапсырыстар',
    searchPh: 'Нөмір немесе тауар іздеу…',
    empty: 'Бұл күйде тапсырыс жоқ',
    emptySub: 'Жаңа тапсырыстар осында пайда болады',
    tabs: { all: 'Барлығы', new: 'Жаңа', processing: 'Дайындалуда', shipped: 'Жіберілді', delivered: 'Жеткізілді', cancelled: 'Бас тартылды' },
    status: { new: 'Жаңа', processing: 'Дайындалуда', shipped: 'Жолда', delivered: 'Жеткізілді', cancelled: 'Бас тартылды' },
    confirm: 'Растау',
    ship: 'Жіберу',
    confirmedToast: 'Тапсырыс расталды',
    shippedToast: 'Жеткізуге берілді',
    detailTitle: 'Тапсырыс',
    deliveryAddr: 'Жеткізу мекенжайы',
    cargoAddr: 'Карго тапсыру мекенжайы',
    cargoHint: 'Дайындалған тапсырысты осы мекенжайға жіберіңіз.',
    orderAmount: 'Тапсырыс сомасы',
    delivery: 'Жеткізу',
    total: 'Барлығы',
    payment: 'Төлем әдісі',
    paid: 'Төленді',
    refunded: 'Қайтарылды',
    customerInfo: 'Сатып алушы',
    timeline: 'Тапсырыс тарихы',
    created: 'Тапсырыс жасалды',
    paidRef: 'Төлем сәтті өтті (tolepay)',
  },
  analytics: {
    title: 'Талдау',
    statsTitle: 'Сатылым статистикасы',
    report: 'Есеп',
    periods: { 'Gün': 'Күн', 'Hafta': 'Апта', 'Ay': 'Ай', 'Çeyrek': 'Тоқсан' },
    revenue: 'Айналым',
    orders: 'Тапсырыс',
    avgOrder: 'Орт. чек',
    conversion: 'Конверсия',
    prev: 'Алдыңғы',
    views: 'қаралым',
    currentPeriod: 'Осы кезең',
    prevPeriod: 'Алдыңғы',
    tapHint: 'Толығырақ көру үшін бағанды басыңыз',
    funnelTitle: 'Сатылым воронкасы',
    funnelViews: 'Қаралымдар',
    funnelCart: 'Себетке қосу',
    funnelOrders: 'Тапсырыстар',
    popularTitle: 'Танымал тауарлар',
    sold: 'сатылым',
    stock: 'Қалдық',
  },
  profile: {
    title: 'Профиль',
    storeActive: 'Белсенді сатушы',
    statProducts: 'Тауар',
    statRating: 'Рейтинг',
    statBalance: 'Баланс',
    secBusiness: 'Дүкен және қаржы',
    secApp: 'Қолданба және тіл',
    secSupport: 'Қолдау және ережелер',
    finance: 'Қаржы',
    documents: 'Дүкен құжаттары',
    brandDocs: 'Бренд құжаттары',
    reviews: 'Пікірлер',
    settings: 'Хабарламалар',
    support: 'Қолдау қызметі',
    faq: 'Жиі қойылатын сұрақтар',
    rules: 'Тауар орналастыру ережелері',
    agreements: 'Келісімшарттар',
    logout: 'Шығу',
    logoutToast: 'Шығу орындалды (демо)',
    editTitle: 'Профильді өңдеу',
    name: 'Аты',
    surname: 'Тегі',
    phone: 'Телефон',
    email: 'E-mail',
    changePhone: 'Өзгерту',
    changeEmail: 'Өзгерту',
    unverified: 'Расталмаған',
    changePass: 'Құпия сөзді өзгерту',
    deleteAcc: 'Аккаунтты жою',
    saveChanges: 'Өзгерістерді сақтау',
  },
  finance: {
    title: 'Қаржы',
    currentBalance: 'Ағымдағы баланс',
    linkCard: 'Карта байлау',
    linkCardSub: 'Ақша шығару үшін карта немесе IBAN қосыңыз',
    requestPayout: 'Төлем сұрау',
    history: 'Операциялар тарихы',
    withdrawTitle: 'Ақша шығару',
    amount: 'Сома',
    amountPh: 'Шығару сомасын енгізіңіз',
    selectBank: 'Банк шотын таңдаңыз',
    sendReq: 'Өтінім жіберу',
    reqSent: 'Өтінім жіберілді',
    enterAmount: 'Соманы енгізіңіз',
    pickBank: 'Банк шотын таңдаңыз',
  },
  pf: {
    newProduct: 'Жаңа тауар',
    editProduct: 'Тауарды өңдеу',
    stepOf: 'Қадам',
    draft: 'Жоба',
    draftSaved: 'Жоба сақталды',
    steps: ['Санат', 'Фото', 'Ақпарат', 'Нұсқалар', 'Баға & Қор', 'Алдын ала'],
    heads: ['Қандай тауар?', 'Фотосуреттер', 'Тауар туралы', 'Түс және өлшем', 'Баға және қор', 'Тексеру және жариялау'],
    subs: [
      'Дұрыс санат іздеуде табылуға және өлшем кестесін автоматты таңдауға көмектеседі.',
      'Бірінші фото мұқаба болады. Ретін ауыстыру үшін фотоны басыңыз.',
      'Атауы мен сипаттамасы сатып алушы іздейтін сөздерге сәйкес болуы керек.',
      'Түстер мен өлшемдерді таңдаңыз — нұсқалар автоматты құрылады.',
      'Бағаны ₺ немесе ₸ түрінде енгізіңіз — сатып алушы бағасы ₸ автоматты есептеледі.',
      'Модерацияға жібермес бұрын карточка сапасын тексеріңіз.',
    ],
    nextPrefix: 'Келесі',
    publish: 'Модерацияға жіберу',
    saveChanges: 'Өзгерістерді сақтау',
    publishedToast: 'Тауар модерацияға жіберілді',
    catSearchPh: 'Не сатасыз? Мыс: көйлек, лофер, джинсы…',
    selectedCat: 'Таңдалған санат',
    sizeAuto: 'Өлшем',
    recent: 'Соңғы қолданылғандар',
    allCats: 'Барлық санаттар',
    sections: 'бөлім',
    subCount: 'ішкі санат',
    directPick: 'Бірден таңдау',
    subPickHint: 'біреуін таңдаңыз',
    noCatTitle: 'бойынша табылмады',
    noCatSub: 'Танымал санаттарды байқап көріңіз:',
    photoTitle: 'Тауар фотосуреттері',
    photoGreat: 'Тамаша!',
    photoRec: 'ұсынылады: 3+',
    dropTitle: 'Тауар фотоларын қосыңыз',
    dropSub: 'Бірінші фото мұқаба болады. Кемінде 3 ракурс сатылымды арттырады.',
    fromGallery: 'Галереядан',
    camera: 'Камера',
    demoPhotos: 'Тест үшін үлгі фото қосу',
    demoAdded: 'Үлгі фотолар қосылды',
    cover: 'Мұқаба',
    makeCover: 'Мұқаба жасау',
    moveLeft: 'Солға жылжыту',
    moveRight: 'Оңға жылжыту',
    photoGuide: 'Фото талаптары',
    videoTitle: 'Тауар видеосы',
    videoSub: 'Міндетті емес · 3 видеоға дейін · 60 сек · 150 МБ',
    addVideo: 'Видео қосу',
    autoTranslate: 'Атауы мен сипаттамасы TR · RU · KZ тілдеріне автоматты аударылады.',
    prodName: 'Тауар атауы',
    prodNamePh: 'Мыс: Әйелдер мақта көйлегі оверсайз',
    suggestTitle: 'Атау ұсыну',
    titleApplied: 'Атау қолданылды',
    brand: 'Бренд',
    brandPh: 'Брендті таңдаңыз немесе іздеңіз',
    brandless: 'Брендсіз',
    desc: 'Сипаттама',
    descPh: 'Жұмсақ мақта мата, еркін пішім…',
    aiDesc: 'AI арқылы сипаттама жазу',
    aiDescToast: 'AI сипаттама жасалды',
    attrsTitle: 'Сипаттамалары',
    attrsFilled: 'толтырылды · сүзгілерде көрінуді арттырады',
    filterBadge: 'Сүзгі',
    multiBadge: 'бірнеше',
    tagsTitle: 'Тауар тегтері',
    tagsSub: 'Тауар карточкасында белгіше ретінде көрінеді',
    colorsTitle: 'Түстер',
    colorsSub: 'Бірнеше түс таңдауға болады',
    colorsSelected: 'түс таңдалды',
    sizesTitle: 'Өлшемдер',
    sizesAutoSub: 'кестесі · санат бойынша автоматты',
    oneSizeNote: 'Бұл санатта өлшем жоқ — «Бірыңғай өлшем».',
    sizesAutoTip: 'TR / RU / INT жүйелері автоматты сәйкестендіріледі',
    popularSizes: 'Танымал өлшемдер',
    showTable: 'Өлшемдер кестесін көру',
    hideTable: 'Кестені жасыру',
    otherTables: 'Басқа кестелер:',
    variantsReady: 'нұсқа дайын',
    oneColor: 'Бір түс',
    colorWord: 'түс',
    sizeWord: 'өлшем',
    priceTitle: 'Сату бағасы',
    priceSub: '₺ TRY немесе ₸ KZT енгізіңіз · сатып алушы ₸ көреді',
    quickDiscount: 'Жеңілдік:',
    noDiscount: 'Жоқ',
    discountLbl: 'Жеңілдік (%)',
    discountedPrice: 'Жеңілдікпен баға',
    buyerPrice: 'Сатып алушы бағасы (KZ · RU · KG · UZ)',
    rateLbl: 'Бағам',
    stockTitle: 'Қоймадағы қор',
    bulkQuick: 'Барлығына 1 рет басып:',
    bulkCustom: 'Басқа сан',
    skuHint: 'Әр нұсқа үшін артикул (SKU) автоматты жасалады.',
    logisticsTitle: 'Жеткізу және тапсырыс',
    stockUnit: 'Өлшем бірлігі',
    weight: 'Салмағы (кг)',
    minOrder: 'Мин. тапсырыс',
    maxOrder: 'Макс. тапсырыс',
    previewTitle: 'Сатып алушы көрінісі',
    noPrice: 'Баға көрсетілмеген',
    noName: 'Атау көрсетілмеген',
    sumVariants: 'Нұсқалар',
    sumStock: 'Жалпы қор',
    sumSellerPrice: 'Сатушы бағасы',
    qualityTitle: 'Карточка сапасы',
    qGreat: 'Өте жақсы',
    qGood: 'Жақсы',
    qLow: 'Толықтыру қажет',
    qGreatSub: 'Тамаша — тауар іздеуде жоғары тұрады',
    qLowSub: 'Толтырылмаған жолды басып жылдам түзетіңіз',
    fillBtn: 'Толтыру',
    errCat: 'Санатты таңдаңыз',
    errPhoto: 'Кемінде 1 фото қосыңыз',
    errName: 'Тауар атауын енгізіңіз',
    errSize: 'Кемінде 1 өлшем таңдаңыз',
    errPrice: 'Бағаны көрсетіңіз',
    errStock: 'Қалдықты көрсетіңіз',
    hideProduct: 'Тауарды жасыру',
    hideProductSub: 'Сатып алушылар көрмейді, қор сақталады',
    deleteProduct: 'Тауарды жою',
    originOpts: ['Түркия', 'Қазақстан', 'Басқа'],
    sizeTableNames: {
      women: 'Әйелдер киімі',
      men: 'Ерлер киімі',
      jeans: 'Джинсы / шалбар',
      shoes: 'Аяқ киім',
      kids: 'Балалар киімі',
      one: 'Бірыңғай өлшем',
    },
  },
}

export const DICTS: Record<Lang, Dict> = { tr: TR, ru: RU, kk: KK }
export const getDict = (lang: string): Dict => DICTS[(lang as Lang) in DICTS ? (lang as Lang) : 'tr']
