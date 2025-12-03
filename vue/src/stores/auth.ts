import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

const TOKEN_KEY = 'graphql_auth_token'
const USER_KEY = 'graphql_auth_user'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userId = computed(() => user.value?.id ?? null)
  const username = computed(() => user.value?.username ?? null)

  // Actions
  function initFromStorage(): void {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      clearStorage()
    }
  }

  function setAuth(authToken: string, authUser: User): void {
    token.value = authToken
    user.value = authUser

    // Persist to storage
    try {
      localStorage.setItem(TOKEN_KEY, authToken)
      localStorage.setItem(USER_KEY, JSON.stringify(authUser))
    } catch (error) {
      console.error('Failed to persist auth state:', error)
    }
  }

  function clearAuth(): void {
    token.value = null
    user.value = null
    clearStorage()
  }

  function clearStorage(): void {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }

  function setLoading(loading: boolean): void {
    isLoading.value = loading
  }

  return {
    // State
    token,
    user,
    isLoading,
    // Getters
    isAuthenticated,
    userId,
    username,
    // Actions
    initFromStorage,
    setAuth,
    clearAuth,
    setLoading,
  }
})
