/**
 * GraphQL Client using Fetch API
 */

const GRAPHQL_ENDPOINT = "http://localhost:4001";

/**
 * Execute a GraphQL query or mutation
 * @param {string} query - GraphQL query string
 * @param {Object} variables - Optional variables for the query
 * @returns {Promise<Object>} - Response data
 */
async function graphqlRequest(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

/**
 * Get current user with their posts
 * @returns {Promise<Object>} - User object with posts
 */
async function getCurrentUser() {
  const query = `
    query {
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
  `;

  const data = await graphqlRequest(query);
  return data.currentUser;
}

/**
 * Get posts by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of posts
 */
async function getPostsByUser(userId) {
  const query = `
    query GetPostsByUser($userId: String!) {
      postsByUser(userId: $userId) {
        id
        content
        userId
      }
    }
  `;

  const data = await graphqlRequest(query, { userId });
  return data.postsByUser;
}

/**
 * Add a new post
 * @param {string} content - Post content
 * @returns {Promise<Object>} - Created post object
 */
async function addPost(content) {
  const mutation = `
    mutation AddPost($content: String!) {
      addPost(content: $content) {
        id
        content
        userId
      }
    }
  `;

  const data = await graphqlRequest(mutation, { content });
  return data.addPost;
}

