# Backend - GraphQL Server

GraphQL server built with Apollo Server and TypeScript.

## Features

- GraphQL API with Query and Mutation support
- Interactive GraphQL Playground (GraphiQL)
- In-memory data store for Users and Posts
- Type-safe schema definitions with TypeScript
- Modular code organization

## Project Structure

```
backend/
├── src/
│   ├── types/          # TypeScript type definitions
│   ├── schema/         # GraphQL schema definitions
│   ├── resolvers/      # Resolver functions (Query, Mutation, User)
│   ├── data/           # Data source and initial data
│   └── server.ts       # Main server entry point
├── dist/               # Compiled JavaScript (generated)
├── tsconfig.json       # TypeScript configuration
└── nodemon.json        # Nodemon configuration
```

## Installation

From the root directory:
```bash
npm install
```

Or from this directory:
```bash
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
# From root
npm run dev:backend

# Or from this directory
npm run dev
```

The server will start on `http://localhost:4001`

### Production Mode
```bash
# From root
npm run build:backend
npm run start --workspace=@graphql-server/backend

# Or from this directory
npm run build
npm start
```

## GraphQL Playground

Once the server is running, visit `http://localhost:4001` in your browser to access the GraphQL Playground.

## API Endpoints

- **GraphQL Endpoint**: `http://localhost:4001`
- **GraphQL Playground**: `http://localhost:4001`

## Schema

- **User**: Represents a user with id, username, and posts
- **Post**: Represents a post with id, content, and userId
- **Query**: `currentUser`, `postsByUser(userId: String!)`
- **Mutation**: `addPost(content: String!)`

