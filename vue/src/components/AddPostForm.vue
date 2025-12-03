<script setup lang="ts">
import { ref } from 'vue'

const content = ref('')
const isSubmitting = ref(false)

const emit = defineEmits<{
  submit: [content: string]
}>()

function handleSubmit() {
  const trimmed = content.value.trim()
  if (!trimmed || isSubmitting.value) return

  isSubmitting.value = true
  emit('submit', trimmed)

  // Reset form (parent will handle the actual submission)
  setTimeout(() => {
    content.value = ''
    isSubmitting.value = false
  }, 500)
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
        :disabled="isSubmitting"
      ></textarea>

      <button type="submit" class="btn btn-primary" :disabled="!content.trim() || isSubmitting">
        <span v-if="isSubmitting">⏳ Adding...</span>
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
