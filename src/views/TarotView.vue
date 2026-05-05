<template>
  <div class="page tarot-page">
    <!-- Phase: select spread -->
    <div v-if="store.phase === 'select'" class="select-phase">
      <h1 class="title">塔罗占卜</h1>
      <p class="subtext">静心默念你的问题，然后选择牌阵</p>

      <div class="spread-options">
        <BaseCard
          :clickable="true"
          :class="{ active: store.spread === 'single' }"
          @click="store.setSpread('single')"
        >
          <div class="spread-icon">🂠</div>
          <div class="spread-name">单张牌</div>
          <div class="spread-desc">每日指引 · 快速占卜</div>
        </BaseCard>
        <BaseCard
          :clickable="true"
          :class="{ active: store.spread === 'three' }"
          @click="store.setSpread('three')"
        >
          <div class="spread-icon">🂠🂠🂠</div>
          <div class="spread-name">三张牌</div>
          <div class="spread-desc">过去 · 现在 · 未来</div>
        </BaseCard>
      </div>

      <div class="question-area">
        <input
          v-model="questionText"
          placeholder="（可选）输入你想问的问题..."
          class="question-input"
        />
      </div>

      <BaseButton variant="primary" @click="startDraw" class="start-btn">
        开始抽牌
      </BaseButton>
    </div>

    <!-- Phase: shuffle & reveal cards -->
    <div v-else-if="store.phase === 'shuffle' || store.phase === 'reveal'" class="reveal-phase">
      <p class="phase-hint">
        {{ store.phase === 'shuffle' ? '点击牌面翻开' : `${revealedCount}/${store.cards.length} 张已翻开` }}
      </p>
      <div :class="['card-grid', store.spread === 'single' ? 'single' : 'three']">
        <TarotCard
          v-for="(dc, i) in store.cards"
          :key="i"
          :card="dc.card"
          :reversed="dc.reversed"
          :revealed="dc.revealed"
          @reveal="store.revealCard(i)"
        />
      </div>
      <BaseButton v-if="revealedCount > 0 && revealedCount < store.cards.length" variant="ghost" @click="store.revealAll()">
        全部翻开
      </BaseButton>
    </div>

    <!-- Phase: reading -->
    <div v-else-if="store.phase === 'reading'" class="reading-phase">
      <h2 class="reading-title">解读结果</h2>

      <div class="result-cards">
        <div v-for="(dc, i) in store.cards" :key="i" class="result-card-mini" :class="{ reversed: dc.reversed }">
          <span class="result-card-name">{{ dc.card.name }}</span>
          <span class="result-card-dir">{{ dc.reversed ? '逆位' : '正位' }}</span>
        </div>
      </div>

      <BaseCard>
        <div class="interpretation-text" v-html="renderMarkdown(interpretation)"></div>
      </BaseCard>

      <!-- AI enhanced reading -->
      <BaseCard v-if="aiResponse" class="ai-card">
        <div class="ai-label">🤖 AI 增强解读</div>
        <div class="interpretation-text" v-html="renderMarkdown(aiResponse)"></div>
      </BaseCard>

      <div class="reading-actions">
        <BaseButton variant="secondary" @click="askAi" :disabled="aiLoading">
          {{ aiLoading ? 'AI 解读中...' : aiResponse ? '重新 AI 解读' : '🤖 AI 增强解读' }}
        </BaseButton>
        <BaseButton variant="primary" @click="saveReading">
          保存结果
        </BaseButton>
        <BaseButton variant="ghost" @click="resetAll">
          重新占卜
        </BaseButton>
      </div>

      <!-- API Key prompt modal -->
      <BaseModal v-model="showApiModal">
        <h3 style="margin-bottom:1rem;">需要 DeepSeek API Key</h3>
        <p style="color:var(--color-muted);font-size:0.875rem;margin-bottom:1rem;">
          AI 增强解读需要 DeepSeek API。请到
          <a href="https://platform.deepseek.com" target="_blank" style="color:var(--color-purple-glow);">platform.deepseek.com</a>
          注册获取 Key（百万 token 仅 ¥1）。
        </p>
        <BaseInput v-model="apiKeyInput" type="password" placeholder="sk-..." label="API Key" />
        <div style="display:flex;gap:0.5rem;margin-top:1rem;justify-content:flex-end;">
          <BaseButton variant="ghost" @click="showApiModal = false">取消</BaseButton>
          <BaseButton variant="primary" @click="saveApiKey">保存并继续</BaseButton>
        </div>
      </BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTarotStore } from '@/stores/tarot'
import { useUserStore } from '@/stores/user'
import { useHistoryStore } from '@/stores/history'
import { dealCards } from '@/utils/shuffle'
import { interpretTarot, buildAiPrompt } from '@/utils/interpret'
import { renderMarkdown } from '@/utils/markdown'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseInput from '@/components/BaseInput.vue'
import TarotCard from '@/components/TarotCard.vue'

const store = useTarotStore()
const userStore = useUserStore()
const historyStore = useHistoryStore()

const questionText = ref('')
const aiResponse = ref('')
const aiLoading = ref(false)
const showApiModal = ref(false)
const apiKeyInput = ref('')

const revealedCount = computed(() => store.cards.filter(c => c.revealed).length)

const interpretation = computed(() => interpretTarot(store.cards))

function startDraw() {
  store.setQuestion(questionText.value)
  store.setCards(dealCards(store.spread === 'single' ? 1 : 3))
}

function resetAll() {
  store.reset()
  questionText.value = ''
  aiResponse.value = ''
}

async function askAi() {
  if (!userStore.deepseekApiKey) {
    showApiModal.value = true
    return
  }
  aiLoading.value = true
  aiResponse.value = ''
  try {
    const resp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: buildAiPrompt(store.cards, store.question) }],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    })
    if (!resp.ok) throw new Error(`API error: ${resp.status}`)
    const data = await resp.json()
    aiResponse.value = data.choices[0].message.content
  } catch (e) {
    aiResponse.value = 'AI 解读暂时不可用，请检查网络或 API Key 是否正确。\n\n本地解读仍然可以为你提供指引。'
  } finally {
    aiLoading.value = false
  }
}

function saveApiKey() {
  userStore.setApiKey(apiKeyInput.value)
  showApiModal.value = false
  askAi()
}

function saveReading() {
  historyStore.saveTarot({
    id: Date.now().toString(36),
    spread: store.spread,
    question: store.question,
    cards: store.cards.map(c => ({ cardId: c.card.id, reversed: c.reversed })),
    interpretation: aiResponse.value || interpretation.value,
    timestamp: Date.now(),
  })
  resetAll()
}
</script>

<style scoped>
.tarot-page {
  padding-bottom: 1rem;
}
.title {
  font-size: 1.75rem;
  text-align: center;
  color: var(--color-starlight);
  margin-bottom: 0.25rem;
}
.subtext {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

/* Spread select */
.spread-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.spread-options :deep(.glass-card) {
  text-align: center;
  padding: 1.5rem 1rem;
}
.spread-options :deep(.glass-card.active) {
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 20px rgba(107, 70, 193, 0.2);
}
.spread-icon { font-size: 1.5rem; margin-bottom: 0.25rem; }
.spread-name { font-weight: 600; color: var(--color-starlight); }
.spread-desc { font-size: 0.75rem; color: var(--color-muted); margin-top: 0.25rem; }

.question-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(107, 70, 193, 0.2);
  background: rgba(15, 10, 26, 0.6);
  color: var(--color-starlight);
  font-size: 0.9375rem;
  outline: none;
  margin-bottom: 1rem;
}
.question-input:focus { border-color: var(--color-purple-glow); }
.question-input::placeholder { color: var(--color-muted); opacity: 0.5; }

.start-btn { width: 100%; margin-top: 0.5rem; }

/* Reveal phase */
.phase-hint {
  text-align: center;
  color: var(--color-muted);
  margin-bottom: 1.5rem;
}
.card-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.card-grid.single { gap: 0; }

/* Reading phase */
.reading-title {
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 1rem;
}
.result-cards {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.result-card-mini {
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  background: rgba(107, 70, 193, 0.15);
  color: var(--color-starlight);
}
.result-card-mini.reversed { background: rgba(245, 158, 11, 0.15); }
.result-card-dir { font-size: 0.625rem; color: var(--color-muted); margin-left: 0.25rem; }

.interpretation-text {
  line-height: 1.8;
  font-size: 0.9375rem;
}
.interpretation-text :deep(h1),
.interpretation-text :deep(h2),
.interpretation-text :deep(h3),
.interpretation-text :deep(h4) {
  color: var(--color-starlight);
  margin: 1em 0 0.5em;
  font-weight: 600;
}
.interpretation-text :deep(h1) { font-size: 1.25rem; }
.interpretation-text :deep(h2) { font-size: 1.125rem; }
.interpretation-text :deep(h3) { font-size: 1rem; }
.interpretation-text :deep(h4) { font-size: 0.9375rem; }
.interpretation-text :deep(p) { margin: 0.5em 0; }
.interpretation-text :deep(ul),
.interpretation-text :deep(ol) {
  padding-left: 1.25rem;
  margin: 0.5em 0;
}
.interpretation-text :deep(li) { margin: 0.25em 0; }
.interpretation-text :deep(strong) {
  color: var(--color-starlight);
  font-weight: 600;
}
.interpretation-text :deep(em) { color: var(--color-purple-glow); }
.interpretation-text :deep(blockquote) {
  border-left: 3px solid rgba(107, 70, 193, 0.3);
  padding-left: 0.75rem;
  margin: 0.5em 0;
  color: var(--color-muted);
}
.interpretation-text :deep(hr) {
  border: none;
  border-top: 1px solid rgba(107, 70, 193, 0.15);
  margin: 1em 0;
}
.interpretation-text :deep(code) {
  background: rgba(107, 70, 193, 0.15);
  padding: 0.125em 0.375em;
  border-radius: 4px;
  font-size: 0.875em;
}
.ai-card {
  margin-top: 0.75rem;
  border-color: rgba(139, 92, 246, 0.3);
}
.ai-label {
  font-size: 0.75rem;
  color: var(--color-purple-glow);
  margin-bottom: 0.5rem;
}

.reading-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.25rem;
}
</style>
