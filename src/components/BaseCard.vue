<template>
  <div :class="['glass-card', { clickable }]" @click="$emit('click')">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ clickable?: boolean }>()
defineEmits(['click'])
</script>

<style scoped>
.glass-card {
  background: rgba(26, 16, 48, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(107, 70, 193, 0.12);
  border-radius: 1rem;
  padding: 1.25rem;
  transition: all 0.3s;
}
.glass-card.clickable {
  cursor: pointer;
}
.glass-card.clickable:hover {
  border-color: rgba(107, 70, 193, 0.35);
  box-shadow: 0 0 20px rgba(107, 70, 193, 0.1);
  transform: translateY(-2px);
}
</style>
