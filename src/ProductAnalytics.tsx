import { useState } from 'react'
import { Star, TrendingUp, Eye, ShoppingCart, PackageCheck, MapPin, Ruler, Archive } from 'lucide-react'
import { fmt, periods, type Period, type PopularProduct } from './data'
import { TopBar, useNav } from './ui'

const MULT: Record<Period, number> = {
  'Gün': 0.2,
  'Hafta': 1,
  'Ay': 3.2,
  'Çeyrek': 8.4,
}

export function ProductAnalytics({ item, rank }: { item: PopularProduct; rank: number }) {
  const { t } = useNav()
  const [period, setPeriod] = useState<Period>('Hafta')
  const [selBar, setSelBar] = useState<number | null>(null)

  const m = MULT[period]
  const sold = Math.max(1, Math.round(item.sold * m))
  const rev = Math.round(item.revenue * m)
  const views = Math.max(sold * 8, Math.round(item.views * m))
  const carts = Math.max(sold * 2, Math.round(item.carts * m))
  const conv = ((sold / views) * 100).toFixed(1).replace('.', ',')
  const cartPct = ((carts / views) * 100).toFixed(1).replace('.', ',')

  const bars = item.series.map((v) => Math.max(0, Math.round(v * Math.max(1, m))))
  const maxBar = Math.max(...bars, 1)
  const days = ['1', '2', '3', '4', '5', '6', '7']
  const pIdx = periods.indexOf(period)

  return (
    <div className="screen pg-soft">
      <TopBar center title={t.productAnalytics} />
      <div className="scroll">
        {/* Product hero card */}
        <div className="pa-hero">
          <img src={item.image} alt={item.title} className="pa-img" />
          <div className="pa-info">
            <div className="pa-top">
              <span className={'pop-rank r' + (rank <= 3 ? rank : 'n')}>#{rank}</span>
              <b>{item.title}</b>
            </div>
            <div className="pa-badges">
              <span className="pa-star"><Star size={11} fill="#f5a623" color="#f5a623" />{item.rating}</span>
              <span className={item.stock <= 10 ? 'st-pill red' : 'st-pill green'}>
                <Archive size={10} style={{ marginRight: 3, verticalAlign: '-1px' }} />
                {t.analytics.stock}: {item.stock} {t.pieces}
              </span>
            </div>
          </div>
        </div>

        {/* Period segmented switcher */}
        <div className="an-seg" style={{ marginBottom: 10 }}>
          <div className="an-seg-thumb" style={{ transform: `translateX(${pIdx * 100}%)` }} />
          {periods.map((p) => (
            <button key={p} className={period === p ? 'on' : ''} onClick={() => { setPeriod(p); setSelBar(null) }}>
              {t.analytics.periods[p]}
            </button>
          ))}
        </div>

        {/* 2x2 KPI grid */}
        <div className="an-kpis" style={{ marginBottom: 10 }}>
          <div className="an-kpi on">
            <span className="an-kpi-l">{t.analytics.revenue}</span>
            <b className="an-kpi-v">{fmt(rev)} <small>₸</small></b>
            <div className="an-kpi-f">
              <span className="an-up"><TrendingUp size={10} />+{item.deltaPct.toFixed(1).replace('.', ',')}%</span>
            </div>
          </div>
          <div className="an-kpi">
            <span className="an-kpi-l">{t.analytics.orders}</span>
            <b className="an-kpi-v">{sold} <small>{t.pieces}</small></b>
            <div className="an-kpi-f"><small>{t.analytics.periods[period]}</small></div>
          </div>
          <div className="an-kpi">
            <span className="an-kpi-l">{t.analytics.funnelViews}</span>
            <b className="an-kpi-v">{fmt(views)}</b>
            <div className="an-kpi-f"><small>{t.analytics.conversion}: {conv}%</small></div>
          </div>
          <div className="an-kpi">
            <span className="an-kpi-l">{t.inCart}</span>
            <b className="an-kpi-v">{fmt(carts)}</b>
            <div className="an-kpi-f"><small>{cartPct}%</small></div>
          </div>
        </div>

        {/* Interactive per-product bar chart */}
        <div className="an-chart-card" style={{ marginBottom: 10 }}>
          <div className="an-chart-h">
            <b>{t.analytics.orders} · {t.analytics.periods[period]}</b>
            {selBar !== null && (
              <span className="an-sel-pill">
                <b>{bars[selBar]} {t.pieces}</b>
                <small>≈ {fmt(Math.round((rev / sold) * bars[selBar]))} ₸</small>
              </span>
            )}
          </div>
          <div className="pa-bars">
            {bars.map((v, i) => (
              <button key={period + i} className={'pa-bar-col' + (selBar === i ? ' on' : '')} onClick={() => setSelBar(selBar === i ? null : i)}>
                <em className="pa-bar-v">{v}</em>
                <div className="pa-bar-track">
                  <i style={{ height: `${Math.max(8, (v / maxBar) * 100)}%` }} />
                </div>
                <span>{days[i]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Funnel */}
        <div className="an-funnel" style={{ marginBottom: 10 }}>
          <div className="an-funnel-h">
            <b>{t.analytics.funnelTitle}</b>
            <small>{conv}%</small>
          </div>
          <div className="an-frows">
            <div className="an-frow">
              <div className="an-frow-t"><span><Eye size={13} />{t.analytics.funnelViews}</span><b>{fmt(views)} <em>100%</em></b></div>
              <div className="an-fbar"><i style={{ width: '100%' }} /></div>
            </div>
            <div className="an-frow">
              <div className="an-frow-t"><span><ShoppingCart size={13} />{t.analytics.funnelCart}</span><b>{fmt(carts)} <em>{cartPct}%</em></b></div>
              <div className="an-fbar"><i style={{ width: `${Math.min(100, Math.max(16, Number(cartPct.replace(',', '.')) * 2.5))}%` }} /></div>
            </div>
            <div className="an-frow">
              <div className="an-frow-t"><span><PackageCheck size={13} />{t.analytics.funnelOrders}</span><b>{fmt(sold)} <em>{conv}%</em></b></div>
              <div className="an-fbar"><i className="solid" style={{ width: `${Math.min(100, Math.max(12, Number(conv.replace(',', '.')) * 5))}%` }} /></div>
            </div>
          </div>
        </div>

        {/* Cities & Top sizes */}
        <div className="pa-grid2">
          <div className="pa-box">
            <div className="pa-box-h"><MapPin size={13} /><span>{t.topCities}</span></div>
            {item.cities.map((c) => (
              <div key={c.name} className="pa-city-row">
                <div><span>{c.name}</span><b>{c.pct}%</b></div>
                <div className="an-fbar"><i style={{ width: `${c.pct}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="pa-box">
            <div className="pa-box-h"><Ruler size={13} /><span>{t.topSizes}</span></div>
            <div className="pa-sizes">
              {item.sizes.map((sz) => (
                <div key={sz.size} className="pa-sz-chip">
                  <b>{sz.size}</b>
                  <small>{Math.max(1, Math.round(sz.sold * m))} {t.pieces}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
