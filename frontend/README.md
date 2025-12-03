# GraphQL Frontend Client

A simple frontend application that uses the Fetch API to interact with the GraphQL server.

## Features

- ✅ Display current user information
- ✅ List all posts for the current user
- ✅ Add new posts via GraphQL mutations
- ✅ Refresh data on demand
- ✅ Modern, responsive UI
- ✅ Error handling and loading states

## How to Use

1. **Start the GraphQL Server** (in the root directory):
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:4001`

2. **Open the Frontend**:
   - Simply open `frontend/index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     cd frontend
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server frontend -p 8000
     ```
   - Then visit `http://localhost:8000` in your browser

## File Structure

```
frontend/
├── index.html          # Main HTML structure
├── styles.css         # Styling
├── graphql-client.js  # GraphQL fetch API utilities
├── app.js            # Application logic
└── README.md         # This file
```

## GraphQL Operations

### Queries

**Get Current User:**
```graphql
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
```

**Get Posts by User:**
```graphql
query GetPostsByUser($userId: String!) {
  postsByUser(userId: $userId) {
    id
    content
    userId
  }
}
```

### Mutations

**Add Post:**
```graphql
mutation AddPost($content: String!) {
  addPost(content: $content) {
    id
    content
    userId
  }
}
```

## API Functions

The `graphql-client.js` file provides these functions:

- `graphqlRequest(query, variables)` - Generic GraphQL request function
- `getCurrentUser()` - Fetch current user with posts
- `getPostsByUser(userId)` - Fetch posts for a specific user
- `addPost(content)` - Create a new post

## Browser Compatibility

This app uses modern JavaScript features:
- Fetch API (supported in all modern browsers)
- Async/await
- ES6+ syntax

For older browsers, you may need to use a polyfill for the Fetch API.

## CORS Configuration

The GraphQL server is configured to allow requests from any origin (for development). For production, you should restrict this to your specific frontend domain.

