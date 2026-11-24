import { useEffect, useState, type ReactNode } from 'react'
import { Home as HomeIc, Box, ReceiptText, LineChart, User, Wifi, Signal, BatteryFull } from 'lucide-react'
import { NavCtx, type Nav, type Route } from './ui'
import {
  Home, Products, Orders, Analytics, OrderDetail, Withdraw, ProductDetail, Profile, ProfileEdit, Finance, Documents,
  BrandDocs, Rules, Support, Faq, Agreements, AgreementText, Simple, Settings,
} from './screens'
import { ProductForm } from './ProductForm'
import { Auth } from './Auth'
import { ProductAnalytics } from './ProductAnalytics'
import { detectLang, getDict, saveLang, type Lang } from './i18n'

function render(r: Route, t: ReturnType<typeof getDict>): ReactNode {
  switch (r.name) {
    case 'home': return <Home />
    case 'products': return <Products />
    case 'orders': return <Orders />
    case 'analytics': return <Analytics />
    case 'profile': return <Profile />
    case 'order': return <OrderDetail o={r.params} />
    case 'withdraw': return <Withdraw />
    case 'productDetail': return <ProductDetail p={r.params} />
    case 'productAnalytics': return <ProductAnalytics item={r.params.item} rank={r.params.rank} />
    case 'productForm': return <ProductForm edit={r.params?.edit} />
    case 'profileEdit': return <ProfileEdit />
    case 'finance': return <Finance />
    case 'documents': return <Documents />
    case 'brandDocs': return <BrandDocs />
    case 'rules': return <Rules />
    case 'support': return <Support />
    case 'faq': return <Faq />
    case 'agreements': return <Agreements />
    case 'agreement': return <AgreementText title={r.params} />
    case 'reviews': return <Simple title={t.profile.reviews} text={t.orders.empty} />
    case 'settings': return <Settings />
    default: return <Home />
  }
}

function Clock({ lang }: { lang: Lang }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 20000); return () => clearInterval(i) }, [])
  const loc = lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'tr-TR'
  return <>{now.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })}</>
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [stack, setStack] = useState<Route[]>([])
  const [sheet, setSheet] = useState<ReactNode | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = (l: Lang) => {
    setLangState(l)
    saveLang(l)
  }

  const t = getDict(lang)
  const [authed, setAuthed] = useState(() => localStorage.getItem('jj-seller-auth') === '1')
  const login = (shop?: string) => {
    localStorage.setItem('jj-seller-auth', '1')
    if (shop) localStorage.setItem('jj-seller-shop', shop)
    setStack([])
    setTab('home')
    setAuthed(true)
  }
  const logout = () => { localStorage.removeItem('jj-seller-auth'); setStack([]); setSheet(null); setAuthed(false) }

  const nav: Nav = {
    push: (name, params) => { setSheet(null); setStack((s) => [...s, { name, params }]) },
    pop: () => setStack((s) => s.slice(0, -1)),
    tab: (k) => { setStack([]); setTab(k) },
    sheet: setSheet,
    toast: (m) => { setToast(m); setTimeout(() => setToast((x) => (x === m ? null : x)), 1800) },
    lang,
    setLang,
    t,
    logout,
  }

  const TABS = [
    { k: 'home', l: t.tabs.home, ic: HomeIc },
    { k: 'products', l: t.tabs.products, ic: Box },
    { k: 'orders', l: t.tabs.orders, ic: ReceiptText },
    { k: 'analytics', l: t.tabs.analytics, ic: LineChart },
    { k: 'profile', l: t.tabs.profile, ic: User },
  ]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (sheet) setSheet(null); else nav.pop() } }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  })

  const top = stack[stack.length - 1]
  return (
    <NavCtx.Provider value={nav}>
      <div className="device">
        <div className="phone">
          <div className={'statusbar' + ((!authed && !top) || (authed && !top && tab === 'home') ? ' dark' : '')}>
            <Clock lang={lang} />
            <span className="icons"><Wifi size={14} /><Signal size={14} /><BatteryFull size={18} /></span>
          </div>
          {!authed && !top ? (
            <div className="screen"><Auth onDone={login} /></div>
          ) : top ? (
            <div className="screen enter" key={stack.length + top.name}>{render(top, t)}</div>
          ) : (
            <>
              <div className="screen" key={tab}>{render({ name: tab }, t)}</div>
              <nav className="tabbar five">
                {TABS.map(({ k, l, ic: Ic }) => (
                  <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
                    <Ic size={21} strokeWidth={tab === k ? 2.1 : 1.65} />
                    <span>{l}</span>
                  </button>
                ))}
              </nav>
            </>
          )}
          <div className="navbar"><i /></div>
          {sheet}
          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>
    </NavCtx.Provider>
  )
}
