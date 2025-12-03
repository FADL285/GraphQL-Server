<script setup lang="ts">
import { ref } from 'vue'
import UserCard from './components/UserCard.vue'
import PostList from './components/PostList.vue'
import AddPostForm from './components/AddPostForm.vue'

// Test data (will be replaced with GraphQL later)
const user = ref({
  id: 'abc-1',
  username: 'andy25',
})

const posts = ref([
  {
    id: 'xyz-1',
    content: 'First Post - Hello world',
    userId: 'abc-1',
  },
  {
    id: 'xyz-2',
    content: 'Second Post - Hello again',
    userId: 'abc-1',
  },
  {
    id: 'xyz-3',
    content: 'Random Post from Vue!',
    userId: 'abc-1',
  },
])

const loading = ref(false)

// Placeholder handlers (will add logic later)
function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

function handleAddPost(content: string) {
  const newPost = {
    id: `xyz-${Date.now()}`,
    content,
    userId: user.value.id,
  }
  posts.value.unshift(newPost)
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">📝 GraphQL Posts App</h1>
      <p class="subtitle">Vue 3 + Composition API</p>
    </header>

    <main class="main">
      <section class="user-section">
        <h2 class="section-label">Current User</h2>
        <UserCard :user="user" />
      </section>

      <PostList :posts="posts" :loading="loading" @refresh="handleRefresh" />

      <AddPostForm @submit="handleAddPost" />
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

@media (max-width: 640px) {
  .app {
    padding: 1rem;
  }

  .title {
    font-size: 1.75rem;
  }
}
</style>
