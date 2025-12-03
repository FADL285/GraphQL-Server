import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    currentUser: User
    postsByUser(userId: String!): [Post]
  }

  type Mutation {
    addPost(content: String!): Post
  }

  type User {
    id: ID!
    username: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    content: String!
    userId: ID!
  }
`;
