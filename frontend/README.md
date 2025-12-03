# Frontend - Simple HTML/JS Client

A simple frontend application that uses the Fetch API to interact with the GraphQL server.

## Features

- Display current user information
- List all posts for the current user
- Add new posts via GraphQL mutations
- Refresh data on demand
- Modern, responsive UI
- Error handling and loading states

## Project Structure

```
frontend/
├── index.html          # Main HTML structure
├── styles.css         # Styling
├── graphql-client.js  # GraphQL fetch API utilities
├── app.js            # Application logic
└── README.md         # This file
```

## Installation

No installation needed - this is a static HTML/JS application.

## Running the Frontend

**Prerequisites**: The GraphQL server must be running (see `../backend/README.md`)

```bash
# From root
npm run dev:frontend

# Or from this directory
npm run dev
```

The frontend will be available at `http://localhost:3000` (or check the terminal output).

## Alternative Methods

```bash
# Using http-server
npm run preview

# Or manually
npx serve -s .
npx http-server . -p 8000
```

## GraphQL Operations

The frontend uses the Fetch API to communicate with the GraphQL server at `http://localhost:4001`.

### Queries

- `getCurrentUser()` - Fetch current user with posts
- `getPostsByUser(userId)` - Fetch posts for a specific user

### Mutations

- `addPost(content)` - Create a new post

## Browser Compatibility

This app uses modern JavaScript features:
- Fetch API (supported in all modern browsers)
- Async/await
- ES6+ syntax
