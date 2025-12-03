// GraphQL Queries
export const GET_CURRENT_USER = `
  query GetCurrentUser {
    currentUser {
      id
      username
      posts {
        id
        content
        userId
      }
    }
  }
`

export const GET_POSTS_BY_USER = `
  query GetPostsByUser($userId: String!) {
    postsByUser(userId: $userId) {
      id
      content
      userId
    }
  }
`

// GraphQL Mutations
export const ADD_POST = `
  mutation AddPost($content: String!) {
    addPost(content: $content) {
      id
      content
      userId
    }
  }
`
