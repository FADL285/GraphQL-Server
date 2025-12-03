<script setup lang="ts">
import { useQuery } from 'villus'
import { GET_POSTS } from '@/graphql/queries'
import type { PostsResponse } from '@/types'
import PostCard from '@/components/PostCard.vue'

const {
  data,
  isFetching,
  execute: refresh,
} = useQuery<PostsResponse>({
  query: GET_POSTS,
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white">All Posts</h1>
        <p class="text-white/80 mt-1">See what everyone is sharing</p>
      </div>
      <button
        @click="() => refresh({ cachePolicy: 'network-only' })"
        :disabled="isFetching"
        class="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
      >
        <span v-if="isFetching">Refreshing...</span>
        <span v-else>🔄 Refresh</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isFetching && !data?.posts?.length" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Posts List -->
    <div v-else-if="data?.posts?.length" class="space-y-4">
      <PostCard v-for="post in data.posts" :key="post.id" :post="post" :show-actions="false" />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl p-12 text-center">
      <div class="text-6xl mb-4">📭</div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">No posts yet</h2>
      <p class="text-gray-500">Be the first to share something!</p>
    </div>
  </div>
</template>
