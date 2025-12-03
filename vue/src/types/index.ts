// User types
export interface User {
  id: string
  username: string
  createdAt: string
}

export interface AuthPayload {
  token: string
  user: User
}

// Post types
export interface Post {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
}

// Message types (for chat)
export interface Message {
  id: string
  content: string
  author: User
  createdAt: string
}

// GraphQL Response types
export interface LoginResponse {
  login: AuthPayload
}

export interface RegisterResponse {
  register: AuthPayload
}

export interface MeResponse {
  me: User | null
}

export interface PostsResponse {
  posts: Post[]
}

export interface PostsByUserResponse {
  postsByUser: Post[]
}

export interface CreatePostResponse {
  createPost: Post
}

export interface UpdatePostResponse {
  updatePost: Post
}

export interface DeletePostResponse {
  deletePost: boolean
}

export interface MessagesResponse {
  messages: Message[]
}

export interface SendMessageResponse {
  sendMessage: Message
}

export interface MessageAddedSubscription {
  messageAdded: Message
}

// Legacy types for backwards compatibility
export interface GetCurrentUserResponse {
  currentUser: (User & { posts: Post[] }) | null
}

export interface AddPostResponse {
  addPost: Post
}
