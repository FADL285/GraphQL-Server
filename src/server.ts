import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { data, currentUserId } from "./data";

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    currentUserId,
    data,
  }),
});

// Start the server
const PORT = process.env.PORT || 4001;

server
  .listen({ port: PORT })
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`📊 GraphQL Playground available at ${url}`);
  })
  .catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });
