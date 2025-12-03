<script setup lang="ts">
interface Post {
  id: string
  content: string
  userId: string
}

defineProps<{
  post: Post
}>()
</script>

<template>
  <article class="post-card">
    <p class="post-content">{{ post.content }}</p>
    <div class="post-meta">
      <span class="post-id">ID: {{ post.id }}</span>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  background: var(--card-bg);
  border-left: 4px solid var(--primary);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow);
}

.post-content {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.post-meta {
  display: flex;
  justify-content: flex-end;
}

.post-id {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}
</style>
