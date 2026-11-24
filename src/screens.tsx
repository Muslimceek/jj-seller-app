import { useMemo, useState } from 'react'
import {
  Plus, ChevronDown, ChevronRight, Search, ArrowUpDown, Sparkles, CheckCircle2,
  Archive, Shapes, Pencil, EyeOff, Eye, MoreHorizontal, SearchX, Truck, ArrowDownLeft, ArrowUpRight,
  CreditCard, Upload, Phone, Mail, Headphones, LogOut, CircleCheck, AlertCircle, History, ChevronUp,
  X, Wallet, FileCheck2, Award, Star, Settings as SettingsIc, HelpCircle, ShieldCheck, FileText,
  Globe, Check, PackageCheck, MapPin, Copy, Landmark, User, Building2, Navigation, QrCode,
} from 'lucide-react'
import {
  orders as INITIAL_ORDERS, products as INITIAL_PRODUCTS, popular, seller, cargoAddress, transactions, stats,
  type Order, type OrderStatus, fmt,
} from './data'
import { useNav, T, TopBar, LangSheet, BellBtn, Sheet } from './ui'
import { HomeHero, DocsAlert, Actions, SalesPerformance, goOrders, takeOrdersTab, takeProductsTab } from './HomeHeader'
import { AnalyticsPanel } from './AnalyticsPanel'
import { CargoQrCard, CargoQrSheet } from './CargoQrCard'
import { LANG_META } from './i18n'

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
  const { t } = nav
  const stLabel = t.orders.status[o.status]
  const cls = STATUS_STYLE[o.status]

  return (
    <div className="oc">
      <button className="oc-main" onClick={() => nav.push('order', o)}>
        <img className="oc-img" src={o.image} alt={o.title} />
        <div className="oc-info">
          <div className="oc-top">
            <b className="oc-title">{o.title}</b>
            <span className={`st-pill ${cls}`}>{stLabel}</span>
          </div>
          <div className="oc-loc">
            <MapPin size={11} />
            <span>{o.city} · {o.buyerName}</span>
          </div>
          <div className="oc-mid">
            <span>#{o.id.slice(-6)} · {o.qty} {t.pieces}</span>
            <b><T n={o.total} /></b>
          </div>
          <div className="oc-date">{o.date}</div>
        </div>
      </button>
      {o.status !== 'cancelled' && (
        <div className="oc-foot">
          {onAdvance && o.status === 'new' && (
            <button className="oc-act primary" onClick={() => onAdvance(o.id, 'processing')}>
              <Check size={14} strokeWidth={2.5} />{t.orders.confirm}
            </button>
          )}
          {onAdvance && o.status === 'processing' && (
            <button className="oc-act" onClick={() => onAdvance(o.id, 'shipped')}>
              <Truck size={14} />{t.orders.ship}
            </button>
          )}
          <button className="oc-act qr" onClick={() => nav.sheet(<CargoQrSheet order={o} />)}>
            <QrCode size={14} />{t.cargoQrBtn}
          </button>
        </div>
      )}
    </div>
  )
}

/* ---------- Ana Sayfa (Главная) ---------- */
export function Home() {
  const nav = useNav()
  const { t } = nav
  return (
    <div className="screen">
      <div className="scroll home">
        <HomeHero />
        <DocsAlert />
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
  const { t } = nav
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
    const filtered = items.filter((p) => {
      if (tab === 'active' && p.hidden) return false
      if (tab === 'low' && (p.hidden || p.stock > 10)) return false
      if (tab === 'hidden' && !p.hidden) return false
      return p.title.toLowerCase().includes(q.trim().toLowerCase())
    })
    if (sort === 'stock') return [...filtered].sort((a, b) => a.stock - b.stock)
    if (sort === 'title') return [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    return filtered
  }, [items, tab, q, sort])

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
                  <img className="pr-img" src={p.image} alt={p.title} />
                  <div className="pr-info">
                    <div className="pr-row1">
                      <b>{p.title}</b>
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
      o.id.includes(ql) ||
      o.city.toLowerCase().includes(ql) ||
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
  const { t } = nav
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
            <img className="pop-img" src={x.image} alt={x.title} />
            <div className="pop-info">
              <div className="pop-top">
                <b>{x.title}</b>
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
  const { t } = nav
  const [status, setStatus] = useState<OrderStatus>(o.status)
  const cls = STATUS_STYLE[status]
  const steps: OrderStatus[] = ['new', 'processing', 'shipped', 'delivered']
  const curIdx = steps.indexOf(status)
  const fullAddress = `Казахстан, ${o.city}, ${o.streetHouse}, ${o.apartment}`

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
              style={{ height: 42, marginTop: 12, fontSize: 14 }}
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

        {/* Cargo API QR Label Card — auto-generated for incoming orders */}
        <CargoQrCard order={o} status={status} />

        {/* Visual Location & Delivery Address Card (Apple Maps style) */}
        <div className="od-map-card">
          <div className="od-map-bg">
            <div className="od-map-grid" />
            <div className="od-map-pin">
              <span className="od-pin-ring" />
              <span className="od-pin-dot"><MapPin size={15} /></span>
            </div>
            <div className="od-map-city">
              <Navigation size={11} />
              <b>{o.city}</b>
              <span>· KZ</span>
            </div>
            <span className="od-map-tag">{o.addressLabel}</span>
          </div>

          <div className="od-addr-body">
            <div className="od-addr-title">
              <MapPin size={15} color="#ae33ff" />
              <b>{t.orders.deliveryAddr}</b>
            </div>

            <div className="od-addr-grid">
              <div className="od-addr-cell">
                <small>{t.city}</small>
                <b>{o.city}</b>
              </div>
              <div className="od-addr-cell">
                <small>{t.apartment}</small>
                <b>{o.apartment}</b>
              </div>
              <div className="od-addr-cell wide">
                <small>{t.house}</small>
                <b>{o.streetHouse}</b>
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
            <div style={{ textAlign: 'right' }}><small>Kazakhstan</small><b>{o.city}</b></div>
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
            <img className="oc-img" src={o.image} alt={o.title} />
            <div className="od-prod-info">
              <b>{o.title}</b>
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
            <div className="it"><i /><div>{t.orders.status.new}<small>{t.orders.created} · {o.city}</small></div><span className="d">{o.date}</span></div>
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

/* ---------- Yeni Çekim (улучшенный вывод средств) ---------- */
export function Withdraw() {
  const nav = useNav()
  const { t } = nav
  const [sum, setSum] = useState('')
  const [bank, setBank] = useState(true)
  const presets = [5000, 10000, seller.balance]

  return (
    <div className="screen pg-soft">
      <TopBar center title={t.finance.withdrawTitle} />
      <div className="scroll">
        <div className="wd-avail">
          <span>{t.home.available}</span>
          <b><T n={seller.balance} /></b>
        </div>

        <div className="od-card">
          <div className="lbl" style={{ marginTop: 0 }}>{t.finance.amount}</div>
          <div className="pf-input big">
            <input inputMode="decimal" placeholder="0" value={sum} onChange={(e) => setSum(e.target.value.replace(/[^\d.,]/g, ''))} />
            <span>₸</span>
          </div>
          <div className="wd-presets">
            {presets.map((p) => (
              <button key={p} className={sum === String(p) ? 'on' : ''} onClick={() => setSum(String(p))}>
                {p === seller.balance ? `${t.withdrawAll} · ${fmt(p)} ₸` : `${fmt(p)} ₸`}
              </button>
            ))}
          </div>
        </div>

        <div className="od-card">
          <div className="lbl" style={{ marginTop: 0 }}>{t.finance.selectBank}</div>
          <button className={'fin-bank-opt' + (bank ? ' on' : '')} onClick={() => setBank(!bank)}>
            <span className="fin-bank-ic"><Landmark size={18} /></span>
            <div className="fin-bank-info">
              <b>Test Bank</b>
              <small>TR33 •••• •••• 1326</small>
            </div>
            <span className={'cat-check-dot' + (bank ? ' on' : '')}>{bank && <Check size={11} strokeWidth={3} />}</span>
          </button>
        </div>

        <button className="btn" style={{ marginTop: 8 }} onClick={() => {
          if (!sum) return nav.toast(t.finance.enterAmount)
          if (!bank) return nav.toast(t.finance.pickBank)
          nav.toast(t.finance.reqSent); nav.pop()
        }}>{t.finance.sendReq}</button>
      </div>
    </div>
  )
}

/* ---------- Ürün detayı ---------- */
export function ProductDetail({ p }: { p: (typeof INITIAL_PRODUCTS)[number] }) {
  const nav = useNav()
  const { t } = nav
  const vars = p.variantList ?? [{ name: 'Siyah, 37', price: p.price, qty: 5, image: p.image }, { name: 'Siyah, 38', price: p.price, qty: 5, image: p.image }]
  return (
    <div className="screen">
      <TopBar title={<span style={{ fontSize: 17 }}>{t.products.detailTitle}</span>} right={<button className="icon-btn soft" onClick={() => nav.push('productForm', { edit: p })}><Pencil size={16} /></button>} />
      <div className="scroll" style={{ padding: '0 0 16px' }}>
        <div style={{ position: 'relative' }}>
          <img className="gallery" src={p.gallery ?? p.image} alt={p.title} style={{ borderRadius: 0, maxHeight: 300, objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, margin: '16px 0 12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{p.title}</span><span style={{ color: '#ae33ff' }}>{p.price}</span>
          </div>
          <span className="meta"><span style={{ background: 'var(--field)', fontSize: 11.5, padding: '6px 10px' }}><Archive size={12} />{p.stock} {t.pieces}</span></span>
          <div className="h2">{t.pf.steps[3]}</div>
          {vars.map((v, i) => (
            <div className="var-card" key={i}>
              <div className="nm">{v.name}<span className="st-pill green">{t.products.active}</span></div>
              <div className="m"><span>{v.price}</span><span><Archive size={10} /> {v.qty} {t.pieces}</span></div>
              <a className="link" onClick={() => nav.toast(t.products.stockHistoryEmpty)} style={{ fontSize: 11, display: 'inline-flex', gap: 4, alignItems: 'center' }}><History size={11} />{t.products.stockHistory}</a>
              <div><img src={v.image} alt={v.name} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-cta"><button className="btn" onClick={() => nav.push('productForm', { edit: p })}><Pencil size={15} />{t.edit}</button></div>
    </div>
  )
}

/* ---------- Profil (БЕЗ ФЛАГОВ!) ---------- */
export function Profile() {
  const nav = useNav()
  const { t } = nav
  const savedShop = (() => { try { return localStorage.getItem('jj-seller-shop') || '' } catch { return '' } })()
  const storeTitle = savedShop || `${seller.name} ${t.home.storeSuffix}`
  const storeLetter = (savedShop || seller.name)[0]?.toUpperCase() || 'J'

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
            <small>{seller.phone}</small>
            <span className="prof-ver"><CheckCircle2 size={11} />{t.profile.storeActive}</span>
          </div>
          <span className="prof-ed"><Pencil size={15} /></span>
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

        <div className="prof-sec">{t.profile.secBusiness}</div>
        <div className="prof-group">
          {business.map((item) => {
            const Ic = item.ic
            return (
              <button key={item.r} className="prof-row" onClick={() => nav.push(item.r)}>
                <span className="prof-ic" style={{ background: item.bg, color: item.c }}><Ic size={17} /></span>
                <span className="prof-lbl">{item.l}</span>
                {item.val && <em className="prof-val">{item.val}</em>}
                <ChevronRight size={16} className="prof-arr" />
              </button>
            )
          })}
        </div>

        {/* Язык БЕЗ флагов — чистый современный сегмент */}
        <div className="prof-sec">{t.profile.secApp}</div>
        <div className="prof-group">
          <div className="prof-lang-box">
            <div className="prof-lang-h">
              <span className="prof-ic" style={{ background: '#f5e8ff', color: '#ae33ff' }}><Globe size={17} /></span>
              <span className="prof-lbl">{t.language}</span>
            </div>
            <div className="prof-lang-seg">
              {LANG_META.map((m) => (
                <button
                  key={m.code}
                  className={nav.lang === m.code ? 'on' : ''}
                  onClick={() => nav.setLang(m.code)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <button className="prof-row" onClick={() => nav.push('settings')}>
            <span className="prof-ic" style={{ background: '#f1f1f5', color: '#484848' }}><SettingsIc size={17} /></span>
            <span className="prof-lbl">{t.profile.settings}</span>
            <ChevronRight size={16} className="prof-arr" />
          </button>
        </div>

        <div className="prof-sec">{t.profile.secSupport}</div>
        <div className="prof-group">
          {help.map((item) => {
            const Ic = item.ic
            return (
              <button key={item.r} className="prof-row" onClick={() => nav.push(item.r)}>
                <span className="prof-ic" style={{ background: item.bg, color: item.c }}><Ic size={17} /></span>
                <span className="prof-lbl">{item.l}</span>
                <ChevronRight size={16} className="prof-arr" />
              </button>
            )
          })}
        </div>

        <button className="prof-logout" onClick={() => (nav.logout ? nav.logout() : nav.toast(t.profile.logoutToast))}>
          <LogOut size={16} />{t.profile.logout}
        </button>
        <div style={{ textAlign: 'center', color: 'var(--ink3)', fontSize: 12, margin: '14px 0 8px' }}>JJ Seller · v1.2.0</div>
      </div>
    </div>
  )
}

export function ProfileEdit() {
  const nav = useNav()
  const { t } = nav
  const [name, setName] = useState(seller.name)
  const [sur, setSur] = useState('')
  return (
    <div className="screen">
      <TopBar title={t.profile.editTitle} />
      <div className="scroll">
        <div className="lbl">{t.profile.name}</div><div className="field"><input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="lbl">{t.profile.surname}</div><div className="field"><input value={sur} onChange={(e) => setSur(e.target.value)} /></div>
        <div className="lbl">{t.profile.phone}<a onClick={() => nav.toast('SMS')}>{t.profile.changePhone}</a></div>
        <div className="field" style={{ color: 'var(--ink2)' }}>{seller.phone}</div>
        <div className="lbl">{t.profile.email}<a onClick={() => nav.toast('E-mail')}>{t.profile.changeEmail}</a></div>
        <div className="field" style={{ color: 'var(--ink2)' }}>{seller.email}<span className="st-pill red" style={{ marginLeft: 'auto' }}>{t.profile.unverified}</span></div>
        <button className="menu-item" style={{ marginTop: 20 }} onClick={() => nav.toast(t.profile.changePass)}>{t.profile.changePass}<ChevronRight size={18} /></button>
        <button className="menu-item red" onClick={() => nav.toast(t.profile.deleteAcc)}>{t.profile.deleteAcc}</button>
      </div>
      <div className="bottom-cta"><button className="btn" onClick={() => { nav.toast(t.saved); nav.pop() }}>{t.profile.saveChanges}</button></div>
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
                  <b>{tx.title}</b>
                  <small>{tx.sub} · {tx.date}</small>
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
        {['Pasaport / ID', 'Lisans', 'Banka / IBAN'].map((d) => (
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
  const req = [
    'Satın alma belgeleri: üreticiden fatura, tedarik sözleşmesi, resmi distribütörden irsaliyeler',
    'Ürünün orijinalliğini ve menşeini kanıtlayan belgeler',
    'Kazakistan’a ithalat ve satışın yasal olduğunu gösteren belgeler',
    'Uygunluk ve etiketleme belgeleri',
  ]
  return (
    <div className="screen">
      <TopBar title={t.profile.brandDocs} />
      <div className="scroll">
        <div className="info-box">
          <div className="h">{t.profile.brandDocs}</div>
          <ul style={{ padding: 0, margin: '8px 0' }}>
            {req.map((r) => <li key={r}><CircleCheck size={13} color="var(--p)" style={{ flex: 'none', marginTop: 1 }} />{r}</li>)}
            <li style={{ color: 'var(--red)' }}><AlertCircle size={13} style={{ flex: 'none', marginTop: 1 }} />Türkiye’deki bir mağazadan alınmış tek bir fiş yeterli değildir.</li>
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
        <h3>1. Genel kurallar</h3>
        <p>Platformda yalnızca orijinal, yasal olarak satılabilen ve açıklamasıyla birebir uyumlu ürünler listelenebilir.</p>
        <h3>2. Yasaklı ürünler</h3>
        <p>Silah, ilaç, alkol, tütün ürünleri, sahte belgeler ve Kazakistan mevzuatına göre satışı yasak olan diğer ürünler listelenemez.</p>
        <h3>3. Belge gerektiren markalar</h3>
        <p>Bazı markalar yalnızca belge onayıyla satılabilir. Yönetici belgeleri onaylayana kadar bu markadaki ürünler moderasyonda kalır.</p>
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

const FAQS = [
  ['Platformda nasıl satıcı olunur?', 'JJ Seller uygulamasını indirip kayıt olun, mağaza belgelerinizi yükleyin ve moderasyon onayından sonra ürün eklemeye başlayın.'],
  ['Sipariş durumu nasıl takip edilir?', '«Siparişler» bölümünde her siparişin güncel durumunu ve geçmişini görebilirsiniz.'],
  ['Uygun beden nasıl seçilir?', 'Ürün kartına beden tablosu ve kalıp bilgisini ekleyin — TR / RU / INT sistemleri otomatik eşleşir.'],
]
export function Faq() {
  const nav = useNav()
  const { t } = nav
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="screen">
      <TopBar title={t.profile.faq} />
      <div className="scroll">
        {FAQS.map(([q, a], i) => (
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

const DOCS = ['Gizlilik politikası', 'İade Politikası', 'Kişisel Verilerin Korunması', 'Ödeme ve iade', 'Teslimat', 'Üyelik sözleşmesi', 'Публичная оферта JJ Market']
export function Agreements() {
  const nav = useNav()
  const { t } = nav
  return (
    <div className="screen">
      <TopBar title={t.profile.agreements} />
      <div className="scroll">
        {DOCS.map((d) => (
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
  return (
    <div className="screen">
      <TopBar title={<span style={{ fontSize: 17 }}>{title}</span>} />
      <div className="scroll text">
        <h3>GİZLİLİK POLİTİKASI</h3>
        <p>İşbu Gizlilik Politikası, JJ Market mobil uygulamasını kullanan kişilerin kişisel verilerinin toplanması ve işlenmesine ilişkin esasları belirler.</p>
        <p><b>1. Kişisel Veri Sorumlusu</b><br />Şirket Unvanı: “АСХАТ-ЖЖ” Limited Şirketi (ТОО)</p>
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
