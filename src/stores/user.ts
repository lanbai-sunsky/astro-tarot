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

  function updateBirthInfo(info: BirthInfo) {
    birthInfo.value = info
  }

  function setApiKey(key: string) {
    deepseekApiKey.value = key
  }

  return { birthInfo, deepseekApiKey, updateBirthInfo, setApiKey }
}, {
  persist: true,
})
