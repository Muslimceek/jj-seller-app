/**
 * Pure TypeScript ISO/IEC 18004 QR Code encoder (Version 4-L, 33×33 modules, up to 78 UTF-8 bytes).
 * Produces genuinely scannable QR codes with zero external dependencies.
 */

const SIZE = 33
const DATA_CW = 80
const ECC_CW = 20

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

const gfMul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]])

function rsGenerator(deg: number): Uint8Array {
  let poly: Uint8Array = new Uint8Array([1])
  for (let i = 0; i < deg; i++) {
    const next = new Uint8Array(poly.length + 1)
    const root = GF_EXP[i]
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= gfMul(poly[j], root)
    }
    poly = next
  }
  return poly
}

function rsRemainder(data: Uint8Array, eccLen: number): Uint8Array {
  const gen = rsGenerator(eccLen)
  const res = new Uint8Array(eccLen)
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ res[0]
    res.copyWithin(0, 1)
    res[eccLen - 1] = 0
    for (let j = 0; j < eccLen; j++) {
      res[j] ^= gfMul(gen[j + 1], factor)
    }
  }
  return res
}

function formatBits(mask: number): number {
  // ECC Level L = 01
  const data = (0b01 << 3) | (mask & 0b111)
  let rem = data << 10
  for (let i = 4; i >= 0; i--) {
    if (rem & (1 << (i + 10))) rem ^= 0x537 << i
  }
  return ((data << 10) | rem) ^ 0x5412
}

export function encodeQrMatrix(text: string): boolean[][] {
  const raw = new TextEncoder().encode(text).slice(0, 78)
  const bits: number[] = []
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1)
  }

  // Byte mode (0100) + length (8 bits) + payload
  pushBits(0b0100, 4)
  pushBits(raw.length, 8)
  for (const b of raw) pushBits(b, 8)

  // Terminator + byte alignment
  const maxBits = DATA_CW * 8
  pushBits(0, Math.min(4, maxBits - bits.length))
  while (bits.length % 8 !== 0) bits.push(0)

  const data = new Uint8Array(DATA_CW)
  for (let i = 0; i < bits.length / 8; i++) {
    let byte = 0
    for (let b = 0; b < 8; b++) byte = (byte << 1) | bits[i * 8 + b]
    data[i] = byte
  }
  let padToggle = true
  for (let i = bits.length / 8; i < DATA_CW; i++) {
    data[i] = padToggle ? 0xec : 0x11
    padToggle = !padToggle
  }

  const ecc = rsRemainder(data, ECC_CW)
  const allBytes = new Uint8Array(DATA_CW + ECC_CW)
  allBytes.set(data, 0)
  allBytes.set(ecc, DATA_CW)

  const grid: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false))
  const isFunc: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false))

  const setFunc = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
      grid[r][c] = val
      isFunc[r][c] = true
    }
  }

  // Finder patterns + separators
  const drawFinder = (r0: number, c0: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const inBox = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6
        const dark =
          inBox &&
          (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4))
        setFunc(r0 + dr, c0 + dc, dark)
      }
    }
  }
  drawFinder(0, 0)
  drawFinder(0, SIZE - 7)
  drawFinder(SIZE - 7, 0)

  // Alignment pattern at (26, 26) for Version 4
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1
      setFunc(26 + dr, 26 + dc, dark)
    }
  }

  // Timing patterns
  for (let i = 8; i < SIZE - 8; i++) {
    setFunc(6, i, i % 2 === 0)
    setFunc(i, 6, i % 2 === 0)
  }

  // Reserve format info + dark module
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      setFunc(8, i, false)
      setFunc(i, 8, false)
    }
  }
  for (let i = SIZE - 8; i < SIZE; i++) {
    setFunc(8, i, false)
    setFunc(i, 8, false)
  }
  setFunc(SIZE - 8, 8, true)

  // Place data + ECC bits (zig-zag) with Mask 0: (r + c) % 2 === 0
  const mask = 0
  let bitIdx = 0
  const totalBits = allBytes.length * 8
  let upward = true
  for (let col = SIZE - 1; col >= 1; col -= 2) {
    if (col === 6) col--
    for (let step = 0; step < SIZE; step++) {
      const row = upward ? SIZE - 1 - step : step
      for (let dx = 0; dx < 2; dx++) {
        const c = col - dx
        if (isFunc[row][c]) continue
        let bit = false
        if (bitIdx < totalBits) {
          bit = ((allBytes[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) === 1
          bitIdx++
        }
        if ((row + c) % 2 === 0) bit = !bit
        grid[row][c] = bit
      }
    }
    upward = !upward
  }

  // Write 15-bit format info
  const fmt = formatBits(mask)
  const bitAt = (i: number) => ((fmt >>> i) & 1) === 1
  const coords1: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ]
  const coords2: [number, number][] = [
    [SIZE - 1, 8], [SIZE - 2, 8], [SIZE - 3, 8], [SIZE - 4, 8], [SIZE - 5, 8], [SIZE - 6, 8], [SIZE - 7, 8],
    [8, SIZE - 8], [8, SIZE - 7], [8, SIZE - 6], [8, SIZE - 5], [8, SIZE - 4], [8, SIZE - 3], [8, SIZE - 2], [8, SIZE - 1],
  ]
  for (let i = 0; i < 15; i++) {
    grid[coords1[i][0]][coords1[i][1]] = bitAt(14 - i)
    grid[coords2[i][0]][coords2[i][1]] = bitAt(14 - i)
  }

  return grid
}

export function qrToSvgDataUrl(text: string): string {
  const m = encodeQrMatrix(text)
  const q = 3 // quiet zone
  const dim = m.length + q * 2
  let rects = ''
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m.length; c++) {
      if (m[r][c]) rects += `<rect x="${c + q}" y="${r + q}" width="1" height="1"/>`
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges"><rect width="${dim}" height="${dim}" fill="#fff"/><g fill="#16141a">${rects}</g></svg>`
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
