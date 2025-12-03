// ============ QUERIES ============

export const ME = `
  query Me {
    me {
      id
      username
      createdAt
    }
  }
`

export const GET_POSTS = `
  query GetPosts {
    posts {
      id
      content
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MY_POSTS = `
  query GetMyPosts($userId: ID!) {
    postsByUser(userId: $userId) {
      id
      content
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MESSAGES = `
  query GetMessages($limit: Int) {
    messages(limit: $limit) {
      id
      content
      author {
        id
        username
      }
      createdAt
    }
  }
`

// ============ MUTATIONS ============

export const LOGIN = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        createdAt
      }
    }
  }
`

export const REGISTER = `
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        id
        username
        createdAt
      }
    }
  }
`

export const CREATE_POST = `
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      id
      content
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_POST = `
  mutation UpdatePost($id: ID!, $content: String!) {
    updatePost(id: $id, content: $content) {
      id
      content
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`

export const DELETE_POST = `
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`

export const SEND_MESSAGE = `
  mutation SendMessage($content: String!) {
    sendMessage(content: $content) {
      id
      content
      author {
        id
        username
      }
      createdAt
    }
  }
`

// ============ SUBSCRIPTIONS ============

export const MESSAGE_ADDED = `
  subscription OnMessageAdded {
    messageAdded {
      id
      content
      author {
        id
        username
      }
      createdAt
    }
  }
`

// Legacy exports for backwards compatibility
export const GET_CURRENT_USER = ME
export const ADD_POST = CREATE_POST
