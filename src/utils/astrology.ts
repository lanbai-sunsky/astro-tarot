import type { BirthInfo } from '@/stores/user'
import { toChineseFormatted } from '@/data/astro-meanings'

export interface PlanetData {
  name: string
  signName: string
  degree: number
  house: number
  formatted: string
  formattedCn: string
  longitude: number
  isRetrograde: boolean
}

export interface HouseCusp {
  house: number
  signName: string
  formatted: string
  formattedCn: string
  longitude: number
}

export interface AspectData {
  body1: string
  body2: string
  type: string
  symbol: string
  orb: number
}

export interface ChartData {
  ascendant: { signName: string; formatted: string; formattedCn: string; degree: number }
  midheaven: { signName: string; formatted: string; formattedCn: string }
  planets: PlanetData[]
  houses: HouseCusp[]
  aspects: AspectData[]
  elements: { fire: string[]; earth: string[]; air: string[]; water: string[] }
  modalities: { cardinal: string[]; fixed: string[]; mutable: string[] }
  retrograde: string[]
  patterns: string[]
}

function toBirthInput(info: BirthInfo) {
  const [y, m, d] = info.date.split('-').map(Number)
  const [h, min] = info.time.split(':').map(Number)
  const tzOffset = getTimezoneOffset(info.timezone)
  return { year: y, month: m, day: d, hour: h || 0, minute: min || 0, second: 0, latitude: info.lat, longitude: info.lng, timezone: tzOffset }
}

export async function calculateChartData(info: BirthInfo): Promise<ChartData> {
  const { calculateChart } = await import('celestine')
  const birth = toBirthInput(info)
  const chart = calculateChart(birth)

  const planets: PlanetData[] = Object.values(chart.planets).map((p: any) => ({
    name: p.name,
    signName: p.signName,
    degree: p.degree,
    house: p.house,
    formatted: p.formatted,
    formattedCn: toChineseFormatted(p.formatted),
    longitude: p.longitude,
    isRetrograde: p.isRetrograde ?? false,
  }))

  const houses: HouseCusp[] = chart.houses.cusps.map((c: any) => ({
    house: c.house,
    signName: c.signName,
    formatted: c.formatted,
    formattedCn: toChineseFormatted(c.formatted),
    longitude: c.longitude,
  }))

  const aspects: AspectData[] = (chart.aspects.all || []).map((a: any) => ({
    body1: a.body1,
    body2: a.body2,
    type: a.type,
    symbol: a.symbol,
    orb: Math.round(a.orb * 100) / 100,
  }))

  const asc = chart.angles.ascendant
  const mc = chart.angles.midheaven

  return {
    ascendant: { signName: asc.signName, formatted: asc.formatted, formattedCn: toChineseFormatted(asc.formatted), degree: asc.degree },
    midheaven: { signName: mc.signName, formatted: mc.formatted, formattedCn: toChineseFormatted(mc.formatted) },
    planets,
    houses,
    aspects,
    elements: chart.summary.elements,
    modalities: chart.summary.modalities,
    retrograde: chart.summary.retrograde || [],
    patterns: chart.summary.patterns || [],
  }
}

export function getTimezoneOffset(timezone: string): number {
  const match = timezone.match(/UTC([+-]\d+)(?::(\d+))?/)
  if (match) return parseInt(match[1])
  // Fallback: use browser
  return -(new Date().getTimezoneOffset() / 60)
}

export function detectUserTimezone(): string {
  const offset = -(new Date().getTimezoneOffset() / 60)
  const sign = offset >= 0 ? '+' : '-'
  const abs = Math.abs(offset)
  return `UTC${sign}${abs}`
}
