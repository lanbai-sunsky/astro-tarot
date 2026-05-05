<template>
  <div class="page history-page">
    <h1 class="title">占卜历史</h1>

    <!-- Tabs -->
    <div class="tabs">
      <button :class="['tab', { active: tab === 'tarot' }]" @click="tab = 'tarot'">
        🎴 塔罗 ({{ historyStore.tarotRecords.length }})
      </button>
      <button :class="['tab', { active: tab === 'chart' }]" @click="tab = 'chart'">
        ⭐ 星盘 ({{ historyStore.chartRecords.length }})
      </button>
    </div>

    <!-- Tarot records -->
    <div v-if="tab === 'tarot'">
      <div v-if="historyStore.tarotRecords.length === 0" class="empty-state">
        <div class="empty-icon">🃏</div>
        <p>还没有占卜记录</p>
        <BaseButton variant="secondary" @click="$router.push('/tarot')">去抽一张牌</BaseButton>
      </div>

      <div v-else class="record-list">
        <BaseCard
          v-for="record in historyStore.tarotRecords"
          :key="record.id"
          :clickable="true"
          @click="selectedTarot = record"
        >
          <div class="record-header">
            <span class="record-spread">{{ record.spread === 'single' ? '单张牌' : '三张牌' }}</span>
            <span class="record-time">{{ formatTime(record.timestamp) }}</span>
          </div>
          <div v-if="record.question" class="record-question">问：{{ record.question }}</div>
          <div class="record-cards">
            <span v-for="(c, i) in record.cards" :key="i" class="record-card-tag">
              {{ getCardName(c.cardId) }}
            </span>
          </div>
          <div class="record-preview">{{ getPreview(record.interpretation) }}</div>
        </BaseCard>
      </div>
    </div>

    <!-- Chart records -->
    <div v-if="tab === 'chart'">
      <div v-if="historyStore.chartRecords.length === 0" class="empty-state">
        <div class="empty-icon">⭐</div>
        <p>还没有星盘记录</p>
        <BaseButton variant="secondary" @click="$router.push('/chart')">去生成星盘</BaseButton>
      </div>

      <div v-else class="record-list">
        <BaseCard
          v-for="record in historyStore.chartRecords"
          :key="record.id"
          :clickable="true"
          @click="selectedChart = record"
        >
          <div class="record-header">
            <span class="record-spread">本命星盘</span>
            <span class="record-time">{{ formatTime(record.timestamp) }}</span>
          </div>
          <div class="record-meta">
            {{ record.date }} {{ record.time }}
          </div>
          <div class="record-cards">
            <span class="record-card-tag asc-tag">
              上升 {{ signNames[record.ascendant] || record.ascendant }}
            </span>
            <span class="record-card-tag">{{ record.place }}</span>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Tarot detail modal -->
    <BaseModal v-model="showTarotDetail">
      <div v-if="selectedTarot" class="detail-content">
        <div class="detail-header">
          <span>{{ selectedTarot.spread === 'single' ? '单张牌占卜' : '三张牌占卜' }}</span>
          <span class="detail-time">{{ formatTime(selectedTarot.timestamp) }}</span>
        </div>
        <div v-if="selectedTarot.question" class="detail-question">
          <strong>问题：</strong>{{ selectedTarot.question }}
        </div>
        <div class="detail-cards">
          <span v-for="(c, i) in selectedTarot.cards" :key="i" class="detail-card-chip" :class="{ reversed: c.reversed }">
            {{ getCardName(c.cardId) }} {{ c.reversed ? '逆' : '正' }}
          </span>
        </div>
        <div class="detail-text">{{ selectedTarot.interpretation }}</div>
        <BaseButton variant="ghost" @click="deleteTarotRecord" style="color: #ef4444; margin-top: 1rem;">
          删除此记录
        </BaseButton>
      </div>
    </BaseModal>

    <!-- Chart detail modal -->
    <BaseModal v-model="showChartDetail">
      <div v-if="selectedChart" class="detail-content">
        <div class="detail-header">
          <span>本命星盘</span>
          <span class="detail-time">{{ formatTime(selectedChart.timestamp) }}</span>
        </div>
        <div class="chart-detail-grid">
          <div class="cd-item"><span class="cd-label">日期</span><span>{{ selectedChart.date }}</span></div>
          <div class="cd-item"><span class="cd-label">时间</span><span>{{ selectedChart.time }}</span></div>
          <div class="cd-item"><span class="cd-label">地点</span><span>{{ selectedChart.place }}</span></div>
          <div class="cd-item"><span class="cd-label">时区</span><span>{{ selectedChart.timezone }}</span></div>
          <div class="cd-item"><span class="cd-label">上升</span><span class="asc-highlight">{{ signNames[selectedChart.ascendant] || selectedChart.ascendant }}</span></div>
        </div>
        <BaseButton variant="ghost" @click="deleteChartRecord" style="color: #ef4444; margin-top: 1rem;">
          删除此记录
        </BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHistoryStore, type TarotRecord, type ChartRecord } from '@/stores/history'
import { tarotCards } from '@/data/tarot-cards'
import { signNames } from '@/data/astro-meanings'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'

const historyStore = useHistoryStore()
const tab = ref<'tarot' | 'chart'>('tarot')
const selectedTarot = ref<TarotRecord | null>(null)
const selectedChart = ref<ChartRecord | null>(null)

const showTarotDetail = computed({
  get: () => !!selectedTarot.value,
  set: (v) => { if (!v) selectedTarot.value = null },
})
const showChartDetail = computed({
  get: () => !!selectedChart.value,
  set: (v) => { if (!v) selectedChart.value = null },
})

function getCardName(id: number): string {
  return tarotCards[id]?.name ?? '未知'
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function getPreview(text: string): string {
  return text.length > 80 ? text.slice(0, 80) + '...' : text
}

function deleteTarotRecord() {
  if (selectedTarot.value) {
    historyStore.removeTarot(selectedTarot.value.id)
    selectedTarot.value = null
  }
}

function deleteChartRecord() {
  if (selectedChart.value) {
    historyStore.removeChart(selectedChart.value.id)
    selectedChart.value = null
  }
}
</script>

<style scoped>
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.25rem;
  border-radius: 0.75rem;
  overflow: hidden;
}
.tab {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  background: rgba(26, 16, 48, 0.4);
  color: var(--color-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.tab:first-child { border-radius: 0.75rem 0 0 0.75rem; }
.tab:last-child { border-radius: 0 0.75rem 0.75rem 0; }
.tab.active {
  background: rgba(107, 70, 193, 0.2);
  color: var(--color-starlight);
}
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-muted);
}
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }

.record-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
}
.record-spread {
  font-weight: 600;
  color: var(--color-starlight);
  font-size: 0.9375rem;
}
.record-time {
  font-size: 0.75rem;
  color: var(--color-muted);
}
.record-question {
  font-size: 0.8125rem;
  color: var(--color-muted);
  margin-bottom: 0.25rem;
}
.record-meta {
  font-size: 0.8125rem;
  color: var(--color-muted);
  margin-bottom: 0.5rem;
}
.record-cards {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}
.record-card-tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(107, 70, 193, 0.15);
  color: var(--color-starlight);
}
.record-card-tag.asc-tag {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-gold);
}
.record-preview {
  font-size: 0.8125rem;
  color: var(--color-muted);
  line-height: 1.5;
}

.detail-content {
  max-height: 65vh;
  overflow-y: auto;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-weight: 600;
}
.detail-time { font-size: 0.75rem; color: var(--color-muted); font-weight: 400; }
.detail-question { font-size: 0.875rem; color: var(--color-muted); margin-bottom: 0.75rem; }
.detail-cards { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
.detail-card-chip {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  background: rgba(107, 70, 193, 0.2);
  color: var(--color-starlight);
}
.detail-card-chip.reversed {
  background: rgba(245, 158, 11, 0.2);
}
.detail-text {
  white-space: pre-line;
  line-height: 1.7;
  font-size: 0.9375rem;
}

.chart-detail-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.cd-item {
  display: flex;
  justify-content: space-between;
  padding: 0.375rem 0;
  border-bottom: 1px solid rgba(107, 70, 193, 0.08);
  font-size: 0.875rem;
}
.cd-label {
  color: var(--color-muted);
  font-size: 0.8125rem;
}
.asc-highlight {
  color: var(--color-gold);
  font-weight: 600;
}
</style>
