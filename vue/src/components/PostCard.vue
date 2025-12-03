<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types'

const props = defineProps<{
  post: Post
  showActions?: boolean
}>()

const emit = defineEmits<{
  edit: [post: Post]
  delete: [id: string]
}>()

const formattedDate = computed(() => {
  const date = new Date(props.post.createdAt)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const isUpdated = computed(() => {
  return props.post.updatedAt !== props.post.createdAt
})
</script>

<template>
  <article class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold"
          >
            {{ post.author.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="font-semibold text-gray-900">@{{ post.author.username }}</p>
            <p class="text-sm text-gray-500">
              {{ formattedDate }}
              <span v-if="isUpdated" class="text-indigo-500">(edited)</span>
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="showActions" class="flex items-center gap-2">
          <button
            @click="emit('edit', post)"
            class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit post"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            @click="emit('delete', post.id)"
            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete post"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ post.content }}</p>
    </div>
  </article>
</template>
