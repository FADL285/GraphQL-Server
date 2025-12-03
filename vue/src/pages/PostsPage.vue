<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation } from 'villus'
import { useAuthStore } from '@/stores/auth'
import { GET_MY_POSTS, CREATE_POST, UPDATE_POST, DELETE_POST } from '@/graphql/queries'
import { getErrorMessage } from '@/utils/errors'
import type {
  PostsByUserResponse,
  CreatePostResponse,
  UpdatePostResponse,
  DeletePostResponse,
  Post,
} from '@/types'
import PostCard from '@/components/PostCard.vue'

const authStore = useAuthStore()

// Fetch user's posts
const {
  data,
  isFetching,
  execute: refresh,
} = useQuery<PostsByUserResponse>({
  query: GET_MY_POSTS,
  variables: computed(() => ({ userId: authStore.userId })),
  tags: ['my_posts'],
})

// Mutations
const { execute: createPostMutation, isFetching: isCreating } = useMutation<CreatePostResponse>(
  CREATE_POST,
  {
    refetchTags: ['my_posts'],
  },
)

const { execute: updatePostMutation, isFetching: isUpdating } = useMutation<UpdatePostResponse>(
  UPDATE_POST,
  {
    refetchTags: ['my_posts'],
  },
)

const { execute: deletePostMutation, isFetching: isDeleting } = useMutation<DeletePostResponse>(
  DELETE_POST,
  {
    refetchTags: ['my_posts'],
  },
)

// Form state
const newPostContent = ref('')
const editingPost = ref<Post | null>(null)
const editContent = ref('')
const error = ref('')

const isProcessing = computed(() => isCreating.value || isUpdating.value || isDeleting.value)

// Create post
async function handleCreate() {
  if (!newPostContent.value.trim()) return
  error.value = ''

  const { error: err } = await createPostMutation({ content: newPostContent.value.trim() })
  if (err) {
    error.value = getErrorMessage(err)
  } else {
    newPostContent.value = ''
  }
}

// Start editing
function startEdit(post: Post) {
  editingPost.value = post
  editContent.value = post.content
}

// Cancel editing
function cancelEdit() {
  editingPost.value = null
  editContent.value = ''
}

// Save edit
async function saveEdit() {
  if (!editingPost.value || !editContent.value.trim()) return
  error.value = ''

  const { error: err } = await updatePostMutation({
    id: editingPost.value.id,
    content: editContent.value.trim(),
  })

  if (err) {
    error.value = getErrorMessage(err)
  } else {
    cancelEdit()
  }
}

// Delete post
async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this post?')) return
  error.value = ''

  const { error: err } = await deletePostMutation({ id })
  if (err) {
    error.value = getErrorMessage(err)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white">My Posts</h1>
        <p class="text-white/80 mt-1">Manage your posts</p>
      </div>
      <button
        @click="() => refresh({ cachePolicy: 'network-only' })"
        :disabled="isFetching"
        class="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
      >
        🔄 Refresh
      </button>
    </div>

    <!-- Create Post Form -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 class="font-semibold text-gray-900 mb-4">Create New Post</h2>
      <form @submit.prevent="handleCreate" class="space-y-4">
        <textarea
          v-model="newPostContent"
          placeholder="What's on your mind?"
          rows="3"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
          :disabled="isCreating"
        ></textarea>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="!newPostContent.trim() || isCreating"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isCreating">Creating...</span>
            <span v-else>Create Post</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editingPost"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Edit Post</h2>
          <textarea
            v-model="editContent"
            rows="4"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
            :disabled="isUpdating"
          ></textarea>
          <div class="flex justify-end gap-3 mt-4">
            <button
              @click="cancelEdit"
              :disabled="isUpdating"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveEdit"
              :disabled="!editContent.trim() || isUpdating"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <span v-if="isUpdating">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isFetching && !data?.postsByUser?.length" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Posts List -->
    <div v-else-if="data?.postsByUser?.length" class="space-y-4">
      <PostCard
        v-for="post in data.postsByUser"
        :key="post.id"
        :post="post"
        :show-actions="true"
        :class="{ 'opacity-50': isProcessing }"
        @edit="startEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl p-12 text-center">
      <div class="text-6xl mb-4">✍️</div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">No posts yet</h2>
      <p class="text-gray-500">Create your first post above!</p>
    </div>
  </div>
</template>
