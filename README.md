# GraphQL Server

A simple GraphQL server built with Apollo Server and TypeScript, following the Vue Mastery tutorial.

## Features

- GraphQL API with Query and Mutation support
- Interactive GraphQL Playground (GraphiQL)
- In-memory data store for Users and Posts
- Type-safe schema definitions with TypeScript
- Modular code organization with separated concerns
- TypeScript for better type safety and developer experience

## Installation

```bash
npm install
```

## Project Structure

```
src/
├── types/          # TypeScript type definitions
├── schema/         # GraphQL schema definitions
├── resolvers/      # Resolver functions (Query, Mutation, User)
├── data/           # Data source and initial data
└── server.ts       # Main server entry point
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

This uses `ts-node` to run TypeScript directly with hot-reload via nodemon.

### Production Mode

```bash
npm run build  # Compile TypeScript to JavaScript
npm start      # Run the compiled server
```

The server will start on `http://localhost:4001`

## GraphQL Playground

Once the server is running, visit `http://localhost:4001` in your browser to access the GraphQL Playground. This interactive tool allows you to:

- Explore the schema
- Write and test queries
- Execute mutations
- View documentation

## Example Queries

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

### Get Posts by User

```graphql
query {
  postsByUser(userId: "abc-1") {
    id
    content
    userId
  }
}
```

## Example Mutations

### Add a New Post

```graphql
mutation {
  addPost(content: "My new post!") {
    id
    content
    userId
  }
}
```

## Testing with Fetch API

You can also test the API using the browser console:

```javascript
fetch("http://localhost:4001", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "query { currentUser { id username } }",
  }),
})
  .then((resp) => resp.json())
  .then((data) => console.log(data));
```

## Schema

- **User**: Represents a user with id, username, and posts
- **Post**: Represents a post with id, content, and userId
- **Query**: `currentUser`, `postsByUser(userId: String!)`
- **Mutation**: `addPost(content: String!)`

## Frontend Application

A simple frontend client is included in the `frontend/` directory that demonstrates how to use the Fetch API to interact with the GraphQL server.

### Running the Frontend

**Step 1: Start the GraphQL Server** (in one terminal)

```bash
npm run dev
```

The server will start on `http://localhost:4001`

**Step 2: Start the Frontend** (in a new terminal)

```bash
# Option 1: Using serve (recommended)
npx serve -s frontend
# Option 2: Using http-server
npx http-server frontend -p 8000
```

**Step 3: Open in Browser**

- Visit `http://localhost:3000` (if using `serve`) or `http://localhost:8000` (if using http-server)
- The app will automatically load user data and posts

**Note:** You need both the server and frontend running simultaneously in separate terminals.

The frontend includes:

- User information display
- Posts listing
- Add new post functionality
- Modern, responsive UI

See `frontend/README.md` for more details.

## Note

⚠️ **Deprecation Notice**: This project uses `apollo-server` which is deprecated. For production use, consider migrating to `@apollo/server` (Apollo Server v4+).
