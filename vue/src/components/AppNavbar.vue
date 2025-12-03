<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'

const authStore = useAuthStore()
const { logout } = useAuth()
const route = useRoute()

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function handleLogout() {
  closeMobileMenu()
  logout()
}

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <nav class="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2" @click="closeMobileMenu">
          <span class="text-2xl">📝</span>
          <span class="font-bold text-xl text-gray-900">GraphQL App</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            to="/"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="
              isActive('/') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            "
          >
            Home
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/posts"
              class="px-4 py-2 rounded-lg font-medium transition-colors"
              :class="
                isActive('/posts')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              "
            >
              My Posts
            </RouterLink>
            <RouterLink
              to="/chat"
              class="px-4 py-2 rounded-lg font-medium transition-colors"
              :class="
                isActive('/chat')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              "
            >
              Chat
            </RouterLink>
          </template>
        </div>

        <!-- Desktop Auth -->
        <div class="hidden md:flex items-center gap-3">
          <template v-if="authStore.isAuthenticated">
            <span class="text-gray-600">
              Hi, <span class="font-medium text-indigo-600">{{ authStore.username }}</span>
            </span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign up
            </RouterLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden pb-4 border-t border-gray-100">
        <div class="flex flex-col gap-1 pt-4">
          <RouterLink
            to="/"
            class="px-4 py-3 rounded-lg font-medium"
            :class="isActive('/') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'"
            @click="closeMobileMenu"
          >
            Home
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/posts"
              class="px-4 py-3 rounded-lg font-medium"
              :class="isActive('/posts') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'"
              @click="closeMobileMenu"
            >
              My Posts
            </RouterLink>
            <RouterLink
              to="/chat"
              class="px-4 py-3 rounded-lg font-medium"
              :class="isActive('/chat') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'"
              @click="closeMobileMenu"
            >
              Chat
            </RouterLink>
            <div class="border-t border-gray-100 my-2"></div>
            <div class="px-4 py-2 text-gray-500">
              Signed in as <span class="font-medium text-indigo-600">{{ authStore.username }}</span>
            </div>
            <button @click="handleLogout" class="px-4 py-3 text-left text-red-600 font-medium">
              Logout
            </button>
          </template>
          <template v-else>
            <div class="border-t border-gray-100 my-2"></div>
            <RouterLink
              to="/login"
              class="px-4 py-3 text-gray-600 font-medium"
              @click="closeMobileMenu"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="mx-4 py-3 bg-indigo-600 text-white text-center rounded-lg font-medium"
              @click="closeMobileMenu"
            >
              Sign up
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
