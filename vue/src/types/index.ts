export interface User {
  id: string
  username: string
  posts?: Post[]
}

export interface Post {
  id: string
  content: string
  userId: string
}

// GraphQL Response Types
export interface GetCurrentUserResponse {
  currentUser: User | null
}

export interface AddPostResponse {
  addPost: Post
}
