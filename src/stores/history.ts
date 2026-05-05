import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DrawnCard, SpreadType } from './tarot'

export interface TarotRecord {
  id: string
  spread: SpreadType
  question: string
  cards: Array<{ cardId: number; reversed: boolean }>
  interpretation: string
  timestamp: number
}

export interface ChartRecord {
  id: string
  date: string
  time: string
  place: string
  timezone: string
  ascendant: string
  timestamp: number
}

export const useHistoryStore = defineStore('history', () => {
  const tarotRecords = ref<TarotRecord[]>([])
  const chartRecords = ref<ChartRecord[]>([])

  function saveTarot(record: TarotRecord) {
    tarotRecords.value.unshift(record)
    if (tarotRecords.value.length > 50) {
      tarotRecords.value = tarotRecords.value.slice(0, 50)
    }
  }

  function removeTarot(id: string) {
    tarotRecords.value = tarotRecords.value.filter(r => r.id !== id)
  }

  function saveChart(record: ChartRecord) {
    chartRecords.value.unshift(record)
    if (chartRecords.value.length > 50) {
      chartRecords.value = chartRecords.value.slice(0, 50)
    }
  }

  function removeChart(id: string) {
    chartRecords.value = chartRecords.value.filter(r => r.id !== id)
  }

  function clearAll() {
    tarotRecords.value = []
    chartRecords.value = []
  }

  return { tarotRecords, chartRecords, saveTarot, removeTarot, saveChart, removeChart, clearAll }
}, {
  persist: true,
})
