import { useState } from 'react'
import { TrendingUp, Eye, ShoppingCart, PackageCheck, X } from 'lucide-react'
import { fmt, periods, stats, type Period } from './data'
import { useNav } from './ui'

type Metric = 'revenue' | 'orders'

function fmtY(val: number, metric: Metric): string {
  if (metric === 'orders') return String(Math.round(val))
  if (val >= 1000) {
    const k = val / 1000
    return (k >= 10 ? Math.round(k) : Number(k.toFixed(1)).toString().replace('.', ',')) + 'k'
  }
  return String(Math.round(val))
}

export function AnalyticsPanel() {
  const { t } = useNav()
  const [period, setPeriod] = useState<Period>('Gün')
  const [metric, setMetric] = useState<Metric>('revenue')
  const [selected, setSelected] = useState<number | null>(null)

  const s = stats[period]
  const pts = s.points
  const ratio = s.sum ? s.prevSum / s.sum : 0.85
  const curVals = pts.map((p) => (metric === 'revenue' ? p.sum : p.count))
  const prevVals = pts.map((_, i) => {
    const ref = pts[(i + 1) % pts.length]
    return metric === 'revenue' ? Math.round(ref.sum * ratio) : Math.max(0, Math.round(ref.count * ratio))
  })

  // Clean Y-axis ticks without duplicate integers
  const rawMax = Math.max(...curVals, ...prevVals, 1)
  const ticks: number[] =
    metric === 'orders'
      ? (() => {
          const top = Math.max(2, Math.ceil(rawMax))
          const step = top <= 4 ? 1 : Math.ceil(top / 4)
          const arr: number[] = []
          for (let v = 0; v <= top; v += step) arr.push(v)
          if (arr[arr.length - 1] < top) arr.push(top)
          return arr
        })()
      : (() => {
          const niceTop = Math.ceil(rawMax / 5000) * 5000 || 5000
          return [0, niceTop * 0.25, niceTop * 0.5, niceTop * 0.75, niceTop]
        })()
  const maxVal = ticks[ticks.length - 1] || 1

  const W = 310
  const H = 144
  const padL = 34
  const padR = 10
  const padT = 10
  const padB = 22
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const baseY = H - padB

  const colW = plotW / pts.length
  const barW = Math.min(22, Math.max(12, colW * 0.48))

  const prevPts = prevVals.map((v, i) => ({
    x: padL + colW * i + colW / 2,
    y: baseY - (v / maxVal) * plotH,
  }))
  const prevLine = prevPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

  const activePt = selected !== null ? pts[selected] : null
  const activeCur = selected !== null ? curVals[selected] : 0
  const activePrev = selected !== null ? prevVals[selected] : 0

  const cartPct = s.views ? (s.carts / s.views) * 100 : 0
  const orderPct = s.views ? (s.count / s.views) * 100 : 0

  const pIdx = periods.indexOf(period)

  return (
    <div className="an-wrap">
      {/* Apple iOS segmented period selector */}
      <div className="an-seg" role="tablist">
        <div className="an-seg-thumb" style={{ transform: `translateX(${pIdx * 100}%)` }} />
        {periods.map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={period === p}
            className={period === p ? 'on' : ''}
            onClick={() => { setPeriod(p); setSelected(null) }}
          >
            {t.analytics.periods[p]}
          </button>
        ))}
      </div>

      {/* 2x2 Interactive KPI Cards */}
      <div className="an-kpis">
        <button className={'an-kpi' + (metric === 'revenue' ? ' on' : '')} onClick={() => { setMetric('revenue'); setSelected(null) }}>
          <span className="an-kpi-l">{t.analytics.revenue}</span>
          <b className="an-kpi-v">{fmt(s.sum)} <small>₸</small></b>
          <div className="an-kpi-f">
            <span className="an-up"><TrendingUp size={10} />+{s.deltaPct.toFixed(1).replace('.', ',')}%</span>
            <small>{t.analytics.prev}: {fmt(s.prevSum)} ₸</small>
          </div>
        </button>

        <button className={'an-kpi' + (metric === 'orders' ? ' on' : '')} onClick={() => { setMetric('orders'); setSelected(null) }}>
          <span className="an-kpi-l">{t.analytics.orders}</span>
          <b className="an-kpi-v">{s.count} <small>{t.pieces}</small></b>
          <div className="an-kpi-f">
            <span className="an-up"><TrendingUp size={10} />+{Math.max(1, Math.round(s.count * 0.2))} {t.pieces}</span>
            <small>{s.subtitle}</small>
          </div>
        </button>

        <div className="an-kpi static">
          <span className="an-kpi-l">{t.analytics.avgOrder}</span>
          <b className="an-kpi-v">{fmt(s.avgOrder)} <small>₸</small></b>
          <div className="an-kpi-f">
            <span className="an-up">+{Math.round(s.deltaPct * 0.6)}%</span>
            <small>{t.analytics.prev}: {fmt(Math.round(s.avgOrder * 0.91))} ₸</small>
          </div>
        </div>

        <div className="an-kpi static">
          <span className="an-kpi-l">{t.analytics.conversion}</span>
          <b className="an-kpi-v">{orderPct.toFixed(1).replace('.', ',')}<small>%</small></b>
          <div className="an-kpi-f">
            <span className="an-up">+{((orderPct / 10) + 0.3).toFixed(1).replace('.', ',')}%</span>
            <small>{fmt(s.views)} {t.analytics.views}</small>
          </div>
        </div>
      </div>

      {/* Interactive Chart Card */}
      <div className="an-chart-card">
        <div className="an-chart-h">
          <b>{metric === 'revenue' ? t.analytics.revenue : t.analytics.orders}</b>
          {activePt ? (
            <div className="an-sel-pill">
              <span>{activePt.fullLabel}:</span>
              <b>{metric === 'revenue' ? `${fmt(activeCur)} ₸` : `${activeCur} ${t.pieces}`}</b>
              <small>({t.analytics.prev}: {metric === 'revenue' ? `${fmt(activePrev)} ₸` : activePrev})</small>
              <button onClick={() => setSelected(null)} aria-label="Close"><X size={11} /></button>
            </div>
          ) : (
            <div className="an-legend">
              <span><i className="cur" />{t.analytics.currentPeriod}</span>
              <span><i className="old" />{t.analytics.prevPeriod}</span>
            </div>
          )}
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="an-svg">
          {ticks.map((tk) => {
            const gy = baseY - (tk / maxVal) * plotH
            return (
              <g key={tk}>
                <line x1={padL} y1={gy} x2={W - padR} y2={gy} stroke="#eeeef3" strokeWidth="1" />
                <text x={padL - 6} y={gy + 3} textAnchor="end" className="an-y">{fmtY(tk, metric)}</text>
              </g>
            )
          })}

          {curVals.map((v, i) => {
            const cx = padL + colW * i + colW / 2
            const bh = v > 0 ? Math.max(5, (v / maxVal) * plotH) : 2
            const isSel = selected === i
            return (
              <g key={period + metric + i} style={{ cursor: 'pointer' }} onClick={() => setSelected(isSel ? null : i)}>
                <rect x={padL + colW * i} y={padT} width={colW} height={plotH + padB} fill="transparent" />
                <rect
                  x={cx - barW / 2}
                  y={baseY - bh}
                  width={barW}
                  height={bh}
                  rx={5}
                  fill={v === 0 ? '#ececf2' : isSel ? '#7c1fd1' : '#ae33ff'}
                  opacity={selected !== null && !isSel ? 0.45 : 1}
                />
                <text x={cx} y={H - 5} textAnchor="middle" className={'an-x' + (isSel ? ' on' : '')}>
                  {pts[i].label}
                </text>
              </g>
            )
          })}

          <path d={prevLine} fill="none" stroke="#8e8e93" strokeWidth="1.5" strokeDasharray="3 3" pointerEvents="none" />
          {prevPts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.6" fill="#fff" stroke="#8e8e93" strokeWidth="1.5" pointerEvents="none" />
          ))}
        </svg>
        <div className="an-hint">{t.analytics.tapHint}</div>
      </div>

      {/* Sales Funnel (matching exact views -> carts -> orders percentages) */}
      <div className="an-funnel">
        <div className="an-funnel-h">
          <b>{t.analytics.funnelTitle}</b>
          <small>{s.subtitle}</small>
        </div>
        <div className="an-frows">
          <div className="an-frow">
            <div className="an-frow-t">
              <span><Eye size={13} />{t.analytics.funnelViews}</span>
              <b>{fmt(s.views)} <em>100%</em></b>
            </div>
            <div className="an-fbar"><i style={{ width: '100%' }} /></div>
          </div>
          <div className="an-frow">
            <div className="an-frow-t">
              <span><ShoppingCart size={13} />{t.analytics.funnelCart}</span>
              <b>{fmt(s.carts)} <em>{cartPct.toFixed(1).replace('.', ',')}%</em></b>
            </div>
            <div className="an-fbar"><i style={{ width: `${Math.max(16, cartPct * 2.5)}%` }} /></div>
          </div>
          <div className="an-frow">
            <div className="an-frow-t">
              <span><PackageCheck size={13} />{t.analytics.funnelOrders}</span>
              <b>{fmt(s.count)} <em>{orderPct.toFixed(1).replace('.', ',')}%</em></b>
            </div>
            <div className="an-fbar"><i className="solid" style={{ width: `${Math.max(10, orderPct * 5)}%` }} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
