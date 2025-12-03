/**
 * GraphQL Client using Fetch API
 * Demonstrates how to call GraphQL with native fetch
 */

const GRAPHQL_ENDPOINT = "http://localhost:4001/graphql";

// Store auth token in memory (in production, use secure storage)
let authToken = null;

/**
 * Set the auth token
 */
function setToken(token) {
  authToken = token;
}

/**
 * Get the current auth token
 */
function getToken() {
  return authToken;
}

/**
 * Clear the auth token
 */
function clearToken() {
  authToken = null;
}

/**
 * Execute a GraphQL query or mutation
 * @param {string} query - GraphQL query string
 * @param {Object} variables - Optional variables for the query
 * @returns {Promise<Object>} - Response data
 */
async function graphqlRequest(query, variables = {}) {
  // Build headers
  const headers = {
    "Content-Type": "application/json",
  };

  // Add auth token if available
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
}

// ============ QUERIES ============

/**
 * Get all posts
 * @returns {Promise<Array>} - Array of posts
 */
async function getPosts() {
  const query = `
    query GetPosts {
      posts {
        id
        content
        author {
          id
          username
        }
        createdAt
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.posts;
}

// ============ MUTATIONS ============

/**
 * Login and get JWT token
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} - { token, user }
 */
async function login(username, password) {
  const mutation = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
        user {
          id
          username
        }
      }
    }
  `;

  const data = await graphqlRequest(mutation, { username, password });
  return data.login;
}

/**
 * Create a new post (requires auth)
 * @param {string} content - Post content
 * @returns {Promise<Object>} - Created post object
 */
async function createPost(content) {
  const mutation = `
    mutation CreatePost($content: String!) {
      createPost(content: $content) {
        id
        content
        author {
          username
        }
      }
    }
  `;

  const data = await graphqlRequest(mutation, { content });
  return data.createPost;
}

/**
 * Delete a post (requires auth, own posts only)
 * @param {string} id - Post ID
 * @returns {Promise<boolean>} - Success status
 */
async function deletePost(id) {
  const mutation = `
    mutation DeletePost($id: ID!) {
      deletePost(id: $id)
    }
  `;

  const data = await graphqlRequest(mutation, { id });
  return data.deletePost;
}
