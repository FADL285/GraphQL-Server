# Backend - GraphQL Server

GraphQL server built with Apollo Server, Express, and SQLite with JWT authentication and real-time subscriptions.

## Features

- **SQLite Database** - Persistent data storage with better-sqlite3
- **JWT Authentication** - Register, login, protected routes
- **Full CRUD for Posts** - Create, read, update, delete
- **Real-time Chat** - Public chat room with WebSocket subscriptions
- **TypeScript** - Full type safety

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── index.ts          # SQLite connection and queries
│   │   └── schema.sql        # Database schema
│   ├── schema/
│   │   └── index.ts          # GraphQL schema definitions
│   ├── resolvers/
│   │   ├── Query.ts          # Query resolvers
│   │   ├── Mutation.ts       # Mutation resolvers (auth + CRUD)
│   │   ├── Subscription.ts   # Subscription resolvers (chat)
│   │   └── index.ts          # Combined resolvers
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── utils/
│   │   └── auth.ts           # JWT helpers
│   ├── pubsub.ts             # PubSub for subscriptions
│   └── server.ts             # Express + Apollo Server
├── data/
│   └── app.db                # SQLite database (auto-created)
└── package.json
```

## Installation

From the root directory:
```bash
npm install
```

## Running the Server

### Development Mode
```bash
# From root
npm run dev:backend

# Or from this directory
npm run dev
```

The server will start on:
- **HTTP**: `http://localhost:4001/graphql`
- **WebSocket**: `ws://localhost:4001/graphql`
- **Playground**: `http://localhost:4001/graphql`

## GraphQL API

### Authentication

**Register:**
```graphql
mutation {
  register(username: "newuser", password: "password123") {
    token
    user {
      id
      username
    }
  }
}
```

**Login:**
```graphql
mutation {
  login(username: "andy25", password: "password123") {
    token
    user {
      id
      username
    }
  }
}
```

**Get Current User (requires auth):**
```graphql
query {
  me {
    id
    username
    posts {
      id
      content
    }
  }
}
```

### Posts CRUD

**Create Post (requires auth):**
```graphql
mutation {
  createPost(content: "My new post!") {
    id
    content
    author {
      username
    }
  }
}
```

**Update Post (requires auth, own posts only):**
```graphql
mutation {
  updatePost(id: "post-id", content: "Updated content") {
    id
    content
    updatedAt
  }
}
```

**Delete Post (requires auth, own posts only):**
```graphql
mutation {
  deletePost(id: "post-id")
}
```

**Get All Posts:**
```graphql
query {
  posts {
    id
    content
    author {
      username
    }
    createdAt
  }
}
```

### Chat / Subscriptions

**Send Message (requires auth):**
```graphql
mutation {
  sendMessage(content: "Hello everyone!") {
    id
    content
    author {
      username
    }
  }
}
```

**Subscribe to New Messages:**
```graphql
subscription {
  messageAdded {
    id
    content
    author {
      username
    }
    createdAt
  }
}
```

**Get Message History:**
```graphql
query {
  messages(limit: 50) {
    id
    content
    author {
      username
    }
    createdAt
  }
}
```

## Authentication Header

For protected operations, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

In GraphQL Playground, add this to HTTP Headers:
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

## Default Users

The database is seeded with sample users (all use password: `password123`):

| Username | Password |
|----------|----------|
| andy25 | password123 |
| sarah_dev | password123 |
| mike_codes | password123 |

## WebSocket Connection (for Subscriptions)

To connect with authentication, pass the token in connectionParams:

```javascript
const wsClient = createClient({
  url: 'ws://localhost:4001/graphql',
  connectionParams: {
    authToken: '<your-jwt-token>'
  }
});
```
