<script setup lang="ts">
import PostCard from './PostCard.vue'

interface Post {
  id: string
  content: string
  userId: string
}

defineProps<{
  posts: Post[]
  loading?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <section class="posts-section">
    <div class="section-header">
      <h2 class="section-title">Posts</h2>
      <button class="btn btn-secondary" @click="emit('refresh')" :disabled="loading">
        <span v-if="loading">⏳ Loading...</span>
        <span v-else>🔄 Refresh</span>
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading posts...</p>
    </div>

    <div v-else-if="posts.length === 0" class="empty-state">
      <p>No posts yet. Add your first post below! 📝</p>
    </div>

    <div v-else class="posts-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </section>
</template>

<style scoped>
.posts-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
