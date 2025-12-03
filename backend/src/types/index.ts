// Database row types
export interface UserRow {
  id: string;
  username: string;
  password: string;
  created_at: string;
}

export interface PostRow {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

// GraphQL types (without password)
export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

// Context type for resolvers
export interface Context {
  user: User | null;
}

// Subscription events
export const EVENTS = {
  MESSAGE_ADDED: "MESSAGE_ADDED",
} as const;
