import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    # Auth
    me: User

    # Users
    users: [User!]!
    user(id: ID!): User

    # Posts
    posts: [Post!]!
    post(id: ID!): Post
    postsByUser(userId: ID!): [Post!]!

    # Messages (chat)
    messages(limit: Int): [Message!]!
  }

  type Mutation {
    # Auth
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!

    # Posts CRUD (requires auth)
    createPost(content: String!): Post!
    updatePost(id: ID!, content: String!): Post!
    deletePost(id: ID!): Boolean!

    # Chat (requires auth)
    sendMessage(content: String!): Message!
  }

  type Subscription {
    # Real-time chat
    messageAdded: Message!
  }

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
`;
