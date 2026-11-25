// Реальные генераторы QR-кода (ISO/IEC 18004) и штрихкода Code 128B (ISO/IEC 15417)
// + имитация ответа CDEK (СДЭК) API по заказу с трек-кодом, QR и штрихкодом.

import type { Order } from './data'

/* ==================== 1. QR-код (ISO/IEC 18004, Byte mode, ECC L) ==================== */
const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)
{
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]
}
const gfMul = (a: number, b: number) => (a && b ? GF_EXP[GF_LOG[a] + GF_LOG[b]] : 0)

function rsPoly(ecLen: number): number[] {
  let g = [1]
  for (let i = 0; i < ecLen; i++) {
    const next = new Array(g.length + 1).fill(0)
    for (let j = 0; j < g.length; j++) {
      next[j] ^= g[j]
      next[j + 1] ^= gfMul(g[j], GF_EXP[i])
    }
    g = next
  }
  return g
}

function rsRemainder(data: number[], ecLen: number): number[] {
  const g = rsPoly(ecLen)
  const buf = [...data, ...new Array(ecLen).fill(0)]
  for (let i = 0; i < data.length; i++) {
    const coef = buf[i]
    if (coef !== 0) {
      for (let j = 0; j < g.length; j++) buf[i + j] ^= gfMul(g[j], coef)
    }
  }
  return buf.slice(data.length)
}

// Version 3-L (29×29, max 53 bytes) & Version 4-L (33×33, max 78 bytes)
const VER_SPEC = [
  { ver: 3, size: 29, dataBytes: 55, ecBytes: 15, align: [6, 22] },
  { ver: 4, size: 33, dataBytes: 80, ecBytes: 20, align: [6, 26] },
]

export function makeQrMatrix(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text))
  const spec = bytes.length <= 53 ? VER_SPEC[0] : VER_SPEC[1]
  const payload = bytes.slice(0, spec.dataBytes - 2)

  // Bitstream: 0100 (byte) + 8-bit length + bytes + terminator
  const bits: number[] = []
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1)
  }
  pushBits(0b0100, 4)
  pushBits(payload.length, 8)
  for (const b of payload) pushBits(b, 8)
  pushBits(0, Math.min(4, spec.dataBytes * 8 - bits.length))
  while (bits.length % 8 !== 0) bits.push(0)

  const codewords: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]
    codewords.push(b)
  }
  const pad = [0xec, 0x11]
  let pi = 0
  while (codewords.length < spec.dataBytes) {
    codewords.push(pad[pi % 2])
    pi++
  }
  const ec = rsRemainder(codewords, spec.ecBytes)
  const full = [...codewords, ...ec]

  const n = spec.size
  const mat: (boolean | null)[][] = Array.from({ length: n }, () => Array(n).fill(null))
  const isFn: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false))

  const setFn = (r: number, c: number, v: boolean) => {
    if (r >= 0 && r < n && c >= 0 && c < n) {
      mat[r][c] = v
      isFn[r][c] = true
    }
  }

  // Finder patterns + separators
  const placeFinder = (r0: number, c0: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const inBox = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6
        const v =
          inBox &&
          (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4))
        setFn(r0 + dr, c0 + dc, v)
      }
    }
  }
  placeFinder(0, 0)
  placeFinder(0, n - 7)
  placeFinder(n - 7, 0)

  // Alignment pattern
  const aPos = spec.align[1]
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      setFn(aPos + dr, aPos + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1)
    }
  }

  // Timing patterns
  for (let i = 8; i < n - 8; i++) {
    setFn(6, i, i % 2 === 0)
    setFn(i, 6, i % 2 === 0)
  }
  // Dark module
  setFn(4 * spec.ver + 9, 8, true)

  // Reserve format info cells
  for (let i = 0; i < 9; i++) {
    if (!isFn[8][i]) setFn(8, i, false)
    if (!isFn[i][8]) setFn(i, 8, false)
  }
  for (let i = 0; i < 8; i++) {
    setFn(8, n - 1 - i, false)
    setFn(n - 1 - i, 8, false)
  }

  // Place data bits (mask 0: (r + c) % 2 === 0)
  const dataBits: number[] = []
  for (const b of full) for (let i = 7; i >= 0; i--) dataBits.push((b >> i) & 1)
  let bi = 0
  let up = true
  for (let col = n - 1; col > 0; col -= 2) {
    if (col === 6) col--
    for (let step = 0; step < n; step++) {
      const r = up ? n - 1 - step : step
      for (const c of [col, col - 1]) {
        if (!isFn[r][c]) {
          const bit = bi < dataBits.length ? dataBits[bi++] === 1 : false
          mat[r][c] = (r + c) % 2 === 0 ? !bit : bit
        }
      }
    }
    up = !up
  }

  // Format bits for ECC L (01) + Mask 0 (000) -> 111011111000100
  const fmtBits = '111011111000100'
  const c1 = [0, 1, 2, 3, 4, 5, 7, 8]
  for (let i = 0; i < 8; i++) mat[8][c1[i]] = fmtBits[i] === '1'
  const r1 = [7, 5, 4, 3, 2, 1, 0]
  for (let i = 0; i < 7; i++) mat[r1[i]][8] = fmtBits[8 + i] === '1'
  for (let i = 0; i < 7; i++) mat[n - 1 - i][8] = fmtBits[i] === '1'
  for (let i = 0; i < 8; i++) mat[8][n - 8 + i] = fmtBits[7 + i] === '1'

  return mat.map((row) => row.map((v) => !!v))
}

/* ==================== 2. Штрихкод Code 128B (ISO/IEC 15417) ==================== */
// Паттерны ширин полос/пробелов для символов 0..106 (Code 128)
const C128: string[] = [
  '212222','222122','222221','121223','121322','131222','122213','122312','132212','221213',
  '221312','231212','112232','122132','122231','113222','123122','123221','223211','221132',
  '221231','213212','223112','312131','311222','321122','321221','312212','322112','322211',
  '212123','212321','232121','111323','131123','131321','112313','132113','132311','211313',
  '231113','231311','112133','112331','132131','113123','113321','133121','313121','211331',
  '231131','213113','213311','213131','311123','311321','331121','312113','312311','332111',
  '314111','221411','431111','111224','111422','121124','121421','141122','141221','112214',
  '112412','122114','122411','142112','142211','241211','221114','413111','241112','134111',
  '111242','121142','121241','114212','124112','124211','411212','421112','421211','212141',
  '214121','412121','111143','111341','131141','114113','114311','411113','411311','113141',
  '114131','311141','411131','211412','211214','211232','2331112',
]

export interface BarcodeBar { x: number; w: number }

export function makeCode128Bars(text: string): { bars: BarcodeBar[]; width: number } {
  const clean = text.replace(/[^\x20-\x7E]/g, '').slice(0, 26) || 'CDEK'
  const codes: number[] = [104] // Start Code B
  let checksum = 104
  for (let i = 0; i < clean.length; i++) {
    const val = clean.charCodeAt(i) - 32
    codes.push(val)
    checksum += val * (i + 1)
  }
  codes.push(checksum % 103)
  codes.push(106) // Stop

  const bars: BarcodeBar[] = []
  let x = 10 // quiet zone
  for (const c of codes) {
    const pat = C128[c]
    for (let i = 0; i < pat.length; i++) {
      const w = Number(pat[i])
      if (i % 2 === 0) bars.push({ x, w })
      x += w
    }
  }
  return { bars, width: x + 10 }
}

/* ==================== 3. CDEK (СДЭК) API модель заказа ==================== */
export interface CdekLabelData {
  provider: 'CDEK'
  trackCode: string
  waybillId: string
  barcodeValue: string
  qrPayload: string
  originHub: string
  destHub: string
  tariff: string
  createdAt: string
}

const HUB_MAP: Record<string, string> = {
  'Алматы': 'ALA',
  'Астана': 'NQZ',
  'Шымкент': 'CIT',
  'Москва': 'MOW',
  'Бишкек': 'FRU',
  'Ташкент': 'TAS',
}

export function getCdekLabelForOrder(order: Order): CdekLabelData {
  const destHub = HUB_MAP[order.city] ?? order.countryCode
  const numeric = order.id.replace(/\D/g, '').slice(-8).padStart(8, '0')
  const trackCode = `10${numeric}`
  const waybillId = `CDEK-${order.countryCode}-${numeric.slice(-6)}`
  const barcodeValue = `CDEK${trackCode}`
  const qrPayload = `CDEK|${trackCode}|IST-${destHub}|${order.countryCode}|${order.id}`

  return {
    provider: 'CDEK',
    trackCode,
    waybillId,
    barcodeValue,
    qrPayload,
    originHub: 'IST-LAL',
    destHub,
    tariff: 'CDEK International Express',
    createdAt: order.date,
  }
}

export function buildCdekLabelSvg(order: Order, label: CdekLabelData): string {
  const mat = makeQrMatrix(label.qrPayload)
  const qSize = mat.length
  const cell = 3.6
  const qrBox = qSize * cell
  const qrX = (300 - qrBox) / 2
  const qrY = 128

  let qrRects = ''
  for (let r = 0; r < qSize; r++) {
    for (let c = 0; c < qSize; c++) {
      if (mat[r][c]) {
        qrRects += `<rect x="${(qrX + c * cell).toFixed(1)}" y="${(qrY + r * cell).toFixed(1)}" width="${cell}" height="${cell}" fill="#111"/>`
      }
    }
  }

  const bc = makeCode128Bars(label.barcodeValue)
  const bcScale = 252 / bc.width
  const bcX = 24
  const bcY = 266
  let bcRects = ''
  for (const b of bc.bars) {
    bcRects += `<rect x="${(bcX + b.x * bcScale).toFixed(2)}" y="${bcY}" width="${(b.w * bcScale).toFixed(2)}" height="54" fill="#111"/>`
  }

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" width="600" height="840">
  <rect width="300" height="420" rx="16" fill="#ffffff" stroke="#d8d8e0" stroke-width="2"/>
  <rect x="0" y="0" width="300" height="56" rx="16" fill="#1ab248"/>
  <rect x="0" y="40" width="300" height="16" fill="#1ab248"/>
  <text x="18" y="34" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="#ffffff">CDEK · JJ SELLER</text>
  <text x="282" y="33" text-anchor="end" font-family="monospace" font-size="12" font-weight="700" fill="#eafff0">${esc(label.originHub)} → ${esc(label.destHub)}</text>
  <text x="18" y="80" font-family="system-ui,sans-serif" font-size="11" fill="#666">TRACK / НАКЛАДНАЯ</text>
  <text x="18" y="102" font-family="monospace" font-size="19" font-weight="800" fill="#111">${esc(label.trackCode)}</text>
  <text x="282" y="100" text-anchor="end" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#1ab248">${esc(order.city)} (${esc(order.countryCode)})</text>
  <line x1="18" y1="114" x2="282" y2="114" stroke="#ececf0"/>
  ${qrRects}
  <line x1="18" y1="252" x2="282" y2="252" stroke="#ececf0" stroke-dasharray="4 3"/>
  ${bcRects}
  <text x="150" y="336" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" letter-spacing="1.5" fill="#111">${esc(label.barcodeValue)}</text>
  <line x1="18" y1="350" x2="282" y2="350" stroke="#ececf0"/>
  <text x="18" y="370" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#111">${esc(order.buyerName)}</text>
  <text x="18" y="388" font-family="system-ui,sans-serif" font-size="10.5" fill="#555">${esc(order.city)}, ${esc(order.streetHouse)}, ${esc(order.apartment)}</text>
  <text x="18" y="405" font-family="system-ui,sans-serif" font-size="10" fill="#888">${esc(order.title)} × ${order.qty} · #${esc(order.id.slice(-6))}</text>
</svg>`
}
