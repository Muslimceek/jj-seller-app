import { useState } from 'react'
import {
  Bell, ChevronRight, ArrowUpRight, ArrowDownRight, Eye, EyeOff, FileWarning, Plus,
  Activity, ShoppingBag, Clock, AlertTriangle, Wallet, Globe,
} from 'lucide-react'
import { fmt, seller, orders, products, stats, type Period } from './data'
import { LangSheet, NotificationsSheet, useNav } from './ui'
import { LANG_META } from './i18n'

export let ordersStartTab = 'all'
export const takeOrdersTab = () => { const t = ordersStartTab; ordersStartTab = 'all'; return t }
export const goOrders = (nav: ReturnType<typeof useNav>, t: string) => { ordersStartTab = t; nav.tab('orders') }

export let productsStartTab = 'all'
export const takeProductsTab = () => { const t = productsStartTab; productsStartTab = 'all'; return t }
export const goProducts = (nav: ReturnType<typeof useNav>, t: string) => { productsStartTab = t; nav.tab('products') }

/* ---------- Тёмная шапка + баланс + переключатель языка ---------- */
export function HomeHero() {
  const nav = useNav()
  const { t } = nav
  const [hidden, setHidden] = useState(false)
  const money = (n: number) => (hidden ? '••• •••' : fmt(n))
  const curLang = LANG_META.find((m) => m.code === nav.lang) ?? LANG_META[0]

  return (
    <div className="hero">
      <div className="hero-top">
        <button className="hero-store" onClick={() => nav.tab('profile')}>
          <span className="hero-av">{seller.name[0]}</span>
          <div className="hero-store-t">
            <div className="hero-hi">{t.home.welcome}</div>
            <div className="hero-name">{seller.name} {t.home.storeSuffix}</div>
          </div>
        </button>
        <button className="hero-lang" onClick={() => nav.sheet(<LangSheet />)} aria-label={t.language}>
          <Globe size={13} />
          <span>{curLang.short}</span>
        </button>
        <button className="hero-ic" onClick={() => nav.sheet(<NotificationsSheet />)} aria-label="Notifications">
          <Bell size={19} strokeWidth={1.8} />
          <i className="hero-dot" />
        </button>
      </div>

      <section className="bal">
        <button className="bal-main" onClick={() => nav.push('finance')}>
          <span className="bal-l">{t.home.balance}</span>
          <span className="bal-v">
            {money(seller.balance)}<small>₸</small>
            <span
              className="bal-eye"
              role="button"
              aria-label="Toggle balance"
              onClick={(e) => { e.stopPropagation(); setHidden(!hidden) }}
            >
              {hidden ? <EyeOff size={17} /> : <Eye size={17} />}
            </span>
          </span>
          <span className="bal-w">{money(seller.balance)} ₸ {t.home.available}</span>
        </button>
        <button className="bal-btn" onClick={() => nav.push('withdraw')}>{t.home.withdraw}</button>
      </section>
    </div>
  )
}

export function DocsAlert() {
  const nav = useNav()
  const { t } = nav
  return (
    <button className="bc-alert" onClick={() => nav.push('documents')}>
      <span className="bc-alert-ic"><FileWarning size={16} /></span>
      <span><b>{t.home.docsTitle}</b>{t.home.docsSub}</span>
      <ChevronRight size={15} />
    </button>
  )
}

/* ---------- Hızlı işlemler 2×2 с цветными иконками ---------- */
export function Actions() {
  const nav = useNav()
  const { t } = nav
  const newCnt = orders.filter((o) => o.status === 'new').length
  const procCnt = orders.filter((o) => o.status === 'processing').length
  const lowCnt = products.filter((p) => p.stock <= 10).length

  const cells = [
    { l: t.home.pendingOrders, v: `${newCnt} ${t.pieces}`, ic: ShoppingBag, bg: '#f5e8ff', c: '#ae33ff', hot: newCnt > 0, go: () => goOrders(nav, 'new') },
    { l: t.home.inProgress, v: `${procCnt} ${t.pieces}`, ic: Clock, bg: '#fff3dc', c: '#d97706', hot: procCnt > 0, go: () => goOrders(nav, 'processing') },
    { l: t.home.lowStock, v: `${lowCnt} ${t.pieces}`, ic: AlertTriangle, bg: '#fdecec', c: '#e5484d', hot: lowCnt > 0, go: () => goProducts(nav, 'low') },
    { l: t.home.finance, v: `${fmt(seller.balance)} ₸`, ic: Wallet, bg: '#e8f7ee', c: '#1a8f4c', hot: false, go: () => nav.push('finance') },
  ]

  return (
    <section className="ak">
      <div className="ak-h">
        <h2>{t.home.quickTitle}</h2>
        <button className="ak-add" onClick={() => nav.push('productForm')}>
          <Plus size={14} strokeWidth={2.5} />{t.home.addProduct}
        </button>
      </div>
      <div className="ak-grid2">
        {cells.map((c) => {
          const Ic = c.ic
          return (
            <button key={c.l} className={'ak-tile' + (c.hot ? ' hot' : '')} onClick={c.go}>
              <span className="ak-ic" style={{ background: c.bg, color: c.c }}><Ic size={17} /></span>
              <div className="ak-meta">
                <span>{c.l}</span>
                <b>{c.v}</b>
              </div>
              <ChevronRight size={14} className="ak-arr" />
            </button>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Satış Performansı ---------- */
function Trend({ v, unit }: { v: number; unit: string }) {
  if (v === 0) return <span className="sp-d flat">0{unit}</span>
  const up = v > 0
  return (
    <span className={'sp-d ' + (up ? 'up' : 'down')}>
      {up ? <ArrowUpRight size={11} strokeWidth={2.6} /> : <ArrowDownRight size={11} strokeWidth={2.6} />}
      {up ? '+' : '−'}{unit === '%' ? Math.abs(v).toFixed(1).replace('.', ',') : fmt(Math.abs(v))}{unit}
    </span>
  )
}

export function SalesPerformance() {
  const nav = useNav()
  const { t } = nav
  const [tab, setTab] = useState<Extract<Period, 'Gün' | 'Hafta'>>('Gün')
  const s = stats[tab]
  const prevCount = Math.max(0, Math.round(s.count / (1 + s.deltaPct / 100)))
  const ratio = s.sum ? s.prevSum / s.sum : 0
  const cur = s.points.map((p) => p.sum)
  const prev = s.points.map((_, i) => Math.round(s.points[(i + 1) % s.points.length].sum * ratio))
  const max = Math.max(...cur, ...prev, 1)

  return (
    <section className="sp">
      <div className="sp-h">
        <h2>{t.home.salesPerf}</h2>
        <button onClick={() => nav.tab('analytics')}>
          <Activity size={13} />{t.home.liveMonitor}<ChevronRight size={14} />
        </button>
      </div>
      <div className="sp-tabs">
        {(['Gün', 'Hafta'] as const).map((k) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
            {k === 'Gün' ? t.home.today : t.home.last7d}
          </button>
        ))}
      </div>
      <div className="sp-tiles">
        <div>
          <span>{t.home.ordersLbl}</span>
          <b>{s.count} {t.pieces}</b>
          <Trend v={s.count - prevCount} unit={` ${t.pieces}`} />
        </div>
        <div>
          <span>{tab === 'Gün' ? t.home.todaySales : t.home.weekSales}</span>
          <b>{fmt(s.sum)} ₸</b>
          <Trend v={s.deltaPct} unit="%" />
        </div>
      </div>
      <div className="sp-chart" aria-hidden>
        <span className="sp-max">{fmt(max)} ₸</span>
        {cur.map((v, i) => (
          <div className="sp-col" key={tab + i}>
            <i className="old" style={{ height: (prev[i] / max) * 100 + '%' }} />
            <i className="cur" style={{ height: Math.max(v ? 5 : 2, (v / max) * 100) + '%', animationDelay: i * 35 + 'ms' }} />
          </div>
        ))}
      </div>
      <div className="sp-x">{s.points.map((p, i) => <span key={i}>{p.label}</span>)}</div>
    </section>
  )
}
