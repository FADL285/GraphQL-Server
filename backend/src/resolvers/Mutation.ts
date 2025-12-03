import { AuthenticationError, UserInputError } from "apollo-server-express";
import { userQueries, postQueries, messageQueries } from "../db";
import {
  generateToken,
  hashPassword,
  comparePassword,
  generateId,
} from "../utils/auth";
import { pubsub, EVENTS } from "../pubsub";
import type { Context, UserRow, PostRow, MessageRow } from "../types";

export const Mutation = {
  // ============ AUTH ============

  register: (
    _: unknown,
    { username, password }: { username: string; password: string }
  ) => {
    // Validate input
    if (username.length < 3) {
      throw new UserInputError("Username must be at least 3 characters");
    }
    if (password.length < 6) {
      throw new UserInputError("Password must be at least 6 characters");
    }

    // Check if username exists
    const existing = userQueries.findByUsername.get(username);
    if (existing) {
      throw new UserInputError("Username already taken");
    }

    // Create user
    const id = generateId("user");
    const hashedPassword = hashPassword(password);
    userQueries.create.run(id, username, hashedPassword);

    // Get created user
    const row = userQueries.findById.get(id) as UserRow;
    const user = {
      id: row.id,
      username: row.username,
      createdAt: row.created_at,
    };

    // Generate token
    const token = generateToken({ userId: user.id, username: user.username });

    return { token, user };
  },

  login: (
    _: unknown,
    { username, password }: { username: string; password: string }
  ) => {
    // Find user
    const row = userQueries.findByUsername.get(username) as UserRow | undefined;
    if (!row) {
      throw new AuthenticationError("Invalid username or password");
    }

    // Check password
    if (!comparePassword(password, row.password)) {
      throw new AuthenticationError("Invalid username or password");
    }

    const user = {
      id: row.id,
      username: row.username,
      createdAt: row.created_at,
    };

    // Generate token
    const token = generateToken({ userId: user.id, username: user.username });

    return { token, user };
  },

  // ============ POSTS CRUD ============

  createPost: (_: unknown, { content }: { content: string }, { user }: Context) => {
    if (!user) {
      throw new AuthenticationError("You must be logged in to create a post");
    }

    if (!content.trim()) {
      throw new UserInputError("Post content cannot be empty");
    }

    const id = generateId("post");
    postQueries.create.run(id, content.trim(), user.id);

    const row = postQueries.findById.get(id) as PostRow;
    return {
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  updatePost: (
    _: unknown,
    { id, content }: { id: string; content: string },
    { user }: Context
  ) => {
    if (!user) {
      throw new AuthenticationError("You must be logged in to update a post");
    }

    if (!content.trim()) {
      throw new UserInputError("Post content cannot be empty");
    }

    // Check if post exists and belongs to user
    const existing = postQueries.findById.get(id) as PostRow | undefined;
    if (!existing) {
      throw new UserInputError("Post not found");
    }
    if (existing.user_id !== user.id) {
      throw new AuthenticationError("You can only update your own posts");
    }

    // Update post
    postQueries.update.run(content.trim(), id, user.id);

    const row = postQueries.findById.get(id) as PostRow;
    return {
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  deletePost: (_: unknown, { id }: { id: string }, { user }: Context) => {
    if (!user) {
      throw new AuthenticationError("You must be logged in to delete a post");
    }

    // Check if post exists and belongs to user
    const existing = postQueries.findById.get(id) as PostRow | undefined;
    if (!existing) {
      throw new UserInputError("Post not found");
    }
    if (existing.user_id !== user.id) {
      throw new AuthenticationError("You can only delete your own posts");
    }

    // Delete post
    postQueries.delete.run(id, user.id);
    return true;
  },

  // ============ CHAT ============

  sendMessage: (
    _: unknown,
    { content }: { content: string },
    { user }: Context
  ) => {
    if (!user) {
      throw new AuthenticationError("You must be logged in to send messages");
    }

    if (!content.trim()) {
      throw new UserInputError("Message cannot be empty");
    }

    const id = generateId("msg");
    messageQueries.create.run(id, content.trim(), user.id);

    const row = messageQueries.findAll.all(1)[0] as MessageRow;
    const message = {
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: row.created_at,
    };

    // Publish to subscribers
    pubsub.publish(EVENTS.MESSAGE_ADDED, { messageAdded: message });

    return message;
  },
};
