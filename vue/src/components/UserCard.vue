<script setup lang="ts">
interface User {
  id: string
  username: string
}

defineProps<{
  user: User
}>()
</script>

<template>
  <div class="user-card">
    <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
    <div class="user-details">
      <h3 class="user-name">{{ user.username }}</h3>
      <p class="user-id">ID: {{ user.id }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-id {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>
