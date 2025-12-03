<script setup lang="ts">
import { computed } from 'vue'
import { useClient, useQuery, useMutation } from 'villus'
import UserCard from './components/UserCard.vue'
import PostList from './components/PostList.vue'
import AddPostForm from './components/AddPostForm.vue'
import { GET_CURRENT_USER, ADD_POST } from './graphql/queries'
import type { GetCurrentUserResponse, AddPostResponse } from './types'

// Configure villus client (uses default plugins: cache, dedup, fetch)
useClient({
  url: 'http://localhost:4001',
})

// Fetch current user with posts
const {
  data,
  isFetching,
  execute: refetch,
} = useQuery<GetCurrentUserResponse>({
  query: GET_CURRENT_USER,
  tags: ['current_user'], // Tag for cache management
})

// Add post mutation with auto-refetch
const { execute: addPostMutation, isFetching: isAdding } = useMutation<AddPostResponse>(ADD_POST, {
  refetchTags: ['current_user'], // Auto-refetch tagged queries after mutation
})

// Computed values
const user = computed(() => data.value?.currentUser ?? null)
const posts = computed(() => data.value?.currentUser?.posts ?? [])
const loading = computed(() => isFetching.value)

// Handlers
function handleRefresh() {
  refetch({ cachePolicy: 'network-only' }) // Bypass cache for manual refresh
}

async function handleAddPost(content: string) {
  await addPostMutation({ content })
  // No need to manually refetch - refetchTags handles it
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">📝 GraphQL Posts App</h1>
      <p class="subtitle">Vue 3 + Villus + GraphQL</p>
    </header>

    <main class="main">
      <section class="user-section">
        <h2 class="section-label">Current User</h2>
        <div v-if="loading && !user" class="loading-card">Loading user...</div>
        <UserCard v-else-if="user" :user="user" />
        <div v-else class="error-card">No user found</div>
      </section>

      <PostList :posts="posts" :loading="loading" @refresh="handleRefresh" />

      <AddPostForm :disabled="isAdding" @submit="handleAddPost" />
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.title {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  margin: 0.5rem 0 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
}

.main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-label {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.loading-card,
.error-card {
  padding: 1.25rem;
  background: var(--card-bg);
  border-radius: 12px;
  text-align: center;
  color: var(--text-secondary);
}

.error-card {
  color: var(--error);
}

@media (max-width: 640px) {
  .app {
    padding: 1rem;
  }

  .title {
    font-size: 1.75rem;
  }
}
</style>
