import { useEffect, useMemo, useState } from 'react'
import { QrCode, Copy, Maximize2, Download, RefreshCw, ChevronDown, CheckCircle2, MapPin, Code2 } from 'lucide-react'
import type { Order, OrderStatus } from './data'
import { buildCargoLabelSync, fetchCargoLabel, type CargoLabelResponse } from './cargoApi'
import { encodeQrMatrix, qrToSvgDataUrl } from './qr'
import { Sheet, useNav } from './ui'

function downloadCargoLabelSvg(order: Order, label: CargoLabelResponse) {
  const m = encodeQrMatrix(label.qrPayload)
  const q = 3
  const dim = m.length + q * 2
  const scale = 6
  const qrPx = dim * scale
  const qrX = (420 - qrPx) / 2
  const qrY = 126
  let rects = ''
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m.length; c++) {
      if (m[r][c]) {
        rects += `<rect x="${qrX + (c + q) * scale}" y="${qrY + (r + q) * scale}" width="${scale}" height="${scale}"/>`
      }
    }
  }
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="560" viewBox="0 0 420 560">
  <rect width="420" height="560" rx="20" fill="#fff" stroke="#16141a" stroke-width="3"/>
  <rect x="0" y="0" width="420" height="72" rx="18" fill="#1f1b24"/>
  <text x="24" y="42" fill="#fff" font-family="system-ui,sans-serif" font-size="22" font-weight="800">JJ MARKET CARGO</text>
  <text x="396" y="42" text-anchor="end" fill="#d99bff" font-family="system-ui,sans-serif" font-size="18" font-weight="800">${esc(label.hubRoute)}</text>
  <text x="210" y="106" text-anchor="middle" fill="#16141a" font-family="monospace" font-size="18" font-weight="700">${esc(label.trackingCode)}</text>
  <g fill="#16141a">${rects}</g>
  <line x1="24" y1="396" x2="396" y2="396" stroke="#ddd" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="24" y="426" fill="#666" font-family="system-ui,sans-serif" font-size="13">TO / DESTINATION</text>
  <text x="24" y="452" fill="#16141a" font-family="system-ui,sans-serif" font-size="18" font-weight="800">${esc(order.city)} · ${esc(order.buyerName)}</text>
  <text x="24" y="476" fill="#333" font-family="system-ui,sans-serif" font-size="14">${esc(order.streetHouse)}, ${esc(order.apartment)}</text>
  <text x="24" y="510" fill="#666" font-family="system-ui,sans-serif" font-size="13">ORDER #${esc(order.id)} · ${esc(order.title)} × ${order.qty} · ${esc(label.weightKg)}</text>
  <text x="24" y="534" fill="#888" font-family="monospace" font-size="12">BARCODE: ${esc(label.barcode)}</text>
</svg>`
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `JJ-Cargo-${label.trackingCode}.svg`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function CargoQrSheet({ order, label }: { order: Order; label?: CargoLabelResponse }) {
  const nav = useNav()
  const { t } = nav
  const data = label ?? buildCargoLabelSync(order)
  const qrSrc = useMemo(() => qrToSvgDataUrl(data.qrPayload), [data.qrPayload])

  const copyTrack = () => {
    try { navigator.clipboard?.writeText(data.trackingCode) } catch {}
    nav.toast(t.copied)
  }

  return (
    <Sheet title={t.cargoQrTitle}>
      <div className="qr-modal">
        <div className="qr-pass">
          <div className="qr-pass-top">
            <div>
              <small>{data.cargoProvider}</small>
              <b>{data.hubRoute}</b>
            </div>
            <span className="qr-hub-pill">{data.cityCode}</span>
          </div>

          <div className="qr-pass-img-wrap">
            <img src={qrSrc} alt={data.trackingCode} className="qr-pass-img" />
          </div>

          <button className="qr-track-row" onClick={copyTrack}>
            <div>
              <small>{t.cargoQrTrack}</small>
              <b>{data.trackingCode}</b>
            </div>
            <Copy size={15} />
          </button>

          <div className="qr-pass-loc">
            <MapPin size={13} />
            <span>{order.city}, {order.streetHouse}, {order.apartment} · {order.buyerName}</span>
          </div>
          <div className="qr-pass-hint">{t.cargoQrScanHint}</div>
        </div>

        <button
          className="btn"
          style={{ marginTop: 12 }}
          onClick={() => {
            downloadCargoLabelSvg(order, data)
            nav.toast(t.cargoQrDownloaded)
          }}
        >
          <Download size={16} />{t.cargoQrDownload}
        </button>
      </div>
    </Sheet>
  )
}

export function CargoQrCard({ order, status }: { order: Order; status: OrderStatus }) {
  const nav = useNav()
  const { t } = nav
  const [label, setLabel] = useState<CargoLabelResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApi, setShowApi] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetchCargoLabel(order)
    setLabel(res)
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'cancelled') return
    let active = true
    setLoading(true)
    fetchCargoLabel(order).then((res) => {
      if (active) {
        setLabel(res)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [order, status])

  const qrSrc = useMemo(() => (label ? qrToSvgDataUrl(label.qrPayload) : ''), [label])

  if (status === 'cancelled') return null

  const copyTrack = () => {
    if (!label) return
    try { navigator.clipboard?.writeText(label.trackingCode) } catch {}
    nav.toast(t.copied)
  }

  return (
    <div className="qr-card">
      <div className="qr-card-h">
        <div className="qr-card-hl">
          <span className="qr-card-ic"><QrCode size={16} /></span>
          <div>
            <b>{t.cargoQrTitle}</b>
            <small>{t.cargoQrSub}</small>
          </div>
        </div>
        {!loading && label && (
          <span className="st-pill green">
            <CheckCircle2 size={10} style={{ marginRight: 3, verticalAlign: '-1px' }} />
            {t.cargoQrReady}
          </span>
        )}
      </div>

      {loading || !label ? (
        <div className="qr-loading">
          <div className="qr-spin" />
          <span>{t.cargoQrLoading}</span>
        </div>
      ) : (
        <>
          <div className="qr-body">
            <button
              className="qr-thumb"
              onClick={() => nav.sheet(<CargoQrSheet order={order} label={label} />)}
              aria-label={t.cargoQrFullScreen}
            >
              <img src={qrSrc} alt={label.trackingCode} />
              <span className="qr-zoom"><Maximize2 size={11} /></span>
            </button>

            <div className="qr-meta">
              <span className="qr-hub-chip">{label.hubRoute}</span>
              <button className="qr-code-copy" onClick={copyTrack}>
                <b>{label.trackingCode}</b>
                <Copy size={13} />
              </button>
              <small>{label.cargoProvider}</small>
              <small>#{label.barcode} · {label.weightKg}</small>
            </div>
          </div>

          <div className="qr-hint-line">{t.cargoQrScanHint}</div>

          <div className="qr-acts">
            <button className="qr-act primary" onClick={() => nav.sheet(<CargoQrSheet order={order} label={label} />)}>
              <Maximize2 size={14} />{t.cargoQrFullScreen}
            </button>
            <button
              className="qr-act"
              onClick={() => {
                downloadCargoLabelSvg(order, label)
                nav.toast(t.cargoQrDownloaded)
              }}
            >
              <Download size={14} />{t.cargoQrDownload}
            </button>
            <button className="qr-act icon" onClick={load} aria-label="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>

          <button className="qr-api-toggle" onClick={() => setShowApi(!showApi)}>
            <Code2 size={13} />
            <span>{t.cargoQrApiData}</span>
            <ChevronDown size={13} style={{ marginLeft: 'auto', transform: showApi ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
          </button>
          {showApi && (
            <pre className="qr-json">{JSON.stringify({
              provider: label.cargoProvider,
              trackingCode: label.trackingCode,
              hubRoute: label.hubRoute,
              barcode: label.barcode,
              qrPayload: label.qrPayload,
            }, null, 2)}</pre>
          )}
        </>
      )}
    </div>
  )
}
