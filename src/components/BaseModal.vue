<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-content">
          <button class="modal-close" @click="$emit('update:modelValue', false)">&times;</button>
          <slot />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 2, 10, 0.8);
  backdrop-filter: blur(4px);
  padding: 1rem;
}
.modal-content {
  position: relative;
  background: rgba(22, 14, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(107, 70, 193, 0.2);
  border-radius: 1.25rem;
  padding: 2rem 1.5rem 1.5rem;
  max-width: 420px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
}
.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.25s;
}
.modal-enter-active .modal-content, .modal-leave-active .modal-content {
  transition: transform 0.25s;
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content { transform: scale(0.9) translateY(10px); }
.modal-leave-to .modal-content { transform: scale(0.9) translateY(10px); }
</style>
