<template>
  <div class="page settings-page">
    <h1 class="title">设置</h1>

    <!-- Birth info -->
    <BaseCard>
      <div class="section-header">
        <h3 class="section-title">出生信息</h3>
        <BaseButton v-if="userStore.birthInfo && !editingBirth" variant="ghost" @click="editingBirth = true" style="font-size: 0.75rem;">
          编辑
        </BaseButton>
      </div>
      <div v-if="userStore.birthInfo && !editingBirth" class="birth-display">
        <div class="birth-row">{{ userStore.birthInfo.date }} {{ userStore.birthInfo.time }}</div>
        <div class="birth-row muted">{{ userStore.birthInfo.place }} ({{ userStore.birthInfo.timezone }})</div>
      </div>
      <div v-if="!userStore.birthInfo || editingBirth" class="birth-form-wrap">
        <BirthForm :initial="userStore.birthInfo" @submit="onBirthUpdate" />
        <BaseButton v-if="userStore.birthInfo" variant="ghost" @click="editingBirth = false" style="margin-top: 0.5rem; width: 100%;">
          取消编辑
        </BaseButton>
      </div>
    </BaseCard>

    <!-- AI API Key -->
    <BaseCard style="margin-top: 0.75rem;">
      <h3 class="section-title">AI 增强解读</h3>
      <p class="hint">使用 DeepSeek API 增强解读效果。Key 仅保存在本地浏览器。</p>
      <div class="api-key-row">
        <input
          :type="showKey ? 'text' : 'password'"
          :value="userStore.deepseekApiKey"
          @input="onApiKeyChange"
          placeholder="输入 DeepSeek API Key"
          class="field-input"
        />
        <BaseButton variant="ghost" @click="showKey = !showKey" style="font-size: 0.75rem;">
          {{ showKey ? '隐藏' : '显示' }}
        </BaseButton>
      </div>
      <p class="hint" style="margin-top: 0.5rem;">
        获取 Key：<a href="https://platform.deepseek.com/" target="_blank" rel="noopener">platform.deepseek.com</a>
        &nbsp;|&nbsp; 百万 Token 仅 ¥1
      </p>
    </BaseCard>

    <!-- About -->
    <BaseCard style="margin-top: 0.75rem;">
      <h3 class="section-title">关于</h3>
      <p class="about-text">
        星罗 · 占星塔罗 — 一个完全免费、无需注册、数据全存本地的中文占星塔罗工具。
      </p>
      <div class="about-details">
        <div>版本：0.2.0</div>
        <div>星盘引擎：celestine (MIT)</div>
        <div>塔罗牌：Rider-Waite 公共领域</div>
        <div>AI 增强：DeepSeek API（用户自备 Key）</div>
      </div>
      <p class="about-text" style="margin-top: 0.75rem;">
        隐私优先：所有数据仅存储在您的浏览器中，不上传任何服务器。
      </p>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore, type BirthInfo } from '@/stores/user'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BirthForm from '@/components/BirthForm.vue'

const userStore = useUserStore()
const editingBirth = ref(false)
const showKey = ref(false)

function onBirthUpdate(info: BirthInfo) {
  userStore.updateBirthInfo(info)
  editingBirth.value = false
}

function onApiKeyChange(e: Event) {
  const target = e.target as HTMLInputElement
  userStore.setApiKey(target.value)
}
</script>

<style scoped>
.title {
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-starlight);
}
.hint {
  font-size: 0.75rem;
  color: var(--color-muted);
  opacity: 0.7;
  line-height: 1.5;
  margin-top: 0.25rem;
}
.hint a {
  color: var(--color-purple-glow);
  text-decoration: underline;
}
.birth-display {
  padding: 0.5rem 0;
}
.birth-row {
  font-size: 0.875rem;
  color: var(--color-starlight);
  line-height: 1.7;
}
.birth-row.muted {
  color: var(--color-muted);
  font-size: 0.8125rem;
}
.birth-form-wrap {
  margin-top: 0.5rem;
}
.api-key-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
}
.api-key-row .field-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(107, 70, 193, 0.2);
  background: rgba(15, 10, 26, 0.6);
  color: var(--color-starlight);
  font-size: 0.875rem;
  outline: none;
}
.api-key-row .field-input:focus {
  border-color: var(--color-purple-glow);
}
.about-text {
  font-size: 0.8125rem;
  color: var(--color-muted);
  line-height: 1.6;
}
.about-details {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-muted);
  opacity: 0.7;
  line-height: 1.8;
}
</style>
