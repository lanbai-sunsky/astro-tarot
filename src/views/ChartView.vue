<template>
  <div class="page chart-page">
    <h1 class="title">占星星盘</h1>

    <!-- No birth info → show form -->
    <div v-if="!userStore.birthInfo" class="form-section">
      <p class="subtext">输入你的出生信息，生成专属本命星盘</p>
      <BirthForm @submit="handleBirthSubmit" />
    </div>

    <!-- Has birth info → show chart -->
    <div v-else class="chart-section">
      <div class="birth-summary">
        <span>{{ userStore.birthInfo.date }} {{ userStore.birthInfo.time }}</span>
        <span class="birth-place">{{ userStore.birthInfo.place }}</span>
        <BaseButton variant="ghost" @click="showEditForm = true" style="font-size:0.75rem;padding:0.25rem 0.5rem;">
          修改
        </BaseButton>
      </div>

      <div v-if="calculating" class="loading">计算星盘中...</div>

      <div v-else-if="errorMsg" class="error-msg">
        <p>{{ errorMsg }}</p>
        <BaseButton variant="secondary" @click="errorMsg = ''; showEditForm = true" style="margin-top:0.5rem;">修改出生信息</BaseButton>
      </div>

      <div v-else-if="chartData" class="result-section">
        <!-- Chart wheel -->
        <ChartWheel :chart="chartData" />

        <!-- Reading panel -->
        <div class="reading-panel">
          <!-- Ascendant highlight -->
          <BaseCard class="asc-card">
            <div class="asc-label">上升星座</div>
            <div class="asc-sign">{{ chartData.ascendant.signName }}</div>
            <div class="asc-degree">{{ chartData.ascendant.formatted }}</div>
            <p class="asc-desc">{{ getSignText(chartData.ascendant.signName) }}</p>
          </BaseCard>

          <!-- Planets table -->
          <BaseCard>
            <h3 class="section-title">行星位置</h3>
            <div class="planet-row" v-for="p in mainPlanets" :key="p.name">
              <span class="planet-symbol">{{ planetSymbols[p.name] || '·' }}</span>
              <span class="planet-name">{{ planetNames[p.name] || p.name }}</span>
              <span class="planet-sign">{{ signNames[p.signName] || p.signName }}</span>
              <span class="planet-house">第{{ p.house }}宫</span>
              <span v-if="p.isRetrograde" class="retro-badge">逆</span>
            </div>
          </BaseCard>

          <!-- Aspects -->
          <BaseCard>
            <h3 class="section-title">主要相位</h3>
            <div class="aspect-row" v-for="a in majorAspects" :key="a.body1 + a.body2 + a.type">
              <span class="aspect-symbol">{{ a.symbol }}</span>
              <span>{{ planetNames[a.body1] || a.body1 }} {{ aspectTypeName[a.type] || a.type }} {{ planetNames[a.body2] || a.body2 }}</span>
            </div>
            <p v-if="majorAspects.length === 0" class="empty-hint">无主要相位</p>
          </BaseCard>

          <!-- Elements & Modes -->
          <BaseCard>
            <h3 class="section-title">元素与模式</h3>
            <div class="stats-grid">
              <div class="stat-item" v-for="el in elementKeys" :key="el">
                <div class="stat-label">{{ elementLabels[el] }}</div>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{ width: getElementCount(el) / 15 * 100 + '%', background: getElementColor(el) }" />
                </div>
                <div class="stat-count">{{ getElementCount(el) }}</div>
              </div>
            </div>
            <div class="mode-tags">
              <span class="mode-tag">基本 {{ chartData.modalities.cardinal?.length || 0 }}</span>
              <span class="mode-tag">固定 {{ chartData.modalities.fixed?.length || 0 }}</span>
              <span class="mode-tag">变动 {{ chartData.modalities.mutable?.length || 0 }}</span>
            </div>
          </BaseCard>
        </div>
      </div>

      <!-- Edit birth form modal -->
      <BaseModal v-model="showEditForm">
        <h3 style="margin-bottom:1rem;">修改出生信息</h3>
        <BirthForm :initial="userStore.birthInfo" @submit="handleBirthSubmit" />
      </BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore, type BirthInfo } from '@/stores/user'
import { useHistoryStore } from '@/stores/history'
import { calculateChartData, type ChartData } from '@/utils/astrology'
import { signNames, planetNames, getSignText, getPlanetInSignText } from '@/data/astro-meanings'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import ChartWheel from '@/components/ChartWheel.vue'
import BirthForm from '@/components/BirthForm.vue'

const userStore = useUserStore()
const historyStore = useHistoryStore()
const chartData = ref<ChartData | null>(null)
const calculating = ref(false)
const showEditForm = ref(false)
const errorMsg = ref('')

const planetSymbols: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
}
const aspectTypeName: Record<string, string> = {
  conjunction: '合', opposition: '冲', trine: '拱', square: '刑', sextile: '六合',
}
const elementLabels: Record<string, string> = {
  fire: '火', earth: '土', air: '风', water: '水',
}
const elementColors: Record<string, string> = {
  fire: '#E53E3E', earth: '#38A169', air: '#ECC94B', water: '#4299E1',
}

const elementKeys: ('fire' | 'earth' | 'air' | 'water')[] = ['fire', 'earth', 'air', 'water']
const getElementCount = (el: 'fire' | 'earth' | 'air' | 'water') => chartData.value?.elements[el]?.length ?? 0
const getElementColor = (el: string) => elementColors[el] || '#888'
const mainPlanets = computed(() => chartData.value?.planets.filter(p => planetSymbols[p.name]) ?? [])
const majorAspects = computed(() =>
  chartData.value?.aspects.filter(a => ['conjunction', 'opposition', 'trine', 'square', 'sextile'].includes(a.type)).slice(0, 12) ?? []
)

async function handleBirthSubmit(info: BirthInfo) {
  userStore.updateBirthInfo(info)
  showEditForm.value = false
  calculating.value = true
  errorMsg.value = ''
  try {
    chartData.value = await calculateChartData(info)
    historyStore.saveChart({
      id: Date.now().toString(36),
      date: info.date,
      time: info.time,
      place: info.place,
      timezone: info.timezone,
      ascendant: chartData.value.ascendant.signName,
      timestamp: Date.now(),
    })
  } catch (e: any) {
    errorMsg.value = e?.message || '星盘计算出错，请检查出生信息'
  } finally {
    calculating.value = false
  }
}

onMounted(async () => {
  if (userStore.birthInfo) {
    calculating.value = true
    try {
      chartData.value = await calculateChartData(userStore.birthInfo)
    } catch (e: any) {
      errorMsg.value = e?.message || '星盘计算出错，请检查出生信息'
    } finally {
      calculating.value = false
    }
  }
})
</script>

<style scoped>
.title { font-size: 1.5rem; text-align: center; margin-bottom: 0.25rem; }
.subtext { text-align: center; color: var(--color-muted); font-size: 0.875rem; margin-bottom: 1.25rem; }

.birth-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: var(--color-muted);
  margin-bottom: 1rem;
}
.loading { text-align: center; color: var(--color-purple-glow); padding: 3rem 0; }
.error-msg { text-align: center; color: #EF4444; padding: 2rem 1rem; font-size: 0.9375rem; }

.asc-card { text-align: center; margin-bottom: 0.75rem; }
.asc-label { font-size: 0.75rem; color: var(--color-muted); }
.asc-sign { font-size: 1.75rem; font-weight: 700; color: var(--color-gold); }
.asc-degree { font-size: 0.8125rem; color: var(--color-muted); margin-bottom: 0.5rem; }
.asc-desc { font-size: 0.8125rem; line-height: 1.6; }

.reading-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}
.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-starlight);
  margin-bottom: 0.625rem;
}

.planet-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0;
  border-bottom: 1px solid rgba(107, 70, 193, 0.08);
  font-size: 0.8125rem;
}
.planet-symbol { font-size: 1rem; width: 1.25rem; text-align: center; }
.planet-name { color: var(--color-starlight); width: 3.5rem; }
.planet-sign { color: var(--color-purple-glow); flex: 1; }
.planet-house { color: var(--color-muted); }
.retro-badge {
  font-size: 0.625rem;
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
  padding: 1px 5px;
  border-radius: 999px;
}

.aspect-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0;
  font-size: 0.8125rem;
  border-bottom: 1px solid rgba(107, 70, 193, 0.06);
}
.aspect-symbol { font-size: 1rem; width: 1.25rem; text-align: center; color: var(--color-gold); }

.stats-grid { display: flex; flex-direction: column; gap: 0.375rem; }
.stat-item { display: flex; align-items: center; gap: 0.5rem; }
.stat-label { font-size: 0.75rem; color: var(--color-muted); width: 1.5rem; }
.stat-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 999px; overflow: hidden; }
.stat-fill { height: 100%; border-radius: 999px; transition: width 0.5s; }
.stat-count { font-size: 0.75rem; color: var(--color-starlight); width: 1rem; text-align: right; }

.mode-tags { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.mode-tag {
  font-size: 0.6875rem;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(107, 70, 193, 0.15);
  color: var(--color-muted);
}

.empty-hint { font-size: 0.8125rem; color: var(--color-muted); }
</style>
