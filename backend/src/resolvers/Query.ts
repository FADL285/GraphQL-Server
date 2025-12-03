import { userQueries, postQueries, messageQueries } from "../db";
import type { Context, UserRow, PostRow, MessageRow } from "../types";

export const Query = {
  // Auth - Get current user
  me: (_: unknown, __: unknown, { user }: Context) => {
    if (!user) return null;
    return user;
  },

  // Users
  users: () => {
    const rows = userQueries.findAll.all() as UserRow[];
    return rows.map((row) => ({
      id: row.id,
      username: row.username,
      createdAt: row.created_at,
    }));
  },

  user: (_: unknown, { id }: { id: string }) => {
    const row = userQueries.findById.get(id) as UserRow | undefined;
    if (!row) return null;
    return {
      id: row.id,
      username: row.username,
      createdAt: row.created_at,
    };
  },

  // Posts
  posts: () => {
    const rows = postQueries.findAll.all() as PostRow[];
    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  post: (_: unknown, { id }: { id: string }) => {
    const row = postQueries.findById.get(id) as PostRow | undefined;
    if (!row) return null;
    return {
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  postsByUser: (_: unknown, { userId }: { userId: string }) => {
    const rows = postQueries.findByUserId.all(userId) as PostRow[];
    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  // Messages
  messages: (_: unknown, { limit = 50 }: { limit?: number }) => {
    const rows = messageQueries.findAll.all(limit) as MessageRow[];
    // Reverse to get chronological order (oldest first)
    return rows.reverse().map((row) => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
    }));
  },
};
