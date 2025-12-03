# GraphQL Server Workspace

A full-stack monorepo demonstrating GraphQL with authentication, real-time subscriptions, and multiple frontend implementations.

## ✨ Features

- **🔐 Authentication** - JWT-based register/login system
- **📝 Posts CRUD** - Create, read, update, delete posts
- **💬 Real-time Chat** - GraphQL subscriptions with WebSocket
- **💾 Persistent Storage** - SQLite database
- **🎨 Multiple Frontends** - Simple HTML/JS and Vue 3 app

## Project Structure

```
.
├── backend/           # GraphQL Server (Apollo Server + Express + SQLite)
├── frontend/          # Simple HTML/JS client (Fetch API)
├── vue/               # Vue 3 application (Villus + Pinia + Tailwind)
└── package.json       # Root workspace configuration
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend Server

```bash
npm run dev:backend
```

The GraphQL server will start on:
- **GraphQL Endpoint**: `http://localhost:4001/graphql`
- **WebSocket (Subscriptions)**: `ws://localhost:4001/graphql`
- **GraphQL Playground**: `http://localhost:4001/graphql`

### 3. Start a Frontend

**Option A: Simple HTML/JS Frontend**
```bash
npm run dev:frontend
```
Visit `http://localhost:3000`

**Option B: Vue App (Full-featured)**
```bash
npm run dev:vue
```
Visit `http://localhost:5173`

## 🔑 Demo Accounts

| Username | Password |
|----------|----------|
| `andy25` | `password123` |
| `sarah_dev` | `password123` |
| `mike_codes` | `password123` |

## Available Scripts

```bash
# Development
npm run dev:backend    # Start GraphQL server with hot-reload
npm run dev:frontend   # Start simple HTML/JS frontend
npm run dev:vue        # Start Vue app with Vite

# Build
npm run build:backend  # Build backend TypeScript
npm run build:vue      # Build Vue app for production
```

## GraphQL Schema

### Types

```graphql
type User {
  id: ID!
  username: String!
  posts: [Post!]!
  createdAt: String!
}

type Post {
  id: ID!
  content: String!
  author: User!
  createdAt: String!
  updatedAt: String!
}

type Message {
  id: ID!
  content: String!
  author: User!
  createdAt: String!
}

type AuthPayload {
  token: String!
  user: User!
}
```

### Queries

```graphql
# Auth
me: User                           # Get current user (requires auth)

# Users
users: [User!]!                    # Get all users
user(id: ID!): User                # Get user by ID

# Posts
posts: [Post!]!                    # Get all posts
post(id: ID!): Post                # Get post by ID
postsByUser(userId: ID!): [Post!]! # Get posts by user

# Messages
messages(limit: Int): [Message!]!  # Get chat messages
```

### Mutations

```graphql
# Auth
register(username: String!, password: String!): AuthPayload!
login(username: String!, password: String!): AuthPayload!

# Posts (requires auth)
createPost(content: String!): Post!
updatePost(id: ID!, content: String!): Post!
deletePost(id: ID!): Boolean!

# Chat (requires auth)
sendMessage(content: String!): Message!
```

### Subscriptions

```graphql
# Real-time chat
messageAdded: Message!
```

## Example Usage

### Register a New User

```graphql
mutation {
  register(username: "newuser", password: "mypassword") {
    token
    user {
      id
      username
    }
  }
}
```

### Login

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

### Create a Post (with Auth Header)

```graphql
# HTTP Header: { "Authorization": "Bearer <token>" }

mutation {
  createPost(content: "Hello GraphQL!") {
    id
    content
    author {
      username
    }
  }
}
```

### Subscribe to Chat Messages

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

## Tech Stack

### Backend
- **Apollo Server v3** - GraphQL server
- **Express** - HTTP server
- **SQLite** (better-sqlite3) - Persistent database
- **JWT** (jsonwebtoken) - Authentication
- **graphql-ws** - WebSocket subscriptions
- **TypeScript** - Type safety

### Vue Frontend
- **Vue 3** - Composition API
- **Villus** - GraphQL client
- **Pinia** - State management
- **Vue Router** - Navigation
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Simple Frontend
- **Vanilla JavaScript** - No framework
- **Fetch API** - GraphQL requests
- **Pure CSS** - Styling

## Development

### Typical Development Setup

1. **Terminal 1** - Backend:
   ```bash
   npm run dev:backend
   ```

2. **Terminal 2** - Frontend:
   ```bash
   npm run dev:vue
   ```

### Database

The SQLite database is stored at `backend/src/db/app.db`. It's automatically created and seeded with demo data on first run.

To reset the database, simply delete the file:
```bash
rm backend/src/db/app.db
```

## Workspace Details

| Package | Description | Port |
|---------|-------------|------|
| `@graphql-server/backend` | GraphQL API server | 4001 |
| `@graphql-server/frontend` | Simple HTML/JS frontend | 3000 |
| `@graphql-server/vue` | Vue 3 application | 5173 |

For detailed documentation, see each workspace's README:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Vue App README](./vue/README.md)

## License

ISC
