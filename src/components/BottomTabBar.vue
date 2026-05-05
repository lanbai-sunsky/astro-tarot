<template>
  <nav class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.path"
      @click="$router.push(tab.path)"
      :class="['tab', { active: $route.path === tab.path }]"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const tabs = [
  { path: '/tarot', label: '塔罗', icon: '🎴' },
  { path: '/chart', label: '星盘', icon: '⭐' },
  { path: '/history', label: '历史', icon: '📖' },
  { path: '/settings', label: '设置', icon: '⚙️' },
]
</script>

<style scoped>
.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 3.5rem;
  background: rgba(15, 10, 26, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(107, 70, 193, 0.15);
  flex-shrink: 0;
}
.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  padding: 0.25rem 1rem;
  transition: color 0.2s;
}
.tab.active {
  color: var(--color-purple-glow);
}
.tab-icon {
  font-size: 1.25rem;
}
.tab-label {
  font-size: 0.7rem;
}
</style>
