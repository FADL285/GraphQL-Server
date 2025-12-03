# Frontend - Simple GraphQL Client

A minimal HTML/CSS/JS frontend demonstrating how to call GraphQL APIs using native `fetch()`.

## Features

- **Login** - Authenticate with JWT token
- **View Posts** - Query all posts from the GraphQL API
- **Add Post** - Create new posts (requires auth)
- **Delete Post** - Delete your own posts (requires auth)

## Running

```bash
# From root directory
npm run dev:frontend

# Opens at http://localhost:3000
```

## How It Works

### GraphQL Query Example

```javascript
async function getPosts() {
  const query = `
    query GetPosts {
      posts {
        id
        content
        author { username }
      }
    }
  `;

  const response = await fetch("http://localhost:4001/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return data.posts;
}
```

### GraphQL Mutation Example

```javascript
async function createPost(content) {
  const mutation = `
    mutation CreatePost($content: String!) {
      createPost(content: $content) {
        id
        content
      }
    }
  `;

  const response = await fetch("http://localhost:4001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // JWT token for auth
    },
    body: JSON.stringify({
      query: mutation,
      variables: { content },
    }),
  });

  const { data } = await response.json();
  return data.createPost;
}
```

## Files

| File                | Description             |
| ------------------- | ----------------------- |
| `index.html`        | HTML structure          |
| `styles.css`        | CSS styling             |
| `graphql-client.js` | GraphQL fetch functions |
| `app.js`            | Application logic       |

## Default Credentials

| Username   | Password    |
| ---------- | ----------- |
| andy25     | password123 |
| sarah_dev  | password123 |
| mike_codes | password123 |
