import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TarotCard } from '@/data/tarot-cards'

export type SpreadType = 'single' | 'three'
export type TarotPhase = 'select' | 'shuffle' | 'reveal' | 'reading'

export interface DrawnCard {
  card: TarotCard
  reversed: boolean
  revealed: boolean
}

export const useTarotStore = defineStore('tarot', () => {
  const spread = ref<SpreadType>('single')
  const question = ref('')
  const phase = ref<TarotPhase>('select')
  const cards = ref<DrawnCard[]>([])

  function setSpread(s: SpreadType) {
    spread.value = s
  }

  function setQuestion(q: string) {
    question.value = q
  }

  function setCards(c: DrawnCard[]) {
    cards.value = c
    phase.value = 'shuffle'
  }

  function revealCard(index: number) {
    if (cards.value[index]) {
      cards.value[index] = { ...cards.value[index], revealed: true }
    }
    if (cards.value.every(c => c.revealed)) {
      phase.value = 'reading'
    }
  }

  function revealAll() {
    cards.value = cards.value.map(c => ({ ...c, revealed: true }))
    phase.value = 'reading'
  }

  function reset() {
    spread.value = 'single'
    question.value = ''
    phase.value = 'select'
    cards.value = []
  }

  return { spread, question, phase, cards, setSpread, setQuestion, setCards, revealCard, revealAll, reset }
})
