import { pagination } from "../utils/pagination";
import { userQueries, postQueries, messageQueries, pagedPostQueries } from "../db";
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
  posts: (_: unknown, args: { limit?: number; offset?: number }) => {
    const { limit, offset } = pagination(args.limit, args.offset);
    const rows = postQueries.findAll.all(limit, offset) as PostRow[];
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

  postsByUser: (_: unknown, args: { userId: string; limit?: number; offset?: number }) => {
    const { limit, offset } = pagination(args.limit, args.offset);
    const rows = pagedPostQueries.findByUserId.all(args.userId, limit, offset) as PostRow[];
    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  // Messages
  messages: (_: unknown, args: { limit?: number; offset?: number }) => {
    const { limit, offset } = pagination(args.limit, args.offset);
    const rows = messageQueries.findAll.all(limit, offset) as MessageRow[];
    // Reverse to get chronological order (oldest first)
    return rows.reverse().map((row) => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
    }));
  },
};
