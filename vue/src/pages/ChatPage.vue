<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { useQuery, useMutation, useSubscription } from 'villus'
import { GET_MESSAGES, SEND_MESSAGE, MESSAGE_ADDED } from '@/graphql/queries'
import { getErrorMessage } from '@/utils/errors'
import type { MessagesResponse, SendMessageResponse, Message } from '@/types'
import ChatMessage from '@/components/ChatMessage.vue'

// Refs
const messageInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const messages = ref<Message[]>([])
const sendError = ref('')

// Fetch initial messages
const { data: initialData, isFetching: isLoadingMessages } = useQuery<MessagesResponse>({
  query: GET_MESSAGES,
  variables: { limit: 50 },
})

// Watch for initial data
watch(
  initialData,
  (newData) => {
    if (newData?.messages) {
      messages.value = [...newData.messages]
      scrollToBottom()
    }
  },
  { immediate: true },
)

// Subscribe to new messages
const { data: subscriptionData } = useSubscription<{ messageAdded: Message }>({
  query: MESSAGE_ADDED,
})

// Watch subscription data for new messages
watch(subscriptionData, (newData) => {
  if (newData?.messageAdded) {
    // Add new message if not already present
    const exists = messages.value.some((m) => m.id === newData.messageAdded.id)
    if (!exists) {
      messages.value.push(newData.messageAdded)
      scrollToBottom()
    }
  }
})

// Send message mutation
const { execute: sendMessageMutation, isFetching: isSending } =
  useMutation<SendMessageResponse>(SEND_MESSAGE)

// Send message handler
async function handleSend() {
  const content = messageInput.value.trim()
  if (!content || isSending.value) return

  messageInput.value = ''
  sendError.value = ''

  const { error } = await sendMessageMutation({ content })

  if (error) {
    sendError.value = getErrorMessage(error)
    messageInput.value = content // Restore input on error

    // Auto-clear error after 5 seconds
    setTimeout(() => {
      sendError.value = ''
    }, 5000)
  }
}

// Scroll to bottom of messages
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Handle Enter key
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="h-[calc(100vh-64px)] flex flex-col max-w-3xl mx-auto">
    <!-- Header -->
    <div class="bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-gray-100">
      <h1 class="text-xl font-bold text-gray-900">💬 Public Chat</h1>
      <p class="text-sm text-gray-500">Real-time messaging with GraphQL subscriptions</p>
    </div>

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
      <!-- Loading State -->
      <div v-if="isLoadingMessages" class="flex items-center justify-center h-full">
        <div class="text-gray-500">Loading messages...</div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!messages.length"
        class="flex flex-col items-center justify-center h-full text-center"
      >
        <div class="text-6xl mb-4">💬</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">No messages yet</h2>
        <p class="text-gray-500">Start the conversation!</p>
      </div>

      <!-- Messages List -->
      <template v-else>
        <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
      </template>
    </div>

    <!-- Input Area -->
    <div class="bg-white border-t border-gray-200 p-4">
      <!-- Error Message -->
      <div v-if="sendError" class="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-3">
        {{ sendError }}
      </div>

      <form @submit.prevent="handleSend" class="flex gap-3">
        <input
          v-model="messageInput"
          type="text"
          placeholder="Type a message..."
          class="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          :disabled="isSending"
          @keydown="handleKeydown"
        />
        <button
          type="submit"
          :disabled="!messageInput.trim() || isSending"
          class="min-w-[80px] px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSending">...</span>
          <span v-else>Send</span>
        </button>
      </form>
    </div>
  </div>
</template>
