import { useState } from 'react'
import { ChevronRight, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react'
import { fmt, periods, stats, type Period } from './data'
import { useNav } from './ui'

/*
 * Блок «Satış istatistikleri» в стиле кабинетов продавца (Ozon Seller, WB Partners, Trendyol Partner):
 * строгие вкладки периода, плитки KPI с динамикой к прошлому периоду, столбчатый график
 * «этот период / прошлый период» с осью Y и подсказкой по нажатию на столбец.
 */

type Metric = 'ciro' | 'siparis' | 'sepet' | 'donusum'

const pct = (n: number) => (n > 0 ? '+' : '') + n.toFixed(1).replace('.', ',') + '%'
const short = (n: number) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.', ',') + 'k' : String(n))

/** Шаг оси Y: «красивые» деления 1/2/5 × 10^n */
function niceMax(v: number) {
  if (v <= 0) return 4
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const r = v / p
  const step = r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10
  return step * p
}

function Delta({ v }: { v: number }) {
  if (!isFinite(v) || v === 0) return <span className="sx-delta flat">0%</span>
  const up = v > 0
  return (
    <span className={'sx-delta ' + (up ? 'up' : 'down')}>
      {up ? <ArrowUpRight size={12} strokeWidth={2.4} /> : <ArrowDownRight size={12} strokeWidth={2.4} />}
      {pct(Math.abs(v)).replace('+', '')}
    </span>
  )
}

export function SalesStats({
  period,
  onPeriodChange,
  detailed = false,
}: {
  period: Period
  onPeriodChange: (p: Period) => void
  detailed?: boolean
}) {
  const nav = useNav()
  const [metric, setMetric] = useState<Metric>('ciro')
  const [sel, setSel] = useState<number | null>(null)

  const s = stats[period]
  const pts = s.points
  const n = pts.length

  // прошлый период: та же форма со сдвигом, масштабированная к prevSum
  const ratio = s.sum ? s.prevSum / s.sum : 0
  const prev = pts.map((_, i) => {
    const src = pts[(i + 1) % n]
    return { sum: Math.round(src.sum * ratio), count: Math.round(src.count * ratio) }
  })
  const prevCount = Math.max(1, prev.reduce((a, p) => a + p.count, 0))
  const prevAvg = s.prevSum / prevCount
  const prevConv = s.conversion / (1 + s.deltaPct / 200)

  const kpis: { k: Metric; label: string; value: string; unit?: string; delta: number; hint: string }[] = [
    { k: 'ciro', label: 'Ciro', value: fmt(s.sum), unit: '₸', delta: s.deltaPct, hint: `Önceki: ${fmt(s.prevSum)} ₸` },
    { k: 'siparis', label: 'Siparişler', value: fmt(s.count), unit: 'adet', delta: ((s.count - prevCount) / prevCount) * 100, hint: `Önceki: ${prevCount} adet` },
    { k: 'sepet', label: 'Ort. sepet', value: fmt(s.avgOrder), unit: '₸', delta: ((s.avgOrder - prevAvg) / prevAvg) * 100, hint: `Önceki: ${fmt(Math.round(prevAvg))} ₸` },
    { k: 'donusum', label: 'Dönüşüm', value: s.conversion.toFixed(1).replace('.', ','), unit: '%', delta: ((s.conversion - prevConv) / prevConv) * 100, hint: `${fmt(s.views)} görüntüleme` },
  ]

  // значения для графика по выбранной метрике
  const cur = pts.map((p) =>
    metric === 'siparis' ? p.count : metric === 'sepet' ? (p.count ? Math.round(p.sum / p.count) : 0) : metric === 'donusum' ? (p.count ? +(s.conversion * (0.6 + (p.sum % 7) / 10)).toFixed(1) : 0) : p.sum,
  )
  const old = prev.map((p) =>
    metric === 'siparis' ? p.count : metric === 'sepet' ? (p.count ? Math.round(p.sum / p.count) : 0) : metric === 'donusum' ? (p.count ? +(prevConv * 0.9).toFixed(1) : 0) : p.sum,
  )
  const top = niceMax(Math.max(...cur, ...old, 1))
  const unit = metric === 'siparis' ? '' : metric === 'donusum' ? '%' : ''
  const yLbl = (v: number) => (metric === 'siparis' ? String(v) : metric === 'donusum' ? String(v).replace('.', ',') + '%' : short(v))

  // геометрия
  const W = 320, H = 150, L = 30, R = 4, T = 8, B = 20
  const pw = W - L - R, ph = H - T - B
  const slot = pw / n
  const bw = Math.min(22, slot * 0.5)
  const y = (v: number) => T + ph - (v / top) * ph
  const oldPath = old.map((v, i) => `${i ? 'L' : 'M'}${(L + slot * i + slot / 2).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

  const active = sel ?? -1
  const tip = sel !== null ? { i: sel, x: L + slot * sel + slot / 2 } : null
  const fmtV = (v: number) => (metric === 'ciro' || metric === 'sepet' ? fmt(v) + ' ₸' : metric === 'siparis' ? v + ' adet' : String(v).replace('.', ',') + '%')

  return (
    <section className="sx" aria-label="Satış istatistikleri">
      <div className="sx-head">
        <div>
          <h2>Satış istatistikleri</h2>
          <div className="sx-sub"><i />{s.subtitle} · güncellendi 13:40</div>
        </div>
        {!detailed && (
          <button className="sx-link" onClick={() => nav.tab('analytics')}>Rapor<ChevronRight size={14} /></button>
        )}
      </div>

      <div className="sx-tabs" role="tablist">
        {periods.map((p) => (
          <button key={p} role="tab" aria-selected={p === period} className={p === period ? 'on' : ''} onClick={() => { setSel(null); onPeriodChange(p) }}>{p}</button>
        ))}
      </div>

      <div className="sx-kpis">
        {kpis.map((k) => (
          <button key={k.k} className={'sx-kpi' + (metric === k.k ? ' on' : '')} onClick={() => { setMetric(k.k); setSel(null) }}>
            <div className="sx-kpi-l">{k.label}</div>
            <div className="sx-kpi-v">{k.value}<small>{k.unit}</small></div>
            <div className="sx-kpi-f"><Delta v={k.delta} /><span>{k.hint}</span></div>
          </button>
        ))}
      </div>

      <div className="sx-chart">
        <div className="sx-chart-h">
          <span>{kpis.find((k) => k.k === metric)!.label}{unit && ', ' + unit}</span>
          <span className="sx-legend"><i className="cur" />Bu dönem<i className="old" />Önceki</span>
        </div>
        {tip && (
          <div className="sx-detail">
            <span className="sx-detail-d">{pts[tip.i].fullLabel}</span>
            <span><i className="cur" />{fmtV(cur[tip.i])}</span>
            <span><i className="old" />{fmtV(old[tip.i])}</span>
            <button onClick={() => setSel(null)}>×</button>
          </div>
        )}
        <div className="sx-plot">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const gy = T + ph - t * ph
              return (
                <g key={t}>
                  <line x1={L} x2={W - R} y1={gy} y2={gy} stroke={t === 0 ? '#D9D9DE' : '#EFEFF2'} />
                  <text x={L - 6} y={gy + 3} textAnchor="end" className="sx-y">{yLbl(metric === 'donusum' ? +(top * t).toFixed(1) : Math.round(top * t))}</text>
                </g>
              )
            })}
            {cur.map((v, i) => {
              const cx = L + slot * i + slot / 2
              const h = Math.max(v > 0 ? 2 : 0, T + ph - y(v))
              return (
                <g key={i} onClick={() => setSel(sel === i ? null : i)} style={{ cursor: 'pointer' }}>
                  <rect x={L + slot * i} y={T} width={slot} height={ph} fill={active === i ? '#F6EEFF' : 'transparent'} />
                  <rect key={period + metric + i} className="sx-bar" x={cx - bw / 2} y={T + ph - h} width={bw} height={h} rx="3"
                    fill={active === -1 || active === i ? '#AE33FF' : '#DCC0F7'} style={{ animationDelay: i * 30 + 'ms' }} />
                  <text x={cx} y={H - 5} textAnchor="middle" className={'sx-x' + (active === i ? ' on' : '')}>{pts[i].label}</text>
                </g>
              )
            })}
            <path d={oldPath} fill="none" stroke="#8E8E96" strokeWidth="1.5" strokeDasharray="4 3" strokeLinejoin="round" pointerEvents="none" />
            {old.map((v, i) => <circle key={i} cx={L + slot * i + slot / 2} cy={y(v)} r="2.2" fill="#fff" stroke="#8E8E96" strokeWidth="1.3" pointerEvents="none" />)}
          </svg>
        </div>
        <div className="sx-note"><Info size={12} />Sütuna dokunun — dönem detayını görün</div>
      </div>

      {detailed && (
        <div className="sx-table">
          <div className="sx-table-h">Satış hunisi</div>
          {[
            ['Görüntüleme', s.views, 100],
            ['Sepete ekleme', s.carts, (s.carts / s.views) * 100],
            ['Sipariş', s.count, (s.count / s.views) * 100],
          ].map(([l, v, p]) => (
            <div className="sx-row" key={l as string}>
              <span>{l}</span>
              <div className="sx-row-bar"><i style={{ width: Math.max(2, p as number) + '%' }} /></div>
              <b>{fmt(v as number)}</b>
              <em>{(p as number).toFixed(1).replace('.', ',')}%</em>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
