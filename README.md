# GraphQL Server Workspace

A monorepo workspace containing a GraphQL server backend, simple HTML/JS frontend, and Vue 3 application.

## Project Structure

```
.
├── backend/          # GraphQL Server (Apollo Server + TypeScript)
├── frontend/          # Simple HTML/JS client (Fetch API)
├── vue/               # Vue 3 application
└── package.json       # Root workspace configuration
```

## Workspaces

This project uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage multiple packages:

- **`@graphql-server/backend`** - GraphQL API server
- **`@graphql-server/frontend`** - Simple HTML/JS frontend
- **`@graphql-server/vue`** - Vue 3 application

## Quick Start

### 1. Install Dependencies

Install all workspace dependencies:

```bash
npm install
```

This will install dependencies for all workspaces (backend, frontend, vue).

### 2. Start the Backend Server

```bash
npm run dev:backend
```

The GraphQL server will start on `http://localhost:4001`

- **GraphQL Endpoint**: `http://localhost:4001`
- **GraphQL Playground**: `http://localhost:4001`

### 3. Start a Frontend (choose one)

**Option A: Simple HTML/JS Frontend**
```bash
npm run dev:frontend
```
Visit `http://localhost:3000` (or the port shown in terminal)

**Option B: Vue App**
```bash
npm run dev:vue
```
Visit `http://localhost:5173` (or the port shown in terminal)

## Available Scripts

### Root Level (Workspace Commands)

```bash
# Development
npm run dev:backend    # Start GraphQL server
npm run dev:frontend   # Start simple HTML/JS frontend
npm run dev:vue        # Start Vue app

# Build
npm run build:backend  # Build backend TypeScript
npm run build:vue      # Build Vue app for production

# Install
npm install            # Install all workspace dependencies
```

### Workspace-Specific Commands

You can also run commands from within each workspace directory:

```bash
# Backend
cd backend
npm run dev            # Start server
npm run build          # Build TypeScript
npm start              # Run production build

# Frontend
cd frontend
npm run dev            # Start static server
npm run preview        # Alternative server

# Vue App
cd vue
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

## Workspace Details

### Backend (`backend/`)

GraphQL server built with:
- Apollo Server v3
- TypeScript
- In-memory data store

See [backend/README.md](./backend/README.md) for details.

### Frontend (`frontend/`)

Simple HTML/JavaScript client using:
- Fetch API
- Vanilla JavaScript
- No build step required

See [frontend/README.md](./frontend/README.md) for details.

### Vue App (`vue/`)

Vue 3 application with:
- Composition API
- TypeScript
- Vite

See [vue/README.md](./vue/README.md) for details.

## Development Workflow

### Typical Development Setup

1. **Terminal 1** - Start the backend:
   ```bash
   npm run dev:backend
   ```

2. **Terminal 2** - Start a frontend (choose one):
   ```bash
   # Simple frontend
   npm run dev:frontend
   
   # OR Vue app
   npm run dev:vue
   ```

3. Open your browser and test the application

### Testing the GraphQL API

You can test the GraphQL API directly using the GraphQL Playground:

1. Start the backend: `npm run dev:backend`
2. Visit `http://localhost:4001` in your browser
3. Use the interactive playground to test queries and mutations

## Example GraphQL Queries

### Get Current User
```graphql
query {
  currentUser {
    id
    username
    posts {
      id
      content
    }
  }
}
```

### Add a Post
```graphql
mutation {
  addPost(content: "My new post!") {
    id
    content
    userId
  }
}
```

## Schema

- **User**: Represents a user with id, username, and posts
- **Post**: Represents a post with id, content, and userId
- **Query**: `currentUser`, `postsByUser(userId: String!)`
- **Mutation**: `addPost(content: String!)`

## Notes

⚠️ **Deprecation Notice**: The backend uses `apollo-server` which is deprecated. For production use, consider migrating to `@apollo/server` (Apollo Server v4+).

## License

ISC
