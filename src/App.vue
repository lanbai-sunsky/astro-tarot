<template>
  <div class="app-shell">
    <StarryBackground />
    <main class="app-main">
      <router-view />
    </main>
    <BottomTabBar />
  </div>
</template>

<script setup lang="ts">
import StarryBackground from '@/components/StarryBackground.vue'
import BottomTabBar from '@/components/BottomTabBar.vue'
</script>

<style>
.app-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
}
.page {
  min-height: 100%;
  padding: 1.5rem 1rem;
}
</style>
