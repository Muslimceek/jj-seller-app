import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  X, Check, ChevronRight, ChevronLeft, ChevronDown, Search, Folder, LayoutGrid, Camera, Images, Type, Palette, Wallet,
  Eye, Plus, Minus, Star, Trash2, ArrowLeft, Video, Sparkles, Info, Ruler, Tag, Save, CircleAlert, CircleCheck,
  ImagePlus, Package, Truck, Percent, Wand2, Layers, Shirt, Briefcase, Baby, Footprints, ShoppingBag, Pill, Home,
  Gem, Utensils, Car, Droplets, Clock, Globe, Award, ShieldCheck, Leaf, Heart, Zap, Send, Crop, RotateCw,
  Pipette, Box, BookOpen, HelpCircle, SlidersHorizontal, Scale, Gift, Share2, ShoppingCart, Calculator,
} from 'lucide-react'
import { useNav, Sheet } from './ui'
import { categories, brands, colors as COLORS, fmt, img, locTitle, type Cat, type Product } from './data'
import { SIZE_TABLES, SYS_LABEL, tableForCategory, systemsOf, equivalents, RATE_USD, RATE_TRY, TRY_PER_USD, type SizeSys } from './sizes'
import {
  getSmartProfile, JEWELRY_METALS, JEWELRY_STONES, JEWELRY_GRAM_PRESETS,
} from './categoryProfiles'

type Cur = 'TRY' | 'USD'
type BoxUnit = 'cm' | 'mm'
type CropRatio = 'free' | '3:4' | '1:1' | 'fit'
const STEP_ICONS = [LayoutGrid, Camera, Type, Palette, Wallet, Eye] as const
const STEP_KEYS = ['cat', 'photo', 'info', 'var', 'price', 'prev'] as const

type CatVisual = { ic: typeof Folder; color: string; bg: string }
const CAT_VISUAL: Record<string, CatVisual> = {
  'Kadın': { ic: Shirt, color: '#ae33ff', bg: '#f5e8ff' },
  'Erkek': { ic: Briefcase, color: '#2563eb', bg: '#eaf2ff' },
  'Çocuk': { ic: Baby, color: '#d97706', bg: '#fef3df' },
  'Kadın ayakkabısı': { ic: Footprints, color: '#db2777', bg: '#fce7f3' },
  'Erkek ayakkabısı': { ic: Footprints, color: '#4f46e5', bg: '#eef0ff' },
  'Çocuk ayakkabısı': { ic: Footprints, color: '#0d9488', bg: '#e6faf7' },
  'Çantalar ve Aksesuarlar': { ic: ShoppingBag, color: '#9333ea', bg: '#f3e8ff' },
  'Güzellik ve Bakım': { ic: Sparkles, color: '#e11d48', bg: '#ffe8ee' },
  'Diyet takviyeleri ve vitaminler': { ic: Pill, color: '#16a34a', bg: '#e7f8ee' },
  'Ev ve Yaşam': { ic: Home, color: '#ea580c', bg: '#fff0e6' },
  'Takılar': { ic: Gem, color: '#b45309', bg: '#fef3c7' },
  'Gıda Ürünleri': { ic: Utensils, color: '#15803d', bg: '#e8f7ec' },
  'Oto Yedek Parça': { ic: Car, color: '#484848', bg: '#efeff3' },
  'Ev Temizlik Ürünleri': { ic: Droplets, color: '#0284c7', bg: '#e6f5fd' },
}
const visualOf = (rootName: string): CatVisual => CAT_VISUAL[rootName] ?? { ic: Folder, color: '#ae33ff', bg: '#f5e8ff' }

const TAG_ICONS: Record<string, typeof Tag> = {
  'Gerçek deri': ShieldCheck,
  'El yapımı': Sparkles,
  '%100 pamuk': Leaf,
  'Su geçirmez': Droplets,
  'Türkiye üretimi': Award,
  'Organik': Heart,
  'gold585': Gem,
  'hallmark': ShieldCheck,
  'cert': Award,
  'giftbox': Gift,
  'handmade': Sparkles,
}

const DESIGNER_SHADES = [
  '#0f172a', '#334155', '#e2e8f0', '#f5f0e6', '#d6bfa8', '#8b5e3c',
  '#991b1b', '#e11d48', '#f472b6', '#f97316', '#eab308', '#65a30d',
  '#059669', '#0d9488', '#0284c7', '#2563eb', '#4f46e5', '#9333ea',
]

const QUICK_DISCOUNTS = [0, 10, 20, 30, 50]
const DEMO_PHOTOS = [img('rubashka'), img('gallery'), img('lofer')]

const parsePrice = (s?: string): { v: string; cur: Cur } => {
  if (!s) return { v: '', cur: 'TRY' }
  const n = s.replace(/[^\d.,]/g, '').replace(/\s/g, '').replace(',', '.')
  return { v: n, cur: s.includes('$') ? 'USD' : 'TRY' }
}
const num = (s: string) => Number(String(s).replace(',', '.')) || 0

const isLightHex = (hex: string) => {
  const c = hex.replace('#', '')
  if (c.length !== 6 && c.length !== 3) return false
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 180
}

function Field({
  label, req, hint, right, children, err, icon,
}: {
  label: string; req?: boolean; hint?: ReactNode; right?: ReactNode; children: ReactNode; err?: string; icon?: ReactNode
}) {
  return (
    <div className="pf-field">
      <div className="pf-lbl">
        <span className="pf-lbl-l">{icon}{label}{req && <em>*</em>}</span>
        {right}
      </div>
      {children}
      {err ? <div className="pf-err"><CircleAlert size={12} />{err}</div> : hint ? <div className="pf-hint">{hint}</div> : null}
    </div>
  )
}

function Section({
  icon, title, sub, children, right,
}: {
  icon: ReactNode; title: string; sub?: string; children: ReactNode; right?: ReactNode
}) {
  return (
    <section className="pf-sec">
      <div className="pf-sec-h">
        <span className="pf-sec-ic">{icon}</span>
        <div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>
        {right}
      </div>
      {children}
    </section>
  )
}

function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="pf-stepper">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label="-"><Minus size={14} /></button>
      <input inputMode="numeric" value={value} onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)} />
      <button type="button" onClick={() => onChange(value + 1)} aria-label="+"><Plus size={14} /></button>
    </div>
  )
}

function BrandSheet({ value, onPick }: { value: string; onPick: (b: string) => void }) {
  const nav = useNav()
  const { t } = nav
  const [q, setQ] = useState('')
  const list = brands.filter((b) => b.toLowerCase().includes(q.toLowerCase()))
  return (
    <Sheet title={t.pf.brand}>
      <div className="cat-search" style={{ marginBottom: 10 }}>
        <Search size={16} className="cat-search-ic" />
        <input autoFocus placeholder={t.pf.brandPh} value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <button className="cat-search-x" onClick={() => setQ('')}><X size={12} /></button>}
      </div>
      {q && !brands.some((b) => b.toLowerCase() === q.toLowerCase()) && (
        <button className="opt on" style={{ justifyContent: 'flex-start', gap: 8 }} onClick={() => { onPick(q); nav.sheet(null) }}>
          <Plus size={15} />«{q}»
        </button>
      )}
      <button className={'opt' + (value === t.pf.brandless ? ' on' : '')} onClick={() => { onPick(t.pf.brandless); nav.sheet(null) }}>
        {t.pf.brandless}{value === t.pf.brandless && <Check size={16} />}
      </button>
      {list.map((b) => (
        <button key={b} className={'opt' + (value === b ? ' on' : '')} onClick={() => { onPick(b); nav.sheet(null) }}>
          {b}{value === b && <Check size={16} />}
        </button>
      ))}
    </Sheet>
  )
}

function PhotoSourceSheet({ onFiles, onDemo }: { onFiles: (f: FileList) => void; onDemo: () => void }) {
  const nav = useNav()
  const { t } = nav
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) onFiles(e.target.files); nav.sheet(null) }
  return (
    <Sheet title={t.pf.photoTitle}>
      <div className="pf-src">
        <label><span><Camera size={22} /></span>{t.pf.camera}<input hidden type="file" accept="image/*" capture="environment" onChange={pick} /></label>
        <label><span><Images size={22} /></span>{t.pf.fromGallery}<input hidden type="file" accept="image/*" multiple onChange={pick} /></label>
      </div>
      <button className="pf-demo-btn" onClick={() => { onDemo(); nav.sheet(null) }}>
        <Wand2 size={15} />{t.pf.demoPhotos}
      </button>
    </Sheet>
  )
}

/* ---------- Интерактивный редактор обрезки и кадрирования фото (Свободно / 3:4 / 1:1 / Всё фото) ---------- */
type FreeHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e'
function PhotoCropSheet({
  src, onApply,
}: {
  src: string; onApply: (croppedUrl: string) => void
}) {
  const nav = useNav()
  const pf = nav.t.pf
  const [ratio, setRatio] = useState<CropRatio>('free')
  const [zoom, setZoom] = useState(1)
  const [rot, setRot] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [box, setBox] = useState({ x: 10, y: 8, w: 80, h: 84 })
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null)
  const freeDragRef = useRef<{
    handle: FreeHandle
    sx: number
    sy: number
    start: { x: number; y: number; w: number; h: number }
  } | null>(null)

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (ratio === 'free') return
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
  }
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d) return
    const lim = 90 * zoom
    const nx = Math.max(-lim, Math.min(lim, d.px + (e.clientX - d.x)))
    const ny = Math.max(-lim, Math.min(lim, d.py + (e.clientY - d.y)))
    setPan({ x: nx, y: ny })
  }
  const onUp = () => { dragRef.current = null }

  const onFreeDown = (handle: FreeHandle, e: React.PointerEvent) => {
    e.stopPropagation()
    freeDragRef.current = { handle, sx: e.clientX, sy: e.clientY, start: { ...box } }
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) } catch {}
  }
  const onFreeMove = (e: React.PointerEvent) => {
    const st = freeDragRef.current
    const el = stageRef.current
    if (!st || !el) return
    e.stopPropagation()
    const rect = el.getBoundingClientRect()
    const dx = ((e.clientX - st.sx) / rect.width) * 100
    const dy = ((e.clientY - st.sy) / rect.height) * 100
    const s = st.start
    const MIN = 18
    let { x, y, w, h } = s

    if (st.handle === 'move') {
      x = Math.max(0, Math.min(100 - s.w, s.x + dx))
      y = Math.max(0, Math.min(100 - s.h, s.y + dy))
    } else {
      if (st.handle.includes('w')) {
        const nx = Math.max(0, Math.min(s.x + s.w - MIN, s.x + dx))
        w = s.x + s.w - nx
        x = nx
      }
      if (st.handle.includes('e')) {
        w = Math.max(MIN, Math.min(100 - s.x, s.w + dx))
      }
      if (st.handle.includes('n')) {
        const ny = Math.max(0, Math.min(s.y + s.h - MIN, s.y + dy))
        h = s.y + s.h - ny
        y = ny
      }
      if (st.handle.includes('s')) {
        h = Math.max(MIN, Math.min(100 - s.y, s.h + dy))
      }
    }
    setBox({ x, y, w, h })
  }
  const onFreeUp = () => { freeDragRef.current = null }

  const applyCrop = () => {
    const el = imgRef.current
    if (!el || !el.naturalWidth) {
      onApply(src)
      nav.sheet(null)
      nav.toast(pf.cropSaved)
      return
    }
    try {
      const nw = el.naturalWidth
      const nh = el.naturalHeight

      if (ratio === 'free') {
        const baseW = 720
        const baseH = 720
        const tmp = document.createElement('canvas')
        tmp.width = baseW
        tmp.height = baseH
        const tctx = tmp.getContext('2d')
        if (!tctx) throw new Error('no ctx')
        tctx.fillStyle = '#f4f2f8'
        tctx.fillRect(0, 0, baseW, baseH)

        const scaleContain = Math.min(baseW / nw, baseH / nh) * zoom
        tctx.save()
        tctx.translate(baseW / 2, baseH / 2)
        tctx.rotate((rot * Math.PI) / 180)
        tctx.drawImage(el, (-nw * scaleContain) / 2, (-nh * scaleContain) / 2, nw * scaleContain, nh * scaleContain)
        tctx.restore()

        const sx = Math.round((box.x / 100) * baseW)
        const sy = Math.round((box.y / 100) * baseH)
        const sw = Math.max(60, Math.round((box.w / 100) * baseW))
        const sh = Math.max(60, Math.round((box.h / 100) * baseH))

        const out = document.createElement('canvas')
        out.width = sw
        out.height = sh
        const octx = out.getContext('2d')
        if (!octx) throw new Error('no ctx')
        octx.drawImage(tmp, sx, sy, sw, sh, 0, 0, sw, sh)
        onApply(out.toDataURL('image/jpeg', 0.92))
      } else {
        const outW = ratio === '1:1' ? 720 : 600
        const outH = ratio === '1:1' ? 720 : 800
        const canvas = document.createElement('canvas')
        canvas.width = outW
        canvas.height = outH
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('no ctx')
        ctx.fillStyle = '#f4f2f8'
        ctx.fillRect(0, 0, outW, outH)

        const scaleCover = Math.max(outW / nw, outH / nh)
        const scaleContain = Math.min(outW / nw, outH / nh)
        const baseScale = ratio === 'fit' ? scaleContain : scaleCover
        const finalScale = baseScale * zoom

        ctx.save()
        ctx.translate(outW / 2 + pan.x * (outW / 240), outH / 2 + pan.y * (outH / 320))
        ctx.rotate((rot * Math.PI) / 180)
        ctx.drawImage(el, (-nw * finalScale) / 2, (-nh * finalScale) / 2, nw * finalScale, nh * finalScale)
        ctx.restore()

        onApply(canvas.toDataURL('image/jpeg', 0.9))
      }
    } catch {
      onApply(src)
    }
    nav.sheet(null)
    nav.toast(pf.cropSaved)
  }

  const badgeText =
    ratio === 'free'
      ? `${pf.cropRatioFree} · ${Math.round(box.w)}% × ${Math.round(box.h)}%`
      : ratio === '1:1'
        ? `${pf.cropRatio11}`
        : ratio === 'fit'
          ? pf.cropFitFull
          : pf.cropSafeZone

  return (
    <Sheet title={pf.cropTitle}>
      <div className="cr-wrap">
        <p className="cr-sub">{ratio === 'free' ? pf.cropFreeHint : pf.cropSub}</p>

        <div
          ref={stageRef}
          className={'cr-stage ' + (ratio === '1:1' || ratio === 'free' ? 'sq' : 'p34') + (ratio === 'free' ? ' free' : '')}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <img
            ref={imgRef}
            src={src}
            alt="Crop preview"
            draggable={false}
            className={ratio === 'fit' || ratio === 'free' ? 'fit' : 'cover'}
            style={{
              transform:
                ratio === 'free'
                  ? `scale(${zoom}) rotate(${rot}deg)`
                  : `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rot}deg)`,
            }}
          />

          {ratio === 'free' ? (
            <div
              className="cr-free-box"
              style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
              onPointerDown={(e) => onFreeDown('move', e)}
              onPointerMove={onFreeMove}
              onPointerUp={onFreeUp}
              onPointerCancel={onFreeUp}
            >
              <div className="cr-grid" aria-hidden>
                <i className="v1" /><i className="v2" /><i className="h1" /><i className="h2" />
              </div>
              {(['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'] as FreeHandle[]).map((h) => (
                <span
                  key={h}
                  className={'cr-h ' + h}
                  onPointerDown={(e) => onFreeDown(h, e)}
                  onPointerMove={onFreeMove}
                  onPointerUp={onFreeUp}
                  onPointerCancel={onFreeUp}
                />
              ))}
            </div>
          ) : (
            <div className="cr-grid" aria-hidden>
              <i className="v1" /><i className="v2" /><i className="h1" /><i className="h2" />
            </div>
          )}

          <span className="cr-safe">{badgeText}</span>
        </div>

        <div className="cr-ratios four">
          {([
            ['free', pf.cropRatioFree],
            ['3:4', pf.cropRatio34],
            ['1:1', pf.cropRatio11],
            ['fit', pf.cropFitFull],
          ] as [CropRatio, string][]).map(([k, l]) => (
            <button
              key={k}
              type="button"
              className={ratio === k ? 'on' : ''}
              onClick={() => {
                setRatio(k)
                setPan({ x: 0, y: 0 })
                setZoom(1)
                if (k === 'free') setBox({ x: 10, y: 8, w: 80, h: 84 })
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="cr-ctrl">
          <span>{pf.cropZoom}</span>
          <input
            type="range"
            min="1"
            max="2.4"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <b>{zoom.toFixed(1)}×</b>
        </div>

        <div className="cr-acts">
          <button
            type="button"
            className="cr-mini"
            onClick={() => {
              if (ratio === 'free') {
                setBox({ x: 14, y: 2, w: 72, h: 68 })
              } else {
                setRatio('3:4')
                setZoom(1.05)
                setPan({ x: 0, y: 26 })
              }
            }}
          >
            <SlidersHorizontal size={14} />{pf.cropTopFocus}
          </button>
          <button type="button" className="cr-mini" onClick={() => setRot((r) => (r + 90) % 360)}>
            <RotateCw size={14} />{pf.cropRotate} 90°
          </button>
        </div>

        <button type="button" className="btn" style={{ height: 50, borderRadius: 14, marginTop: 10 }} onClick={applyCrop}>
          <Check size={17} strokeWidth={2.5} />{pf.cropApply}
        </button>
      </div>
    </Sheet>
  )
}

/* ================================================================== */
export function ProductForm({ edit }: { edit?: Product }) {
  const nav = useNav()
  const { t, lang } = nav
  const pf = t.pf
  const ru = lang === 'ru'
  const isEdit = !!edit
  const p0 = parsePrice(edit?.price)

  const [step, setStep] = useState(isEdit ? 2 : 0)
  const [visited, setVisited] = useState<number[]>(isEdit ? [0, 1, 2, 3, 4, 5] : [0])
  const stepBtnsRef = useRef<(HTMLButtonElement | null)[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)

  const catName = (raw: string) => pf.catNames[raw] ?? raw
  const catPathLabel = (path: string) => path.split(' > ').map(catName).join(' › ')
  const colorLabel = (key: string) => pf.colorNames[key] ?? key

  // 1. категория + умный профиль
  const [cat, setCat] = useState(isEdit ? 'Kadın > Bluz ve Gömlek' : '')
  const [stack, setStack] = useState<Cat[]>([])
  const [cq, setCq] = useState('')
  const profile = useMemo(() => getSmartProfile(cat, lang), [cat, lang])
  const isJewelry = profile.domain === 'jewelry'

  // 2. фото + обрезка
  const [photos, setPhotos] = useState<string[]>(isEdit ? [edit!.gallery ?? edit!.image, edit!.image] : [])
  const [croppedIdx, setCroppedIdx] = useState<Record<number, boolean>>({})
  const [videos, setVideos] = useState<string[]>([])
  const vidRef = useRef<HTMLInputElement>(null)

  // 3. описание + ювелирный паспорт (граммы, проба, камень, караты, клеймо, коробка)
  const [name, setName] = useState(edit ? locTitle(edit.title, lang) : '')
  const [brand, setBrand] = useState(isEdit ? 'Iskra' : '')
  const [desc, setDesc] = useState('')
  const [attrs, setAttrs] = useState<Record<string, string[]>>({})
  const [tagOn, setTagOn] = useState<string[]>(isEdit ? ['Türkiye üretimi'] : [])

  // Ювелирные поля (активны автоматически при выборе «Украшения / Takılar»)
  const [jewelGrams, setJewelGrams] = useState('')
  const [jewelMetalIdx, setJewelMetalIdx] = useState(0)
  const [jewelStoneIdx, setJewelStoneIdx] = useState(0)
  const [jewelCarat, setJewelCarat] = useState('')
  const [jewelHallmark, setJewelHallmark] = useState(true)
  const [jewelGiftBox, setJewelGiftBox] = useState(true)
  const [gramRateInput, setGramRateInput] = useState('')

  const activeMetal = JEWELRY_METALS[lang][jewelMetalIdx] ?? JEWELRY_METALS[lang][0]
  const activeStone = JEWELRY_STONES[lang][jewelStoneIdx] ?? JEWELRY_STONES[lang][0]
  const gramsN = num(jewelGrams)

  // 4. варианты: умные цвета (металлы для украшений) + палитра + поиск + свои размеры + урок
  const table = useMemo(() => tableForCategory(cat), [cat])
  const [sys, setSys] = useState<SizeSys>(table.base)
  const [selColors, setSelColors] = useState<string[]>(isEdit ? ['Kahverengi', 'Kırmızı', 'Haki', 'Lacivert'] : [])
  const [customColors, setCustomColors] = useState<{ name: string; hex: string }[]>([])
  const [colorQ, setColorQ] = useState('')
  const [showPalette, setShowPalette] = useState(false)
  const [showAllColors, setShowAllColors] = useState(false)
  const [palHex, setPalHex] = useState('#d4a038')
  const [palName, setPalName] = useState('')

  const [selRows, setSelRows] = useState<number[]>(isEdit ? [2, 3, 4, 5] : [])
  const [customSizes, setCustomSizes] = useState<string[]>([])
  const [sizeQ, setSizeQ] = useState('')
  const [showTable, setShowTable] = useState(false)

  // 5. цена (₺ TRY / $ USD), остатки, логистика + коробка (см / мм)
  const [price, setPrice] = useState(p0.v)
  const [cur, setCur] = useState<Cur>(p0.cur)
  const [disc, setDisc] = useState('')
  const [stock, setStock] = useState<Record<string, number>>({})
  const [bulk, setBulk] = useState(isEdit ? 5 : 10)
  const [stockUnitIdx, setStockUnitIdx] = useState(0)
  const [weight, setWeight] = useState('')
  const [boxUnit, setBoxUnit] = useState<BoxUnit>('cm')
  const [boxL, setBoxL] = useState('')
  const [boxW, setBoxW] = useState('')
  const [boxH, setBoxH] = useState('')
  const [minQ, setMinQ] = useState(1)
  const [maxQ, setMaxQ] = useState(5)
  const [hidden, setHidden] = useState(false)
  const [tried, setTried] = useState(false)

  useEffect(() => {
    stepBtnsRef.current[step]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [step])

  const allColorEntries = useMemo(() => {
    const priority = profile.priorityColors.map(([label, hex]) => ({ key: label, label, hex }))
    const base = COLORS.map(([k, hex]) => ({ key: k, label: colorLabel(k), hex }))
    const custom = customColors.map((c) => ({ key: c.name, label: c.name, hex: c.hex }))
    return [...priority, ...base, ...custom]
  }, [profile.priorityColors, customColors, pf.colorNames])

  const hexOfColor = (key: string) => allColorEntries.find((c) => c.key === key)?.hex ?? '#ae33ff'

  const sysList = systemsOf(table)
  const activeSys = sysList.includes(sys) ? sys : table.base
  const colorList = selColors.length ? selColors : [pf.oneColor]
  const sizeItems = [
    ...(table.id === 'one'
      ? [{ id: 'r0', label: isJewelry && gramsN > 0 ? `${jewelGrams} ${ru ? 'г' : 'gr'}` : (table.rows[0][activeSys] ?? table.rows[0].int ?? 'OS'), sub: '' }]
      : selRows.map((r) => ({
          id: `r${r}`,
          label: table.rows[r][activeSys] ?? table.rows[r][table.base] ?? '',
          sub: activeSys !== 'ru' && table.rows[r].ru ? `RU ${table.rows[r].ru}` : table.rows[r].tr ? `TR ${table.rows[r].tr}` : '',
        }))),
    ...customSizes.map((cs) => ({ id: `c:${cs}`, label: cs, sub: ru ? 'Свой' : 'Özel' })),
  ]
  const variants = colorList.flatMap((c) => sizeItems.map((sz) => ({ c, sz, key: `${c}|${sz.id}` })))
  const stockOf = (k: string) => stock[k] ?? (isEdit ? 5 : 0)
  const totalStock = variants.reduce((a, v) => a + stockOf(v.key), 0)
  const priceN = num(price)
  const discN = Math.min(90, num(disc))
  const final = priceN * (1 - discN / 100)
  const sym = cur === 'TRY' ? '₺' : '$'
  const convertedVal = cur === 'TRY' ? final * RATE_USD.TRY : final * RATE_TRY.USD
  const convertedOld = cur === 'TRY' ? priceN * RATE_USD.TRY : priceN * RATE_TRY.USD
  const convertedSym = cur === 'TRY' ? '$' : '₺'
  const fmtConv = (v: number) =>
    cur === 'TRY'
      ? v.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : fmt(Math.round(v))
  const pricePerGram = isJewelry && gramsN > 0 && final > 0 ? final / gramsN : 0
  const tableName = (id: string) => pf.sizeTableNames[id] ?? id
  const activeStockUnit = pf.stockUnits[stockUnitIdx] ?? pf.stockUnits[0]

  const errs = {
    cat: !cat ? pf.errCat : '',
    photo: photos.length === 0 ? pf.errPhoto : '',
    name: name.trim().length < 3 ? pf.errName : '',
    size: table.id !== 'one' && selRows.length === 0 && customSizes.length === 0 ? pf.errSize : '',
    price: priceN <= 0 ? pf.errPrice : '',
    stock: totalStock <= 0 ? pf.errStock : '',
  }
  const stepErr = [errs.cat, errs.photo, errs.name, errs.size, errs.price || errs.stock, '']
  const checks = [
    { ok: !!cat, l: pf.selectedCat, s: 0 },
    { ok: photos.length >= 3, l: `${pf.photoTitle} (3+)`, s: 1 },
    { ok: name.trim().length >= 15, l: `${pf.prodName} (15+)`, s: 2 },
    ...(isJewelry ? [{ ok: gramsN > 0, l: ru ? 'Вес золота / украшения (г)' : 'Altın / takı gramajı (gr)', s: 2 }] : []),
    { ok: desc.trim().length >= 60, l: `${pf.desc}`, s: 2 },
    { ok: selColors.length > 0, l: pf.colorsTitle, s: 3 },
    { ok: table.id === 'one' || selRows.length > 0 || customSizes.length > 0, l: pf.sizesTitle, s: 3 },
    { ok: priceN > 0 && totalStock > 0, l: pf.steps[4], s: 4 },
  ]
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
  const scoreColor = score >= 80 ? '#1fa45a' : score >= 50 ? '#e6a700' : '#ae33ff'

  const go = (n: number) => {
    setStep(n)
    setVisited((v) => (v.includes(n) ? v : [...v, n]))
    bodyRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }
  const next = () => {
    if (stepErr[step] && !isEdit) { setTried(true); nav.toast(stepErr[step]); return }
    setTried(false); go(Math.min(STEP_KEYS.length - 1, step + 1))
  }
  const publish = () => {
    const first = stepErr.findIndex((e) => e)
    if (first >= 0) { setTried(true); go(first); nav.toast(stepErr[first]); return }
    nav.toast(isEdit ? t.saved : pf.publishedToast); nav.pop()
  }
  const toggle = (_arr: string[], set: React.Dispatch<React.SetStateAction<string[]>>, v: string) =>
    set((arr) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]))
  const sizeLabel = (r: number, s: SizeSys = activeSys) => table.rows[r][s] ?? table.rows[r][table.base] ?? ''

  /* ---------- 1. КАТЕГОРИЯ ---------- */
  const level = stack.length ? stack[stack.length - 1].children ?? [] : categories
  const allLeaves = useMemo(
    () =>
      categories.flatMap((c) =>
        c.children && c.children.length > 0
          ? c.children.map((l) => ({ path: `${c.name} > ${l.name}`, leaf: l.name, root: c.name }))
          : [{ path: c.name, leaf: c.name, root: c.name }],
      ),
    [],
  )
  const recent = [
    'Takılar > Kolye',
    'Takılar > Yüzük',
    'Kadın > Elbiseler',
    'Kadın ayakkabısı > Loafer',
  ]
  const quickSearch = ru
    ? ['Колье', 'Кольца', 'Платья', 'Лоферы', 'Сумки', 'Кофе']
    : ['Kolye', 'Yüzük', 'Elbise', 'Loafer', 'Çanta', 'Kahve']

  const pickCat = (path: string) => {
    const nextProf = getSmartProfile(path, lang)
    const nextTbl = tableForCategory(path)
    setCat(path)
    setCq('')
    setSys(nextTbl.base)
    setSelRows([])
    setAttrs({})
    setTagOn([])
    setBoxL(nextProf.defaultBox.l)
    setBoxW(nextProf.defaultBox.w)
    setBoxH(nextProf.defaultBox.h)
    setBoxUnit(nextProf.defaultBox.unit)
    setTried(false)
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const searchHits = useMemo(() => {
    const q = cq.trim().toLowerCase()
    if (!q) return []
    return allLeaves.filter((x) =>
      x.path.toLowerCase().includes(q) || catPathLabel(x.path).toLowerCase().includes(q),
    ).slice(0, 18)
  }, [allLeaves, cq, pf.catNames])

  const pickedRoot = cat ? cat.split(' > ')[0] : ''
  const pickedLeaf = cat ? cat.split(' > ').slice(-1)[0] : ''
  const pickedVis = visualOf(pickedRoot)
  const PickedIc = pickedVis.ic
  const activeParent = stack.length ? stack[stack.length - 1] : null
  const parentVis = activeParent ? visualOf(activeParent.name) : null
  const ParentIc = parentVis?.ic ?? Folder

  const StepCat = (
    <>
      <div className="cat-search">
        <Search size={17} className="cat-search-ic" />
        <input placeholder={pf.catSearchPh} value={cq} onChange={(e) => setCq(e.target.value)} />
        {cq && <button type="button" className="cat-search-x" onClick={() => setCq('')} aria-label={t.clear}><X size={13} /></button>}
      </div>

      {cat && !cq && (
        <div className="cat-picked">
          <div className="cat-picked-ic" style={{ background: pickedVis.bg, color: pickedVis.color }}>
            <PickedIc size={19} />
            <span className="cat-picked-ok"><Check size={10} strokeWidth={3} /></span>
          </div>
          <div className="cat-picked-info">
            <small>{pickedRoot !== pickedLeaf ? catName(pickedRoot) : pf.selectedCat}</small>
            <b>{catName(pickedLeaf)}</b>
            <span className="cat-size-badge">
              {isJewelry ? <Gem size={11} /> : <Ruler size={11} />}
              {isJewelry ? profile.badge : `${pf.sizeAuto}: ${tableName(table.id)}`}
            </span>
          </div>
          <button type="button" className="cat-picked-btn" onClick={() => { setCat(''); setStack([]) }}>{t.change}</button>
        </div>
      )}

      {cq ? (
        <div className="cat-results">
          {searchHits.length > 0 ? (
            searchHits.map((item) => {
              const v = visualOf(item.root)
              const Ic = v.ic
              const on = cat === item.path
              const sz = tableName(tableForCategory(item.path).id)
              return (
                <button type="button" key={item.path} className={'cat-subrow' + (on ? ' on' : '')} onClick={() => pickCat(item.path)}>
                  <span className="cat-mini-ic" style={{ background: v.bg, color: v.color }}><Ic size={15} /></span>
                  <span className="cat-subrow-t">
                    <b>{catName(item.leaf)}</b>
                    {item.root !== item.leaf && <small>{catName(item.root)}</small>}
                  </span>
                  <span className="cat-subrow-r">
                    <em className="cat-sz-pill">{sz}</em>
                    {on ? <span className="cat-check-dot on"><Check size={12} strokeWidth={3} /></span> : <ChevronRight size={15} />}
                  </span>
                </button>
              )
            })
          ) : (
            <div className="cat-empty">
              <div className="cat-empty-ic"><Search size={20} /></div>
              <b>«{cq}» {pf.noCatTitle}</b>
              <p>{pf.noCatSub}</p>
              <div className="cat-qchips">
                {quickSearch.map((w) => <button type="button" key={w} onClick={() => setCq(w)}>{w}</button>)}
              </div>
            </div>
          )}
        </div>
      ) : !stack.length ? (
        <>
          <div className="cat-sec-h"><Clock size={13} /><span>{pf.recent}</span></div>
          <div className="cat-recent">
            {recent.map((r) => {
              const [root, leaf] = r.split(' > ')
              const v = visualOf(root)
              const Ic = v.ic
              const on = cat === r
              return (
                <button type="button" key={r} className={'cat-rec-card' + (on ? ' on' : '')} onClick={() => pickCat(r)}>
                  <span className="cat-rec-ic" style={{ background: v.bg, color: v.color }}><Ic size={15} /></span>
                  <span className="cat-rec-txt"><b>{catName(leaf)}</b><small>{catName(root)}</small></span>
                  {on && <span className="cat-rec-chk"><Check size={11} strokeWidth={3} /></span>}
                </button>
              )
            })}
          </div>

          <div className="cat-sec-h">
            <LayoutGrid size={13} />
            <span>{pf.allCats}</span>
            <small>{categories.length} {pf.sections}</small>
          </div>
          <div className="cat-grid">
            {categories.map((c) => {
              const v = visualOf(c.name)
              const Ic = v.ic
              const leaf = !c.children || c.children.length === 0
              const subCount = c.children?.length ?? 0
              const isSelected = cat === c.name || pickedRoot === c.name
              return (
                <button
                  type="button"
                  key={c.name}
                  className={'cat-card' + (isSelected ? ' on' : '')}
                  onClick={() => { if (leaf) pickCat(c.name); else setStack([c]) }}
                >
                  <div className="cat-card-top">
                    <span className="cat-card-ic" style={{ background: v.bg, color: v.color }}><Ic size={19} /></span>
                    {isSelected ? (
                      <span className="cat-card-chk"><Check size={11} strokeWidth={3} /></span>
                    ) : (
                      <span className="cat-card-cnt">{subCount}</span>
                    )}
                  </div>
                  <div className="cat-card-name">{catName(c.name)}</div>
                  <div className="cat-card-sub">
                    {subCount > 0 ? `${subCount} ${pf.subCount}` : pf.directPick}
                    {!leaf && <ChevronRight size={12} />}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <div className="cat-parent">
            <button type="button" className="cat-back-pill" onClick={() => setStack(stack.slice(0, -1))}>
              <ArrowLeft size={14} />{pf.allCats}
            </button>
            <div className="cat-parent-main">
              <span className="cat-card-ic" style={{ background: parentVis?.bg, color: parentVis?.color }}><ParentIc size={19} /></span>
              <div><b>{activeParent ? catName(activeParent.name) : ''}</b><small>{level.length} {pf.subCount} · {pf.subPickHint}</small></div>
            </div>
          </div>

          <div className="cat-results">
            {level.map((c) => {
              const path = [...stack.map((s) => s.name), c.name].join(' > ')
              const leaf = !c.children || c.children.length === 0
              const on = cat === path
              const sz = tableName(tableForCategory(path).id)
              return (
                <button type="button" key={c.name} className={'cat-subrow' + (on ? ' on' : '')} onClick={() => { if (leaf) pickCat(path); else setStack([...stack, c]) }}>
                  <span className={'cat-check-dot' + (on ? ' on' : '')}>{on && <Check size={11} strokeWidth={3} />}</span>
                  <span className="cat-subrow-t"><b>{catName(c.name)}</b></span>
                  <span className="cat-subrow-r"><em className="cat-sz-pill">{sz}</em>{!leaf && <ChevronRight size={15} />}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
      {tried && errs.cat && <div className="pf-err"><CircleAlert size={12} />{errs.cat}</div>}
    </>
  )

  /* ---------- 2. ФОТОГРАФИИ + УМНАЯ ПОДСКАЗКА КАТЕГОРИИ + СВОБОДНАЯ ОБРЕЗКА ---------- */
  const openCropFor = (idx: number, src: string) => {
    nav.sheet(
      <PhotoCropSheet
        src={src}
        onApply={(croppedUrl) => {
          setPhotos((prev) => prev.map((x, j) => (j === idx ? croppedUrl : x)))
          setCroppedIdx((m) => ({ ...m, [idx]: true }))
        }}
      />,
    )
  }

  const addDemoPhotos = () => {
    setPhotos((p) => {
      const nextList = [...p]
      for (const u of DEMO_PHOTOS) if (!nextList.includes(u)) nextList.push(u)
      return nextList.slice(0, 20)
    })
    setTried(false)
    nav.toast(pf.demoAdded)
  }

  const handleFiles = (files: FileList) => {
    const urls = Array.from(files).map((x) => URL.createObjectURL(x))
    const firstNewIdx = photos.length
    setPhotos((p) => [...p, ...urls].slice(0, 20))
    setTried(false)
    if (urls[0]) setTimeout(() => openCropFor(firstNewIdx, urls[0]), 120)
  }

  const openPhotoSheet = () =>
    nav.sheet(<PhotoSourceSheet onFiles={handleFiles} onDemo={addDemoPhotos} />)

  const StepPhoto = (
    <>
      {cat && (
        <div className={'pf-smart-pill' + (isJewelry ? ' gold' : '')}>
          {isJewelry ? <Gem size={14} /> : <Wand2 size={14} />}
          <span><b>{profile.badge}:</b> {profile.photoTip}</span>
        </div>
      )}

      <div className="pf-ph-meter">
        <div className="pf-ph-meter-t">
          <span><Camera size={14} />{pf.photoTitle}</span>
          <b className={photos.length >= 3 ? 'ok' : ''}>{photos.length} / 20 · {photos.length >= 3 ? pf.photoGreat : pf.photoRec}</b>
        </div>
        <div className="pf-ph-meter-bar">
          <i style={{ width: `${Math.min(100, (photos.length / 3) * 100)}%`, background: photos.length >= 3 ? '#1fa45a' : '#ae33ff' }} />
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="pf-dropzone">
          <div className="pf-drop-ic"><ImagePlus size={28} /></div>
          <b>{pf.dropTitle}</b>
          <p>{profile.photoTip}</p>
          <div className="pf-drop-acts">
            <label className="pf-drop-btn primary">
              <Images size={16} />{pf.fromGallery}
              <input hidden type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files) }} />
            </label>
            <label className="pf-drop-btn">
              <Camera size={16} />{pf.camera}
              <input hidden type="file" accept="image/*" capture="environment" onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files) }} />
            </label>
          </div>
          <button type="button" className="pf-demo-link" onClick={addDemoPhotos}><Wand2 size={13} />{pf.demoPhotos}</button>
        </div>
      ) : (
        <div className="pf-photos">
          {photos.map((ph, i) => (
            <div key={i} className={'pf-ph' + (i === 0 ? ' cover' : '')}>
              <button type="button" className="pf-ph-tap" onClick={() => nav.sheet(
                <Sheet title={`${ru ? 'Фото' : 'Foto'} ${i + 1}`}>
                  <button className="opt on" onClick={() => openCropFor(i, ph)}>
                    <span style={{ display: 'flex', gap: 10 }}><Crop size={16} />{pf.cropBtn}</span>
                  </button>
                  {i > 0 && <button className="opt" onClick={() => { setPhotos([ph, ...photos.filter((_, j) => j !== i)]); nav.sheet(null) }}><span style={{ display: 'flex', gap: 10 }}><Star size={16} />{pf.makeCover}</span></button>}
                  {i > 0 && <button className="opt" onClick={() => { const a = [...photos];[a[i - 1], a[i]] = [a[i], a[i - 1]]; setPhotos(a); nav.sheet(null) }}><span style={{ display: 'flex', gap: 10 }}><ChevronLeft size={16} />{pf.moveLeft}</span></button>}
                  {i < photos.length - 1 && <button className="opt" onClick={() => { const a = [...photos];[a[i + 1], a[i]] = [a[i], a[i + 1]]; setPhotos(a); nav.sheet(null) }}><span style={{ display: 'flex', gap: 10 }}><ChevronRight size={16} />{pf.moveRight}</span></button>}
                  <button className="opt" style={{ color: 'var(--red)' }} onClick={() => { setPhotos(photos.filter((_, j) => j !== i)); nav.sheet(null) }}><span style={{ display: 'flex', gap: 10 }}><Trash2 size={16} />{t.delete}</span></button>
                </Sheet>,
              )}>
                <img src={ph} alt={`Foto ${i + 1}`} style={{ objectPosition: 'center top' }} />
                {i === 0 ? <span className="pf-cover"><Star size={10} fill="#fff" />{pf.cover}</span> : <span className="pf-num">{i + 1}</span>}
                {croppedIdx[i] && <span className="pf-ph-34">✓</span>}
              </button>
              <button type="button" className="pf-ph-crop" onClick={() => openCropFor(i, ph)} aria-label={pf.cropBtn}>
                <Crop size={11} />{ru ? 'Кадр' : 'Kırp'}
              </button>
              <button type="button" className="pf-ph-del" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} aria-label={t.delete}><X size={11} strokeWidth={2.8} /></button>
            </div>
          ))}
          {photos.length < 20 && (
            <button type="button" className="pf-ph add" onClick={openPhotoSheet}><ImagePlus size={22} /><span>+</span><small>{photos.length}/20</small></button>
          )}
        </div>
      )}

      <div className="pf-tip">
        <div className="pf-tip-h"><Crop size={14} />{pf.photoGuide}</div>
        <ul>
          {[
            [photos.length >= 3, '3+ · 3:4 (900×1200 px) · JPG / PNG / WEBP'],
            [Object.keys(croppedIdx).length > 0, pf.cropFreeHint],
          ].map(([ok, tx]) => <li key={tx as string} className={ok ? 'ok' : ''}><CircleCheck size={13} />{tx as string}</li>)}
        </ul>
      </div>

      <Section icon={<Video size={16} />} title={pf.videoTitle} sub={pf.videoSub}>
        {videos.map((v, i) => <div key={i} className="pf-file"><Video size={14} color="#ae33ff" /><span>{v}</span><button onClick={() => setVideos(videos.filter((_, j) => j !== i))}><X size={14} /></button></div>)}
        {videos.length < 3 && <button type="button" className="pf-add-line" onClick={() => vidRef.current?.click()}><Plus size={16} />{pf.addVideo}</button>}
        <input ref={vidRef} hidden type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && setVideos([...videos, e.target.files[0].name])} />
      </Section>
      {tried && errs.photo && <div className="pf-err"><CircleAlert size={12} />{errs.photo}</div>}
    </>
  )

  /* ---------- 3. ОПИСАНИЕ + ЮВЕЛИРНЫЙ ПАСПОРТ (ГРАММЫ / ПРОБА / КАМЕНЬ / КЛЕЙМО) ---------- */
  const fillSmartTitle = () => {
    if (isJewelry) {
      const leafNm = pickedLeaf ? catName(pickedLeaf) : (ru ? 'Украшение' : 'Takı')
      const stoneTxt = jewelStoneIdx > 0 ? (ru ? `с камнем (${activeStone})` : `${activeStone} taşlı`) : ''
      const gramTxt = gramsN > 0 ? `${jewelGrams} ${ru ? 'г' : 'gr'}` : ''
      setName([leafNm, activeMetal, stoneTxt, gramTxt].filter(Boolean).join(', '))
      nav.toast(pf.titleApplied)
      return
    }
    const parts = [
      pickedRoot && pickedRoot !== pickedLeaf ? catName(pickedRoot).split(' ')[0] : '',
      Object.values(attrs).flat()[0],
      pickedLeaf ? catName(pickedLeaf) : (ru ? 'Товар' : 'Ürün'),
    ].filter(Boolean)
    setName(parts.join(' ').trim() || (ru ? 'Женская хлопковая рубашка' : 'Kadın pamuklu gömlek'))
    nav.toast(pf.titleApplied)
  }

  const fillAiDesc = () => {
    if (isJewelry) {
      const lines = [
        `${name || (pickedLeaf ? catName(pickedLeaf) : (ru ? 'Ювелирное украшение' : 'Mücevher'))}${brand && brand !== pf.brandless ? ` — ${brand}` : ''}.`,
        `• ${ru ? 'Металл и проба' : 'Maden ve ayar'}: ${activeMetal}`,
        gramsN > 0 ? `• ${ru ? 'Точный вес' : 'Net ağırlık'}: ${jewelGrams} ${ru ? 'г' : 'gr'}` : '',
        `• ${ru ? 'Вставка' : 'Taş'}: ${activeStone}${jewelStoneIdx > 0 && jewelCarat ? ` (${jewelCarat} ct)` : ''}`,
        jewelHallmark ? `• ${ru ? 'Имеется официальное пробирное клеймо' : 'Resmi ayar damgalı'}` : '',
        jewelGiftBox ? `• ${ru ? 'В комплекте: фирменная подарочная коробка и сертификат подлинности' : 'Hediye kutusu ve orijinallik sertifikası dahildir'}` : '',
      ].filter(Boolean)
      setDesc(lines.join('\n'))
      nav.toast(pf.aiDescToast)
      return
    }
    const attrLines = profile.attrs
      .filter((a) => attrs[a.k]?.length)
      .map((a) => `• ${a.l}: ${attrs[a.k].join(', ')}`)
    const lines = [
      `${name || (pickedLeaf ? catName(pickedLeaf) : (ru ? 'Товар' : 'Ürün'))}${brand && brand !== pf.brandless ? ` — ${brand}` : ''}.`,
      ...(attrLines.length ? attrLines : [ru ? '• Высокое турецкое качество и аккуратный пошив' : '• Yüksek Türkiye kalitesi ve özenli işçilik']),
      ru ? '• Быстрая отправка из Стамбула в Казахстан, Россию, Кыргызстан и Узбекистан.' : '• İstanbul’dan Kazakistan, Rusya, Kırgızistan ve Özbekistan’a hızlı gönderim.',
    ]
    setDesc(lines.join('\n'))
    nav.toast(pf.aiDescToast)
  }

  const filledAttrCount = profile.attrs.filter((a) => (attrs[a.k]?.length ?? 0) > 0).length
  const quickBrands = isJewelry
    ? [pf.brandless, 'Atasay', 'Altınbaş', 'Zen', 'Koçak']
    : [pf.brandless, 'Iskra', 'Diva', 'Kiğılı', 'Polo Garage']

  const StepInfo = (
    <>
      <div className="pf-info-banner">
        <Globe size={15} />
        <span>{pf.autoTranslate}</span>
      </div>

      {/* Умная карточка для ЗОЛОТА И УКРАШЕНИЙ (граммы, проба, камень, караты, клеймо, коробка) */}
      {isJewelry && (
        <section className="pf-jewel-card">
          <div className="pf-jewel-h">
            <span className="pf-jewel-ic"><Gem size={18} /></span>
            <div>
              <h3>{ru ? 'Паспорт золота и украшения' : 'Altın ve Mücevher Özellikleri'}</h3>
              <p>{ru ? 'Точные граммы, проба и гарантии повышают доверие покупателей' : 'Net gramaj, ayar ve sertifika bilgisi alıcı güvenini artırır'}</p>
            </div>
          </div>

          {/* Граммовка (0.01 г + быстрые чипы) */}
          <div className="pf-j-block">
            <div className="pf-j-lbl">
              <span><Scale size={13} />{ru ? 'Вес изделия (граммы)' : 'Ürün gramajı (gr)'}<em>*</em></span>
              {gramsN > 0 && <b className="pf-j-ok">{jewelGrams} {ru ? 'г' : 'gr'}</b>}
            </div>
            <div className="pf-j-gram-row">
              <div className="pf-input big" style={{ height: 48 }}>
                <input
                  inputMode="decimal"
                  placeholder="3.45"
                  value={jewelGrams}
                  onChange={(e) => setJewelGrams(e.target.value.replace(/[^\d.,]/g, '').replace(',', '.'))}
                />
                <span>{ru ? 'г' : 'gr'}</span>
              </div>
            </div>
            <div className="pf-j-chips">
              {JEWELRY_GRAM_PRESETS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={jewelGrams === g ? 'on' : ''}
                  onClick={() => setJewelGrams(g)}
                >
                  {g} {ru ? 'г' : 'gr'}
                </button>
              ))}
            </div>
          </div>

          {/* Металл и Проба (Ayar) */}
          <div className="pf-j-block">
            <div className="pf-j-lbl"><span>{ru ? 'Металл и проба (Ayar)' : 'Maden ve Ayar'}</span></div>
            <div className="pf-chips">
              {JEWELRY_METALS[lang].map((m, idx) => (
                <button
                  key={m}
                  type="button"
                  className={jewelMetalIdx === idx ? 'on' : ''}
                  onClick={() => setJewelMetalIdx(idx)}
                >
                  {jewelMetalIdx === idx && <Check size={12} />}{m}
                </button>
              ))}
            </div>
          </div>

          {/* Камень и караты */}
          <div className="pf-j-block">
            <div className="pf-j-lbl"><span>{ru ? 'Вставка / Камень' : 'Taş cinsi'}</span></div>
            <div className="pf-chips">
              {JEWELRY_STONES[lang].map((st, idx) => (
                <button
                  key={st}
                  type="button"
                  className={jewelStoneIdx === idx ? 'on' : ''}
                  onClick={() => setJewelStoneIdx(idx)}
                >
                  {jewelStoneIdx === idx && <Check size={12} />}{st}
                </button>
              ))}
            </div>
            {jewelStoneIdx > 0 && (
              <div className="pf-j-carat">
                <label>{ru ? 'Вес камня (караты)' : 'Taş ağırlığı (karat)'}</label>
                <div className="pf-box-inp" style={{ maxWidth: 150 }}>
                  <input
                    inputMode="decimal"
                    placeholder="0.25"
                    value={jewelCarat}
                    onChange={(e) => setJewelCarat(e.target.value.replace(/[^\d.,]/g, '').replace(',', '.'))}
                  />
                  <span>ct</span>
                </div>
              </div>
            )}
          </div>

          {/* Плюсы против конкурентов: пробирное клеймо + сертификат и подарочная коробка */}
          <div className="pf-j-toggles">
            <button type="button" className={'pf-j-tog' + (jewelHallmark ? ' on' : '')} onClick={() => setJewelHallmark(!jewelHallmark)}>
              <ShieldCheck size={15} />
              <span>{ru ? 'Есть пробирное клеймо (Damga)' : 'Resmi ayar damgası var'}</span>
              <em className={'pe-geo-chk' + (jewelHallmark ? ' on' : '')}>{jewelHallmark && <Check size={10} strokeWidth={3} />}</em>
            </button>
            <button type="button" className={'pf-j-tog' + (jewelGiftBox ? ' on' : '')} onClick={() => setJewelGiftBox(!jewelGiftBox)}>
              <Gift size={15} />
              <span>{ru ? 'Подарочная коробка и сертификат' : 'Hediye kutusu ve sertifika'}</span>
              <em className={'pe-geo-chk' + (jewelGiftBox ? ' on' : '')}>{jewelGiftBox && <Check size={10} strokeWidth={3} />}</em>
            </button>
          </div>
        </section>
      )}

      <Field
        label={pf.prodName}
        req
        icon={<Type size={13} color="#ae33ff" />}
        err={tried ? errs.name : ''}
        right={<span className={'pf-count' + (name.trim().length >= 15 ? ' ok' : '')}>{name.trim().length >= 15 ? '✓ ' : ''}{name.length}/100</span>}
      >
        <div className="pf-input">
          <input maxLength={100} placeholder={profile.namePh} value={name} onChange={(e) => setName(e.target.value)} />
          {name && <button type="button" className="cat-search-x" onClick={() => setName('')}><X size={12} /></button>}
        </div>
        <button type="button" className="pf-ai" onClick={fillSmartTitle}><Wand2 size={13} />{pf.suggestTitle}</button>
      </Field>

      <Field label={pf.brand} icon={<Award size={13} color="#ae33ff" />}>
        <button type="button" className="pf-input pf-select" onClick={() => nav.sheet(<BrandSheet value={brand} onPick={setBrand} />)}>
          <span className={brand ? '' : 'ph'}>{brand || pf.brandPh}</span>
          {brand ? <X size={16} onClick={(e) => { e.stopPropagation(); setBrand('') }} /> : <ChevronDown size={16} />}
        </button>
        <div className="pf-qrow">
          {quickBrands.map((b) => <button type="button" key={b} className={brand === b ? 'on' : ''} onClick={() => setBrand(b)}>{b}</button>)}
        </div>
      </Field>

      <Field
        label={pf.desc}
        icon={<Sparkles size={13} color="#ae33ff" />}
        right={<span className={'pf-count' + (desc.trim().length >= 60 ? ' ok' : '')}>{desc.trim().length >= 60 ? '✓ ' : ''}{desc.length}/5000</span>}
      >
        <div className="pf-input area">
          <textarea maxLength={5000} rows={5} placeholder={profile.descPh} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <button type="button" className="pf-ai" onClick={fillAiDesc}><Sparkles size={14} />{pf.aiDesc}</button>
      </Field>

      <Section icon={<Layers size={16} />} title={pf.attrsTitle} sub={`${filledAttrCount}/${profile.attrs.length} ${pf.attrsFilled}`}>
        {profile.attrs.map((a) => {
          const picked = attrs[a.k] ?? []
          return (
            <div key={a.k} className="pf-attr">
              <div className="pf-attr-l">
                {a.l}
                {a.filter && <span>{pf.filterBadge}</span>}
                {a.multi && <small>{pf.multiBadge}</small>}
                {picked.length > 0 && <em className="pf-attr-cnt">{picked.length}</em>}
              </div>
              <div className="pf-chips">
                {a.opts.map((o) => {
                  const on = picked.includes(o)
                  return (
                    <button
                      type="button"
                      key={o}
                      className={on ? 'on' : ''}
                      onClick={() => setAttrs((curA) => {
                        const has = curA[a.k]?.includes(o)
                        return { ...curA, [a.k]: a.multi ? (has ? curA[a.k].filter((x) => x !== o) : [...(curA[a.k] ?? []), o]) : has ? [] : [o] }
                      })}
                    >
                      {on && <Check size={12} />}{o}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </Section>

      <Section icon={<Tag size={16} />} title={pf.tagsTitle} sub={pf.tagsSub}>
        <div className="pf-chips">
          {profile.tags.map((tg) => {
            const on = tagOn.includes(tg.key)
            const Tic = TAG_ICONS[tg.key] ?? Tag
            return (
              <button
                type="button"
                key={tg.key}
                className={on ? 'on' : ''}
                style={on ? { background: tg.bg, borderColor: tg.color, color: tg.color } : undefined}
                onClick={() => toggle(tagOn, setTagOn, tg.key)}
              >
                <Tic size={12} />{tg.label}
              </button>
            )
          })}
        </div>
      </Section>
    </>
  )

  /* ---------- 4. ЦВЕТА (МЕТАЛЛЫ ДЛЯ УКРАШЕНИЙ + ПАЛИТРА) И РАЗМЕРЫ (КОЛЬЦА/ЦЕПОЧКИ/УРОК) ---------- */
  const filteredColors = useMemo(() => {
    const q = colorQ.trim().toLowerCase()
    if (q) return allColorEntries.filter((c) => c.label.toLowerCase().includes(q) || c.key.toLowerCase().includes(q))
    return showAllColors ? allColorEntries : allColorEntries.slice(0, 6)
  }, [allColorEntries, colorQ, showAllColors])

  const addPaletteColor = () => {
    const cleanName = palName.trim() || palHex.toUpperCase()
    if (!customColors.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      setCustomColors((prev) => [...prev, { name: cleanName, hex: palHex }])
    }
    if (!selColors.includes(cleanName)) setSelColors((prev) => [...prev, cleanName])
    setPalName('')
    setShowPalette(false)
    nav.toast(`${cleanName} ✓`)
  }

  const pickPopularSizes = () => {
    if (table.id === 'shoes') setSelRows([1, 2, 3, 4, 5])
    else if (table.id === 'rings') setSelRows([2, 3, 4, 5])
    else if (table.id === 'chains') setSelRows([1, 2, 3])
    else if (table.id === 'bracelets') setSelRows([1, 2, 3])
    else if (table.id === 'women') setSelRows([2, 3, 4, 5])
    else if (table.id === 'men') setSelRows([1, 2, 3, 4])
    else setSelRows(table.rows.slice(0, Math.min(4, table.rows.length)).map((_, i) => i))
    setTried(false)
  }

  const filteredSizeRows = useMemo(() => {
    const q = sizeQ.trim().toLowerCase()
    const indexed = table.rows.map((row, r) => ({ row, r }))
    if (!q) return indexed
    return indexed.filter(({ row }) =>
      Object.values(row).some((v) => v && v.toLowerCase().includes(q)),
    )
  }, [table, sizeQ])

  const addCustomSize = () => {
    const v = sizeQ.trim().toUpperCase()
    if (!v) return
    const hit = table.rows.findIndex((row) => Object.values(row).some((x) => x && x.toLowerCase() === v.toLowerCase()))
    if (hit >= 0) {
      setSelRows((curR) => (curR.includes(hit) ? curR : [...curR, hit].sort((a, b) => a - b)))
    } else if (!customSizes.includes(v)) {
      setCustomSizes((prev) => [...prev, v])
    }
    setSizeQ('')
    setTried(false)
    nav.toast(`${pf.sizeCustomAdded}: ${v}`)
  }

  const toggleSizeRow = (r: number) => {
    setSelRows((curR) => (curR.includes(r) ? curR.filter((x) => x !== r) : [...curR, r].sort((a, b) => a - b)))
    setTried(false)
  }

  const StepVar = (
    <>
      <Section
        icon={<Palette size={16} />}
        title={isJewelry ? (ru ? 'Оттенок металла / Цвет' : 'Maden Rengi / Ton') : pf.colorsTitle}
        sub={selColors.length ? `${selColors.length} ${pf.colorsSelected}` : pf.colorsSub}
        right={selColors.length ? <button type="button" className="pf-link" onClick={() => setSelColors([])}>{t.clear}</button> : null}
      >
        <div className="pf-clr-bar">
          <div className="pf-clr-search">
            <Search size={14} />
            <input placeholder={pf.colorSearchPh} value={colorQ} onChange={(e) => setColorQ(e.target.value)} />
            {colorQ && <button type="button" onClick={() => setColorQ('')}><X size={12} /></button>}
          </div>
          <button
            type="button"
            className={'pf-pal-btn' + (showPalette ? ' on' : '')}
            onClick={() => setShowPalette(!showPalette)}
          >
            <Pipette size={14} /><span>{pf.colorPaletteBtn}</span>
          </button>
        </div>

        {selColors.length > 0 && (
          <div className="pf-clr-picked">
            {selColors.map((k) => {
              const hex = hexOfColor(k)
              return (
                <button key={k} type="button" className="pf-clr-tag" onClick={() => toggle(selColors, setSelColors, k)}>
                  <i style={{ background: hex }} />
                  <span>{colorLabel(k)}</span>
                  <X size={11} />
                </button>
              )
            })}
          </div>
        )}

        {showPalette && (
          <div className="pf-pal-box">
            <div className="pf-pal-h">
              <b>{pf.colorPaletteTitle}</b>
              <span className="pf-pal-hex"><i style={{ background: palHex }} />{palHex.toUpperCase()}</span>
            </div>
            <div className="pf-pal-swatches">
              {DESIGNER_SHADES.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className={palHex.toLowerCase() === hex ? 'on' : ''}
                  style={{ background: hex }}
                  onClick={() => setPalHex(hex)}
                  aria-label={hex}
                />
              ))}
            </div>
            <div className="pf-pal-custom">
              <label className="pf-pal-wheel" style={{ background: palHex }}>
                <input type="color" value={palHex} onChange={(e) => setPalHex(e.target.value)} />
                <Pipette size={15} color={isLightHex(palHex) ? '#1b1b1f' : '#fff'} />
              </label>
              <input
                className="pf-pal-name"
                placeholder={pf.colorCustomNamePh}
                value={palName}
                onChange={(e) => setPalName(e.target.value)}
              />
              <button type="button" className="pf-pal-add" onClick={addPaletteColor}>
                <Plus size={14} />{pf.sizeAddCustom}
              </button>
            </div>
          </div>
        )}

        <div className="pf-colors compact">
          {filteredColors.map((c) => {
            const on = selColors.includes(c.key)
            return (
              <button type="button" key={c.key} className={on ? 'on' : ''} onClick={() => toggle(selColors, setSelColors, c.key)}>
                <span className="sw" style={{ background: c.hex }}>
                  {on && <Check size={11} color={isLightHex(c.hex) ? '#1b1b1f' : '#fff'} strokeWidth={3} />}
                </span>
                <span>{c.label}</span>
              </button>
            )
          })}
        </div>

        {!colorQ && allColorEntries.length > 6 && (
          <button type="button" className="pf-clr-more" onClick={() => setShowAllColors(!showAllColors)}>
            {showAllColors ? pf.colorShowLess : `${pf.colorShowMore} (${allColorEntries.length})`}
            <ChevronDown size={13} style={{ transform: showAllColors ? 'rotate(180deg)' : undefined }} />
          </button>
        )}
      </Section>

      {/* Размеры / Вес / Длина в зависимости от категории */}
      <Section
        icon={isJewelry ? <Gem size={16} /> : <Ruler size={16} />}
        title={isJewelry && table.id === 'one' ? (ru ? 'Вес в граммах (варианты)' : 'Gramaj (varyantlar)') : pf.sizesTitle}
        sub={`${tableName(table.id)} · ${pf.sizesAutoSub}`}
        right={table.id !== 'one' ? (
          <button type="button" className="pf-link" onClick={() => setSelRows(selRows.length === table.rows.length ? [] : table.rows.map((_, i) => i))}>
            {selRows.length === table.rows.length ? t.clear : t.all}
          </button>
        ) : null}
      >
        {table.id === 'one' ? (
          <>
            {isJewelry ? (
              <div className="pf-j-var-box">
                <p>{ru ? 'Для серёг/комплектов/брошей можно добавить несколько весов (например: 2.5 г, 4.0 г) или указать точный вес:' : 'Küpe/set/broş için farklı gramaj seçenekleri (örn: 2.5 gr, 4.0 gr) ekleyebilirsiniz:'}</p>
                <div className="pf-sz-custom-bar">
                  <div className="pf-clr-search">
                    <Scale size={14} />
                    <input
                      placeholder={ru ? 'Добавить вес (напр: 3.5 г, 5.2 г)' : 'Gramaj ekle (örn: 3.5 gr, 5.2 gr)'}
                      value={sizeQ}
                      onChange={(e) => setSizeQ(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize() } }}
                    />
                  </div>
                  <button type="button" className={'pf-sz-add' + (sizeQ.trim() ? ' on' : '')} disabled={!sizeQ.trim()} onClick={addCustomSize}>
                    <Plus size={14} />{pf.sizeAddCustom}
                  </button>
                </div>
                {customSizes.length > 0 && (
                  <div className="pf-clr-picked">
                    {customSizes.map((cs) => (
                      <button key={cs} type="button" className="pf-clr-tag" onClick={() => setCustomSizes((p) => p.filter((x) => x !== cs))}>
                        <b>{cs}</b><X size={11} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="pf-note"><Info size={14} />{pf.oneSizeNote}</div>
            )}
          </>
        ) : (
          <>
            {sysList.length > 1 && (
              <div className="pf-seg" role="tablist">
                {sysList.map((s) => <button type="button" key={s} className={activeSys === s ? 'on' : ''} onClick={() => setSys(s)}>{SYS_LABEL[s]}</button>)}
              </div>
            )}

            <div className="pf-sz-custom-bar">
              <div className="pf-clr-search">
                <Search size={14} />
                <input
                  placeholder={pf.sizeSearchAddPh}
                  value={sizeQ}
                  onChange={(e) => setSizeQ(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize() } }}
                />
                {sizeQ && <button type="button" onClick={() => setSizeQ('')}><X size={12} /></button>}
              </div>
              <button
                type="button"
                className={'pf-sz-add' + (sizeQ.trim() ? ' on' : '')}
                disabled={!sizeQ.trim()}
                onClick={addCustomSize}
              >
                <Plus size={14} />{pf.sizeAddCustom}
              </button>
            </div>

            {customSizes.length > 0 && (
              <div className="pf-clr-picked" style={{ marginBottom: 8 }}>
                {customSizes.map((cs) => (
                  <button key={cs} type="button" className="pf-clr-tag" onClick={() => setCustomSizes((p) => p.filter((x) => x !== cs))}>
                    <b>{cs}</b>
                    <X size={11} />
                  </button>
                ))}
              </div>
            )}

            <div className="pf-sz-bar">
              <span className="pf-sz-tip"><Wand2 size={12} />{pf.sizesAutoTip}</span>
              <button type="button" className="pf-sz-preset" onClick={pickPopularSizes}><Zap size={11} />{pf.popularSizes}</button>
            </div>

            <div className="pf-sizes">
              {filteredSizeRows.map(({ r }) => {
                const on = selRows.includes(r)
                return (
                  <button
                    type="button"
                    key={r}
                    className={on ? 'on' : ''}
                    onClick={() => toggleSizeRow(r)}
                  >
                    <b>{sizeLabel(r)}</b>
                    <small>{equivalents(table, r, activeSys) || table.rows[r].cm || ''}</small>
                    {on && <span className="tick"><Check size={10} strokeWidth={3} /></span>}
                  </button>
                )
              })}
            </div>

            <button type="button" className={'pf-lesson-btn' + (showTable ? ' open' : '')} onClick={() => setShowTable(!showTable)}>
              <span className="pf-lesson-ic"><BookOpen size={15} /></span>
              <span className="pf-lesson-t">
                <b>{showTable ? pf.hideTable : pf.showTable}</b>
                <small>{pf.sizeTapRowHint}</small>
              </span>
              <ChevronDown size={16} style={{ transform: showTable ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
            </button>

            {showTable && (
              <div className="pf-lesson-box">
                <div className="pf-lesson-steps">
                  <div className="pf-lesson-h"><BookOpen size={13} />{pf.sizeLessonTitle}</div>
                  {pf.sizeLessonSteps.map((st) => <div key={st} className="pf-lesson-st">{st}</div>)}
                </div>
                <div className="pf-table interactive">
                  <table>
                    <thead>
                      <tr>
                        {sysList.map((s) => <th key={s} className={s === activeSys ? 'on' : ''}>{SYS_LABEL[s]}</th>)}
                        <th>{table.measureLabel[lang]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, r) => {
                        const on = selRows.includes(r)
                        return (
                          <tr key={r} className={on ? 'on' : ''} onClick={() => toggleSizeRow(r)}>
                            {sysList.map((s) => <td key={s}>{row[s] ?? '—'}</td>)}
                            <td className="cm">{row.cm ?? '—'} {on && <Check size={12} style={{ marginLeft: 4, verticalAlign: '-2px' }} />}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pf-other">
              {pf.otherTables} {SIZE_TABLES.filter((tb) => tb.id !== table.id).slice(0, 6).map((tb) => <span key={tb.id}>{tableName(tb.id)}</span>)}
            </div>
            {tried && errs.size && <div className="pf-err"><CircleAlert size={12} />{errs.size}</div>}
          </>
        )}
      </Section>

      <div className="pf-sum">
        <span className="pf-sum-ic"><Package size={16} /></span>
        <div className="pf-sum-t">
          <b>{variants.length} {pf.variantsReady}</b>
          <small>{selColors.length ? `${selColors.length} ${pf.colorWord}` : pf.oneColor} × {sizeItems.length} {pf.sizeWord}</small>
        </div>
        {selColors.length > 0 && (
          <div className="pf-sum-dots">
            {selColors.slice(0, 5).map((c) => <i key={c} style={{ background: hexOfColor(c) }} />)}
          </div>
        )}
      </div>
    </>
  )

  /* ---------- 5. ЦЕНА (₺ TRY / $ USD + КАЛЬКУЛЯТОР ЦЕНЫ ЗА 1 ГРАММ ДЛЯ ЗОЛОТА), ОСТАТКИ И КОРОБКА ---------- */
  const applyBulk = (val: number) => {
    setBulk(val)
    setStock(Object.fromEntries(variants.map((v) => [v.key, val])))
    setTried(false)
    nav.toast(`${val} ${t.pieces} · ${t.apply}`)
  }

  const applyGramRate = () => {
    const rate = num(gramRateInput)
    if (rate > 0 && gramsN > 0) {
      setPrice(String(Math.round(rate * gramsN)))
      setTried(false)
      nav.toast(`${jewelGrams} ${ru ? 'г' : 'gr'} × ${fmt(rate)} ${sym} = ${fmt(Math.round(rate * gramsN))} ${sym}`)
    }
  }

  const StepPrice = (
    <>
      <Section icon={<Wallet size={16} />} title={pf.priceTitle} sub={pf.priceSub}>
        {/* Умный калькулятор цены по граммам для золота/украшений */}
        {isJewelry && (
          <div className="pf-gram-calc">
            <div className="pf-gc-h">
              <Calculator size={14} />
              <b>{ru ? 'Калькулятор по граммам золота' : 'Gram altın fiyat hesaplayıcı'}</b>
              {gramsN > 0 && <span>{jewelGrams} {ru ? 'г' : 'gr'}</span>}
            </div>
            {gramsN > 0 ? (
              <div className="pf-gc-row">
                <div className="pf-box-inp" style={{ flex: 1 }}>
                  <input
                    inputMode="decimal"
                    placeholder={ru ? `Цена за 1 г (${sym})` : `1 gr fiyatı (${sym})`}
                    value={gramRateInput}
                    onChange={(e) => setGramRateInput(e.target.value.replace(/[^\d.,]/g, ''))}
                  />
                  <span>{sym}/{ru ? 'г' : 'gr'}</span>
                </div>
                <button type="button" className="pf-gc-btn" onClick={applyGramRate}>
                  {ru ? 'Рассчитать' : 'Hesapla'}
                </button>
              </div>
            ) : (
              <button type="button" className="pf-gc-go" onClick={() => go(2)}>
                {ru ? 'Укажите вес в граммах на шаге «Описание» →' : '«Bilgiler» adımında gramaj girin →'}
              </button>
            )}
            {pricePerGram > 0 && (
              <div className="pf-gc-res">
                {ru ? 'Итоговая цена за 1 грамм:' : 'Gram başı fiyat:'}{' '}
                <b>≈ {fmt(Math.round(pricePerGram))} {sym} / {ru ? 'г' : 'gr'}</b>
              </div>
            )}
          </div>
        )}

        <div className="pf-price-row">
          <div className="pf-input big">
            <input inputMode="decimal" placeholder="0" value={price} onChange={(e) => { setPrice(e.target.value.replace(/[^\d.,]/g, '')); setTried(false) }} />
            <span>{sym}</span>
          </div>
          <div className="pf-seg small">
            {(['TRY', 'USD'] as Cur[]).map((c) => (
              <button type="button" key={c} className={cur === c ? 'on' : ''} onClick={() => setCur(c)}>
                {c === 'TRY' ? '₺ TRY' : '$ USD'}
              </button>
            ))}
          </div>
        </div>
        {tried && errs.price && <div className="pf-err"><CircleAlert size={12} />{errs.price}</div>}

        <div className="pf-disc-presets">
          <span className="pf-disc-lbl"><Percent size={12} />{pf.quickDiscount}</span>
          {QUICK_DISCOUNTS.map((d) => (
            <button type="button" key={d} className={discN === d ? 'on' : ''} onClick={() => setDisc(d ? String(d) : '')}>
              {d === 0 ? pf.noDiscount : `−${d}%`}
            </button>
          ))}
        </div>

        <div className="pf-row2">
          <Field label={pf.discountLbl}>
            <div className="pf-input"><Percent size={14} color="#8a8a93" /><input inputMode="numeric" placeholder="0" value={disc} onChange={(e) => setDisc(e.target.value.replace(/\D/g, '').slice(0, 2))} /></div>
          </Field>
          <Field label={pf.discountedPrice}>
            <div className="pf-input ro">{priceN ? `${fmt(Math.round(final * 100) / 100)} ${sym}` : '—'}</div>
          </Field>
        </div>

        {priceN > 0 && (
          <div className="pf-buyer">
            <div>
              <span>{pf.buyerPrice}</span>
              <small>{pf.rateLbl}: 1 $ = {TRY_PER_USD} ₺</small>
            </div>
            <div className="pf-buyer-r">
              <b>≈ {fmtConv(convertedVal)} {convertedSym}</b>
              {discN > 0 && <s>{fmtConv(convertedOld)} {convertedSym}</s>}
            </div>
          </div>
        )}
      </Section>

      <Section icon={<Package size={16} />} title={pf.stockTitle} sub={`${fmt(totalStock)} ${t.pieces} · ${variants.length} ${t.products.variants}`}>
        <div className="pf-bulk-box">
          <div className="pf-bulk-quick">
            <span>{pf.bulkQuick}</span>
            {[5, 10, 20].map((q) => <button type="button" key={q} onClick={() => applyBulk(q)}>{q}</button>)}
          </div>
          <div className="pf-bulk">
            <span>{pf.bulkCustom}</span>
            <Stepper value={bulk} onChange={setBulk} />
            <button type="button" onClick={() => applyBulk(bulk)}>{t.apply}</button>
          </div>
        </div>

        {colorList.map((c) => {
          const hex = selColors.length ? hexOfColor(c) : undefined
          return (
            <div key={c} className="pf-vgroup">
              <div className="pf-vgroup-h">{hex && <span className="dot" style={{ background: hex }} />}{selColors.length ? colorLabel(c) : c}</div>
              {sizeItems.map((sz) => {
                const k = `${c}|${sz.id}`
                const val = stockOf(k)
                return (
                  <div key={k} className="pf-vrow">
                    <span className="sz">
                      <i className={'pf-sdot' + (val > 0 ? ' ok' : '')} />
                      <b>{sz.label}</b>
                      {sz.sub && <small>{sz.sub}</small>}
                    </span>
                    <Stepper value={val} onChange={(n) => { setStock((curS) => ({ ...curS, [k]: n })); setTried(false) }} />
                  </div>
                )
              })}
            </div>
          )
        })}
        {tried && errs.stock && <div className="pf-err"><CircleAlert size={12} />{errs.stock}</div>}
        <div className="pf-hint" style={{ marginTop: 8 }}>{pf.skuHint}</div>
      </Section>

      <Section icon={<Truck size={16} />} title={pf.logisticsTitle}>
        <div className="pf-row2">
          <Field label={pf.stockUnit}>
            <button
              type="button"
              className="pf-input pf-select"
              onClick={() => nav.sheet(
                <Sheet title={pf.stockUnit}>
                  {pf.stockUnits.map((st, idx) => (
                    <button key={st} className={'opt' + (idx === stockUnitIdx ? ' on' : '')} onClick={() => { setStockUnitIdx(idx); nav.sheet(null) }}>
                      {st}{idx === stockUnitIdx && <Check size={16} color="var(--p)" />}
                    </button>
                  ))}
                </Sheet>,
              )}
            >
              {activeStockUnit}<ChevronDown size={16} />
            </button>
          </Field>
          <Field label={pf.weight}>
            <div className="pf-input"><input inputMode="decimal" placeholder={profile.defaultBox.weightHint} value={weight} onChange={(e) => setWeight(e.target.value.replace(/[^\d.,]/g, ''))} /></div>
          </Field>
        </div>

        <div className="pf-box-card">
          <div className="pf-box-h">
            <div className="pf-box-t">
              <Box size={15} color="#ae33ff" />
              <div>
                <b>{pf.boxTitle}</b>
                <small>{pf.boxSub}</small>
              </div>
            </div>
            <div className="pf-unit-seg">
              <button type="button" className={boxUnit === 'cm' ? 'on' : ''} onClick={() => setBoxUnit('cm')}>{pf.unitCm}</button>
              <button type="button" className={boxUnit === 'mm' ? 'on' : ''} onClick={() => setBoxUnit('mm')}>{pf.unitMm}</button>
            </div>
          </div>
          <div className="pf-box-grid">
            <div>
              <label>{pf.boxLen}</label>
              <div className="pf-box-inp">
                <input inputMode="numeric" placeholder={profile.defaultBox.l} value={boxL} onChange={(e) => setBoxL(e.target.value.replace(/[^\d.,]/g, ''))} />
                <span>{boxUnit === 'cm' ? pf.unitCm : pf.unitMm}</span>
              </div>
            </div>
            <div>
              <label>{pf.boxWid}</label>
              <div className="pf-box-inp">
                <input inputMode="numeric" placeholder={profile.defaultBox.w} value={boxW} onChange={(e) => setBoxW(e.target.value.replace(/[^\d.,]/g, ''))} />
                <span>{boxUnit === 'cm' ? pf.unitCm : pf.unitMm}</span>
              </div>
            </div>
            <div>
              <label>{pf.boxHei}</label>
              <div className="pf-box-inp">
                <input inputMode="numeric" placeholder={profile.defaultBox.h} value={boxH} onChange={(e) => setBoxH(e.target.value.replace(/[^\d.,]/g, ''))} />
                <span>{boxUnit === 'cm' ? pf.unitCm : pf.unitMm}</span>
              </div>
            </div>
          </div>
          {(boxL || boxW || boxH) && (
            <div className="pf-box-pill">
              <Package size={12} />
              <span>{boxL || '0'} × {boxW || '0'} × {boxH || '0'} {boxUnit === 'cm' ? pf.unitCm : pf.unitMm}</span>
            </div>
          )}
        </div>

        <div className="pf-row2" style={{ marginTop: 12 }}>
          <Field label={pf.minOrder}><Stepper value={minQ} onChange={(n) => setMinQ(Math.max(1, n))} /></Field>
          <Field label={pf.maxOrder}><Stepper value={maxQ} onChange={(n) => setMaxQ(Math.max(minQ, n))} /></Field>
        </div>

        <div className="pf-minmax-info">
          <div className="pf-mmi-h"><HelpCircle size={14} /><b>{pf.minMaxHelpTitle}</b></div>
          <p>• {pf.minHelpText}</p>
          <p>• {pf.maxHelpText}</p>
        </div>
      </Section>
    </>
  )

  /* ---------- 6. РЕАЛИСТИЧНАЯ ВИТРИННАЯ КАРТОЧКА ТОВАРА (ПРЕВЬЮ ПОКУПАТЕЛЯ) ---------- */
  const StepPrev = (
    <>
      <div className="cat-sec-h"><Eye size={13} /><span>{pf.previewTitle}</span></div>

      <div className="pf-mkt-card">
        <div className="pf-mkt-media">
          {photos[0] ? (
            <img src={photos[0]} alt="Preview" />
          ) : (
            <div className="pf-mkt-empty"><ImagePlus size={34} /><span>3:4</span></div>
          )}
          <div className="pf-mkt-top-badges">
            {discN > 0 && <span className="pf-mkt-disc">−{discN}%</span>}
            {isJewelry && gramsN > 0 && (
              <span className="pf-mkt-gold"><Gem size={11} />{jewelGrams} {ru ? 'г' : 'gr'}</span>
            )}
          </div>
          <div className="pf-mkt-ic-col" aria-hidden>
            <span><Heart size={15} /></span>
            <span><Share2 size={15} /></span>
          </div>
          {photos.length > 1 && (
            <div className="pf-mkt-dots" aria-hidden>
              {photos.slice(0, 5).map((_, idx) => <i key={idx} className={idx === 0 ? 'on' : ''} />)}
            </div>
          )}
        </div>

        <div className="pf-mkt-body">
          <div className="pf-mkt-price-row">
            <div>
              <b className="pf-mkt-price">{priceN ? `${fmt(Math.round(final * 100) / 100)} ${sym}` : pf.noPrice}</b>
              {discN > 0 && priceN > 0 && <s className="pf-mkt-old">{fmt(priceN)} {sym}</s>}
              {priceN > 0 && <span className="pf-mkt-conv">≈ {fmtConv(convertedVal)} {convertedSym}</span>}
            </div>
            <span className="pf-mkt-rate"><Star size={12} fill="#f5a623" color="#f5a623" />5.0</span>
          </div>

          <div className="pf-mkt-title">
            {brand && brand !== pf.brandless && <b>{brand} · </b>}
            {name || pf.noName}
          </div>
          {cat && <div className="pf-mkt-cat">{catPathLabel(cat)}</div>}

          {/* Спец-чипы для ювелирных изделий */}
          {isJewelry && (
            <div className="pf-mkt-specs">
              <span>{activeMetal}</span>
              {gramsN > 0 && <span>{jewelGrams} {ru ? 'г' : 'gr'}</span>}
              {jewelStoneIdx > 0 && <span>{activeStone}{jewelCarat ? ` ${jewelCarat} ct` : ''}</span>}
              {jewelHallmark && <span className="ok"><ShieldCheck size={10} />{ru ? 'Клеймо' : 'Damgalı'}</span>}
              {jewelGiftBox && <span className="ok"><Gift size={10} />{ru ? 'Коробка' : 'Kutulu'}</span>}
            </div>
          )}

          {selColors.length > 0 && (
            <div className="pf-mkt-colors">
              {selColors.map((c) => (
                <span key={c}><i style={{ background: hexOfColor(c) }} />{colorLabel(c)}</span>
              ))}
            </div>
          )}

          {sizeItems.length > 0 && table.id !== 'one' && (
            <div className="pf-mkt-sizes">
              {sizeItems.slice(0, 6).map((sz) => <span key={sz.id}>{sz.label}</span>)}
              {sizeItems.length > 6 && <span>+{sizeItems.length - 6}</span>}
            </div>
          )}

          <div className="pf-mkt-cta" aria-hidden>
            <ShoppingCart size={15} />
            <span>{ru ? 'В корзину · JJ Market' : 'Sepete ekle · JJ Market'}</span>
          </div>
        </div>
      </div>

      <div className="pf-summary-grid">
        <div><small>{pf.sumVariants}</small><b>{variants.length}</b></div>
        <div><small>{pf.sumStock}</small><b>{fmt(totalStock)} {t.pieces}</b></div>
        <div><small>{pf.sumSellerPrice}</small><b>{priceN ? `${fmt(Math.round(final))} ${sym}` : '—'}</b></div>
      </div>

      <div className="pf-quality">
        <div className="pf-quality-h">
          <div className="ring" style={{ background: `conic-gradient(${score >= 80 ? '#1fa45a' : score >= 50 ? '#e6a700' : '#e5484d'} ${score * 3.6}deg, #ececf0 0)` }}>
            <span>{score}</span>
          </div>
          <div>
            <b>{pf.qualityTitle} · {score >= 80 ? pf.qGreat : score >= 50 ? pf.qGood : pf.qLow}</b>
            <small>{score >= 80 ? pf.qGreatSub : pf.qLowSub}</small>
          </div>
        </div>
        {checks.map((c) => (
          <button type="button" key={c.l} className={'pf-check' + (c.ok ? ' ok' : '')} onClick={() => !c.ok && go(c.s)}>
            {c.ok ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
            <span>{c.l}</span>
            {!c.ok && <em className="pf-check-go">{pf.fillBtn}<ChevronRight size={13} /></em>}
          </button>
        ))}
      </div>

      {isEdit && (
        <>
          <div className="pf-toggle">
            <span><b>{pf.hideProduct}</b><small>{pf.hideProductSub}</small></span>
            <button type="button" className={'switch' + (hidden ? ' on' : '')} onClick={() => setHidden(!hidden)}><i /></button>
          </div>
          <button type="button" className="pf-del" onClick={() => { nav.toast(t.delete); nav.pop() }}>
            <Trash2 size={16} />{pf.deleteProduct}
          </button>
        </>
      )}
    </>
  )

  const bodies = [StepCat, StepPhoto, StepInfo, StepVar, StepPrice, StepPrev]
  const nextStepLabel = step < STEP_KEYS.length - 1 ? pf.steps[step + 1] : ''

  return (
    <div className="screen pf">
      <div className="pf-top">
        <button type="button" className="pf-x" onClick={nav.pop} aria-label={t.cancel}><X size={22} /></button>
        <div className="pf-title">
          <b>{isEdit ? pf.editProduct : pf.newProduct}</b>
          <small>{pf.stepOf} {step + 1}/{STEP_KEYS.length} · {pf.steps[step]}</small>
        </div>
        <button type="button" className="pf-score-pill" onClick={() => go(5)}>
          <i style={{ background: scoreColor }} />{score}%
        </button>
        <button type="button" className="pf-draft" onClick={() => nav.toast(pf.draftSaved)}><Save size={14} />{pf.draft}</button>
      </div>

      <div className="pf-steps">
        {STEP_KEYS.map((k, i) => {
          const Ic = STEP_ICONS[i]
          const done = i !== step && visited.includes(i) && !stepErr[i]
          const bad = i !== step && visited.includes(i) && !!stepErr[i]
          return (
            <button
              type="button"
              key={k}
              ref={(el) => { stepBtnsRef.current[i] = el }}
              className={(i === step ? 'on ' : '') + (done ? 'done ' : '') + (bad ? 'bad' : '')}
              onClick={() => go(i)}
            >
              <span>{done ? <Check size={13} strokeWidth={3} /> : bad ? <CircleAlert size={13} /> : <Ic size={13} />}</span>
              {pf.steps[i]}
            </button>
          )
        })}
      </div>
      <div className="pf-progress"><i style={{ width: `${((step + 1) / STEP_KEYS.length) * 100}%` }} /></div>

      <div className="pf-body" key={step} ref={bodyRef}>
        <div className="pf-head">
          <h2>{pf.heads[step]}</h2>
          <p>{pf.subs[step]}</p>
        </div>
        {bodies[step]}
      </div>

      <div className="pf-bar">
        {step > 0 && <button type="button" className="pf-back" onClick={() => go(step - 1)}><ChevronLeft size={18} />{t.back}</button>}
        {step < STEP_KEYS.length - 1 ? (
          <button type="button" className="pf-next" onClick={next}>
            <span>{pf.nextPrefix} · {nextStepLabel}</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <button type="button" className="pf-next" onClick={publish}>
            <Send size={16} />
            <span>{isEdit ? pf.saveChanges : pf.publish}</span>
          </button>
        )}
      </div>
    </div>
  )
}
