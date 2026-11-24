import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Eye, EyeOff, ChevronLeft, Phone, Mail, Store, User, Lock, Check, ShieldCheck, KeyRound,
  Sparkles, CircleAlert, Loader2, ArrowRight, QrCode, BarChart3, Zap, PlayCircle, ChevronDown,
  MapPin, CheckCircle2, Wallet,
} from 'lucide-react'
import { useNav, Sheet } from './ui'
import { LANG_META } from './i18n'

/*
 * Премиальный вход, интерактивный онбординг-гид (можно скрыть или открыть снова)
 * и 2-шаговая регистрация продавца JJ Seller (TR / RU / KZ) с анимационной сверкой.
 * Регистрация по телефону — только турецкий номер (+90), без флагов.
 */

const TX = {
  ru: {
    guideBtn: 'Гид',
    skip: 'Скрыть',
    next: 'Далее',
    startReg: 'Открыть магазин',
    goLogin: 'Уже есть аккаунт · Войти',
    slides: [
      {
        badge: 'Шаг 1 · Старт за 1 минуту',
        title: 'Откройте магазин на JJ Market',
        desc: 'Укажите название магазина, имя и турецкий номер +90 (или e-mail). Без ИНН и бумажных договоров.',
        cardTop: 'Новый магазин',
        cardVal: 'Lale Boutique',
        cardSub: 'Стамбул · Активен сразу',
      },
      {
        badge: 'Шаг 2 · Продажи в Казахстан',
        title: 'Товары в ₺ — заказы в ₸',
        desc: 'Загружайте фото и цены в лирах. Покупатели в Алматы, Астане и Шымкенте сразу видят цену в тенге.',
        cardTop: 'Новый заказ · Алматы',
        cardVal: '15 824 ₸',
        cardSub: 'Лоферы · 1 шт · Оплачено',
      },
      {
        badge: 'Шаг 3 · Карго и выплаты',
        title: 'Cargo QR и быстрые выплаты',
        desc: 'На каждый заказ Cargo API сам выдаёт QR-код для сдачи в Laleli. Деньги сразу видны на балансе.',
        cardTop: 'IST-LAL → ALA',
        cardVal: 'JJ-TR-ALA-160319',
        cardSub: 'QR-этикетка готова за 1 сек',
      },
    ],
    loginTitle: 'Кабинет продавца',
    loginSub: 'Управляйте товарами, заказами и продажами в Казахстан',
    perks: ['Старт за 1 мин', 'Cargo QR', 'Live-аналитика'],
    phone: 'Телефон',
    mail: 'E-mail',
    pass: 'Пароль',
    passPh: 'Введите пароль',
    forgot: 'Забыли пароль?',
    login: 'Войти в кабинет',
    sms: 'По SMS-коду',
    demoFill: 'Демо · admin',
    demoLoaded: 'Демо-данные подставлены',
    bad: 'Неверный логин или пароль',
    loginHint: 'Номер +90, e-mail или admin',
    or: 'или через аккаунт',
    google: 'Google',
    apple: 'Apple',
    newSeller: 'Новый продавец?',
    newSellerSub: 'Откройте магазин за 1 минуту',
    regBtn: 'Создать',
    hasAcc: 'Уже есть аккаунт?',
    // Register
    stepLabels: ['Данные', 'Код'],
    regTitle: 'Открыть магазин',
    regSub: 'Регистрация продавцов из Турции — просто и понятно',
    regGuideToggle: 'Как пройти регистрацию? (3 шага)',
    regGuideSteps: [
      'Введите название магазина и ваше имя',
      'Укажите турецкий номер +90 или e-mail и пароль',
      'Введите 4-значный SMS-код — кабинет откроется сразу',
    ],
    watchTour: 'Посмотреть презентацию',
    shopLbl: 'Магазин',
    shopPh: 'Lale Boutique',
    nameLbl: 'Ваше имя',
    namePh: 'Айгерим',
    phoneLbl: 'Турецкий номер телефона',
    mailLbl: 'Электронная почта',
    contactPhoneNote: 'Код подтверждения придёт по SMS на +90',
    contactMailNote: 'Код подтверждения придёт на вашу почту',
    newPassPh: 'Придумайте пароль (6+ символов)',
    weak: 'Слабый',
    mid: 'Средний',
    strong: 'Надёжный',
    agreePrefix: 'Принимаю ',
    agree: ['политику конфиденциальности', 'соглашение', 'оферту JJ Market'],
    needAgree: 'Подтвердите согласие с условиями',
    regSubmit: 'Получить код',
    consentShort: ['Продолжая, вы принимаете ', 'правила сервиса', ''],
    // OTP
    otpTitle: 'Подтверждение',
    otpSub: 'Введите 4-значный код, отправленный на',
    otpDemo: 'Вставить демо-код 1234',
    resend: 'Отправить код ещё раз',
    resendIn: (s: number) => `Повторить через 0:${String(s).padStart(2, '0')}`,
    otpBad: 'Неверный код — попробуйте 1234',
    confirm: 'Подтвердить и войти',
    welcome: (n: string) => `Добро пожаловать, ${n}!`,
    // Animated launch verification
    launchTitle: 'Настраиваем ваш кабинет',
    launchSub: 'Проверяем данные и подключаем инструменты продавца',
    launchSteps: [
      'Контакт подтверждён',
      'Магазин зарегистрирован в JJ Seller',
      'Cargo QR и аналитика подключены',
    ],
    // Forgot
    forgotT: 'Восстановление пароля',
    forgotS: 'Укажите номер +90 или e-mail — пришлём код для сброса',
    send: 'Отправить код',
    sent: 'Код отправлен',
    social: 'Вход выполнен (демо)',
  },
  tr: {
    guideBtn: 'Rehber',
    skip: 'Gizle',
    next: 'Devam',
    startReg: 'Mağaza aç',
    goLogin: 'Zaten hesabım var · Giriş yap',
    slides: [
      {
        badge: 'Adım 1 · 1 dakikada hazır',
        title: 'JJ Market’te mağazanızı açın',
        desc: 'Mağaza adı, adınız ve +90 Türkiye numaranızı (veya e-posta) girin. Ek belge gerekmez.',
        cardTop: 'Yeni mağaza',
        cardVal: 'Lale Boutique',
        cardSub: 'İstanbul · Anında aktif',
      },
      {
        badge: 'Adım 2 · Kazakistan’a satış',
        title: 'Fiyatı ₺ girin — ₸ ile satın',
        desc: 'Fotoğraf ve ₺ fiyat ekleyin. Almatı, Astana ve Şımkent’teki alıcılar fiyatı otomatik ₸ görür.',
        cardTop: 'Yeni sipariş · Almatı',
        cardVal: '15 824 ₸',
        cardSub: 'Loafer · 1 adet · Ödendi',
      },
      {
        badge: 'Adım 3 · Kargo QR ve finans',
        title: 'Kargo QR ve hızlı ödemeler',
        desc: 'Her siparişte Kargo API otomatik QR kod üretir. Laleli şubesinde taratın, bakiyenizi takip edin.',
        cardTop: 'IST-LAL → ALA',
        cardVal: 'JJ-TR-ALA-160319',
        cardSub: 'QR etiket 1 saniyede hazır',
      },
    ],
    loginTitle: 'Satıcı paneli',
    loginSub: 'Ürünlerinizi, siparişlerinizi ve Kazakistan satışlarınızı yönetin',
    perks: ['1 dk kurulum', 'Kargo QR', 'Canlı analiz'],
    phone: 'Telefon',
    mail: 'E-posta',
    pass: 'Şifre',
    passPh: 'Şifrenizi girin',
    forgot: 'Şifremi unuttum',
    login: 'Giriş yap',
    sms: 'SMS koduyla',
    demoFill: 'Demo · admin',
    demoLoaded: 'Demo bilgileri dolduruldu',
    bad: 'Kullanıcı adı veya şifre hatalı',
    loginHint: '+90 numara, e-posta veya admin',
    or: 'veya şununla devam et',
    google: 'Google',
    apple: 'Apple',
    newSeller: 'Yeni satıcı mısınız?',
    newSellerSub: '1 dakikada mağazanızı açın',
    regBtn: 'Mağaza aç',
    hasAcc: 'Zaten hesabınız var mı?',
    // Register
    stepLabels: ['Bilgiler', 'Kod'],
    regTitle: 'Mağaza açın',
    regSub: 'Türkiye’deki satıcılar için hızlı ve anlaşılır kayıt',
    regGuideToggle: 'Kayıt nasıl yapılır? (3 adım)',
    regGuideSteps: [
      'Mağaza adınızı ve kendi adınızı yazın',
      '+90 Türkiye numaranızı veya e-postanızı ve şifrenizi girin',
      '4 haneli SMS kodunu onaylayın — paneliniz anında açılır',
    ],
    watchTour: 'Tanıtımı izle',
    shopLbl: 'Mağaza adı',
    shopPh: 'Lale Boutique',
    nameLbl: 'Adınız',
    namePh: 'Jadyra',
    phoneLbl: 'Türkiye telefon numarası',
    mailLbl: 'E-posta adresi',
    contactPhoneNote: 'Doğrulama kodu +90 numaranıza SMS ile gelir',
    contactMailNote: 'Doğrulama kodu e-posta adresinize gelir',
    newPassPh: 'Şifre oluşturun (en az 6 karakter)',
    weak: 'Zayıf',
    mid: 'Orta',
    strong: 'Güçlü',
    agreePrefix: 'Kabul ediyorum: ',
    agree: ['gizlilik politikası', 'sözleşme', 'JJ Market teklifi'],
    needAgree: 'Devam etmek için koşulları kabul edin',
    regSubmit: 'Doğrulama kodu al',
    consentShort: ['Devam ederek ', 'kullanım koşullarını', ' kabul edersiniz'],
    // OTP
    otpTitle: 'Doğrulama kodu',
    otpSub: 'Gönderilen 4 haneli kodu girin:',
    otpDemo: 'Demo kodu gir: 1234',
    resend: 'Kodu tekrar gönder',
    resendIn: (s: number) => `0:${String(s).padStart(2, '0')} sonra tekrar`,
    otpBad: 'Kod hatalı — 1234 deneyin',
    confirm: 'Onayla ve giriş yap',
    welcome: (n: string) => `Hoş geldiniz, ${n}!`,
    // Launch
    launchTitle: 'Paneliniz hazırlanıyor',
    launchSub: 'Bilgiler doğrulanıyor ve satıcı araçları bağlanıyor',
    launchSteps: [
      'İletişim doğrulandı',
      'Mağaza JJ Seller’da açıldı',
      'Kargo QR ve analiz bağlandı',
    ],
    // Forgot
    forgotT: 'Şifre sıfırlama',
    forgotS: '+90 numaranızı veya e-postanızı girin — sıfırlama kodu gönderelim',
    send: 'Kod gönder',
    sent: 'Kod gönderildi',
    social: 'Giriş yapıldı (demo)',
  },
  kk: {
    guideBtn: 'Нұсқаулық',
    skip: 'Жасыру',
    next: 'Келесі',
    startReg: 'Дүкен ашу',
    goLogin: 'Аккаунтым бар · Кіру',
    slides: [
      {
        badge: '1-қадам · 1 минутта бастау',
        title: 'JJ Market-те дүкен ашыңыз',
        desc: 'Дүкен атауы, атыңыз және Түркияның +90 нөмірін (немесе e-mail) енгізіңіз. Артық құжатсыз.',
        cardTop: 'Жаңа дүкен',
        cardVal: 'Lale Boutique',
        cardSub: 'Ыстамбұл · Бірден белсенді',
      },
      {
        badge: '2-қадам · Қазақстанға сатылым',
        title: 'Бағасы ₺ — тапсырыстар ₸',
        desc: 'Фото және ₺ баға қосыңыз. Алматы, Астана, Шымкент сатып алушылары бағаны ₸ түрінде көреді.',
        cardTop: 'Жаңа тапсырыс · Алматы',
        cardVal: '15 824 ₸',
        cardSub: 'Лоферы · 1 дана · Төленді',
      },
      {
        badge: '3-қадам · Cargo QR және төлем',
        title: 'Cargo QR және жылдам төлем',
        desc: 'Әр тапсырысқа Cargo API автоматты QR-код береді. Laleli пунктінде сканерлеп, балансты бақылаңыз.',
        cardTop: 'IST-LAL → ALA',
        cardVal: 'JJ-TR-ALA-160319',
        cardSub: 'QR-этикетка 1 секундта дайын',
      },
    ],
    loginTitle: 'Сатушы кабинеті',
    loginSub: 'Тауарларды, тапсырыстарды және сатылымды бір жерде басқарыңыз',
    perks: ['1 минутта бастау', 'Cargo QR', 'Live-талдау'],
    phone: 'Телефон',
    mail: 'E-mail',
    pass: 'Құпиясөз',
    passPh: 'Құпиясөзді енгізіңіз',
    forgot: 'Ұмыттыңыз ба?',
    login: 'Кабинетке кіру',
    sms: 'SMS-кодпен',
    demoFill: 'Демо · admin',
    demoLoaded: 'Демо деректер толтырылды',
    bad: 'Логин немесе құпиясөз қате',
    loginHint: '+90 нөмірі, e-mail немесе admin',
    or: 'немесе аккаунт арқылы',
    google: 'Google',
    apple: 'Apple',
    newSeller: 'Жаңа сатушысыз ба?',
    newSellerSub: '1 минутта дүкен ашыңыз',
    regBtn: 'Дүкен ашу',
    hasAcc: 'Аккаунтыңыз бар ма?',
    // Register
    stepLabels: ['Деректер', 'Код'],
    regTitle: 'Дүкен ашу',
    regSub: 'Түркия сатушыларына жылдам әрі түсінікті тіркелу',
    regGuideToggle: 'Қалай тіркелу керек? (3 қадам)',
    regGuideSteps: [
      'Дүкен атауын және өз атыңызды енгізіңіз',
      'Түркияның +90 нөмірін немесе e-mail және құпиясөз жазыңыз',
      '4 таңбалы SMS-кодты растаңыз — кабинет бірден ашылады',
    ],
    watchTour: 'Таныстырылымды көру',
    shopLbl: 'Дүкен атауы',
    shopPh: 'Lale Boutique',
    nameLbl: 'Атыңыз',
    namePh: 'Айгерім',
    phoneLbl: 'Түркия телефон нөмірі',
    mailLbl: 'Электрондық пошта',
    contactPhoneNote: 'Растау коды +90 нөміріне SMS арқылы келеді',
    contactMailNote: 'Растау коды поштаңызға келеді',
    newPassPh: 'Құпиясөз ойлап табыңыз (6+ таңба)',
    weak: 'Әлсіз',
    mid: 'Орташа',
    strong: 'Сенімді',
    agreePrefix: 'Қабылдаймын: ',
    agree: ['құпиялық саясаты', 'келісім', 'JJ Market офертасы'],
    needAgree: 'Жалғастыру үшін шарттарды қабылдаңыз',
    regSubmit: 'Код алу',
    consentShort: ['Жалғастыра отырып, ', 'қызмет шарттарын', ' қабылдайсыз'],
    // OTP
    otpTitle: 'Кодты растау',
    otpSub: 'Жіберілген 4 таңбалы кодты енгізіңіз:',
    otpDemo: 'Демо-кодты енгізу: 1234',
    resend: 'Кодты қайта жіберу',
    resendIn: (s: number) => `0:${String(s).padStart(2, '0')} кейін қайта`,
    otpBad: 'Код қате — 1234 енгізіңіз',
    confirm: 'Растау және кіру',
    welcome: (n: string) => `Қош келдіңіз, ${n}!`,
    // Launch
    launchTitle: 'Кабинет дайындалуда',
    launchSub: 'Деректер тексеріліп, сатушы құралдары қосылуда',
    launchSteps: [
      'Байланыс расталды',
      'Дүкен JJ Seller-де тіркелді',
      'Cargo QR және талдау қосылды',
    ],
    // Forgot
    forgotT: 'Құпиясөзді қалпына келтіру',
    forgotS: '+90 нөмірін немесе e-mail енгізіңіз — қалпына келтіру кодын жібереміз',
    send: 'Код жіберу',
    sent: 'Код жіберілді',
    social: 'Кіру орындалды (демо)',
  },
}
type Tx = (typeof TX)['ru']

const ACC_KEY = 'jj-seller-accounts'
const TOUR_KEY = 'jj-seller-tour-seen'
const loadAccounts = (): { id: string; pass: string; shop: string }[] => {
  try { return JSON.parse(localStorage.getItem(ACC_KEY) || '[]') } catch { return [] }
}
const digits = (s: string) => s.replace(/\D/g, '')
const maskPhone = (s: string) => {
  const d = digits(s).slice(0, 10)
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(' ')
}

/* ---------- Плавно анимированный переключатель языка TR · RU · KZ ---------- */
function LangBar() {
  const nav = useNav()
  const idx = Math.max(0, LANG_META.findIndex((m) => m.code === nav.lang))
  return (
    <div className="au2-lang" role="group" aria-label={nav.t.language}>
      <span className="au2-lang-thumb" style={{ transform: `translateX(${idx * 100}%)` }} />
      {LANG_META.map((m) => (
        <button
          key={m.code}
          type="button"
          className={nav.lang === m.code ? 'on' : ''}
          onClick={() => nav.setLang(m.code)}
        >
          {m.short}
        </button>
      ))}
    </div>
  )
}

function HeroTop({
  onBack, onGuide, guideLabel,
}: {
  onBack?: () => void; onGuide?: () => void; guideLabel?: string
}) {
  return (
    <div className="au2-top">
      {onBack ? (
        <button type="button" className="au2-back" onClick={onBack} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
      ) : (
        <div className="au2-brand">
          <span className="au2-logo-box"><img src="/brand/JJ_symbol_white.svg" alt="JJ" /></span>
          <span>JJ <b>Seller</b></span>
        </div>
      )}
      <div className="au2-top-r">
        {onGuide && guideLabel && (
          <button type="button" className="au2-guide-btn" onClick={onGuide}>
            <PlayCircle size={13} />
            <span>{guideLabel}</span>
          </button>
        )}
        <LangBar />
      </div>
    </div>
  )
}

function Seg({ value, items, onChange }: { value: number; items: string[]; onChange: (i: number) => void }) {
  return (
    <div className="au2-seg" role="tablist">
      <i style={{ transform: `translateX(${value * 100}%)` }} />
      {items.map((l, i) => (
        <button
          type="button"
          key={l}
          role="tab"
          aria-selected={value === i}
          className={value === i ? 'on' : ''}
          onClick={() => onChange(i)}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

function Field({ label, right, children }: { label?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="au2-field">
      {(label || right) && (
        <div className="au2-flbl">
          <span>{label}</span>
          {right}
        </div>
      )}
      {children}
    </div>
  )
}

function Inp({
  icon, children, err, ok, right,
}: {
  icon?: ReactNode; children: ReactNode; err?: boolean; ok?: boolean; right?: ReactNode
}) {
  return (
    <label className={'au2-inp' + (err ? ' err' : '') + (ok ? ' ok' : '')}>
      {icon && <span className="au2-ic">{icon}</span>}
      {children}
      {right}
    </label>
  )
}

function TrPrefix() {
  return (
    <span className="au2-tr">
      <em>TR</em>
      <b>+90</b>
    </span>
  )
}

function Pass({
  value, onChange, placeholder, err, meter, tx,
}: {
  value: string; onChange: (v: string) => void; placeholder: string; err?: boolean; meter?: boolean; tx: Tx
}) {
  const [show, setShow] = useState(false)
  const lvl =
    value.length === 0
      ? 0
      : value.length < 6
        ? 1
        : /\d/.test(value) && /[a-zA-Zа-яА-Я]/.test(value) && value.length >= 8
          ? 3
          : 2

  return (
    <>
      <Inp
        icon={<Lock size={16} />}
        err={err}
        right={
          <button type="button" className="au2-eye" onClick={() => setShow(!show)} aria-label="Show password">
            {show ? <Eye size={17} /> : <EyeOff size={17} />}
          </button>
        }
      >
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={meter ? 'new-password' : 'current-password'}
        />
      </Inp>
      {meter && value && (
        <div className={'au-meter l' + lvl}>
          <i /><i /><i />
          <span>{[, tx.weak, tx.mid, tx.strong][lvl]}</span>
        </div>
      )}
    </>
  )
}

/* ================================================================== */
export function Auth({ onDone }: { onDone: (shop?: string) => void }) {
  const nav = useNav()
  const tx: Tx = (TX as any)[nav.lang] ?? TX.ru
  const [view, setView] = useState<'tour' | 'login' | 'register' | 'otp' | 'launch'>(() => {
    try { return localStorage.getItem(TOUR_KEY) === '1' ? 'login' : 'tour' } catch { return 'tour' }
  })
  const [returnTo, setReturnTo] = useState<'login' | 'register'>('login')
  const [otpTo, setOtpTo] = useState('')
  const [pendingShop, setPendingShop] = useState('')
  const [otpForLogin, setOtpForLogin] = useState(false)

  const finishTour = (dest: 'login' | 'register') => {
    try { localStorage.setItem(TOUR_KEY, '1') } catch {}
    setView(dest)
  }

  const openTour = (from: 'login' | 'register') => {
    setReturnTo(from)
    setView('tour')
  }

  return (
    <div className="au2" key={view}>
      <div className="au2-lang-fade" key={nav.lang}>
        {view === 'tour' && (
          <OnboardingTour
            tx={tx}
            onClose={() => finishTour(returnTo)}
            onRegister={() => finishTour('register')}
            onLogin={() => finishTour('login')}
          />
        )}
        {view === 'login' && (
          <Login
            tx={tx}
            onDone={onDone}
            onRegister={() => setView('register')}
            onGuide={() => openTour('login')}
            onSms={(to) => { setOtpTo(to); setOtpForLogin(true); setView('otp') }}
          />
        )}
        {view === 'register' && (
          <Register
            tx={tx}
            onBack={() => setView('login')}
            onGuide={() => openTour('register')}
            onSubmit={(to, shop) => { setOtpTo(to); setPendingShop(shop); setOtpForLogin(false); setView('otp') }}
          />
        )}
        {view === 'otp' && (
          <Otp
            tx={tx}
            to={otpTo}
            fromRegister={!otpForLogin}
            onBack={() => setView(otpForLogin ? 'login' : 'register')}
            onOk={() => {
              if (!otpForLogin) {
                setView('launch')
              } else {
                onDone(pendingShop || undefined)
              }
            }}
          />
        )}
        {view === 'launch' && (
          <LaunchVerify
            tx={tx}
            shop={pendingShop || 'JJ Seller'}
            onFinish={() => {
              if (pendingShop) nav.toast(tx.welcome(pendingShop))
              onDone(pendingShop || undefined)
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ---------- 0. Интерактивный рекламный онбординг (можно скрыть или открыть снова) ---------- */
function OnboardingTour({
  tx, onClose, onRegister, onLogin,
}: {
  tx: Tx; onClose: () => void; onRegister: () => void; onLogin: () => void
}) {
  const [idx, setIdx] = useState(0)
  const slide = tx.slides[idx]

  return (
    <div className="au2-screen tour">
      <div className="au2-tour-bg">
        <div className="au2-glow a" />
        <div className="au2-glow b" />

        <div className="au2-top" style={{ padding: '6px 18px 0' }}>
          <div className="au2-brand">
            <span className="au2-logo-box"><img src="/brand/JJ_symbol_white.svg" alt="JJ" /></span>
            <span>JJ <b>Seller</b></span>
          </div>
          <div className="au2-top-r">
            <LangBar />
            <button type="button" className="au2-skip" onClick={onClose}>{tx.skip}</button>
          </div>
        </div>

        {/* Рекламная анимированная сцена */}
        <div className="au2-stage" key={idx}>
          <div className="au2-orb-ring" />
          {idx === 0 && (
            <div className="au2-demo-card float">
              <div className="au2-dc-shine" />
              <div className="au2-dc-top">
                <span className="au2-dc-ic"><Store size={17} /></span>
                <span>{slide.cardTop}</span>
                <em className="au2-dc-ok"><Check size={11} strokeWidth={3} /></em>
              </div>
              <div className="au2-dc-val">{slide.cardVal}</div>
              <div className="au2-dc-sub">
                <span className="au2-dc-pill">TR +90</span>
                <span>{slide.cardSub}</span>
              </div>
            </div>
          )}
          {idx === 1 && (
            <div className="au2-demo-card float">
              <div className="au2-dc-shine" />
              <div className="au2-dc-top">
                <span className="au2-dc-ic green"><MapPin size={17} /></span>
                <span>{slide.cardTop}</span>
                <em className="au2-dc-live">LIVE</em>
              </div>
              <div className="au2-dc-val">{slide.cardVal}</div>
              <div className="au2-dc-sub">
                <span className="au2-dc-pill green">₺ → ₸</span>
                <span>{slide.cardSub}</span>
              </div>
            </div>
          )}
          {idx === 2 && (
            <div className="au2-demo-card float">
              <div className="au2-dc-shine" />
              <div className="au2-dc-top">
                <span className="au2-dc-ic"><QrCode size={17} /></span>
                <span>{slide.cardTop}</span>
                <em className="au2-dc-ok"><Wallet size={11} /></em>
              </div>
              <div className="au2-dc-qr-row">
                <div className="au2-mini-qr">
                  <QrCode size={34} />
                  <i className="au2-laser" />
                </div>
                <div>
                  <div className="au2-dc-code">{slide.cardVal}</div>
                  <div className="au2-dc-sub" style={{ marginTop: 4 }}>{slide.cardSub}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Нижняя белая карточка описания и навигации */}
      <div className="au2-tour-sheet">
        <div className="au2-tour-copy" key={idx}>
          <span className="au2-tour-badge"><Sparkles size={11} />{slide.badge}</span>
          <h1>{slide.title}</h1>
          <p>{slide.desc}</p>
        </div>

        <div className="au2-tour-dots">
          {tx.slides.map((s, i) => (
            <button
              key={s.badge}
              type="button"
              className={i === idx ? 'on' : ''}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="au2-tour-acts">
          {idx < tx.slides.length - 1 ? (
            <button type="button" className="au2-btn shine" onClick={() => setIdx(idx + 1)}>
              <span>{tx.next}</span>
              <ArrowRight size={17} />
            </button>
          ) : (
            <button type="button" className="au2-btn shine" onClick={onRegister}>
              <span>{tx.startReg}</span>
              <ArrowRight size={17} />
            </button>
          )}
          <button type="button" className="au2-tour-login" onClick={onLogin}>
            {tx.goLogin}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- 1. Вход ---------- */
function Login({
  tx, onDone, onRegister, onGuide, onSms,
}: {
  tx: Tx; onDone: (shop?: string) => void; onRegister: () => void; onGuide: () => void; onSms: (to: string) => void
}) {
  const nav = useNav()
  const [mode, setMode] = useState(0)
  const [id, setId] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)
  const [busy, setBusy] = useState<'' | 'login' | 'google' | 'apple'>('')

  const isAdmin = id.trim().toLowerCase() === 'admin'
  const phoneOk = digits(id).length === 10
  const ready = (isAdmin || (mode === 0 ? phoneOk : /.+@.+\..+/.test(id))) && pass.length > 0

  const submit = () => {
    if (!ready || busy) return
    setBusy('login')
    setErr(false)
    setTimeout(() => {
      const key = mode === 0 && !isAdmin ? digits(id) : id.trim().toLowerCase()
      const acc = loadAccounts().find((a) => a.id === key && a.pass === pass)
      if ((isAdmin && pass === 'admin') || acc) {
        onDone(acc?.shop)
      } else {
        setBusy('')
        setErr(true)
      }
    }, 450)
  }

  const social = (k: 'google' | 'apple') => {
    setBusy(k)
    setTimeout(() => { nav.toast(tx.social); onDone() }, 550)
  }

  const fillDemo = () => {
    setMode(1)
    setId('admin')
    setPass('admin')
    setErr(false)
    nav.toast(tx.demoLoaded)
  }

  const perkIcons = [Zap, QrCode, BarChart3]

  return (
    <div className="au2-screen">
      <div className="au2-hero">
        <div className="au2-glow a" />
        <HeroTop onGuide={onGuide} guideLabel={tx.guideBtn} />
        <div className="au2-hero-copy">
          <h1>{tx.loginTitle}</h1>
          <p>{tx.loginSub}</p>
        </div>
        <div className="au2-perks">
          {tx.perks.map((p, i) => {
            const Ic = perkIcons[i]
            return <span key={p}><Ic size={12} />{p}</span>
          })}
        </div>
      </div>

      <div className="au2-sheet">
        <div className="au2-sheet-main">
          <Seg value={mode} items={[`${tx.phone} +90`, tx.mail]} onChange={(i) => { setMode(i); setId(''); setErr(false) }} />

          <form onSubmit={(e) => { e.preventDefault(); submit() }}>
            <Field label={mode === 0 ? tx.phoneLbl : tx.mailLbl}>
              {mode === 0 ? (
                <Inp err={err} icon={<TrPrefix />}>
                  <input
                    inputMode={isAdmin || /[a-z]/i.test(id) ? 'text' : 'tel'}
                    placeholder="5XX XXX XX XX"
                    value={id}
                    onChange={(e) => {
                      const v = e.target.value
                      setErr(false)
                      setId(/[a-z]/i.test(v) ? v.slice(0, 5) : maskPhone(v))
                    }}
                    autoComplete="tel"
                  />
                </Inp>
              ) : (
                <Inp err={err} icon={<Mail size={16} />}>
                  <input
                    type="text"
                    inputMode="email"
                    placeholder="seller@mail.com"
                    value={id}
                    onChange={(e) => { setErr(false); setId(e.target.value) }}
                    autoComplete="username"
                  />
                </Inp>
              )}
            </Field>

            <Field
              label={tx.pass}
              right={
                <button type="button" className="au2-link" onClick={() => nav.sheet(<ForgotSheet tx={tx} />)}>
                  {tx.forgot}
                </button>
              }
            >
              <Pass value={pass} onChange={(v) => { setErr(false); setPass(v) }} placeholder={tx.passPh} err={err} tx={tx} />
            </Field>

            {err && <div className="au-err"><CircleAlert size={13} />{tx.bad}</div>}

            <button className={'au2-btn' + (ready ? ' shine' : ' dis')} type="submit">
              {busy === 'login' ? <Loader2 size={19} className="au-spin" /> : tx.login}
            </button>
          </form>

          <div className="au2-quick">
            {mode === 0 && (
              <button type="button" className="au2-pill-btn" disabled={!phoneOk} onClick={() => onSms('+90 ' + id)}>
                <Phone size={13} />{tx.sms}
              </button>
            )}
            <button type="button" className="au2-pill-btn demo" onClick={fillDemo}>
              <Sparkles size={13} />{tx.demoFill}
            </button>
          </div>
        </div>

        <div className="au2-sheet-foot">
          <div className="au2-or"><span>{tx.or}</span></div>
          <div className="au2-social-grid">
            <button type="button" className="au2-social g" onClick={() => social('google')}>
              {busy === 'google' ? <Loader2 size={17} className="au-spin" /> : <img src="/brand/google.svg" alt="" />}
              <span>{tx.google}</span>
            </button>
            <button type="button" className="au2-social a" onClick={() => social('apple')}>
              {busy === 'apple' ? <Loader2 size={17} className="au-spin" /> : <img src="/brand/apple.svg" alt="" />}
              <span>{tx.apple}</span>
            </button>
          </div>

          <button type="button" className="au2-cta-card" onClick={onRegister}>
            <span className="au2-cta-ic"><Store size={17} /></span>
            <div className="au2-cta-t">
              <b>{tx.newSeller}</b>
              <small>{tx.newSellerSub}</small>
            </div>
            <span className="au2-cta-go">{tx.regBtn}<ArrowRight size={13} /></span>
          </button>

          <p className="au2-consent">
            {tx.consentShort[0]}
            <a onClick={() => nav.push('agreements')}>{tx.consentShort[1]}</a>
            {tx.consentShort[2]}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------- 2. Регистрация (Шаг 1/2 + скрываемый гид + только +90) ---------- */
function Register({
  tx, onBack, onGuide, onSubmit,
}: {
  tx: Tx; onBack: () => void; onGuide: () => void; onSubmit: (to: string, shop: string) => void
}) {
  const nav = useNav()
  const [shop, setShop] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState(0)
  const [id, setId] = useState('')
  const [pass, setPass] = useState('')
  const [agree, setAgree] = useState(false)
  const [tried, setTried] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const idOk = mode === 0 ? digits(id).length === 10 : /.+@.+\..+/.test(id)
  const ok = { shop: shop.trim().length >= 2, name: name.trim().length >= 2, id: idOk, pass: pass.length >= 6 }
  const ready = Object.values(ok).every(Boolean) && agree

  const submit = () => {
    setTried(true)
    if (!Object.values(ok).every(Boolean)) return
    if (!agree) { nav.toast(tx.needAgree); return }
    const key = mode === 0 ? digits(id) : id.trim().toLowerCase()
    const list = loadAccounts().filter((a) => a.id !== key)
    localStorage.setItem(ACC_KEY, JSON.stringify([...list, { id: key, pass, shop: shop.trim() }]))
    onSubmit(mode === 0 ? '+90 ' + id : id.trim(), shop.trim())
  }

  return (
    <div className="au2-screen">
      <div className="au2-hero reg">
        <div className="au2-glow a" />
        <HeroTop onBack={onBack} onGuide={onGuide} guideLabel={tx.guideBtn} />
        <div className="au2-steps">
          <span className="on"><i>1</i>{tx.stepLabels[0]}</span>
          <em />
          <span><i>2</i>{tx.stepLabels[1]}</span>
        </div>
        <div className="au2-hero-copy">
          <h1>{tx.regTitle}</h1>
          <p>{tx.regSub}</p>
        </div>
      </div>

      <div className="au2-sheet">
        <div className="au2-sheet-main">
          {/* Сворачиваемая подсказка-гид по шагам регистрации */}
          <div className={'au2-acc' + (showGuide ? ' open' : '')}>
            <button type="button" className="au2-acc-h" onClick={() => setShowGuide(!showGuide)}>
              <Sparkles size={14} />
              <span>{tx.regGuideToggle}</span>
              <ChevronDown size={15} className="au2-acc-ic" />
            </button>
            {showGuide && (
              <div className="au2-acc-b">
                {tx.regGuideSteps.map((st, i) => (
                  <div key={st} className="au2-acc-step"><i>{i + 1}</i><span>{st}</span></div>
                ))}
                <button type="button" className="au2-acc-tour" onClick={onGuide}>
                  <PlayCircle size={13} />{tx.watchTour}
                </button>
              </div>
            )}
          </div>

          <div className="au2-row2">
            <Field label={tx.shopLbl}>
              <Inp
                icon={<Store size={15} />}
                err={tried && !ok.shop}
                ok={ok.shop}
                right={ok.shop ? <Check size={14} color="#1fa45a" /> : null}
              >
                <input placeholder={tx.shopPh} value={shop} onChange={(e) => setShop(e.target.value)} autoComplete="organization" />
              </Inp>
            </Field>
            <Field label={tx.nameLbl}>
              <Inp
                icon={<User size={15} />}
                err={tried && !ok.name}
                ok={ok.name}
                right={ok.name ? <Check size={14} color="#1fa45a" /> : null}
              >
                <input placeholder={tx.namePh} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
              </Inp>
            </Field>
          </div>

          <Seg value={mode} items={[`${tx.phone} +90`, tx.mail]} onChange={(i) => { setMode(i); setId('') }} />

          <Field label={mode === 0 ? tx.phoneLbl : tx.mailLbl}>
            {mode === 0 ? (
              <Inp
                err={tried && !ok.id}
                ok={ok.id}
                icon={<TrPrefix />}
                right={ok.id ? <Check size={15} color="#1fa45a" /> : null}
              >
                <input
                  inputMode="tel"
                  placeholder="5XX XXX XX XX"
                  value={id}
                  onChange={(e) => setId(maskPhone(e.target.value))}
                  autoComplete="tel"
                />
              </Inp>
            ) : (
              <Inp
                err={tried && !ok.id}
                ok={ok.id}
                icon={<Mail size={16} />}
                right={ok.id ? <Check size={15} color="#1fa45a" /> : null}
              >
                <input
                  inputMode="email"
                  placeholder="seller@mail.com"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  autoComplete="email"
                />
              </Inp>
            )}
            <div className="au2-note">{mode === 0 ? tx.contactPhoneNote : tx.contactMailNote}</div>
          </Field>

          <Field label={tx.pass}>
            <Pass value={pass} onChange={setPass} placeholder={tx.newPassPh} err={tried && !ok.pass} meter tx={tx} />
          </Field>

          <label className={'au2-check' + (tried && !agree ? ' err' : '')}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span className="box">{agree && <Check size={12} strokeWidth={3} />}</span>
            <span>
              {tx.agreePrefix}
              {tx.agree.map((a, i) => (
                <span key={a}>
                  <a onClick={(e) => { e.preventDefault(); nav.push('agreements') }}>{a}</a>
                  {i < tx.agree.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
          </label>
        </div>

        <div className="au2-sheet-foot">
          <button type="button" className={'au2-btn' + (ready ? ' shine' : ' dis')} onClick={submit}>
            <span>{tx.regSubmit}</span>
            <ArrowRight size={17} />
          </button>
          <div className="au2-foot-line">
            {tx.hasAcc} <button type="button" onClick={onBack}>{tx.login}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- 3. OTP подтверждение (Шаг 2/2) ---------- */
function Otp({
  tx, to, fromRegister, onBack, onOk,
}: {
  tx: Tx; to: string; fromRegister: boolean; onBack: () => void; onOk: () => void
}) {
  const [code, setCode] = useState('')
  const [err, setErr] = useState(false)
  const [left, setLeft] = useState(59)
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const nav = useNav()

  useEffect(() => { ref.current?.focus() }, [])
  useEffect(() => {
    if (left <= 0) return
    const timer = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(timer)
  }, [left])

  const check = (c: string) => {
    if (c.length < 4 || busy) return
    setBusy(true)
    setTimeout(() => {
      if (c === '1234') onOk()
      else { setBusy(false); setErr(true); setCode('') }
    }, 400)
  }

  return (
    <div className="au2-screen">
      <div className="au2-hero otp">
        <div className="au2-glow a" />
        <HeroTop onBack={onBack} />
        {fromRegister && (
          <div className="au2-steps">
            <span className="done"><i><Check size={10} strokeWidth={3} /></i>{tx.stepLabels[0]}</span>
            <em className="on" />
            <span className="on"><i>2</i>{tx.stepLabels[1]}</span>
          </div>
        )}
        <div className="au2-otp-hero-ic"><ShieldCheck size={28} /></div>
        <div className="au2-hero-copy center">
          <h1>{tx.otpTitle}</h1>
          <p>{tx.otpSub}</p>
        </div>
        <div className="au2-to-chip">{to}</div>
      </div>

      <div className="au2-sheet">
        <div className="au2-sheet-main otp">
          <label className={'au2-otp' + (err ? ' err' : '')} onClick={() => ref.current?.focus()}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={(code.length === i ? 'cur ' : '') + (code[i] ? 'fill' : '')}>
                {code[i] ?? ''}
              </span>
            ))}
            <input
              ref={ref}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              maxLength={4}
              onChange={(e) => {
                const v = digits(e.target.value).slice(0, 4)
                setErr(false)
                setCode(v)
                check(v)
              }}
            />
          </label>

          {err && <div className="au-err" style={{ justifyContent: 'center' }}><CircleAlert size={13} />{tx.otpBad}</div>}

          <button type="button" className="au2-pill-btn demo center" onClick={() => { setCode('1234'); check('1234') }}>
            <KeyRound size={14} />{tx.otpDemo}
          </button>
        </div>

        <div className="au2-sheet-foot">
          <button
            type="button"
            className={'au2-btn' + (code.length === 4 ? ' shine' : ' dis')}
            onClick={() => check(code)}
          >
            {busy ? <Loader2 size={19} className="au-spin" /> : tx.confirm}
          </button>

          <button
            type="button"
            className="au2-resend"
            disabled={left > 0}
            onClick={() => { setLeft(59); nav.toast(tx.sent) }}
          >
            {left > 0 ? tx.resendIn(left) : tx.resend}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- 4. Анимационная сверка при завершении регистрации (рекламный эффект) ---------- */
function LaunchVerify({ tx, shop, onFinish }: { tx: Tx; shop: string; onFinish: () => void }) {
  const [doneCount, setDoneCount] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setDoneCount(1), 420)
    const t2 = setTimeout(() => setDoneCount(2), 920)
    const t3 = setTimeout(() => setDoneCount(3), 1420)
    const t4 = setTimeout(() => onFinish(), 2150)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onFinish])

  return (
    <div className="au2-launch">
      <div className="au2-glow a" />
      <div className="au2-glow b" />

      <div className="au2-launch-emblem">
        <span className="au2-pulse r1" />
        <span className="au2-pulse r2" />
        <div className="au2-launch-logo">
          <img src="/brand/JJ_symbol_white.svg" alt="JJ" />
        </div>
      </div>

      <div className="au2-launch-shop">{shop}</div>
      <h1>{tx.launchTitle}</h1>
      <p>{tx.launchSub}</p>

      <div className="au2-launch-list">
        {tx.launchSteps.map((step, i) => {
          const ok = doneCount > i
          return (
            <div key={step} className={'au2-launch-row' + (ok ? ' ok' : '')}>
              <span className="au2-launch-ic">
                {ok ? <CheckCircle2 size={17} /> : <Loader2 size={15} className="au-spin" />}
              </span>
              <span>{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ForgotSheet({ tx }: { tx: Tx }) {
  const nav = useNav()
  const [v, setV] = useState('')
  return (
    <Sheet title={tx.forgotT}>
      <p className="au2-note" style={{ margin: '0 0 12px', fontSize: 12.5 }}>{tx.forgotS}</p>
      <Inp icon={<Phone size={16} />}>
        <input autoFocus placeholder={tx.loginHint} value={v} onChange={(e) => setV(e.target.value)} />
      </Inp>
      <button
        type="button"
        className={'au2-btn' + (v.trim().length > 3 ? ' shine' : ' dis')}
        style={{ marginTop: 12 }}
        onClick={() => { if (v.trim().length > 3) { nav.sheet(null); nav.toast(tx.sent) } }}
      >
        {tx.send}
      </button>
    </Sheet>
  )
}
