import { createContext, useContext, type ReactNode } from 'react'
import { ChevronLeft, X, Check, Bell, Sparkles, MapPin, ChevronRight, ShoppingBag, QrCode } from 'lucide-react'
import { fmt, orders, stats, type Period } from './data'
import { getDict, LANG_META, type Dict, type Lang } from './i18n'

export type Route = { name: string; params?: any }

export interface Nav {
  push: (name: string, params?: any) => void
  pop: () => void
  tab: (name: string) => void
  sheet: (node: ReactNode | null) => void
  toast: (msg: string) => void
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
  logout?: () => void
}
export const NavCtx = createContext<Nav>(null as any)
export const useNav = () => useContext(NavCtx)

export const T = ({ n }: { n: number }) => <>{fmt(n)}<span className="tenge">₸</span></>

export function TopBar({ title, center, right, count }: { title: ReactNode; center?: boolean; right?: ReactNode; count?: number }) {
  const nav = useNav()
  return (
    <div className={'topbar' + (center ? ' center' : '')}>
      <button className="back" onClick={nav.pop}><ChevronLeft size={24} /></button>
      <h1>{title}{count !== undefined && <small>({count})</small>}</h1>
      {right ?? (center ? <span style={{ width: 28 }} /> : null)}
    </div>
  )
}

export const SparkBtn = ({ soft }: { soft?: boolean }) => {
  const nav = useNav()
  return <button className={'icon-btn sparkle' + (soft ? ' soft' : '')} onClick={() => nav.toast('AI asistanı yakında')}><Sparkles size={19} /></button>
}

export function NotificationsSheet() {
  const nav = useNav()
  const { t } = nav
  const incoming = orders.filter((o) => o.status !== 'cancelled').slice(0, 4)
  return (
    <Sheet title={t.notificationsTitle}>
      {incoming.map((o) => (
        <button
          key={o.id}
          className="notif-card"
          onClick={() => { nav.sheet(null); nav.push('order', o) }}
        >
          <span className={'notif-ic ' + (o.status === 'new' ? 'new' : '')}>
            <ShoppingBag size={16} />
          </span>
          <div className="notif-body">
            <div className="notif-top">
              <b>{o.status === 'new' ? t.newOrderNotif : t.orders.status[o.status]}</b>
              <small>{o.date}</small>
            </div>
            <div className="notif-prod">{o.buyerName} · {o.title} ({o.qty} {t.pieces}) · <b>{fmt(o.total)} ₸</b></div>
            <div className="notif-loc">
              <MapPin size={12} />
              <span>{o.city}, {o.streetHouse}, {o.apartment}</span>
              <em className="notif-qr-tag"><QrCode size={10} />QR</em>
            </div>
          </div>
          <ChevronRight size={16} className="notif-arr" />
        </button>
      ))}
    </Sheet>
  )
}

export const BellBtn = () => {
  const nav = useNav()
  return (
    <button className="icon-btn notif-btn" onClick={() => nav.sheet(<NotificationsSheet />)}>
      <Bell size={20} />
      <i className="notif-dot" />
    </button>
  )
}

export function Sheet({ title, children, center, footer, sub }: { title: string; children: ReactNode; center?: boolean; footer?: ReactNode; sub?: ReactNode }) {
  const nav = useNav()
  return (
    <div className="overlay" onClick={() => nav.sheet(null)}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        <div className={'sh' + (center ? ' c' : '')}>
          {title}
          {!center && <button className="x" onClick={() => nav.sheet(null)}><X size={14} /></button>}
        </div>
        {sub}
        <div className="body">{children}</div>
        {footer && <div className="bottom-cta">{footer}</div>}
      </div>
    </div>
  )
}

export function ListSheet({ title, options, value, onPick }: { title: string; options: string[]; value: string; onPick: (v: string) => void }) {
  const nav = useNav()
  return (
    <Sheet title={title}>
      {options.map((o) => (
        <button key={o} className="opt" onClick={() => { onPick(o); nav.sheet(null) }}>
          {o}{o === value && <Check size={16} color="var(--p)" />}
        </button>
      ))}
    </Sheet>
  )
}

export const LANGS = LANG_META.map((m) => [m.code, m.label] as [Lang, string])
export function LangSheet() {
  const nav = useNav()
  const dict = getDict(nav.lang)
  return (
    <Sheet title={dict.language}>
      {LANG_META.map((m) => (
        <button key={m.code} className={'lang-row' + (nav.lang === m.code ? ' on' : '')} onClick={() => { nav.setLang(m.code); nav.sheet(null) }}>
          <span className="lang-code-pill">{m.short}</span>
          <span className="lang-name">{m.label}</span>
          {nav.lang === m.code && <Check size={17} color="#ae33ff" />}
        </button>
      ))}
    </Sheet>
  )
}

/** Плавная кривая продаж: ровная линия → провал → пик → спад (как в приложении) */
export function Chart({ period }: { period: Period }) {
  const s = stats[period]
  const w = 300, h = 150
  const peakY = h - 10 - s.peak * (h - 30)
  const B = h - 32, D = h - 24
  const d = `M8 ${B} C 40 ${B}, 55 ${B}, 75 ${B} C 100 ${B}, 115 ${D}, 140 ${D} C 168 ${D}, 178 ${peakY}, 204 ${peakY} C 232 ${peakY}, 262 ${h - 22}, 292 ${h - 12}`
  return (
    <div className="chart">
      <div className="sum"><T n={s.sum} /></div>
      <div className="cnt">{s.count} satış</div>
      <div className="live"><i />LIVE</div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block', marginTop: 6 }}>
        <defs>
          <linearGradient id={'g' + period} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c58bf9" stopOpacity=".28" />
            <stop offset="1" stopColor="#c58bf9" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L292 ${h} L8 ${h} Z`} fill={`url(#g${period})`} />
        <path key={period} d={d} fill="none" stroke="#b65af7" strokeWidth="2.2" strokeLinecap="round"
          style={{ strokeDasharray: 600, strokeDashoffset: 600, animation: 'draw 1s ease forwards' }} />
        <circle cx="8" cy={B} r="2.5" fill="#b65af7" /><circle cx="75" cy={B} r="2.5" fill="#b65af7" />
        <circle cx="140" cy={D} r="2.5" fill="#b65af7" /><circle cx="292" cy={h - 12} r="2.5" fill="#b65af7" />
      </svg>
      <style>{'@keyframes draw{to{stroke-dashoffset:0}}'}</style>
      <div className="axis">{s.labels.map((l, i) => <span key={i}>{l}</span>)}</div>
    </div>
  )
}

export function PeriodChips({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="chips">
      {(['Gün', 'Hafta', 'Ay', 'Çeyrek'] as Period[]).map((p) => (
        <button key={p} className={'chip' + (p === value ? ' on' : '')} onClick={() => onChange(p)}>{p}</button>
      ))}
    </div>
  )
}
