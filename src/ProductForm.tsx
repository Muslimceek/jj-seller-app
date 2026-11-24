import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  X, Check, ChevronRight, ChevronLeft, ChevronDown, Search, Folder, LayoutGrid, Camera, Images, Type, Palette, Wallet,
  Eye, Plus, Minus, Star, Trash2, ArrowLeft, Video, Sparkles, Info, Ruler, Tag, Save, CircleAlert, CircleCheck,
  ImagePlus, Package, Truck, Percent, Wand2, Layers, Shirt, Briefcase, Baby, Footprints, ShoppingBag, Pill, Home,
  Gem, Utensils, Car, Droplets, Clock, Globe, Award, ShieldCheck, Leaf, Heart, Zap, Send,
} from 'lucide-react'
import { useNav, Sheet } from './ui'
import { categories, brands, tags as TAGS, colors as COLORS, stockTypes, fmt, img, type Cat, type Product } from './data'
import { SIZE_TABLES, SYS_LABEL, tableForCategory, systemsOf, equivalents, RATE_KZT, type SizeSys } from './sizes'

type Cur = 'TRY' | 'KZT'
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
  'Takılar': { ic: Gem, color: '#7c3aed', bg: '#f1ecff' },
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
}

const QUICK_SEARCH = ['Gömlek', 'Loafer', 'Kot', 'Çanta', 'Vitamin', 'Parfüm']
const QUICK_DISCOUNTS = [0, 10, 20, 30, 50]
const DEMO_PHOTOS = [img('rubashka'), img('gallery'), img('lofer')]

const parsePrice = (s?: string): { v: string; cur: Cur } => {
  if (!s) return { v: '', cur: 'TRY' }
  const n = s.replace(/[^\d.,]/g, '').replace(/\s/g, '').replace(',', '.')
  return { v: n, cur: s.includes('₸') ? 'KZT' : 'TRY' }
}
const num = (s: string) => Number(String(s).replace(',', '.')) || 0

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
      <button onClick={() => onChange(Math.max(0, value - 1))} aria-label="-"><Minus size={14} /></button>
      <input inputMode="numeric" value={value} onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)} />
      <button onClick={() => onChange(value + 1)} aria-label="+"><Plus size={14} /></button>
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

/* ================================================================== */
export function ProductForm({ edit }: { edit?: Product }) {
  const nav = useNav()
  const { t } = nav
  const pf = t.pf
  const isEdit = !!edit
  const p0 = parsePrice(edit?.price)

  const [step, setStep] = useState(isEdit ? 2 : 0)
  const [visited, setVisited] = useState<number[]>(isEdit ? [0, 1, 2, 3, 4, 5] : [0])
  const stepBtnsRef = useRef<(HTMLButtonElement | null)[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)

  const ATTRS: { k: string; l: string; opts: string[]; multi?: boolean; filter?: boolean }[] = [
    { k: 'mat', l: 'Malzeme / Материал', opts: ['Pamuk', 'Polyester', 'Viskon', 'Keten', 'Yün', 'Deri', 'Süet', 'Denim', 'Elastan'], multi: true, filter: true },
    { k: 'season', l: 'Sezon / Сезон', opts: ['İlkbahar/Yaz', 'Sonbahar/Kış', 'Dört mevsim'], filter: true },
    { k: 'fit', l: 'Kalıp / Посадка', opts: ['Dar', 'Normal', 'Oversize'], filter: true },
    { k: 'pattern', l: 'Desen / Узор', opts: ['Düz', 'Ekose', 'Çizgili', 'Çiçekli', 'Baskılı'] },
    { k: 'sleeve', l: 'Kol boyu / Рукав', opts: ['Kolsuz', 'Kısa kol', 'Uzun kol'] },
    { k: 'origin', l: 'Menşei / Страна', opts: [...pf.originOpts] },
  ]

  // 1. kategori
  const [cat, setCat] = useState(isEdit ? 'Kadın > Bluz ve Gömlek' : '')
  const [stack, setStack] = useState<Cat[]>([])
  const [cq, setCq] = useState('')
  // 2. foto
  const [photos, setPhotos] = useState<string[]>(isEdit ? [edit!.gallery ?? edit!.image, edit!.image] : [])
  const [videos, setVideos] = useState<string[]>([])
  const vidRef = useRef<HTMLInputElement>(null)
  // 3. bilgiler
  const [name, setName] = useState(edit?.title ?? '')
  const [brand, setBrand] = useState(isEdit ? 'Iskra' : '')
  const [desc, setDesc] = useState('')
  const [attrs, setAttrs] = useState<Record<string, string[]>>({ origin: [pf.originOpts[0]] })
  const [tagOn, setTagOn] = useState<string[]>(isEdit ? ['Türkiye üretimi'] : [])
  // 4. varyantlar
  const table = useMemo(() => tableForCategory(cat), [cat])
  const [sys, setSys] = useState<SizeSys>(table.base)
  const [selColors, setSelColors] = useState<string[]>(isEdit ? ['Kahverengi', 'Kırmızı', 'Haki', 'Lacivert'] : [])
  const [selRows, setSelRows] = useState<number[]>(isEdit ? [2, 3, 4, 5] : [])
  const [showTable, setShowTable] = useState(false)
  // 5. fiyat
  const [price, setPrice] = useState(p0.v)
  const [cur, setCur] = useState<Cur>(p0.cur)
  const [disc, setDisc] = useState('')
  const [stock, setStock] = useState<Record<string, number>>({})
  const [bulk, setBulk] = useState(isEdit ? 5 : 10)
  const [stockType, setStockType] = useState('Adet')
  const [weight, setWeight] = useState('')
  const [minQ, setMinQ] = useState(1)
  const [maxQ, setMaxQ] = useState(5)
  const [hidden, setHidden] = useState(false)
  const [tried, setTried] = useState(false)

  useEffect(() => {
    stepBtnsRef.current[step]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [step])

  const sysList = systemsOf(table)
  const activeSys = sysList.includes(sys) ? sys : table.base
  const colorList = selColors.length ? selColors : [pf.oneColor]
  const rows = table.id === 'one' ? [0] : selRows
  const variants = colorList.flatMap((c) => rows.map((r) => ({ c, r, key: `${c}|${r}` })))
  const stockOf = (k: string) => stock[k] ?? (isEdit ? 5 : 0)
  const totalStock = variants.reduce((a, v) => a + stockOf(v.key), 0)
  const priceN = num(price)
  const discN = Math.min(90, num(disc))
  const final = priceN * (1 - discN / 100)
  const kzt = Math.round(final * RATE_KZT[cur])
  const sym = cur === 'TRY' ? '₺' : '₸'
  const tableName = (id: string) => pf.sizeTableNames[id] ?? id

  const errs = {
    cat: !cat ? pf.errCat : '',
    photo: photos.length === 0 ? pf.errPhoto : '',
    name: name.trim().length < 3 ? pf.errName : '',
    size: table.id !== 'one' && selRows.length === 0 ? pf.errSize : '',
    price: priceN <= 0 ? pf.errPrice : '',
    stock: totalStock <= 0 ? pf.errStock : '',
  }
  const stepErr = [errs.cat, errs.photo, errs.name, errs.size, errs.price || errs.stock, '']
  const checks = [
    { ok: !!cat, l: pf.selectedCat, s: 0 },
    { ok: photos.length >= 3, l: `${pf.photoTitle} (3+)`, s: 1 },
    { ok: name.trim().length >= 15, l: `${pf.prodName} (15+)`, s: 2 },
    { ok: !!brand, l: pf.brand, s: 2 },
    { ok: desc.trim().length >= 100, l: `${pf.desc} (100+)`, s: 2 },
    { ok: Object.values(attrs).filter((v) => v.length).length >= 3, l: `${pf.attrsTitle} (3+)`, s: 2 },
    { ok: selColors.length > 0, l: pf.colorsTitle, s: 3 },
    { ok: table.id === 'one' || selRows.length > 0, l: pf.sizesTitle, s: 3 },
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

  /* ---------- 1. KATEGORİ ---------- */
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
  const recent = ['Kadın > Bluz ve Gömlek', 'Kadın ayakkabısı > Loafer', 'Kadın > Kadın Dış Giyim', 'Çantalar ve Aksesuarlar > Kadın Çanta']
  const pickCat = (path: string) => {
    setCat(path)
    setCq('')
    setSys(tableForCategory(path).base)
    setSelRows([])
    setTried(false)
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const searchHits = useMemo(() => {
    const q = cq.trim().toLowerCase()
    if (!q) return []
    return allLeaves.filter((x) => x.path.toLowerCase().includes(q)).slice(0, 14)
  }, [allLeaves, cq])

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
        {cq && <button className="cat-search-x" onClick={() => setCq('')} aria-label={t.clear}><X size={13} /></button>}
      </div>

      {cat && !cq && (
        <div className="cat-picked">
          <div className="cat-picked-ic" style={{ background: pickedVis.bg, color: pickedVis.color }}>
            <PickedIc size={19} />
            <span className="cat-picked-ok"><Check size={10} strokeWidth={3} /></span>
          </div>
          <div className="cat-picked-info">
            <small>{pickedRoot !== pickedLeaf ? pickedRoot : pf.selectedCat}</small>
            <b>{pickedLeaf}</b>
            <span className="cat-size-badge"><Ruler size={11} />{pf.sizeAuto}: {tableName(table.id)}</span>
          </div>
          <button className="cat-picked-btn" onClick={() => { setCat(''); setStack([]) }}>{t.change}</button>
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
                <button key={item.path} className={'cat-subrow' + (on ? ' on' : '')} onClick={() => pickCat(item.path)}>
                  <span className="cat-mini-ic" style={{ background: v.bg, color: v.color }}><Ic size={15} /></span>
                  <span className="cat-subrow-t">
                    <b>{item.leaf}</b>
                    {item.root !== item.leaf && <small>{item.root}</small>}
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
                {QUICK_SEARCH.map((w) => <button key={w} onClick={() => setCq(w)}>{w}</button>)}
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
                <button key={r} className={'cat-rec-card' + (on ? ' on' : '')} onClick={() => pickCat(r)}>
                  <span className="cat-rec-ic" style={{ background: v.bg, color: v.color }}><Ic size={15} /></span>
                  <span className="cat-rec-txt"><b>{leaf}</b><small>{root}</small></span>
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
                  key={c.name}
                  className={'cat-card' + (isSelected ? ' on' : '')}
                  onClick={() => { if (leaf) pickCat(c.name); else setStack([c]) }}
                >
                  <div className="cat-card-top">
                    <span className="cat-card-ic" style={{ background: v.bg, color: v.color }}><Ic size={19} /></span>
                    {isSelected ? (
                      <span className="cat-card-chk"><Check size={11} strokeWidth={3} /></span>
                    ) : subCount > 0 ? (
                      <span className="cat-card-cnt">{subCount}</span>
                    ) : (
                      <span className="cat-card-cnt leaf">1</span>
                    )}
                  </div>
                  <div className="cat-card-name">{c.name}</div>
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
            <button className="cat-back-pill" onClick={() => setStack(stack.slice(0, -1))}>
              <ArrowLeft size={14} />{pf.allCats}
            </button>
            <div className="cat-parent-main">
              <span className="cat-card-ic" style={{ background: parentVis?.bg, color: parentVis?.color }}><ParentIc size={19} /></span>
              <div><b>{activeParent?.name}</b><small>{level.length} {pf.subCount} · {pf.subPickHint}</small></div>
            </div>
          </div>

          <div className="cat-results">
            {level.map((c) => {
              const path = [...stack.map((s) => s.name), c.name].join(' > ')
              const leaf = !c.children || c.children.length === 0
              const on = cat === path
              const sz = tableName(tableForCategory(path).id)
              return (
                <button key={c.name} className={'cat-subrow' + (on ? ' on' : '')} onClick={() => { if (leaf) pickCat(path); else setStack([...stack, c]) }}>
                  <span className={'cat-check-dot' + (on ? ' on' : '')}>{on && <Check size={11} strokeWidth={3} />}</span>
                  <span className="cat-subrow-t"><b>{c.name}</b></span>
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

  /* ---------- 2. FOTOĞRAFLAR ---------- */
  const addDemoPhotos = () => {
    setPhotos((p) => {
      const nextList = [...p]
      for (const u of DEMO_PHOTOS) if (!nextList.includes(u)) nextList.push(u)
      return nextList.slice(0, 20)
    })
    setTried(false)
    nav.toast(pf.demoAdded)
  }

  const openPhotoSheet = () =>
    nav.sheet(
      <PhotoSourceSheet
        onFiles={(f) => { setPhotos((p) => [...p, ...Array.from(f).map((x) => URL.createObjectURL(x))].slice(0, 20)); setTried(false) }}
        onDemo={addDemoPhotos}
      />,
    )

  const StepPhoto = (
    <>
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
          <p>{pf.dropSub}</p>
          <div className="pf-drop-acts">
            <label className="pf-drop-btn primary">
              <Images size={16} />{pf.fromGallery}
              <input hidden type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files?.length) { setPhotos(Array.from(e.target.files).map((x) => URL.createObjectURL(x)).slice(0, 20)); setTried(false) } }} />
            </label>
            <label className="pf-drop-btn">
              <Camera size={16} />{pf.camera}
              <input hidden type="file" accept="image/*" capture="environment" onChange={(e) => { if (e.target.files?.length) { setPhotos(Array.from(e.target.files).map((x) => URL.createObjectURL(x)).slice(0, 20)); setTried(false) } }} />
            </label>
          </div>
          <button className="pf-demo-link" onClick={addDemoPhotos}><Wand2 size={13} />{pf.demoPhotos}</button>
        </div>
      ) : (
        <div className="pf-photos">
          {photos.map((ph, i) => (
            <div key={ph + i} className={'pf-ph' + (i === 0 ? ' cover' : '')}>
              <button className="pf-ph-tap" onClick={() => nav.sheet(
                <Sheet title={`Foto ${i + 1}`}>
                  {i > 0 && <button className="opt" onClick={() => { setPhotos([ph, ...photos.filter((_, j) => j !== i)]); nav.sheet(null) }}><span style={{ display: 'flex', gap: 10 }}><Star size={16} />{pf.makeCover}</span></button>}
                  {i > 0 && <button className="opt" onClick={() => { const a = [...photos];[a[i - 1], a[i]] = [a[i], a[i - 1]]; setPhotos(a); nav.sheet(null) }}><span style={{ display: 'flex', gap: 10 }}><ChevronLeft size={16} />{pf.moveLeft}</span></button>}
                  {i < photos.length - 1 && <button className="opt" onClick={() => { const a = [...photos];[a[i + 1], a[i]] = [a[i], a[i + 1]]; setPhotos(a); nav.sheet(null) }}><span style={{ display: 'flex', gap: 10 }}><ChevronRight size={16} />{pf.moveRight}</span></button>}
                  <button className="opt" style={{ color: 'var(--red)' }} onClick={() => { setPhotos(photos.filter((_, j) => j !== i)); nav.sheet(null) }}><span style={{ display: 'flex', gap: 10 }}><Trash2 size={16} />{t.delete}</span></button>
                </Sheet>,
              )}>
                <img src={ph} alt={`Foto ${i + 1}`} />
                {i === 0 ? <span className="pf-cover"><Star size={10} fill="#fff" />{pf.cover}</span> : <span className="pf-num">{i + 1}</span>}
              </button>
              <button className="pf-ph-del" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} aria-label={t.delete}><X size={11} strokeWidth={2.8} /></button>
            </div>
          ))}
          {photos.length < 20 && (
            <button className="pf-ph add" onClick={openPhotoSheet}><ImagePlus size={22} /><span>+</span><small>{photos.length}/20</small></button>
          )}
        </div>
      )}

      <div className="pf-tip">
        <div className="pf-tip-h"><Info size={14} />{pf.photoGuide}</div>
        <ul>
          {[
            [photos.length >= 3, '3+ foto · 3:4 · ≥ 900×1200 px'],
            [true, 'JPG / PNG / WEBP · ≤ 25 MB'],
          ].map(([ok, tx]) => <li key={tx as string} className={ok ? 'ok' : ''}><CircleCheck size={13} />{tx as string}</li>)}
        </ul>
      </div>

      <Section icon={<Video size={16} />} title={pf.videoTitle} sub={pf.videoSub}>
        {videos.map((v, i) => <div key={i} className="pf-file"><Video size={14} color="#ae33ff" /><span>{v}</span><button onClick={() => setVideos(videos.filter((_, j) => j !== i))}><X size={14} /></button></div>)}
        {videos.length < 3 && <button className="pf-add-line" onClick={() => vidRef.current?.click()}><Plus size={16} />{pf.addVideo}</button>}
        <input ref={vidRef} hidden type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && setVideos([...videos, e.target.files[0].name])} />
      </Section>
      {tried && errs.photo && <div className="pf-err"><CircleAlert size={12} />{errs.photo}</div>}
    </>
  )

  /* ---------- 3. BİLGİLER ---------- */
  const fillSmartTitle = () => {
    const parts = [
      pickedRoot && pickedRoot !== pickedLeaf ? pickedRoot.split(' ')[0] : '',
      attrs.pattern?.[0],
      attrs.fit?.[0],
      pickedLeaf || 'Ürün',
      attrs.mat?.[0] ? `(${attrs.mat[0]})` : '',
    ].filter(Boolean)
    setName(parts.join(' ').trim() || 'Kadın pamuklu gömlek')
    nav.toast(pf.titleApplied)
  }

  const fillAiDesc = () => {
    const a = (k: string) => attrs[k]?.join(', ')
    const lines = [
      `${name || pickedLeaf || 'Ürün'}${brand && brand !== pf.brandless ? ` — ${brand}` : ''}.`,
      a('mat') ? `• ${a('mat')}` : '• Pamuk / kaliteli kumaş',
      a('fit') ? `• ${a('fit')}` : '• Normal kalıp',
      a('season') ? `• ${a('season')}` : '',
      a('origin') ? `• ${a('origin')}` : '',
      '• 30°C yıkama önerilir.',
    ].filter(Boolean)
    setDesc(lines.join('\n'))
    nav.toast(pf.aiDescToast)
  }

  const filledAttrCount = Object.values(attrs).filter((v) => v.length > 0).length
  const quickBrands = [pf.brandless, 'Iskra', 'Diva', 'Kiğılı', 'Polo Garage']

  const StepInfo = (
    <>
      <div className="pf-info-banner">
        <Globe size={15} />
        <span>{pf.autoTranslate}</span>
      </div>

      <Field
        label={pf.prodName}
        req
        icon={<Type size={13} color="#ae33ff" />}
        err={tried ? errs.name : ''}
        right={<span className={'pf-count' + (name.trim().length >= 15 ? ' ok' : '')}>{name.trim().length >= 15 ? '✓ ' : ''}{name.length}/100</span>}
      >
        <div className="pf-input">
          <input maxLength={100} placeholder={pf.prodNamePh} value={name} onChange={(e) => setName(e.target.value)} />
          {name && <button className="cat-search-x" onClick={() => setName('')}><X size={12} /></button>}
        </div>
        <button className="pf-ai" onClick={fillSmartTitle}><Wand2 size={13} />{pf.suggestTitle}</button>
      </Field>

      <Field label={pf.brand} icon={<Award size={13} color="#ae33ff" />}>
        <button className="pf-input pf-select" onClick={() => nav.sheet(<BrandSheet value={brand} onPick={setBrand} />)}>
          <span className={brand ? '' : 'ph'}>{brand || pf.brandPh}</span>
          {brand ? <X size={16} onClick={(e) => { e.stopPropagation(); setBrand('') }} /> : <ChevronDown size={16} />}
        </button>
        <div className="pf-qrow">
          {quickBrands.map((b) => <button key={b} className={brand === b ? 'on' : ''} onClick={() => setBrand(b)}>{b}</button>)}
        </div>
      </Field>

      <Field
        label={pf.desc}
        icon={<Sparkles size={13} color="#ae33ff" />}
        right={<span className={'pf-count' + (desc.trim().length >= 100 ? ' ok' : '')}>{desc.trim().length >= 100 ? '✓ ' : ''}{desc.length}/5000</span>}
      >
        <div className="pf-input area">
          <textarea maxLength={5000} rows={5} placeholder={pf.descPh} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <button className="pf-ai" onClick={fillAiDesc}><Sparkles size={14} />{pf.aiDesc}</button>
      </Field>

      <Section icon={<Layers size={16} />} title={pf.attrsTitle} sub={`${filledAttrCount}/${ATTRS.length} ${pf.attrsFilled}`}>
        {ATTRS.map((a) => {
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
                      key={o}
                      className={on ? 'on' : ''}
                      onClick={() => setAttrs((cur) => {
                        const has = cur[a.k]?.includes(o)
                        return { ...cur, [a.k]: a.multi ? (has ? cur[a.k].filter((x) => x !== o) : [...(cur[a.k] ?? []), o]) : has ? [] : [o] }
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
          {TAGS.map((tg) => {
            const on = tagOn.includes(tg.name)
            const Tic = TAG_ICONS[tg.name] ?? Tag
            return (
              <button
                key={tg.name}
                className={on ? 'on' : ''}
                style={on ? { background: tg.bg, borderColor: tg.color, color: tg.color } : undefined}
                onClick={() => toggle(tagOn, setTagOn, tg.name)}
              >
                <Tic size={12} />{tg.name}
              </button>
            )
          })}
        </div>
      </Section>
    </>
  )

  /* ---------- 4. VARYANTLAR ---------- */
  const pickPopularSizes = () => {
    if (table.id === 'shoes') setSelRows([1, 2, 3, 4, 5])
    else if (table.id === 'women') setSelRows([2, 3, 4, 5])
    else if (table.id === 'men') setSelRows([1, 2, 3, 4])
    else if (table.id === 'jeans') setSelRows([2, 3, 4, 5])
    else setSelRows(table.rows.slice(0, 4).map((_, i) => i))
    setTried(false)
  }

  const StepVar = (
    <>
      <Section
        icon={<Palette size={16} />}
        title={pf.colorsTitle}
        sub={selColors.length ? `${selColors.length} ${pf.colorsSelected}` : pf.colorsSub}
        right={selColors.length ? <button className="pf-link" onClick={() => setSelColors([])}>{t.clear}</button> : null}
      >
        <div className="pf-colors">
          {COLORS.map(([n, hex]) => {
            const on = selColors.includes(n)
            return (
              <button key={n} className={on ? 'on' : ''} onClick={() => toggle(selColors, setSelColors, n)}>
                <span className="sw" style={{ background: hex }}>
                  {on && <Check size={12} color={['Beyaz', 'Açık gri', 'Pudra', 'Melanj', 'Haki'].includes(n) ? '#1b1b1f' : '#fff'} strokeWidth={3} />}
                </span>
                <span>{n}</span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section
        icon={<Ruler size={16} />}
        title={pf.sizesTitle}
        sub={`${tableName(table.id)} · ${pf.sizesAutoSub}`}
        right={table.id !== 'one' ? (
          <button className="pf-link" onClick={() => setSelRows(selRows.length === table.rows.length ? [] : table.rows.map((_, i) => i))}>
            {selRows.length === table.rows.length ? t.clear : t.all}
          </button>
        ) : null}
      >
        {table.id === 'one' ? (
          <div className="pf-note"><Info size={14} />{pf.oneSizeNote}</div>
        ) : (
          <>
            <div className="pf-seg" role="tablist">
              {sysList.map((s) => <button key={s} className={activeSys === s ? 'on' : ''} onClick={() => setSys(s)}>{SYS_LABEL[s]}</button>)}
            </div>
            <div className="pf-sz-bar">
              <span className="pf-sz-tip"><Wand2 size={12} />{pf.sizesAutoTip}</span>
              <button className="pf-sz-preset" onClick={pickPopularSizes}><Zap size={11} />{pf.popularSizes}</button>
            </div>
            <div className="pf-sizes">
              {table.rows.map((_, r) => {
                const on = selRows.includes(r)
                return (
                  <button
                    key={r}
                    className={on ? 'on' : ''}
                    onClick={() => {
                      setSelRows((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r].sort((a, b) => a - b)))
                      setTried(false)
                    }}
                  >
                    <b>{sizeLabel(r)}</b>
                    <small>{equivalents(table, r, activeSys)}</small>
                    {on && <span className="tick"><Check size={10} strokeWidth={3} /></span>}
                  </button>
                )
              })}
            </div>
            <button className="pf-add-line" onClick={() => setShowTable(!showTable)}>
              <Ruler size={15} />{showTable ? pf.hideTable : pf.showTable}
              <ChevronDown size={15} style={{ marginLeft: 'auto', transform: showTable ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
            </button>
            {showTable && (
              <div className="pf-table">
                <table>
                  <thead><tr>{sysList.map((s) => <th key={s} className={s === activeSys ? 'on' : ''}>{SYS_LABEL[s]}</th>)}</tr></thead>
                  <tbody>{table.rows.map((row, r) => <tr key={r} className={selRows.includes(r) ? 'on' : ''}>{sysList.map((s) => <td key={s}>{row[s] ?? '—'}</td>)}</tr>)}</tbody>
                </table>
              </div>
            )}
            <div className="pf-other">
              {pf.otherTables} {SIZE_TABLES.filter((tb) => tb.id !== table.id).map((tb) => <span key={tb.id}>{tableName(tb.id)}</span>)}
            </div>
            {tried && errs.size && <div className="pf-err"><CircleAlert size={12} />{errs.size}</div>}
          </>
        )}
      </Section>

      <div className="pf-sum">
        <span className="pf-sum-ic"><Package size={16} /></span>
        <div className="pf-sum-t">
          <b>{variants.length} {pf.variantsReady}</b>
          <small>{selColors.length ? `${selColors.length} ${pf.colorWord}` : pf.oneColor} × {rows.length} {pf.sizeWord}</small>
        </div>
        {selColors.length > 0 && (
          <div className="pf-sum-dots">
            {selColors.slice(0, 5).map((c) => <i key={c} style={{ background: COLORS.find(([n]) => n === c)?.[1] }} />)}
          </div>
        )}
      </div>
    </>
  )

  /* ---------- 5. FİYAT & STOK ---------- */
  const applyBulk = (val: number) => {
    setBulk(val)
    setStock(Object.fromEntries(variants.map((v) => [v.key, val])))
    setTried(false)
    nav.toast(`${val} ${t.pieces} · ${t.apply}`)
  }

  const StepPrice = (
    <>
      <Section icon={<Wallet size={16} />} title={pf.priceTitle} sub={pf.priceSub}>
        <div className="pf-price-row">
          <div className="pf-input big">
            <input inputMode="decimal" placeholder="0" value={price} onChange={(e) => { setPrice(e.target.value.replace(/[^\d.,]/g, '')); setTried(false) }} />
            <span>{sym}</span>
          </div>
          <div className="pf-seg small">
            {(['TRY', 'KZT'] as Cur[]).map((c) => (
              <button key={c} className={cur === c ? 'on' : ''} onClick={() => setCur(c)}>{c === 'TRY' ? '₺ TRY' : '₸ KZT'}</button>
            ))}
          </div>
        </div>
        {tried && errs.price && <div className="pf-err"><CircleAlert size={12} />{errs.price}</div>}

        <div className="pf-disc-presets">
          <span className="pf-disc-lbl"><Percent size={12} />{pf.quickDiscount}</span>
          {QUICK_DISCOUNTS.map((d) => (
            <button key={d} className={discN === d ? 'on' : ''} onClick={() => setDisc(d ? String(d) : '')}>
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
              <small>{cur === 'TRY' ? `${pf.rateLbl}: 1 ₺ = 8,89 ₸` : '₸ KZT'}</small>
            </div>
            <div className="pf-buyer-r">
              <b>≈ {fmt(kzt)} ₸</b>
              {discN > 0 && <s>{fmt(Math.round(priceN * RATE_KZT[cur]))} ₸</s>}
            </div>
          </div>
        )}
      </Section>

      <Section icon={<Package size={16} />} title={pf.stockTitle} sub={`${fmt(totalStock)} ${t.pieces} · ${variants.length} ${t.products.variants}`}>
        <div className="pf-bulk-box">
          <div className="pf-bulk-quick">
            <span>{pf.bulkQuick}</span>
            {[5, 10, 20].map((q) => <button key={q} onClick={() => applyBulk(q)}>{q}</button>)}
          </div>
          <div className="pf-bulk">
            <span>{pf.bulkCustom}</span>
            <Stepper value={bulk} onChange={setBulk} />
            <button onClick={() => applyBulk(bulk)}>{t.apply}</button>
          </div>
        </div>

        {colorList.map((c) => {
          const hex = COLORS.find(([n]) => n === c)?.[1]
          return (
            <div key={c} className="pf-vgroup">
              <div className="pf-vgroup-h">{hex && <span className="dot" style={{ background: hex }} />}{c}</div>
              {rows.map((r) => {
                const k = `${c}|${r}`
                const val = stockOf(k)
                return (
                  <div key={k} className="pf-vrow">
                    <span className="sz">
                      <i className={'pf-sdot' + (val > 0 ? ' ok' : '')} />
                      <b>{sizeLabel(r)}</b>
                      {table.id !== 'one' && <small>{activeSys !== 'ru' && table.rows[r].ru ? `RU ${table.rows[r].ru}` : table.rows[r].tr ? `EU ${table.rows[r].tr}` : ''}</small>}
                    </span>
                    <Stepper value={val} onChange={(n) => { setStock((cur) => ({ ...cur, [k]: n })); setTried(false) }} />
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
            <button className="pf-input pf-select" onClick={() => nav.sheet(<Sheet title={pf.stockUnit}>{stockTypes.map((st) => <button key={st} className="opt" onClick={() => { setStockType(st); nav.sheet(null) }}>{st}{st === stockType && <Check size={16} color="var(--p)" />}</button>)}</Sheet>)}>
              {stockType}<ChevronDown size={16} />
            </button>
          </Field>
          <Field label={pf.weight}>
            <div className="pf-input"><input inputMode="decimal" placeholder="0,5" value={weight} onChange={(e) => setWeight(e.target.value.replace(/[^\d.,]/g, ''))} /></div>
          </Field>
        </div>
        <div className="pf-row2">
          <Field label={pf.minOrder}><Stepper value={minQ} onChange={(n) => setMinQ(Math.max(1, n))} /></Field>
          <Field label={pf.maxOrder}><Stepper value={maxQ} onChange={(n) => setMaxQ(Math.max(minQ, n))} /></Field>
        </div>
      </Section>
    </>
  )

  /* ---------- 6. ÖNİZLEME ---------- */
  const StepPrev = (
    <>
      <div className="cat-sec-h"><Eye size={13} /><span>{pf.previewTitle}</span></div>
      <div className="pf-pv">
        <div className="pf-pv-img">
          {photos[0] ? <img src={photos[0]} alt="Preview" /> : <ImagePlus size={30} />}
          {discN > 0 && <span className="pf-pv-disc">−{discN}%</span>}
          {photos.length > 1 && <span className="pf-pv-cnt"><Images size={10} />{photos.length}</span>}
        </div>
        <div className="pf-pv-b">
          <div className="pf-pv-price">
            <b>{priceN ? `${fmt(kzt)} ₸` : pf.noPrice}</b>
            {discN > 0 && priceN > 0 && <s>{fmt(Math.round(priceN * RATE_KZT[cur]))} ₸</s>}
          </div>
          <div className="pf-pv-name">{brand && brand !== pf.brandless && <b>{brand} / </b>}{name || pf.noName}</div>
          {cat && <div className="pf-pv-cat">{cat.replace(' > ', ' › ')}</div>}
          {selColors.length > 0 && (
            <div className="pf-pv-colors">
              {selColors.map((c) => <i key={c} style={{ background: COLORS.find(([n]) => n === c)?.[1] }} />)}
            </div>
          )}
          {table.id !== 'one' && selRows.length > 0 && (
            <div className="pf-pv-sizes">
              {selRows.slice(0, 6).map((r) => <span key={r}>{table.rows[r].ru ?? sizeLabel(r)}</span>)}
              {selRows.length > 6 && <span>+{selRows.length - 6}</span>}
              <small>RU</small>
            </div>
          )}
          {tagOn.length > 0 && <div className="pf-pv-tags">{tagOn.map((tg) => <span key={tg}>{tg}</span>)}</div>}
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
          <button key={c.l} className={'pf-check' + (c.ok ? ' ok' : '')} onClick={() => !c.ok && go(c.s)}>
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
            <button className={'switch' + (hidden ? ' on' : '')} onClick={() => setHidden(!hidden)}><i /></button>
          </div>
          <button className="pf-del" onClick={() => { nav.toast(t.delete); nav.pop() }}>
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
        <button className="pf-x" onClick={nav.pop} aria-label={t.cancel}><X size={22} /></button>
        <div className="pf-title">
          <b>{isEdit ? pf.editProduct : pf.newProduct}</b>
          <small>{pf.stepOf} {step + 1}/{STEP_KEYS.length} · {pf.steps[step]}</small>
        </div>
        <button className="pf-score-pill" onClick={() => go(5)}>
          <i style={{ background: scoreColor }} />{score}%
        </button>
        <button className="pf-draft" onClick={() => nav.toast(pf.draftSaved)}><Save size={14} />{pf.draft}</button>
      </div>

      <div className="pf-steps">
        {STEP_KEYS.map((k, i) => {
          const Ic = STEP_ICONS[i]
          const done = i !== step && visited.includes(i) && !stepErr[i]
          const bad = i !== step && visited.includes(i) && !!stepErr[i]
          return (
            <button
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
        {step > 0 && <button className="pf-back" onClick={() => go(step - 1)}><ChevronLeft size={18} />{t.back}</button>}
        {step < STEP_KEYS.length - 1 ? (
          <button className="pf-next" onClick={next}>
            <span>{pf.nextPrefix} · {nextStepLabel}</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <button className="pf-next" onClick={publish}>
            <Send size={16} />
            <span>{isEdit ? pf.saveChanges : pf.publish}</span>
          </button>
        )}
      </div>
    </div>
  )
}
