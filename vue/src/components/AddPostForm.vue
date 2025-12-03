<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const content = ref('')

const emit = defineEmits<{
  submit: [content: string]
}>()

const isDisabled = computed(() => props.disabled || !content.value.trim())

function handleSubmit() {
  const trimmed = content.value.trim()
  if (!trimmed || props.disabled) return

  emit('submit', trimmed)
  content.value = ''
}
</script>

<template>
  <section class="add-post-section">
    <h2 class="section-title">Add New Post</h2>

    <form class="post-form" @submit.prevent="handleSubmit">
      <textarea
        v-model="content"
        class="post-input"
        placeholder="What's on your mind?"
        rows="4"
        :disabled="disabled"
      ></textarea>

      <button type="submit" class="btn btn-primary" :disabled="isDisabled">
        <span v-if="disabled">⏳ Adding...</span>
        <span v-else>➕ Add Post</span>
      </button>
    </form>
  </section>
</template>

<style scoped>
.add-post-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.section-title {
  margin: 0 0 1.25rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s ease;
  background: var(--bg);
  color: var(--text-primary);
}

.post-input:focus {
  outline: none;
  border-color: var(--primary);
}

.post-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.post-input::placeholder {
  color: var(--text-muted);
}
</style>
