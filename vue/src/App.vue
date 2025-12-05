<script setup lang="ts">
import {
  useClient,
  handleSubscriptions,
  defaultPlugins,
  definePlugin,
  type StandardOperationResult,
} from 'villus'
import { createClient as createWSClient } from 'graphql-ws'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/AppNavbar.vue'
import { API_URL, WS_URL } from '@/config'

const authStore = useAuthStore()

// Create WebSocket client for subscriptions
const wsClient = createWSClient({
  url: WS_URL,
  connectionParams: () => ({
    authToken: authStore.token,
  }),
})

// Create subscription handler
const subscriptionsHandler = handleSubscriptions((operation) => {
  return {
    subscribe: (observer) => {
      const dispose = wsClient.subscribe(
        {
          query: operation.query as string,
          variables: operation.variables,
        },
        {
          next: (data) => observer.next(data as StandardOperationResult),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        },
      )

      return {
        unsubscribe: dispose,
      }
    },
  }
})

// Auth plugin to inject Authorization header
const authPlugin = definePlugin(({ opContext }) => {
  const token = authStore.token
  if (token) {
    opContext.headers = opContext.headers || {}
    ;(opContext.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
})

// Configure villus client with auth header and subscriptions
useClient({
  url: API_URL,
  use: [authPlugin, subscriptionsHandler, ...defaultPlugins()],
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppNavbar />
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>
