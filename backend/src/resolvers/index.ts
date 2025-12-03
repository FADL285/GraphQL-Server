import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Subscription } from "./Subscription";
import { userQueries, postQueries } from "../db";
import type { UserRow, PostRow } from "../types";

// Field resolvers for nested types
const User = {
  posts: (parent: { id: string }) => {
    const rows = postQueries.findByUserId.all(parent.id) as PostRow[];
    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },
};

const Post = {
  author: (parent: { userId: string }) => {
    const row = userQueries.findById.get(parent.userId) as UserRow | undefined;
    if (!row) return null;
    return {
      id: row.id,
      username: row.username,
      createdAt: row.created_at,
    };
  },
};

const Message = {
  author: (parent: { userId: string }) => {
    const row = userQueries.findById.get(parent.userId) as UserRow | undefined;
    if (!row) return null;
    return {
      id: row.id,
      username: row.username,
      createdAt: row.created_at,
    };
  },
};

export const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Message,
};
