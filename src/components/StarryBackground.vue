<template>
  <div class="starry-bg" aria-hidden="true">
    <div v-for="i in 3" :key="i" class="stars-layer" />
  </div>
</template>

<style scoped>
.starry-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: linear-gradient(180deg, #0F0A1A 0%, #1A1030 50%, #0F0A1A 100%);
}

.stars-layer {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1.5px 1.5px at 40% 15%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 55% 60%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.3), transparent),
    radial-gradient(1.5px 1.5px at 85% 55%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 15% 75%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1px 1px at 60% 85%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.3), transparent),
    radial-gradient(1.5px 1.5px at 35% 50%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 5% 55%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1px 1px at 45% 80%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 75% 10%, rgba(255,255,255,0.3), transparent),
    radial-gradient(1.5px 1.5px at 20% 90%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 95% 75%, rgba(255,255,255,0.3), transparent),
    radial-gradient(1px 1px at 50% 5%, rgba(255,255,255,0.7), transparent);
  background-size: 200px 200px;
  animation: twinkle 4s ease-in-out infinite;
}

.stars-layer:nth-child(2) {
  background-size: 300px 300px;
  animation-duration: 6s;
  animation-delay: -2s;
  opacity: 0.7;
}

.stars-layer:nth-child(3) {
  background-size: 250px 250px;
  animation-duration: 8s;
  animation-delay: -4s;
  opacity: 0.5;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
</style>
