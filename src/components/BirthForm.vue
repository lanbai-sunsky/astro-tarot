<template>
  <div class="birth-form">
    <!-- Step indicator -->
    <div class="steps">
      <div v-for="(s, i) in steps" :key="i" :class="['step', { active: i === currentStep, done: i < currentStep }]">
        {{ s }}
      </div>
    </div>

    <!-- Step 1: Date -->
    <div v-if="currentStep === 0" class="step-content">
      <label class="field-label">出生日期</label>
      <input type="date" v-model="form.date" class="field-input" />
      <BaseButton variant="primary" @click="nextStep" :disabled="!form.date" style="width:100%;margin-top:1rem;">
        下一步
      </BaseButton>
    </div>

    <!-- Step 2: Time -->
    <div v-if="currentStep === 1" class="step-content">
      <label class="field-label">出生时间</label>
      <input type="time" v-model="form.time" class="field-input" />
      <p class="field-hint">如果不确定精确时间，请尽量接近。默认为中午 12:00。</p>
      <div style="display:flex;gap:0.5rem;margin-top:1rem;">
        <BaseButton variant="secondary" @click="currentStep--" style="flex:1;">上一步</BaseButton>
        <BaseButton variant="primary" @click="nextStep" style="flex:1;">下一步</BaseButton>
      </div>
    </div>

    <!-- Step 3: Place -->
    <div v-if="currentStep === 2" class="step-content">
      <label class="field-label">出生地点</label>
      <input type="text" v-model="form.place" placeholder="例如：北京" class="field-input" />
      <label class="field-label" style="margin-top:0.75rem;">时区</label>
      <select v-model="form.timezone" class="field-input">
        <option v-for="tz in timezones" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
      </select>
      <p class="field-hint">系统已自动检测你的时区，可以手动修改。</p>
      <div style="display:flex;gap:0.5rem;margin-top:1rem;">
        <BaseButton variant="secondary" @click="currentStep--" style="flex:1;">上一步</BaseButton>
        <BaseButton variant="primary" @click="submit" :disabled="!form.place" style="flex:1;">
          生成星盘
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { BirthInfo } from '@/stores/user'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{ initial?: BirthInfo | null }>()
const emit = defineEmits<{ submit: [BirthInfo] }>()

const steps = ['出生日期', '出生时间', '出生地点']
const currentStep = ref(0)

const timezones = [
  { value: 'UTC+8', label: 'UTC+8 — 北京时间 (CST)' },
  { value: 'UTC+7', label: 'UTC+7 — 东南亚' },
  { value: 'UTC+9', label: 'UTC+9 — 日本/韩国' },
  { value: 'UTC+0', label: 'UTC+0 — 伦敦' },
  { value: 'UTC-5', label: 'UTC-5 — 纽约 (EST)' },
  { value: 'UTC-8', label: 'UTC-8 — 洛杉矶 (PST)' },
  { value: 'UTC+5:30', label: 'UTC+5:30 — 印度' },
  { value: 'UTC+3', label: 'UTC+3 — 莫斯科' },
  { value: 'UTC+10', label: 'UTC+10 — 悉尼' },
  { value: 'UTC-3', label: 'UTC-3 — 巴西' },
]

const form = reactive({
  date: '',
  time: '12:00',
  place: '',
  timezone: 'UTC+8',
})

// City coordinate mapping (simplified)
const cityCoords: Record<string, { lat: number; lng: number; timezone: string }> = {
  '北京': { lat: 39.9, lng: 116.4, timezone: 'UTC+8' },
  '上海': { lat: 31.2, lng: 121.5, timezone: 'UTC+8' },
  '广州': { lat: 23.1, lng: 113.3, timezone: 'UTC+8' },
  '深圳': { lat: 22.5, lng: 114.1, timezone: 'UTC+8' },
  '成都': { lat: 30.6, lng: 104.1, timezone: 'UTC+8' },
  '重庆': { lat: 29.5, lng: 106.5, timezone: 'UTC+8' },
  '杭州': { lat: 30.3, lng: 120.2, timezone: 'UTC+8' },
  '南京': { lat: 32.1, lng: 118.8, timezone: 'UTC+8' },
  '武汉': { lat: 30.6, lng: 114.3, timezone: 'UTC+8' },
  '西安': { lat: 34.3, lng: 108.9, timezone: 'UTC+8' },
  '香港': { lat: 22.3, lng: 114.2, timezone: 'UTC+8' },
  '台北': { lat: 25.0, lng: 121.5, timezone: 'UTC+8' },
  '东京': { lat: 35.7, lng: 139.7, timezone: 'UTC+9' },
  '首尔': { lat: 37.6, lng: 127.0, timezone: 'UTC+9' },
  '纽约': { lat: 40.7, lng: -74.0, timezone: 'UTC-5' },
  '洛杉矶': { lat: 34.1, lng: -118.2, timezone: 'UTC-8' },
  '伦敦': { lat: 51.5, lng: -0.1, timezone: 'UTC+0' },
  '巴黎': { lat: 48.9, lng: 2.3, timezone: 'UTC+1' },
  '悉尼': { lat: -33.9, lng: 151.2, timezone: 'UTC+10' },
  '新加坡': { lat: 1.3, lng: 103.8, timezone: 'UTC+8' },
}

onMounted(() => {
  if (props.initial) {
    form.date = props.initial.date
    form.time = props.initial.time
    form.place = props.initial.place
    form.timezone = props.initial.timezone
  }
  // Auto-detect timezone
  const offset = -(new Date().getTimezoneOffset() / 60)
  const sign = offset >= 0 ? '+' : '-'
  form.timezone = `UTC${sign}${Math.abs(offset)}`
})

function nextStep() {
  if (currentStep.value < 2) currentStep.value++
}

function getCoords(): { lat: number; lng: number; timezone: string } {
  const match = cityCoords[form.place]
  if (match) return match
  // Default to Beijing
  if (/[一-鿿]/.test(form.place)) return { lat: 35, lng: 110, timezone: 'UTC+8' }
  return { lat: 40, lng: -74, timezone: 'UTC-5' }
}

function submit() {
  const coords = getCoords()
  const finalTz = form.timezone || coords.timezone
  emit('submit', {
    date: form.date,
    time: form.time || '12:00',
    place: form.place,
    timezone: finalTz,
    lat: coords.lat,
    lng: coords.lng,
  })
}
</script>

<style scoped>
.steps {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.step {
  font-size: 0.75rem;
  color: var(--color-muted);
  padding-bottom: 0.375rem;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}
.step.active {
  color: var(--color-purple-glow);
  border-bottom-color: var(--color-purple-glow);
}
.step.done { color: var(--color-emerald); }
.field-label {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-muted);
  margin-bottom: 0.375rem;
}
.field-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(107, 70, 193, 0.2);
  background: rgba(15, 10, 26, 0.6);
  color: var(--color-starlight);
  font-size: 1rem;
  outline: none;
  color-scheme: dark;
}
.field-input:focus { border-color: var(--color-purple-glow); }
.field-hint {
  font-size: 0.75rem;
  color: var(--color-muted);
  opacity: 0.6;
  margin-top: 0.375rem;
}
</style>
