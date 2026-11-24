import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Eye, EyeOff, ChevronLeft, Phone, Mail, Store, User, Lock, Check, ShieldCheck, KeyRound,
  Sparkles, CircleAlert, Loader2, ArrowRight, QrCode, BarChart3, Zap,
} from 'lucide-react'
import { useNav, Sheet } from './ui'
import { LANG_META } from './i18n'

/*
 * Вход и регистрация продавца JJ Seller (TR / RU / KZ).
 * Премиальный тёмно-фиолетовый hero + приподнятая светлая карточка-лист (Revolut / Kaspi / Apple стиль).
 * Регистрация и вход по телефону — только турецкий номер (+90), без флагов.
 */

const TX = {
  ru: {
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
    regSub: 'Быстрая регистрация продавцов из Турции — без лишних документов',
    regPerks: ['Без ИНН', 'Только +90 или e-mail', 'Доступ сразу'],
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
    consentShort: ['Продолжая, вы принимаете ', 'правила сервиса'],
    // OTP
    otpTitle: 'Подтверждение',
    otpSub: 'Введите 4-значный код, отправленный на',
    otpDemo: 'Вставить демо-код 1234',
    resend: 'Отправить код ещё раз',
    resendIn: (s: number) => `Повторить через 0:${String(s).padStart(2, '0')}`,
    otpBad: 'Неверный код — попробуйте 1234',
    confirm: 'Подтвердить и войти',
    welcome: (n: string) => `Добро пожаловать, ${n}!`,
    // Forgot
    forgotT: 'Восстановление пароля',
    forgotS: 'Укажите номер +90 или e-mail — пришлём код для сброса',
    send: 'Отправить код',
    sent: 'Код отправлен',
    social: 'Вход выполнен (демо)',
  },
  tr: {
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
    regSub: 'Türkiye’deki satıcılar için hızlı kayıt — ek belge gerekmez',
    regPerks: ['Vergi no gerekmez', '+90 veya e-posta', 'Anında erişim'],
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
    // Forgot
    forgotT: 'Şifre sıfırlama',
    forgotS: '+90 numaranızı veya e-postanızı girin — sıfırlama kodu gönderelim',
    send: 'Kod gönder',
    sent: 'Kod gönderildi',
    social: 'Giriş yapıldı (demo)',
  },
  kk: {
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
    regSub: 'Түркия сатушыларына жылдам тіркелу — артық құжатсыз',
    regPerks: ['ЖСН қажет емес', '+90 немесе e-mail', 'Бірден кіру'],
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
const loadAccounts = (): { id: string; pass: string; shop: string }[] => {
  try { return JSON.parse(localStorage.getItem(ACC_KEY) || '[]') } catch { return [] }
}
const digits = (s: string) => s.replace(/\D/g, '')
const maskPhone = (s: string) => {
  const d = digits(s).slice(0, 10)
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(' ')
}

/* ---------- Общие элементы Auth ---------- */
function LangBar() {
  const nav = useNav()
  return (
    <div className="au2-lang" role="group" aria-label={nav.t.language}>
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

function HeroTop({ onBack }: { onBack?: () => void }) {
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
      <LangBar />
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
  const [view, setView] = useState<'login' | 'register' | 'otp'>('login')
  const [otpTo, setOtpTo] = useState('')
  const [pendingShop, setPendingShop] = useState('')
  const [otpForLogin, setOtpForLogin] = useState(false)

  return (
    <div className="au2" key={view}>
      {view === 'login' && (
        <Login
          tx={tx}
          onDone={onDone}
          onRegister={() => setView('register')}
          onSms={(to) => { setOtpTo(to); setOtpForLogin(true); setView('otp') }}
        />
      )}
      {view === 'register' && (
        <Register
          tx={tx}
          onBack={() => setView('login')}
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
            if (pendingShop) nav.toast(tx.welcome(pendingShop))
            onDone(pendingShop || undefined)
          }}
        />
      )}
    </div>
  )
}

/* ---------- Вход (Dark Hero + Elevated Full-Height Sheet) ---------- */
function Login({
  tx, onDone, onRegister, onSms,
}: {
  tx: Tx; onDone: (shop?: string) => void; onRegister: () => void; onSms: (to: string) => void
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
    }, 500)
  }

  const social = (k: 'google' | 'apple') => {
    setBusy(k)
    setTimeout(() => { nav.toast(tx.social); onDone() }, 600)
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
      {/* Dark atmospheric JJ brand hero */}
      <div className="au2-hero">
        <div className="au2-glow" />
        <HeroTop />
        <div className="au2-hero-copy">
          <h1>{tx.loginTitle}</h1>
          <p>{tx.loginSub}</p>
        </div>
        <div className="au2-perks">
          {tx.perks.map((p, i) => {
            const Ic = perkIcons[i]
            return (
              <span key={p}><Ic size={12} />{p}</span>
            )
          })}
        </div>
      </div>

      {/* Elevated white sheet filling remaining height cleanly */}
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

            <button className={'au2-btn' + (ready ? '' : ' dis')} type="submit">
              {busy === 'login' ? <Loader2 size={19} className="au-spin" /> : tx.login}
            </button>
          </form>

          <div className="au2-quick">
            {mode === 0 && (
              <button
                type="button"
                className="au2-pill-btn"
                disabled={!phoneOk}
                onClick={() => onSms('+90 ' + id)}
              >
                <Phone size={13} />{tx.sms}
              </button>
            )}
            <button type="button" className="au2-pill-btn demo" onClick={fillDemo}>
              <Sparkles size={13} />{tx.demoFill}
            </button>
          </div>
        </div>

        {/* Bottom anchored block — zero awkward empty void! */}
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
            {tx.consentShort[2] ?? ''}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------- Регистрация (Dark Hero + 2-Step Guided Sheet, только +90) ---------- */
function Register({
  tx, onBack, onSubmit,
}: {
  tx: Tx; onBack: () => void; onSubmit: (to: string, shop: string) => void
}) {
  const nav = useNav()
  const [shop, setShop] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState(0)
  const [id, setId] = useState('')
  const [pass, setPass] = useState('')
  const [agree, setAgree] = useState(false)
  const [tried, setTried] = useState(false)

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
      {/* Compact dark hero with 2-step progress */}
      <div className="au2-hero reg">
        <div className="au2-glow" />
        <HeroTop onBack={onBack} />
        <div className="au2-steps">
          <span className="on"><i>1</i>{tx.stepLabels[0]}</span>
          <em />
          <span><i>2</i>{tx.stepLabels[1]}</span>
        </div>
        <div className="au2-hero-copy">
          <h1>{tx.regTitle}</h1>
          <p>{tx.regSub}</p>
        </div>
        <div className="au2-perks">
          {tx.regPerks.map((p) => <span key={p}><Check size={11} strokeWidth={3} />{p}</span>)}
        </div>
      </div>

      {/* Elevated scrollable form sheet */}
      <div className="au2-sheet scroll">
        <div className="au2-sheet-main">
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
          <button type="button" className={'au2-btn' + (ready ? '' : ' dis')} onClick={submit}>
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

/* ---------- OTP подтверждение (Шаг 2/2) ---------- */
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
    }, 450)
  }

  return (
    <div className="au2-screen">
      <div className="au2-hero otp">
        <div className="au2-glow" />
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
            className={'au2-btn' + (code.length === 4 ? '' : ' dis')}
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
        className={'au2-btn' + (v.trim().length > 3 ? '' : ' dis')}
        style={{ marginTop: 12 }}
        onClick={() => { if (v.trim().length > 3) { nav.sheet(null); nav.toast(tx.sent) } }}
      >
        {tx.send}
      </button>
    </Sheet>
  )
}
