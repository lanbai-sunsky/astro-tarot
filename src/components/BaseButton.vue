<template>
  <button :class="['btn', `btn-${variant}`]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
}>(), {
  variant: 'primary',
  disabled: false,
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  color: var(--color-starlight);
}
.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary {
  background: linear-gradient(135deg, var(--color-purple-primary), #7C3AED);
  box-shadow: 0 0 20px rgba(107, 70, 193, 0.3);
}
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 0 30px rgba(107, 70, 193, 0.5);
}
.btn-secondary {
  background: rgba(107, 70, 193, 0.15);
  border: 1px solid rgba(107, 70, 193, 0.3);
}
.btn-secondary:hover:not(:disabled) {
  background: rgba(107, 70, 193, 0.25);
}
.btn-ghost {
  background: none;
  color: var(--color-muted);
}
.btn-ghost:hover:not(:disabled) {
  color: var(--color-starlight);
}
</style>
