<template>
  <canvas ref="canvasRef" :width="size" :height="size" class="chart-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { ChartData } from '@/utils/astrology'

const props = defineProps<{ chart: ChartData }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const size = 340

const SIGN_COLORS: Record<string, string> = {
  Aries: '#E53E3E', Taurus: '#38A169', Gemini: '#ECC94B', Cancer: '#E2E8F0',
  Leo: '#ED8936', Virgo: '#9AE6B4', Libra: '#F687B3', Scorpio: '#9F7AEA',
  Sagittarius: '#4299E1', Capricorn: '#718096', Aquarius: '#63B3ED', Pisces: '#B794F4',
}
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cx = size / 2, cy = size / 2
  const outerR = size / 2 - 10
  const signRingInner = outerR - 28
  const houseRingInner = signRingInner - 16
  const planetArea = houseRingInner - 10

  ctx.clearRect(0, 0, size, size)

  // Background circle
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(15, 10, 26, 0.9)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(107, 70, 193, 0.3)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Draw zodiac ring
  for (let i = 0; i < 12; i++) {
    const startAngle = (-90 + i * 30) * Math.PI / 180
    const endAngle = (-90 + (i + 1) * 30) * Math.PI / 180
    const sign = SIGNS[i]
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, outerR, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = SIGN_COLORS[sign] + '15'
    ctx.fill()
    ctx.strokeStyle = 'rgba(107, 70, 193, 0.15)'
    ctx.stroke()

    // Sign symbol
    const midAngle = (-90 + (i + 0.5) * 30) * Math.PI / 180
    const symbolR = outerR - 16
    ctx.fillStyle = SIGN_COLORS[sign] + 'AA'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(SIGN_SYMBOLS[sign], cx + Math.cos(midAngle) * symbolR, cy + Math.sin(midAngle) * symbolR)
  }

  // Draw house cusps
  for (const h of props.chart.houses) {
    const angle = (-90 + (h.longitude % 360)) * Math.PI / 180
    const innerX = cx + Math.cos(angle) * (planetArea * 0.5)
    const innerY = cy + Math.sin(angle) * (planetArea * 0.5)
    const outerX = cx + Math.cos(angle) * houseRingInner
    const outerY = cy + Math.sin(angle) * houseRingInner
    ctx.beginPath()
    ctx.moveTo(innerX, innerY)
    ctx.lineTo(outerX, outerY)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 0.5
    ctx.stroke()

    // House number
    const labelR = (planetArea * 0.5 + houseRingInner) / 2
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'
    ctx.font = '8px sans-serif'
    ctx.fillText(String(h.house), cx + Math.cos(angle) * labelR, cy + Math.sin(angle) * labelR)
  }

  // Draw aspect lines (only major ones, limit to 12)
  const majorAspects = props.chart.aspects
    .filter(a => ['conjunction', 'opposition', 'trine', 'square', 'sextile'].includes(a.type))
    .slice(0, 14)
  for (const a of majorAspects) {
    const p1 = props.chart.planets.find(p => p.name === a.body1)
    const p2 = props.chart.planets.find(p => p.name === a.body2)
    if (!p1 || !p2) continue
    const a1 = (-90 + (p1.longitude % 360)) * Math.PI / 180
    const a2 = (-90 + (p2.longitude % 360)) * Math.PI / 180
    const r = planetArea * 0.85
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r)
    ctx.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r)
    const colors: Record<string, string> = { conjunction: '#F59E0B', opposition: '#EF4444', trine: '#50C878', square: '#EF4444', sextile: '#6366F1' }
    ctx.strokeStyle = colors[a.type] + '40' || 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  }

  // Draw planets (only major 10)
  const majorPlanets = props.chart.planets.filter(p => PLANET_SYMBOLS[p.name])
  const planetR = planetArea * 0.78
  for (const p of majorPlanets) {
    const angle = (-90 + (p.longitude % 360)) * Math.PI / 180
    const px = cx + Math.cos(angle) * planetR
    const py = cy + Math.sin(angle) * planetR

    // Planet dot
    ctx.beginPath()
    ctx.arc(px, py, 10, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(15, 10, 26, 0.95)'
    ctx.fill()
    ctx.strokeStyle = p.isRetrograde ? '#EF4444' : 'rgba(139, 92, 246, 0.6)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Planet symbol
    ctx.fillStyle = p.isRetrograde ? '#EF4444' : '#E2E8F0'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(PLANET_SYMBOLS[p.name] || '·', px, py)
  }

  // Center label
  ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
  ctx.font = '9px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('ASC ' + props.chart.ascendant.formatted, cx, cy - 4)
  ctx.fillText('MC ' + props.chart.midheaven.formatted, cx, cy + 10)
}

onMounted(draw)
watch(() => props.chart, draw, { deep: true })
</script>

<style scoped>
.chart-canvas {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
