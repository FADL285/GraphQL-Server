<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const username = ref('')
const password = ref('')
const error = ref('')

const { login, isLoggingIn } = useAuth()

async function handleSubmit() {
  error.value = ''

  if (!username.value.trim() || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  const result = await login(username.value.trim(), password.value)

  if (!result.success) {
    error.value = result.error || 'Login failed'
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p class="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              autocomplete="username"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoggingIn"
            class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoggingIn">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-500">
            Don't have an account?
            <RouterLink to="/register" class="text-indigo-600 font-medium hover:text-indigo-700">
              Sign up
            </RouterLink>
          </p>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-400 text-center">
            Demo accounts: andy25, sarah_dev, mike_codes (password: password123)
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
