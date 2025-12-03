<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/types'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  message: Message
}>()

const authStore = useAuthStore()

const isOwnMessage = computed(() => props.message.author.id === authStore.userId)

const formattedTime = computed(() => {
  const date = new Date(props.message.createdAt)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div class="flex gap-3" :class="isOwnMessage ? 'flex-row-reverse' : 'flex-row'">
    <!-- Avatar -->
    <div
      class="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold"
      :class="isOwnMessage ? 'bg-indigo-500' : 'bg-gray-400'"
    >
      {{ message.author.username.charAt(0).toUpperCase() }}
    </div>

    <!-- Message Bubble -->
    <div
      class="max-w-[70%] rounded-2xl px-4 py-2"
      :class="
        isOwnMessage
          ? 'bg-indigo-500 text-white rounded-br-md'
          : 'bg-gray-100 text-gray-900 rounded-bl-md'
      "
    >
      <p
        v-if="!isOwnMessage"
        class="text-xs font-medium mb-1"
        :class="isOwnMessage ? 'text-indigo-200' : 'text-gray-500'"
      >
        @{{ message.author.username }}
      </p>
      <p class="text-sm leading-relaxed">{{ message.content }}</p>
      <p class="text-xs mt-1" :class="isOwnMessage ? 'text-indigo-200' : 'text-gray-400'">
        {{ formattedTime }}
      </p>
    </div>
  </div>
</template>
