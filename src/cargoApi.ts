import type { Order } from './data'

/**
 * Cargo API integration layer.
 * When live Cargo API credentials/endpoint are configured, replace fetchCargoLabelFromApi()
 * with a real POST/GET call returning { trackingCode, qrPayload, hubCode, barcode, ... }.
 */

export interface CargoLabelResponse {
  orderId: string
  cargoProvider: string
  trackingCode: string
  barcode: string
  qrPayload: string
  hubRoute: string
  cityCode: string
  weightKg: string
  createdAt: string
}

const CITY_CODES: Record<string, string> = {
  'Алматы': 'ALA',
  'Астана': 'NQZ',
  'Шымкент': 'CIT',
  'Караганда': 'KGF',
  'Актобе': 'AKX',
}

const cache = new Map<string, CargoLabelResponse>()

export function buildCargoLabelSync(o: Order): CargoLabelResponse {
  const existing = cache.get(o.id)
  if (existing) return existing
  const cityCode = CITY_CODES[o.city] ?? 'KAZ'
  const shortId = o.id.slice(-6)
  const trackingCode = `JJ-TR-${cityCode}-${shortId}`
  const barcode = `8690${o.id}`
  // Compact scannable payload returned by Cargo API (<= 78 bytes for crisp QR v4)
  const qrPayload = `https://cargo.jjmarket.kz/q/${trackingCode}?o=${o.id}`
  const label: CargoLabelResponse = {
    orderId: o.id,
    cargoProvider: 'JJ Express Cargo · Laleli',
    trackingCode,
    barcode,
    qrPayload,
    hubRoute: `IST-LAL → ${cityCode}`,
    cityCode,
    weightKg: `${(o.qty * 0.65).toFixed(1).replace('.', ',')} kg`,
    createdAt: o.date,
  }
  cache.set(o.id, label)
  return label
}

export async function fetchCargoLabel(o: Order): Promise<CargoLabelResponse> {
  if (cache.has(o.id)) return cache.get(o.id)!
  // Simulates Cargo API request latency; swap with fetch('/api/cargo/label', ...) in production
  await new Promise((r) => setTimeout(r, 320))
  return buildCargoLabelSync(o)
}

export function getCachedCargoLabel(orderId: string): CargoLabelResponse | undefined {
  return cache.get(orderId)
}
