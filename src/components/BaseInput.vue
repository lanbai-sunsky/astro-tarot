<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      class="input-field"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
}>(), {
  type: 'text',
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.input-label {
  font-size: 0.8125rem;
  color: var(--color-muted);
}
.input-field {
  padding: 0.625rem 0.875rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(107, 70, 193, 0.2);
  background: rgba(15, 10, 26, 0.6);
  color: var(--color-starlight);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s;
}
.input-field::placeholder {
  color: var(--color-muted);
  opacity: 0.5;
}
.input-field:focus {
  border-color: var(--color-purple-glow);
}
</style>
