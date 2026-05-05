import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BirthInfo {
  date: string
  time: string
  place: string
  timezone: string
  lat: number
  lng: number
}

export const useUserStore = defineStore('user', () => {
  const birthInfo = ref<BirthInfo | null>(null)
  const deepseekApiKey = ref('')
  const theme = ref<'dark' | 'purple'>('dark')

  function updateBirthInfo(info: BirthInfo) {
    birthInfo.value = info
  }

  function setApiKey(key: string) {
    deepseekApiKey.value = key
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'purple' : 'dark'
  }

  return { birthInfo, deepseekApiKey, theme, updateBirthInfo, setApiKey, toggleTheme }
}, {
  persist: true,
})
