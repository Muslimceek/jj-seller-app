import { useMemo, useState } from 'react'
import { QrCode, ScanBarcode, Maximize2, Download, Copy, Check, Code2, ChevronDown, Truck } from 'lucide-react'
import { locCity, type Order, type OrderStatus } from './data'
import { buildCdekLabelSvg, getCdekLabelForOrder, makeCode128Bars, makeQrMatrix, type CdekLabelData } from './cdekCode'
import { Sheet, useNav } from './ui'

type CodeMode = 'qr' | 'barcode'

function QrSvg({ text, size = 148 }: { text: string; size?: number }) {
  const mat = useMemo(() => makeQrMatrix(text), [text])
  const n = mat.length
  const pad = 2
  const view = n + pad * 2
  return (
    <svg viewBox={`0 0 ${view} ${view}`} width={size} height={size} className="cdek-qr-svg" role="img" aria-label="CDEK QR">
      <rect width={view} height={view} fill="#ffffff" rx="1.5" />
      {mat.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c + pad} y={r + pad} width={1.03} height={1.03} fill="#14121a" /> : null,
        ),
      )}
    </svg>
  )
}

function BarcodeSvg({ value, height = 74 }: { value: string; height?: number }) {
  const { bars, width } = useMemo(() => makeCode128Bars(value), [value])
  return (
    <div className="cdek-bc-box">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        className="cdek-bc-svg"
        role="img"
        aria-label="CDEK Barcode"
      >
        <rect width={width} height={height} fill="#ffffff" />
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={4} width={b.w} height={height - 8} fill="#14121a" />
        ))}
      </svg>
      <div className="cdek-bc-val">{value}</div>
    </div>
  )
}

function downloadLabel(order: Order, label: CdekLabelData) {
  const svg = buildCdekLabelSvg(order, label)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `CDEK-${label.trackCode}.svg`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function CdekFullScreenSheet({
  order, label, initialMode,
}: {
  order: Order; label: CdekLabelData; initialMode: CodeMode
}) {
  const nav = useNav()
  const c = nav.t.cdek
  const [mode, setMode] = useState<CodeMode>(initialMode)
  const [copied, setCopied] = useState(false)

  const copyTrack = () => {
    try { navigator.clipboard?.writeText(label.trackCode) } catch {}
    setCopied(true)
    nav.toast(`${c.trackCode}: ${label.trackCode}`)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Sheet title={c.fullTitle}>
      <div className="cdek-fs">
        <div className="cdek-fs-top">
          <span className="cdek-brand-pill">CDEK</span>
          <b>{label.originHub} → {label.destHub}</b>
          <span className="cdek-fs-cc">{locCity(order.city, nav.lang)} · {order.countryCode}</span>
        </div>

        {/* Переключатель QR ↔ Штрихкод прямо на полном экране */}
        <div className="cdek-seg" role="tablist">
          <i style={{ transform: `translateX(${mode === 'qr' ? 0 : 100}%)` }} />
          <button type="button" className={mode === 'qr' ? 'on' : ''} onClick={() => setMode('qr')}>
            <QrCode size={14} />{c.tabQr}
          </button>
          <button type="button" className={mode === 'barcode' ? 'on' : ''} onClick={() => setMode('barcode')}>
            <ScanBarcode size={14} />{c.tabBarcode}
          </button>
        </div>

        <div className={'cdek-fs-stage ' + mode} key={mode}>
          {mode === 'qr' ? (
            <QrSvg text={label.qrPayload} size={220} />
          ) : (
            <BarcodeSvg value={label.barcodeValue} height={116} />
          )}
        </div>

        <button type="button" className="cdek-track-row" onClick={copyTrack}>
          <div>
            <small>{c.trackCode}</small>
            <b>{label.trackCode}</b>
          </div>
          <span className="cdek-copy-btn">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? nav.t.copied : c.copyTrack}
          </span>
        </button>

        <p className="cdek-fs-hint">{c.scanHint}</p>

        <button
          type="button"
          className="btn"
          style={{ height: 48, borderRadius: 13 }}
          onClick={() => { downloadLabel(order, label); nav.toast(c.downloaded) }}
        >
          <Download size={16} />{c.downloadLabel}
        </button>
      </div>
    </Sheet>
  )
}

export function CdekLabelCard({ order, status }: { order: Order; status: OrderStatus }) {
  const nav = useNav()
  const c = nav.t.cdek
  const [mode, setMode] = useState<CodeMode>('qr')
  const [copied, setCopied] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const label = useMemo(() => getCdekLabelForOrder(order), [order])
  if (status === 'cancelled') return null

  const copyTrack = () => {
    try { navigator.clipboard?.writeText(label.trackCode) } catch {}
    setCopied(true)
    nav.toast(`${c.trackCode}: ${label.trackCode}`)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="cdek-card">
      <div className="cdek-head">
        <div className="cdek-head-l">
          <span className="cdek-logo">CDEK</span>
          <div>
            <b>{c.title}</b>
            <small>{c.sub}</small>
          </div>
        </div>
        <span className="cdek-ready"><i />{c.apiReady}</span>
      </div>

      {/* Переключатель QR-код ↔ Штрихкод */}
      <div className="cdek-seg" role="tablist">
        <i style={{ transform: `translateX(${mode === 'qr' ? 0 : 100}%)` }} />
        <button type="button" role="tab" aria-selected={mode === 'qr'} className={mode === 'qr' ? 'on' : ''} onClick={() => setMode('qr')}>
          <QrCode size={14} />{c.tabQr}
        </button>
        <button type="button" role="tab" aria-selected={mode === 'barcode'} className={mode === 'barcode' ? 'on' : ''} onClick={() => setMode('barcode')}>
          <ScanBarcode size={14} />{c.tabBarcode}
        </button>
      </div>

      {/* Область кода (QR или Штрихкод Code 128) */}
      <div
        className={'cdek-code-stage ' + mode}
        key={mode}
        onClick={() => nav.sheet(<CdekFullScreenSheet order={order} label={label} initialMode={mode} />)}
      >
        {mode === 'qr' ? (
          <div className="cdek-qr-wrap">
            <QrSvg text={label.qrPayload} size={146} />
            <div className="cdek-qr-meta">
              <span className="cdek-route-chip"><Truck size={11} />{label.originHub} → {label.destHub}</span>
              <small>{c.waybill}</small>
              <b>{label.waybillId}</b>
              <p>{c.scanHint}</p>
            </div>
          </div>
        ) : (
          <div className="cdek-bc-wrap">
            <BarcodeSvg value={label.barcodeValue} height={78} />
            <div className="cdek-bc-meta">
              <span>{label.originHub} → {label.destHub}</span>
              <span>{c.code128Note}</span>
            </div>
          </div>
        )}
      </div>

      {/* Трек-код + копирование в 1 клик */}
      <button type="button" className="cdek-track-row" onClick={copyTrack}>
        <div>
          <small>{c.trackCode}</small>
          <b>{label.trackCode}</b>
        </div>
        <span className="cdek-copy-btn">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? nav.t.copied : c.copyTrack}
        </span>
      </button>

      {/* Действия: На весь экран + Скачать этикетку */}
      <div className="cdek-acts">
        <button
          type="button"
          className="cdek-act primary"
          onClick={() => nav.sheet(<CdekFullScreenSheet order={order} label={label} initialMode={mode} />)}
        >
          <Maximize2 size={14} />{c.fullScreen}
        </button>
        <button
          type="button"
          className="cdek-act"
          onClick={() => { downloadLabel(order, label); nav.toast(c.downloaded) }}
        >
          <Download size={14} />{c.downloadLabel}
        </button>
      </div>

      {/* Сворачиваемый ответ CDEK API */}
      <button type="button" className="cdek-api-toggle" onClick={() => setShowJson(!showJson)}>
        <Code2 size={13} />
        <span>{c.apiData}</span>
        <ChevronDown size={14} style={{ marginLeft: 'auto', transform: showJson ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
      </button>
      {showJson && (
        <pre className="cdek-json">
{JSON.stringify({
  provider: label.provider,
  track_code: label.trackCode,
  waybill_id: label.waybillId,
  barcode_code128: label.barcodeValue,
  qr_payload: label.qrPayload,
  route: `${label.originHub} -> ${label.destHub}`,
  destination: `${order.city} (${order.countryCode})`,
}, null, 2)}
        </pre>
      )}
    </div>
  )
}
