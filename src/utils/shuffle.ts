import { tarotCards, type TarotCard } from '@/data/tarot-cards'
import type { DrawnCard } from '@/stores/tarot'

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function dealCards(count: number): DrawnCard[] {
  const shuffled = fisherYatesShuffle(tarotCards)
  return shuffled.slice(0, count).map(card => ({
    card,
    reversed: Math.random() < 0.5,
    revealed: false,
  }))
}
