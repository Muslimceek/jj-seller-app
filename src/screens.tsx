import { useMemo, useState } from 'react'
import {
  Plus, ChevronDown, ChevronRight, Search, ArrowUpDown, Sparkles, CheckCircle2,
  Archive, Shapes, Pencil, EyeOff, Eye, MoreHorizontal, SearchX, Truck, ArrowDownLeft, ArrowUpRight,
  CreditCard, Upload, Phone, Mail, Headphones, LogOut, CircleCheck, AlertCircle, History, ChevronUp,
  X, Wallet, FileCheck2, Award, Star, Settings as SettingsIc, HelpCircle, ShieldCheck, FileText,
  Globe, Check, PackageCheck, MapPin, Copy, Landmark, User, Building2, Navigation, Store, Lock, Trash2,
} from 'lucide-react'
import {
  orders as INITIAL_ORDERS, products as INITIAL_PRODUCTS, popular, seller, cargoAddress, transactions, stats,
  ALL_COUNTRIES, loadSellerProfile, saveSellerProfile,
  locTitle, locCity, locAddrLabel, locStreet, locApt, locVariant, locTxTitle, locTxSub,
  type CountryCode, type Order, type OrderStatus, fmt,
} from './data'
import { useNav, T, TopBar, LangSheet, BellBtn, Sheet, SwipeLangBar } from './ui'
import { HomeHero, DocsAlert, Actions, SalesPerformance, goOrders, takeOrdersTab, takeProductsTab } from './HomeHeader'
import { AnalyticsPanel } from './AnalyticsPanel'
import { CdekLabelCard } from './CdekLabelCard'

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: 'purple',
  processing: 'amber',
  shipped: 'blue',
  delivered: 'green',
  cancelled: 'red',
}

const copyText = (text: string, onDone: () => void) => {
  try {
    navigator.clipboard?.writeText(text)
  } catch {}
  onDone()
}

/* ---------- Общая карточка заказа (с городом и покупателем) ---------- */
function OrderCard({
  o, onAdvance,
}: {
  o: Order
  onAdvance?: (id: string, next: OrderStatus) => void
}) {
  const nav = useNav()
  const { t, lang } = nav
  const stLabel = t.orders.status[o.status]
  const cls = STATUS_STYLE[o.status]

  return (
    <div className="oc">
      <button className="oc-main" onClick={() => nav.push('order', o)}>
        <img className="oc-img" src={o.image} alt={locTitle(o.title, lang)} />
        <div className="oc-info">
          <div className="oc-top">
            <b className="oc-title">{locTitle(o.title, lang)}</b>
            <span className={`st-pill ${cls}`}>{stLabel}</span>
          </div>
          <div className="oc-loc">
            <MapPin size={12} />
            <span>{locCity(o.city, lang)} ({o.countryCode}) · {o.buyerName}</span>
          </div>
          <div className="oc-mid">
            <span>#{o.id.slice(-6)} · {o.qty} {t.pieces}</span>
            <b><T n={o.total} /></b>
          </div>
          <div className="oc-date">{o.date}</div>
        </div>
      </button>
      {onAdvance && (o.status === 'new' || o.status === 'processing') && (
        <div className="oc-foot">
          {o.status === 'new' && (
            <button className="oc-act primary" onClick={() => onAdvance(o.id, 'processing')}>
              <Check size={14} strokeWidth={2.5} />{t.orders.confirm}
            </button>
          )}
          {o.status === 'processing' && (
            <button className="oc-act" onClick={() => onAdvance(o.id, 'shipped')}>
              <Truck size={14} />{t.orders.ship}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------- Ana Sayfa (Главная — без баннера верификации, он перенесён в Профиль) ---------- */
export function Home() {
  const nav = useNav()
  const { t } = nav
  return (
    <div className="screen">
      <div className="scroll home">
        <HomeHero />
        <Actions />
        <SalesPerformance />
        <div className="sec-h">
          <h2>{t.home.recentOrders}</h2>
          <button onClick={() => goOrders(nav, 'all')}>{t.home.seeAll}<ChevronRight size={14} /></button>
        </div>
        {INITIAL_ORDERS.slice(0, 3).map((o) => <OrderCard key={o.id} o={o} />)}
      </div>
    </div>
  )
}

/* ---------- Ürünlerim (Товары) ---------- */
type SortMode = 'newest' | 'stock' | 'title'
export function Products() {
  const nav = useNav()
  const { t, lang } = nav
  const [tab, setTab] = useState(takeProductsTab)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortMode>('newest')
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({})

  const items = useMemo(
    () => INITIAL_PRODUCTS.map((p) => ({ ...p, hidden: hiddenMap[p.id] ?? !!p.hidden })),
    [hiddenMap],
  )

  const totalCnt = items.length
  const activeCnt = items.filter((p) => !p.hidden).length
  const lowCnt = items.filter((p) => !p.hidden && p.stock <= 10).length
  const hiddenCnt = items.filter((p) => p.hidden).length

  const list = useMemo(() => {
    const ql = q.trim().toLowerCase()
    const filtered = items.filter((p) => {
      if (tab === 'active' && p.hidden) return false
      if (tab === 'low' && (p.hidden || p.stock > 10)) return false
      if (tab === 'hidden' && !p.hidden) return false
      return p.title.toLowerCase().includes(ql) || locTitle(p.title, lang).toLowerCase().includes(ql)
    })
    if (sort === 'stock') return [...filtered].sort((a, b) => a.stock - b.stock)
    if (sort === 'title') return [...filtered].sort((a, b) => locTitle(a.title, lang).localeCompare(locTitle(b.title, lang)))
    return filtered
  }, [items, tab, q, sort, lang])

  const cycleSort = () => {
    const next: SortMode = sort === 'newest' ? 'stock' : sort === 'stock' ? 'title' : 'newest'
    setSort(next)
    nav.toast(next === 'newest' ? t.products.sortNewest : next === 'stock' ? t.products.sortStock : t.products.sortTitle)
  }

  const toggleHide = (id: string, curHidden: boolean) => {
    setHiddenMap((m) => ({ ...m, [id]: !curHidden }))
    nav.toast(curHidden ? t.products.shownToast : t.products.hiddenToast)
  }

  const tabs = [
    { k: 'all', l: t.products.tabAll, c: totalCnt },
    { k: 'active', l: t.products.tabActive, c: activeCnt },
    { k: 'low', l: t.products.tabLow, c: lowCnt },
    { k: 'hidden', l: t.products.tabHidden, c: hiddenCnt },
  ]

  return (
    <div className="screen pg-soft">
      <div className="topbar pg-head">
        <h1>{t.products.title}<small>({list.length})</small></h1>
        <button className="icon-btn soft" onClick={cycleSort} aria-label="Sort"><ArrowUpDown size={17} /></button>
        <button className="pg-add-ic" onClick={() => nav.push('productForm')} aria-label={t.products.addBtn}><Plus size={18} strokeWidth={2.5} /></button>
      </div>

      <div className="scroll">
        <div className="pr-kpis">
          <button className={'pr-kpi' + (tab === 'all' ? ' on' : '')} onClick={() => setTab('all')}>
            <span>{t.products.kpiTotal}</span><b>{totalCnt}</b>
          </button>
          <button className={'pr-kpi' + (tab === 'active' ? ' on' : '')} onClick={() => setTab('active')}>
            <span>{t.products.kpiActive}</span><b className="g">{activeCnt}</b>
          </button>
          <button className={'pr-kpi' + (tab === 'low' ? ' on' : '')} onClick={() => setTab('low')}>
            <span>{t.products.kpiLow}</span><b className="r">{lowCnt}</b>
          </button>
        </div>

        <div className="cat-search" style={{ marginBottom: 10 }}>
          <Search size={16} className="cat-search-ic" />
          <input placeholder={t.products.searchPh} value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button className="cat-search-x" onClick={() => setQ('')}><X size={12} /></button>}
        </div>

        <div className="chips" style={{ marginBottom: 12 }}>
          {tabs.map((tb) => (
            <button key={tb.k} className={'pg-pill' + (tab === tb.k ? ' on' : '')} onClick={() => setTab(tb.k)}>
              {tb.l}<em>{tb.c}</em>
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="empty">
            <div className="ic"><SearchX size={26} /></div>
            <b>{t.noResults}</b>
            {t.noResultsSub}
          </div>
        ) : (
          list.map((p) => {
            const low = p.stock <= 10
            return (
              <div className={'pr-card' + (p.hidden ? ' dim' : '')} key={p.id}>
                <div className="pr-top" onClick={() => nav.push('productDetail', p)}>
                  <img className="pr-img" src={p.image} alt={locTitle(p.title, lang)} />
                  <div className="pr-info">
                    <div className="pr-row1">
                      <b>{locTitle(p.title, lang)}</b>
                      <span className="pr-price">{p.price}</span>
                    </div>
                    <div className="pr-badges">
                      <span className={p.hidden ? 'b-gray' : 'b-green'}>
                        {p.hidden ? <EyeOff size={10} /> : <CheckCircle2 size={10} />}
                        {p.hidden ? t.products.hidden : t.products.active}
                      </span>
                      <span className={low ? 'b-red' : 'b-gray'}>
                        <Archive size={10} />{t.products.stock}: {p.stock}
                      </span>
                      <span className="b-gray">
                        <Shapes size={10} />{p.variants} {t.products.variants}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pr-acts">
                  <button onClick={() => nav.push('productForm', { edit: p })}>
                    <Pencil size={14} />{t.edit}
                  </button>
                  <button onClick={() => toggleHide(p.id, !!p.hidden)}>
                    {p.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                    {p.hidden ? t.products.show : t.products.hide}
                  </button>
                  <button
                    className="more"
                    onClick={() => nav.sheet(
                      <Sheet title={t.products.actions}>
                        <button className="opt" onClick={() => { nav.sheet(null); nav.toast(t.products.copiedToast) }}>{t.products.duplicate}</button>
                        <button className="opt" onClick={() => { nav.sheet(null); nav.toast(t.products.copiedToast) }}>{t.products.share}</button>
                        <button className="opt" style={{ color: 'var(--red)' }} onClick={() => { nav.sheet(null); nav.toast(t.delete) }}>{t.delete}</button>
                      </Sheet>,
                    )}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="bottom-cta">
        <button className="btn" onClick={() => nav.push('productForm')}>
          <Plus size={17} strokeWidth={2.5} />{t.products.addBtn}
        </button>
      </div>
    </div>
  )
}

/* ---------- Siparişler (Заказы) ---------- */
export function Orders() {
  const nav = useNav()
  const { t } = nav
  const [tab, setTab] = useState(takeOrdersTab)
  const [q, setQ] = useState('')
  const [orderList, setOrderList] = useState<Order[]>(INITIAL_ORDERS)

  const advanceOrder = (id: string, nextStatus: OrderStatus) => {
    setOrderList((cur) => cur.map((o) => (o.id === id ? { ...o, status: nextStatus } : o)))
    nav.toast(nextStatus === 'processing' ? t.orders.confirmedToast : t.orders.shippedToast)
  }

  const tabs: [string, string][] = [
    [t.orders.tabs.all, 'all'],
    [t.orders.tabs.new, 'new'],
    [t.orders.tabs.processing, 'processing'],
    [t.orders.tabs.shipped, 'shipped'],
    [t.orders.tabs.delivered, 'delivered'],
    [t.orders.tabs.cancelled, 'cancelled'],
  ]

  const countOf = (k: string) => (k === 'all' ? orderList.length : orderList.filter((o) => o.status === k).length)

  const list = orderList.filter((o) => {
    const matchTab = tab === 'all' || o.status === tab
    const ql = q.trim().toLowerCase()
    const matchQ =
      !ql ||
      o.title.toLowerCase().includes(ql) ||
      locTitle(o.title, nav.lang).toLowerCase().includes(ql) ||
      o.id.includes(ql) ||
      o.city.toLowerCase().includes(ql) ||
      locCity(o.city, nav.lang).toLowerCase().includes(ql) ||
      o.buyerName.toLowerCase().includes(ql)
    return matchTab && matchQ
  })

  return (
    <div className="screen pg-soft">
      <div className="topbar pg-head">
        <h1>{t.orders.title}<small>({list.length})</small></h1>
        <BellBtn />
      </div>

      <div style={{ padding: '0 14px 8px' }}>
        <div className="cat-search" style={{ marginBottom: 10 }}>
          <Search size={16} className="cat-search-ic" />
          <input placeholder={t.orders.searchPh} value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button className="cat-search-x" onClick={() => setQ('')}><X size={12} /></button>}
        </div>
        <div className="chips">
          {tabs.map(([l, k]) => (
            <button key={k} className={'pg-pill' + (k === tab ? ' on' : '')} onClick={() => setTab(k)}>
              {l}<em>{countOf(k)}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="scroll">
        {list.length === 0 ? (
          <div className="empty">
            <div className="ic"><PackageCheck size={26} /></div>
            <b>{t.orders.empty}</b>
            {t.orders.emptySub}
          </div>
        ) : (
          list.map((o) => <OrderCard key={o.id} o={o} onAdvance={advanceOrder} />)
        )}
      </div>
    </div>
  )
}

/* ---------- Analiz (Аналитика + кликабельные популярные товары) ---------- */
export function Analytics() {
  const nav = useNav()
  const { t, lang } = nav
  return (
    <div className="screen pg-soft">
      <div className="topbar pg-head">
        <h1>{t.analytics.title}</h1>
      </div>
      <div className="scroll">
        <AnalyticsPanel />

        <div className="sec-h" style={{ marginTop: 18 }}>
          <h2>{t.analytics.popularTitle}</h2>
          <span className="pop-hint">{t.tapForStats}</span>
        </div>
        {popular.map((x, i) => (
          <button
            className="pop-card clickable"
            key={x.id}
            onClick={() => nav.push('productAnalytics', { item: x, rank: i + 1 })}
          >
            <span className={'pop-rank r' + (i < 3 ? i + 1 : 'n')}>#{i + 1}</span>
            <img className="pop-img" src={x.image} alt={locTitle(x.title, lang)} />
            <div className="pop-info">
              <div className="pop-top">
                <b>{locTitle(x.title, lang)}</b>
                <span className="pop-rev">{fmt(x.revenue)} ₸</span>
              </div>
              <div className="pop-meta">
                <span className="pop-star"><Star size={11} fill="#f5a623" color="#f5a623" />{x.rating}</span>
                <span>{x.sold} {t.analytics.sold}</span>
                <span className={x.stock <= 10 ? 'low' : ''}>{t.analytics.stock}: {x.stock}</span>
              </div>
            </div>
            <ChevronRight size={16} className="pop-arr" />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Sipariş detayı (обновлённый дизайн заказа + карта/адрес/город/дом/кв) ---------- */
export function OrderDetail({ o }: { o: Order }) {
  const nav = useNav()
  const { t, lang } = nav
  const [status, setStatus] = useState<OrderStatus>(o.status)
  const cls = STATUS_STYLE[status]
  const steps: OrderStatus[] = ['new', 'processing', 'shipped', 'delivered']
  const curIdx = steps.indexOf(status)
  const countryName = t.countries[o.countryCode]
  const cityName = locCity(o.city, lang)
  const streetName = locStreet(o.streetHouse, lang)
  const aptName = locApt(o.apartment, lang)
  const addrLbl = locAddrLabel(o.addressLabel, lang)
  const prodTitle = locTitle(o.title, lang)
  const fullAddress = `${countryName}, ${cityName}, ${streetName}, ${aptName}`

  return (
    <div className="screen pg-soft">
      <TopBar center title={`${t.orders.detailTitle} №${o.id.slice(-6)}`} />
      <div className="scroll">
        {/* Status Stepper Card */}
        <div className="od-card">
          <div className="od-st-top">
            <span className={`st-pill ${cls}`}>{t.orders.status[status]}</span>
            <small>{o.dateLong}</small>
          </div>
          {status !== 'cancelled' && (
            <div className="od-stepper">
              {steps.map((st, idx) => (
                <div key={st} className={'od-step' + (idx <= curIdx ? ' on' : '')}>
                  <i />
                  <span>{t.orders.tabs[st]}</span>
                </div>
              ))}
            </div>
          )}
          {(status === 'new' || status === 'processing') && (
            <button
              className="btn"
              style={{ height: 46, marginTop: 12, fontSize: 15 }}
              onClick={() => {
                const next: OrderStatus = status === 'new' ? 'processing' : 'shipped'
                setStatus(next)
                nav.toast(next === 'processing' ? t.orders.confirmedToast : t.orders.shippedToast)
              }}
            >
              {status === 'new' ? <><Check size={16} />{t.orders.confirm}</> : <><Truck size={16} />{t.orders.ship}</>}
            </button>
          )}
        </div>

        {/* Блок СДЭК (CDEK API): трек-код + переключатель QR-код ↔ Штрихкод + на весь экран + скачать этикетку */}
        <CdekLabelCard order={o} status={status} />

        {/* Visual Location & Delivery Address Card */}
        <div className="od-map-card">
          <div className="od-map-bg">
            <div className="od-map-grid" />
            <div className="od-map-pin">
              <span className="od-pin-ring" />
              <span className="od-pin-dot"><MapPin size={15} /></span>
            </div>
            <div className="od-map-city">
              <Navigation size={11} />
              <b>{cityName}</b>
              <span>· {o.countryCode}</span>
            </div>
            <span className="od-map-tag">{addrLbl}</span>
          </div>

          <div className="od-addr-body">
            <div className="od-addr-title">
              <MapPin size={15} color="#ae33ff" />
              <b>{t.orders.deliveryAddr}</b>
            </div>

            <div className="od-addr-grid">
              <div className="od-addr-cell">
                <small>{t.city}</small>
                <b>{cityName}</b>
              </div>
              <div className="od-addr-cell">
                <small>{t.apartment}</small>
                <b>{aptName}</b>
              </div>
              <div className="od-addr-cell wide">
                <small>{t.house}</small>
                <b>{streetName}</b>
              </div>
            </div>

            <div className="od-buyer-row">
              <span className="od-buyer-av"><User size={16} /></span>
              <div className="od-buyer-info">
                <small>{t.recipient}</small>
                <b>{o.buyerName}</b>
                <span>{o.buyerPhone}</span>
              </div>
            </div>

            <div className="od-addr-acts">
              <a className="od-act-btn primary" href={`tel:${o.buyerPhone.replace(/\s/g, '')}`}>
                <Phone size={14} />{t.callBuyer}
              </a>
              <button className="od-act-btn" onClick={() => copyText(fullAddress, () => nav.toast(t.copied))}>
                <Copy size={14} />{t.copyAddress}
              </button>
            </div>
          </div>
        </div>

        {/* Route & Cargo Drop-off Card */}
        <div className="od-card">
          <div className="od-sec-h">
            <Truck size={15} color="#ae33ff" />
            <b>{t.routeFromTo}</b>
          </div>
          <div className="od-route">
            <div><small>İstanbul</small><b>Laleli Cargo</b></div>
            <span className="od-route-line"><i /></span>
            <div style={{ textAlign: 'right' }}><small>{countryName}</small><b>{cityName}</b></div>
          </div>
          <div className="od-cargo-box">
            <div className="od-cargo-t">
              <b>{t.orders.cargoAddr}</b>
              <p>{cargoAddress}</p>
              <small>{t.orders.cargoHint}</small>
            </div>
            <button className="od-copy-ic" onClick={() => copyText(cargoAddress, () => nav.toast(t.copied))} aria-label={t.copyAddress}>
              <Copy size={15} />
            </button>
          </div>
        </div>

        {/* Product & Payment Card */}
        <div className="od-card">
          <div className="od-prod">
            <img className="oc-img" src={o.image} alt={prodTitle} />
            <div className="od-prod-info">
              <b>{prodTitle}</b>
              <span>{fmt(Math.round(o.total / o.qty))} ₸ × {o.qty} {t.pieces}</span>
            </div>
            <b className="od-prod-sum"><T n={o.total} /></b>
          </div>
          <div className="od-kv-list">
            <div className="kv">{t.orders.orderAmount}<b><T n={o.total} /></b></div>
            <div className="kv">{t.orders.delivery}<b><T n={0} /></b></div>
            <div className="kv total">{t.orders.total}<b><T n={o.total} /></b></div>
            <div className="kv" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0f0f5' }}>
              {t.orders.payment}
              <span className={'st-pill ' + (status === 'cancelled' ? 'blue' : 'green')}>
                {status === 'cancelled' ? t.orders.refunded : t.orders.paid}
              </span>
            </div>
          </div>
        </div>

        {/* Order History Card */}
        <div className="od-card">
          <div className="od-sec-h" style={{ marginBottom: 12 }}>
            <History size={15} color="#ae33ff" />
            <b>{t.orders.timeline}</b>
          </div>
          <div className="timeline">
            <div className="it"><i /><div>{t.orders.status.new}<small>{t.orders.created} · {cityName}</small></div><span className="d">{o.date}</span></div>
            <div className="it"><i /><div>{t.orders.paid}<small>{t.orders.paidRef}</small></div><span className="d">{o.date}</span></div>
            {status !== 'new' && (
              <div className={'it' + (status === 'cancelled' ? ' red' : '')}>
                <i /><div>{t.orders.status[status]}</div><span className="d">{o.date}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Вывод средств (3 валюты ₸ / $ / ₺ + добавление и удаление карт/IBAN) ---------- */
type PayoutCur = 'KZT' | 'USD' | 'TRY'
interface BankCard { id: string; bank: string; number: string; cur: PayoutCur }
const CARDS_KEY = 'jj-seller-cards'
const DEFAULT_CARDS: BankCard[] = [
  { id: 'c1', bank: 'Test Bank', number: 'TR33 •••• •••• 1326', cur: 'TRY' },
  { id: 'c2', bank: 'Garanti BBVA', number: 'TR82 •••• •••• 4901', cur: 'USD' },
]
const loadCards = (): BankCard[] => {
  try {
    const raw = localStorage.getItem(CARDS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return DEFAULT_CARDS
}
const saveCards = (list: BankCard[]) => {
  try { localStorage.setItem(CARDS_KEY, JSON.stringify(list)) } catch {}
}

const PAYOUT_RATE: Record<PayoutCur, { sym: string; label: string; divFromKzt: number; decimals: number }> = {
  KZT: { sym: '₸', label: '₸ KZT', divFromKzt: 1, decimals: 0 },
  USD: { sym: '$', label: '$ USD', divFromKzt: 500, decimals: 2 },
  TRY: { sym: '₺', label: '₺ TRY', divFromKzt: 8.89, decimals: 0 },
}

function AddCardSheet({ onAdd }: { onAdd: (c: BankCard) => void }) {
  const nav = useNav()
  const { t } = nav
  const [bank, setBank] = useState('')
  const [number, setNumber] = useState('')
  const [cur, setCur] = useState<PayoutCur>('TRY')

  const maskCard = (raw: string) => {
    const clean = raw.trim().toUpperCase()
    if (clean.length <= 8) return clean
    return `${clean.slice(0, 4)} •••• •••• ${clean.slice(-4)}`
  }

  const submit = () => {
    if (!bank.trim() || number.trim().length < 6) return
    onAdd({ id: 'c' + Date.now(), bank: bank.trim(), number: maskCard(number), cur })
    nav.sheet(null)
    nav.toast(t.finance.cardAdded)
  }

  return (
    <Sheet title={t.finance.addCardTitle}>
      <div className="pe-sheet-form">
        <label className="pe-field-lbl">{t.finance.bankNameLbl}</label>
        <div className="pe-inp">
          <Landmark size={16} />
          <input autoFocus placeholder={t.finance.bankNamePh} value={bank} onChange={(e) => setBank(e.target.value)} />
        </div>
        <label className="pe-field-lbl" style={{ marginTop: 10 }}>{t.finance.cardNumLbl}</label>
        <div className="pe-inp">
          <CreditCard size={16} />
          <input placeholder={t.finance.cardNumPh} value={number} onChange={(e) => setNumber(e.target.value)} />
        </div>
        <label className="pe-field-lbl" style={{ marginTop: 10 }}>{t.finance.payoutCurrency}</label>
        <div className="wd-cur-seg" style={{ marginBottom: 14 }}>
          {(['TRY', 'USD', 'KZT'] as PayoutCur[]).map((c) => (
            <button key={c} type="button" className={cur === c ? 'on' : ''} onClick={() => setCur(c)}>
              {PAYOUT_RATE[c].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={'btn' + (bank.trim() && number.trim().length >= 6 ? '' : ' dis')}
          style={{ height: 50, borderRadius: 14 }}
          onClick={submit}
        >
          <Plus size={17} />{t.finance.addCardBtn}
        </button>
      </div>
    </Sheet>
  )
}

export function Withdraw() {
  const nav = useNav()
  const { t } = nav
  const [cur, setCur] = useState<PayoutCur>('TRY')
  const [sum, setSum] = useState('')
  const [cards, setCards] = useState<BankCard[]>(loadCards)
  const [selectedId, setSelectedId] = useState<string>(() => loadCards()[0]?.id ?? '')

  const meta = PAYOUT_RATE[cur]
  const avail = meta.decimals ? Number((seller.balance / meta.divFromKzt).toFixed(2)) : Math.round(seller.balance / meta.divFromKzt)
  const fmtVal = (v: number) =>
    meta.decimals
      ? v.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : fmt(Math.round(v))

  const presets = [
    { label: '25%', val: meta.decimals ? Number((avail * 0.25).toFixed(2)) : Math.round(avail * 0.25) },
    { label: '50%', val: meta.decimals ? Number((avail * 0.5).toFixed(2)) : Math.round(avail * 0.5) },
    { label: `${t.withdrawAll} · ${fmtVal(avail)} ${meta.sym}`, val: avail },
  ]

  const addCard = (card: BankCard) => {
    const next = [...cards, card]
    setCards(next)
    saveCards(next)
    setSelectedId(card.id)
  }

  const removeCard = (id: string) => {
    const next = cards.filter((c) => c.id !== id)
    setCards(next)
    saveCards(next)
    if (selectedId === id) setSelectedId(next[0]?.id ?? '')
    nav.toast(t.finance.cardDeleted)
  }

  return (
    <div className="screen pg-soft">
      <TopBar center title={t.finance.withdrawTitle} />
      <div className="scroll">
        {/* Тёмно-фиолетовая карточка доступного баланса + выбор валюты ₺ / $ / ₸ */}
        <div className="wd-hero">
          <div className="wd-hero-top">
            <span>{t.home.available}</span>
            <small>{t.finance.rateNote}</small>
          </div>
          <div className="wd-hero-bal">
            {fmtVal(avail)}<small>{meta.sym}</small>
          </div>
          <div className="wd-cur-seg dark">
            {(['TRY', 'USD', 'KZT'] as PayoutCur[]).map((c) => (
              <button
                key={c}
                type="button"
                className={cur === c ? 'on' : ''}
                onClick={() => { setCur(c); setSum('') }}
              >
                {PAYOUT_RATE[c].label}
              </button>
            ))}
          </div>
        </div>

        {/* Сумма вывода */}
        <div className="od-card">
          <div className="wd-sec-h">
            <b>{t.finance.amount}</b>
            <span>{meta.label}</span>
          </div>
          <div className="pf-input big wd-inp">
            <input
              inputMode="decimal"
              placeholder="0"
              value={sum}
              onChange={(e) => setSum(e.target.value.replace(/[^\d.,]/g, ''))}
            />
            <span>{meta.sym}</span>
          </div>
          <div className="wd-presets">
            {presets.map((p) => (
              <button key={p.label} type="button" className={sum === String(p.val) ? 'on' : ''} onClick={() => setSum(String(p.val))}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Карты и IBAN: выбор, удаление, добавление */}
        <div className="od-card">
          <div className="wd-sec-h">
            <b>{t.finance.selectBank}</b>
            <small>{cards.length}</small>
          </div>
          {cards.length === 0 ? (
            <div className="wd-empty">{t.finance.noCards}</div>
          ) : (
            <div className="wd-cards">
              {cards.map((c) => {
                const on = selectedId === c.id
                return (
                  <div key={c.id} className={'wd-card-row' + (on ? ' on' : '')}>
                    <button type="button" className="wd-card-main" onClick={() => setSelectedId(c.id)}>
                      <span className="fin-bank-ic"><Landmark size={17} /></span>
                      <div className="fin-bank-info">
                        <b>{c.bank}<em>{c.cur}</em></b>
                        <small>{c.number}</small>
                      </div>
                      <span className={'cat-check-dot' + (on ? ' on' : '')}>{on && <Check size={11} strokeWidth={3} />}</span>
                    </button>
                    <button
                      type="button"
                      className="wd-card-del"
                      aria-label={t.delete}
                      onClick={() => removeCard(c.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
          <button type="button" className="wd-add-card" onClick={() => nav.sheet(<AddCardSheet onAdd={addCard} />)}>
            <Plus size={16} />{t.finance.addCardBtn}
          </button>
        </div>
      </div>

      <div className="bottom-cta">
        <button
          className={'btn' + (sum && selectedId ? '' : ' dis')}
          style={{ height: 52, borderRadius: 14, fontSize: 15.5 }}
          onClick={() => {
            if (!sum || Number(sum.replace(',', '.')) <= 0) return nav.toast(t.finance.enterAmount)
            if (!selectedId) return nav.toast(t.finance.pickBank)
            nav.toast(`${t.finance.reqSent} · ${sum} ${meta.sym}`)
            nav.pop()
          }}
        >
          <ArrowUpRight size={18} />{t.finance.sendReq}
        </button>
      </div>
    </div>
  )
}

/* ---------- Карточка товара (полное 3:4 фото без обрезки головы + минималистичный анимированный дизайн) ---------- */
export function ProductDetail({ p }: { p: (typeof INITIAL_PRODUCTS)[number] }) {
  const nav = useNav()
  const { t, lang } = nav
  const [fitMode, setFitMode] = useState<'contain' | 'top'>('contain')
  const [openVar, setOpenVar] = useState<number | null>(0)
  const vars = (p.variantList ?? [
    { name: `${t.pf.colorNames['Siyah'] ?? 'Siyah'}, 37`, price: p.price, qty: 5, image: p.image },
    { name: `${t.pf.colorNames['Siyah'] ?? 'Siyah'}, 38`, price: p.price, qty: 5, image: p.image },
  ]).map((v) => ({ ...v, name: locVariant(v.name, lang) }))
  const title = locTitle(p.title, lang)
  const tryPrice = Number(p.price.replace(/[^\d]/g, '')) || 0
  const usdPrice = tryPrice ? (tryPrice / 36).toFixed(1).replace('.', ',') : ''

  return (
    <div className="screen pg-soft">
      <TopBar
        center
        title={t.products.detailTitle}
        right={
          <button className="icon-btn soft" onClick={() => nav.push('productForm', { edit: p })} aria-label={t.edit}>
            <Pencil size={16} />
          </button>
        }
      />
      <div className="scroll" style={{ padding: '0 0 18px' }}>
        {/* Полноразмерный 3:4 кадр — голова и товар целиком без обрезки */}
        <div className="pd-stage">
          <div className="pd-stage-bg" style={{ backgroundImage: `url(${p.gallery ?? p.image})` }} aria-hidden />
          <img
            className={'pd-stage-img ' + fitMode}
            src={p.gallery ?? p.image}
            alt={title}
          />
          <span className="pd-stage-pill ok"><CheckCircle2 size={11} />{t.products.active}</span>
          <button
            type="button"
            className="pd-stage-fit"
            onClick={() => setFitMode((m) => (m === 'contain' ? 'top' : 'contain'))}
          >
            {t.products.detailFullPhoto}
          </button>
        </div>

        <div className="pd-body">
          {/* Заголовок и цена */}
          <div className="pd-head-card">
            <div className="pd-title-row">
              <h1>{title}</h1>
              <div className="pd-price-col">
                <b>{p.price}</b>
                {usdPrice && <small>≈ ${usdPrice}</small>}
              </div>
            </div>
            <div className="pd-kpis">
              <div>
                <span>{t.products.detailTotalStock}</span>
                <b><Archive size={13} />{p.stock} {t.pieces}</b>
              </div>
              <div>
                <span>{t.products.detailVariantsCnt}</span>
                <b><Shapes size={13} />{vars.length}</b>
              </div>
              <div>
                <span>{t.products.detailStatus}</span>
                <b className="ok">{t.products.active}</b>
              </div>
            </div>
          </div>

          {/* Варианты — минималистичные карточки с плавным раскрытием истории */}
          <div className="pd-sec-h">
            <h2>{t.pf.steps[3]}</h2>
            <span>{vars.length} {t.products.variants}</span>
          </div>

          <div className="pd-vars">
            {vars.map((v, i) => {
              const expanded = openVar === i
              const pct = Math.min(100, Math.max(18, Math.round((v.qty / 20) * 100)))
              return (
                <div className={'pd-var' + (expanded ? ' open' : '')} key={i} style={{ animationDelay: `${i * 45}ms` }}>
                  <button type="button" className="pd-var-top" onClick={() => setOpenVar(expanded ? null : i)}>
                    <img src={v.image} alt={v.name} className="pd-var-thumb" />
                    <div className="pd-var-info">
                      <div className="pd-var-r1">
                        <b>{v.name}</b>
                        <span className="st-pill green">{t.products.active}</span>
                      </div>
                      <div className="pd-var-r2">
                        <span className="pd-var-price">{v.price}</span>
                        <span className="pd-var-qty"><Archive size={11} />{v.qty} {t.pieces}</span>
                      </div>
                      <div className="pd-var-bar"><i style={{ width: `${pct}%` }} /></div>
                    </div>
                    <ChevronDown size={16} className={'pd-var-ch' + (expanded ? ' rot' : '')} />
                  </button>
                  {expanded && (
                    <div className="pd-var-extra">
                      <div className="pd-var-hist">
                        <History size={13} />
                        <span>{t.products.stockHistory}: <b>{t.products.stockHistoryEmpty}</b></span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bottom-cta">
        <button className="btn" style={{ height: 50, borderRadius: 14 }} onClick={() => nav.push('productForm', { edit: p })}>
          <Pencil size={16} />{t.edit}
        </button>
      </div>
    </div>
  )
}

/* ---------- Profil (БЕЗ ФЛАГОВ + свайп-переключатель языка!) ---------- */
export function Profile() {
  const nav = useNav()
  const { t } = nav
  const prof = loadSellerProfile()
  const storeTitle = prof.shop || `${prof.name} ${t.home.storeSuffix}`
  const storeLetter = (storeTitle || 'J')[0]?.toUpperCase() || 'J'

  const business = [
    { l: t.profile.finance, r: 'finance', ic: Wallet, bg: '#e8f7ee', c: '#1a8f4c', val: `${fmt(seller.balance)} ₸` },
    { l: t.profile.documents, r: 'documents', ic: FileCheck2, bg: '#eaf2ff', c: '#2563eb' },
    { l: t.profile.brandDocs, r: 'brandDocs', ic: Award, bg: '#f5e8ff', c: '#ae33ff' },
    { l: t.profile.reviews, r: 'reviews', ic: Star, bg: '#fff3dc', c: '#d97706', val: '4.9' },
  ]
  const help = [
    { l: t.profile.support, r: 'support', ic: Headphones, bg: '#f5e8ff', c: '#ae33ff' },
    { l: t.profile.faq, r: 'faq', ic: HelpCircle, bg: '#e6f5fd', c: '#0284c7' },
    { l: t.profile.rules, r: 'rules', ic: ShieldCheck, bg: '#fff0e6', c: '#ea580c' },
    { l: t.profile.agreements, r: 'agreements', ic: FileText, bg: '#f1f1f5', c: '#484848' },
  ]

  return (
    <div className="screen pg-soft">
      <div className="topbar pg-head">
        <h1>{t.profile.title}</h1>
        <BellBtn />
      </div>

      <div className="scroll">
        <button className="prof-hero" onClick={() => nav.push('profileEdit')}>
          <span className="prof-av">{storeLetter}</span>
          <div className="prof-info">
            <b>{storeTitle}</b>
            <small>{prof.phone} · {prof.district}</small>
            <div className="prof-tags">
              <span className="prof-ver"><CheckCircle2 size={11} />{t.profile.storeActive}</span>
              <span className="prof-geo">{prof.countries.join(' · ')}</span>
            </div>
          </div>
          <span className="prof-ed"><Pencil size={16} /></span>
        </button>

        <div className="prof-stats">
          <button onClick={() => nav.tab('products')}>
            <b>{INITIAL_PRODUCTS.length}</b>
            <span>{t.profile.statProducts}</span>
          </button>
          <button onClick={() => nav.push('reviews')}>
            <b>4.9 ★</b>
            <span>{t.profile.statRating}</span>
          </button>
          <button onClick={() => nav.push('finance')}>
            <b>{fmt(seller.balance)} ₸</b>
            <span>{t.profile.statBalance}</span>
          </button>
        </div>

        {/* Верификация магазина перенесена с Главной сюда в Профиль */}
        <div style={{ marginBottom: 14 }}>
          <DocsAlert />
        </div>

        <div className="prof-sec">{t.profile.secBusiness}</div>
        <div className="prof-group">
          {business.map((item) => {
            const Ic = item.ic
            return (
              <button key={item.r} className="prof-row" onClick={() => nav.push(item.r)}>
                <span className="prof-ic" style={{ background: item.bg, color: item.c }}><Ic size={18} /></span>
                <span className="prof-lbl">{item.l}</span>
                {item.val && <em className="prof-val">{item.val}</em>}
                <ChevronRight size={17} className="prof-arr" />
              </button>
            )
          })}
        </div>

        {/* Язык БЕЗ флагов — свайп влево/вправо */}
        <div className="prof-sec">{t.profile.secApp}</div>
        <div className="prof-group">
          <div className="prof-lang-box">
            <div className="prof-lang-h">
              <span className="prof-ic" style={{ background: '#f5e8ff', color: '#ae33ff' }}><Globe size={18} /></span>
              <div className="prof-lang-meta">
                <span className="prof-lbl">{t.language}</span>
                <small>{t.swipeLangHint}</small>
              </div>
            </div>
            <SwipeLangBar variant="light" fullLabels />
          </div>
          <button className="prof-row" onClick={() => nav.push('settings')}>
            <span className="prof-ic" style={{ background: '#f1f1f5', color: '#484848' }}><SettingsIc size={18} /></span>
            <span className="prof-lbl">{t.profile.settings}</span>
            <ChevronRight size={17} className="prof-arr" />
          </button>
        </div>

        <div className="prof-sec">{t.profile.secSupport}</div>
        <div className="prof-group">
          {help.map((item) => {
            const Ic = item.ic
            return (
              <button key={item.r} className="prof-row" onClick={() => nav.push(item.r)}>
                <span className="prof-ic" style={{ background: item.bg, color: item.c }}><Ic size={18} /></span>
                <span className="prof-lbl">{item.l}</span>
                <ChevronRight size={17} className="prof-arr" />
              </button>
            )
          })}
        </div>

        <button className="prof-logout" onClick={() => (nav.logout ? nav.logout() : nav.toast(t.profile.logoutToast))}>
          <LogOut size={17} />{t.profile.logout}
        </button>
        <div style={{ textAlign: 'center', color: 'var(--ink3)', fontSize: 12, margin: '14px 0 8px' }}>JJ Seller · v1.3.0</div>
      </div>
    </div>
  )
}

/* ---------- Редактировать профиль (современный крупный мобильный экран с сохранением!) ---------- */
export function ProfileEdit() {
  const nav = useNav()
  const { t } = nav
  const ep = t.editProfile
  const initial = loadSellerProfile()
  const [shop, setShop] = useState(initial.shop)
  const [name, setName] = useState(initial.name)
  const [sur, setSur] = useState(initial.surname)
  const [district, setDistrict] = useState(initial.district)
  const [phone, setPhone] = useState(initial.phone.replace(/^\+90\s*/, ''))
  const [email, setEmail] = useState(initial.email)
  const [countries, setCountries] = useState<CountryCode[]>(initial.countries)

  const toggleCountry = (cc: CountryCode) => {
    setCountries((cur) => {
      if (cur.includes(cc)) return cur.length > 1 ? cur.filter((x) => x !== cc) : cur
      return [...cur, cc]
    })
  }

  const save = () => {
    const cleanShop = shop.trim() || initial.shop
    const cleanName = name.trim() || initial.name
    const cleanPhone = phone.trim() ? `+90 ${phone.trim()}` : initial.phone
    saveSellerProfile({
      shop: cleanShop,
      name: cleanName,
      surname: sur.trim(),
      district: district.trim() || 'İstanbul · Laleli',
      phone: cleanPhone,
      email: email.trim() || initial.email,
      countries,
    })
    nav.toast(t.saved)
    nav.pop()
  }

  const openPasswordSheet = () => {
    nav.sheet(
      <Sheet title={ep.passTitle}>
        <div className="pe-sheet-form">
          <label className="pe-field-lbl">{ep.passCur}</label>
          <div className="pe-inp"><Lock size={16} /><input type="password" placeholder="••••••••" /></div>
          <label className="pe-field-lbl">{ep.passNew}</label>
          <div className="pe-inp"><Lock size={16} /><input type="password" placeholder="••••••••" /></div>
          <button className="btn" style={{ marginTop: 14, height: 50 }} onClick={() => { nav.sheet(null); nav.toast(t.saved) }}>
            {t.save}
          </button>
        </div>
      </Sheet>,
    )
  }

  const openDeleteSheet = () => {
    nav.sheet(
      <Sheet title={ep.deleteConfirmTitle} center>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--ink2)', textAlign: 'center', lineHeight: 1.5 }}>
          {ep.deleteConfirmSub}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn ghost" style={{ height: 48 }} onClick={() => nav.sheet(null)}>{t.cancel}</button>
          <button className="btn" style={{ height: 48, background: 'var(--red)' }} onClick={() => { nav.sheet(null); nav.toast(t.profile.deleteAcc) }}>
            {t.delete}
          </button>
        </div>
      </Sheet>,
    )
  }

  const letter = (shop.trim() || name.trim() || 'J')[0].toUpperCase()

  return (
    <div className="screen pg-soft">
      <TopBar center title={t.profile.editTitle} />
      <div className="scroll">
        {/* Живая карточка магазина */}
        <div className="pe-hero">
          <div className="pe-av">{letter}</div>
          <div className="pe-hero-info">
            <b>{shop.trim() || ep.shopPh}</b>
            <small>{name.trim()}{sur.trim() ? ` ${sur.trim()}` : ''} · {district.trim() || 'İstanbul'}</small>
            <div className="pe-badges">
              <span className="pe-pill ok"><CheckCircle2 size={11} />{t.profile.storeActive}</span>
              <span className="pe-pill">{countries.join(' · ')}</span>
            </div>
          </div>
        </div>

        {/* Секция 1: Магазин и владелец */}
        <div className="prof-sec">{ep.storeSection}</div>
        <div className="pe-card">
          <div className="pe-field">
            <label className="pe-field-lbl">{ep.shopName}</label>
            <div className="pe-inp">
              <Store size={17} />
              <input value={shop} placeholder={ep.shopPh} onChange={(e) => setShop(e.target.value)} />
            </div>
          </div>

          <div className="pe-row2">
            <div className="pe-field">
              <label className="pe-field-lbl">{t.profile.name}</label>
              <div className="pe-inp">
                <User size={16} />
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="pe-field">
              <label className="pe-field-lbl">{t.profile.surname}</label>
              <div className="pe-inp">
                <input value={sur} placeholder="—" onChange={(e) => setSur(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="pe-field" style={{ marginBottom: 0 }}>
            <label className="pe-field-lbl">{ep.cityDistrict}</label>
            <div className="pe-inp">
              <MapPin size={17} />
              <input value={district} placeholder={ep.cityDistrictPh} onChange={(e) => setDistrict(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Секция 2: Контакты (только TR +90) */}
        <div className="prof-sec">{ep.contactsSection}</div>
        <div className="pe-card">
          <div className="pe-field">
            <div className="pe-field-top">
              <label className="pe-field-lbl">{t.profile.phone}</label>
              <span className="st-pill green"><Check size={10} style={{ marginRight: 2 }} />{ep.verified}</span>
            </div>
            <div className="pe-inp">
              <span className="au2-tr"><em>TR</em><b>+90</b></span>
              <input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="pe-field" style={{ marginBottom: 0 }}>
            <div className="pe-field-top">
              <label className="pe-field-lbl">{t.profile.email}</label>
              <span className="st-pill amber">{t.profile.unverified}</span>
            </div>
            <div className="pe-inp">
              <Mail size={17} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Секция 3: География доставки (4 страны) */}
        <div className="prof-sec">{ep.geoSection}</div>
        <div className="pe-card">
          <div className="pe-geo-sub">{ep.geoSub}</div>
          <div className="pe-geo-grid">
            {ALL_COUNTRIES.map((cc) => {
              const on = countries.includes(cc)
              return (
                <button
                  key={cc}
                  type="button"
                  className={'pe-geo-chip' + (on ? ' on' : '')}
                  onClick={() => toggleCountry(cc)}
                >
                  <span className="pe-geo-cc">{cc}</span>
                  <span className="pe-geo-nm">{t.countries[cc]}</span>
                  <span className={'pe-geo-chk' + (on ? ' on' : '')}>{on && <Check size={11} strokeWidth={3} />}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Секция 4: Безопасность */}
        <div className="prof-sec">{ep.securitySection}</div>
        <div className="prof-group" style={{ marginBottom: 10 }}>
          <button type="button" className="prof-row" onClick={openPasswordSheet}>
            <span className="prof-ic" style={{ background: '#f5e8ff', color: '#ae33ff' }}><Lock size={17} /></span>
            <span className="prof-lbl">{t.profile.changePass}</span>
            <ChevronRight size={17} className="prof-arr" />
          </button>
          <button type="button" className="prof-row" onClick={openDeleteSheet}>
            <span className="prof-ic" style={{ background: '#fdecec', color: '#e5484d' }}><Trash2 size={17} /></span>
            <span className="prof-lbl" style={{ color: '#e5484d' }}>{t.profile.deleteAcc}</span>
            <ChevronRight size={17} className="prof-arr" />
          </button>
        </div>
      </div>

      <div className="bottom-cta">
        <button className="btn" style={{ height: 52, fontSize: 16, borderRadius: 14 }} onClick={save}>
          <Check size={18} strokeWidth={2.5} />{t.profile.saveChanges}
        </button>
      </div>
    </div>
  )
}

/* ---------- Finans (новый финтех-дизайн: Apple Wallet + Kaspi / WB) ---------- */
export function Finance() {
  const nav = useNav()
  const { t } = nav
  const [hideBal, setHideBal] = useState(false)
  const [txFilter, setTxFilter] = useState<'all' | 'in' | 'out'>('all')

  const list = transactions.filter((tx) => txFilter === 'all' || tx.type === txFilter)
  const monthIn = transactions.filter((tx) => tx.type === 'in').reduce((s, x) => s + x.amount, 0)
  const money = (n: number) => (hideBal ? '••• •••' : fmt(n))

  return (
    <div className="screen pg-soft">
      <TopBar center title={t.finance.title} />
      <div className="scroll">
        {/* Dark-violet fintech balance card */}
        <div className="fin-hero">
          <div className="fin-hero-top">
            <span>{t.finance.currentBalance}</span>
            <button className="fin-eye" onClick={() => setHideBal(!hideBal)} aria-label="Toggle">
              {hideBal ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          <div className="fin-bal">
            {money(seller.balance)}<small>₸</small>
          </div>
          <div className="fin-subgrid">
            <div>
              <span>{t.inProcessing}</span>
              <b>{money(11391)} ₸</b>
            </div>
            <div>
              <span>{t.thisMonth}</span>
              <b className="g">+{money(monthIn)} ₸</b>
            </div>
          </div>
        </div>

        {/* 2 primary fintech actions */}
        <div className="fin-acts">
          <button className="fin-btn primary" onClick={() => nav.push('withdraw')}>
            <ArrowUpRight size={17} />{t.home.withdraw}
          </button>
          <button className="fin-btn" onClick={() => nav.toast(t.finance.linkCard)}>
            <CreditCard size={17} />{t.finance.linkCard}
          </button>
        </div>

        {/* Linked Bank Account */}
        <div className="prof-sec" style={{ marginTop: 14 }}>{t.linkedAccount}</div>
        <button className="fin-bank-card" onClick={() => nav.toast('TR330006100519786457841326')}>
          <span className="fin-bank-ic"><Building2 size={18} /></span>
          <div className="fin-bank-info">
            <b>Test Bank</b>
            <small>TR33 •••• •••• 1326</small>
          </div>
          <span className="st-pill green"><Check size={10} style={{ marginRight: 2 }} />OK</span>
        </button>

        {/* Transaction History + Filter Pills */}
        <div className="fin-hist-h">
          <h2>{t.finance.history}</h2>
        </div>
        <div className="chips" style={{ marginBottom: 10 }}>
          {([
            ['all', t.txAll],
            ['in', t.txIn],
            ['out', t.txOut],
          ] as const).map(([k, l]) => (
            <button key={k} className={'pg-pill' + (txFilter === k ? ' on' : '')} onClick={() => setTxFilter(k)}>
              {l}
            </button>
          ))}
        </div>

        <div className="fin-tx-list">
          {list.map((tx) => {
            const isIn = tx.type === 'in'
            return (
              <div className="fin-tx" key={tx.id}>
                <span className={'fin-tx-ic ' + tx.type}>
                  {isIn ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </span>
                <div className="fin-tx-info">
                  <b>{locTxTitle(tx.title, nav.lang)}</b>
                  <small>{locTxSub(tx.sub, nav.lang)} · {tx.date}</small>
                </div>
                <div className="fin-tx-r">
                  <b className={tx.type}>{isIn ? '+' : '−'}{fmt(tx.amount)} ₸</b>
                  <span>{isIn ? t.txCredited : t.txPaidOut}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function Documents() {
  const nav = useNav()
  const { t } = nav
  return (
    <div className="screen">
      <TopBar title={t.profile.documents} />
      <div className="scroll">
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25, marginTop: 6 }}>{t.home.docsTitle}</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink2)', margin: '8px 0 4px' }}>{t.home.docsSub}</div>
        <div style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 18 }}>JPG, PNG, WEBP, PDF · ≤ 15 MB</div>
        {t.sub.docsList.map((d) => (
          <div className="doc-row" key={d}>
            <div className="n">{d}</div>
            <label style={{ cursor: 'pointer' }}>
              <input type="file" hidden accept="image/*,.pdf" onChange={() => nav.toast(d + ' ✓')} />
              <span style={{ width: 46, height: 46, borderRadius: 10, background: '#ae33ff', color: '#fff', display: 'grid', placeItems: 'center' }}><Upload size={17} /></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BrandDocs() {
  const nav = useNav()
  const { t } = nav
  return (
    <div className="screen">
      <TopBar title={t.profile.brandDocs} />
      <div className="scroll">
        <div className="info-box">
          <div className="h">{t.profile.brandDocs}</div>
          <ul style={{ padding: 0, margin: '8px 0' }}>
            {t.sub.brandDocsReqs.map((r) => <li key={r}><CircleCheck size={13} color="var(--p)" style={{ flex: 'none', marginTop: 1 }} />{r}</li>)}
            <li style={{ color: 'var(--red)' }}><AlertCircle size={13} style={{ flex: 'none', marginTop: 1 }} />{t.sub.brandDocsWarn}</li>
          </ul>
          <a className="link" onClick={() => nav.push('rules')}>{t.profile.rules}</a>
        </div>
      </div>
      <div className="bottom-cta"><button className="btn" onClick={() => nav.toast(t.saved)}><Plus size={16} />{t.continue}</button></div>
    </div>
  )
}

export function Rules() {
  const { t } = useNav()
  return (
    <div className="screen">
      <TopBar title={<span style={{ fontSize: 16, lineHeight: 1.2, display: 'block' }}>{t.profile.rules}</span>} />
      <div className="scroll text">
        {t.sub.rulesSections.map((s) => (
          <div key={s.h}>
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Support() {
  const nav = useNav()
  const { t } = nav
  return (
    <div className="screen">
      <TopBar center title={t.profile.support} />
      <div className="scroll">
        <div className="info-box" style={{ background: '#faf6ff', fontSize: 12 }}>
          <div style={{ color: 'var(--ink3)', fontSize: 11, marginBottom: 8 }}>{t.profile.support}</div>
          <a href="tel:+905397837224" style={{ display: 'flex', gap: 8, color: '#ae33ff', fontSize: 15, textDecoration: 'none', marginBottom: 8 }}><Phone size={16} />+90 539 783 72 24</a>
          <a href="mailto:support@jjmarket.kz" style={{ display: 'flex', gap: 8, color: '#ae33ff', fontSize: 15, textDecoration: 'none' }}><Mail size={16} />support@jjmarket.kz</a>
        </div>
        <div className="empty"><div className="ic" style={{ color: 'var(--ink3)' }}><Headphones size={26} /></div>{t.orders.empty}</div>
      </div>
      <button className="fab" onClick={() => nav.toast(t.profile.support)}><Plus size={20} /></button>
    </div>
  )
}

export function Faq() {
  const nav = useNav()
  const { t } = nav
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="screen">
      <TopBar title={t.profile.faq} />
      <div className="scroll">
        {t.sub.faqs.map(([q, a], i) => (
          <div className="faq" key={i}>
            <button onClick={() => setOpen(open === i ? null : i)}>{q}{open === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
            {open === i && <p>{a}</p>}
          </div>
        ))}
        <div className="faq" style={{ padding: 14, marginTop: 16 }}>
          <button className="btn" style={{ height: 42 }} onClick={() => nav.push('support')}>{t.profile.support}</button>
        </div>
      </div>
    </div>
  )
}

export function Agreements() {
  const nav = useNav()
  const { t } = nav
  return (
    <div className="screen">
      <TopBar title={t.profile.agreements} />
      <div className="scroll">
        {t.sub.agreements.map((d) => (
          <button key={d} className="menu-item" onClick={() => nav.push('agreement', d)}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d}</span>
            <ChevronRight size={18} style={{ flex: 'none' }} />
          </button>
        ))}
      </div>
    </div>
  )
}

export function AgreementText({ title }: { title: string }) {
  const { t } = useNav()
  return (
    <div className="screen">
      <TopBar title={<span style={{ fontSize: 17 }}>{title}</span>} />
      <div className="scroll text">
        <h3>{t.sub.agreementHeading}</h3>
        <p>{t.sub.agreementBody}</p>
      </div>
    </div>
  )
}

export function Simple({ title, text }: { title: string; text: string }) {
  return (
    <div className="screen">
      <TopBar title={title} />
      <div className="empty"><div className="ic"><Sparkles size={24} /></div>{text}</div>
    </div>
  )
}

export function Settings() {
  const { t } = useNav()
  const [push, setPush] = useState(true)
  const [mail, setMail] = useState(false)
  return (
    <div className="screen">
      <TopBar title={t.profile.settings} />
      <div className="scroll">
        {[['Push', push, setPush], ['E-mail', mail, setMail]].map(([l, v, s]: any) => (
          <div className="menu-item" key={l}>{l}<button className={'switch' + (v ? ' on' : '')} onClick={() => s(!v)}><i /></button></div>
        ))}
      </div>
    </div>
  )
}

export { stats, LangSheet }
