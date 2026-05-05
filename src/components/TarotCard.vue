<template>
  <div
    :class="['tarot-card', { revealed, reversed }]"
    @click="$emit('reveal')"
  >
    <div class="card-inner">
      <div class="card-front">
        <div class="card-name">{{ card.name }}</div>
        <div class="card-direction">{{ reversed ? '逆位 ↓' : '正位 ↑' }}</div>
        <div class="card-keywords">
          <span v-for="kw in (reversed ? card.keywords.reversed : card.keywords.upright)" :key="kw" class="keyword-tag">
            {{ kw }}
          </span>
        </div>
      </div>
      <div class="card-back">
        <div class="card-back-pattern">✦</div>
        <div class="card-back-text">点击翻牌</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TarotCard } from '@/data/tarot-cards'

defineProps<{
  card: TarotCard
  reversed: boolean
  revealed: boolean
}>()

defineEmits(['reveal'])
</script>

<style scoped>
.tarot-card {
  width: 140px;
  height: 210px;
  perspective: 800px;
  cursor: pointer;
  flex-shrink: 0;
}
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.tarot-card.revealed .card-inner {
  transform: rotateY(180deg);
}
.tarot-card.reversed.revealed .card-inner {
  transform: rotateY(180deg) rotateZ(180deg);
}
.card-front, .card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
}
.card-front {
  background: linear-gradient(135deg, #1A1030, #2D1B4E);
  border: 1px solid rgba(107, 70, 193, 0.35);
  transform: rotateY(180deg);
  gap: 0.5rem;
}
.card-back {
  background: linear-gradient(135deg, #2D1B4E, #1A1030);
  border: 2px solid rgba(107, 70, 193, 0.25);
  gap: 0.75rem;
}
.card-back-pattern {
  font-size: 2rem;
  color: rgba(139, 92, 246, 0.4);
  animation: pulse 3s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.15); }
}
.card-back-text {
  font-size: 0.75rem;
  color: var(--color-muted);
}
.card-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gold);
}
.card-direction {
  font-size: 0.75rem;
  color: var(--color-muted);
}
.card-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}
.keyword-tag {
  font-size: 0.625rem;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(107, 70, 193, 0.2);
  color: var(--color-starlight);
}
.tarot-card:not(.revealed):hover .card-inner {
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.4));
}
</style>
