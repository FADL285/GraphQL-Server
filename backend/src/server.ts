import express from "express";
import cors from "cors";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useServer } = require("graphql-ws/use/ws");
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { initDatabase } from "./db";
import { verifyToken, extractToken } from "./utils/auth";
import { userQueries } from "./db";
import type { Context, UserRow } from "./types";

// Initialize database
initDatabase();

// Create Express app
const app = express();

// Configure CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Create HTTP server
const httpServer = createServer(app);

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

// Set up WebSocket server with graphql-ws
const serverCleanup = useServer(
  {
    schema,
    context: async (ctx: { connectionParams?: Record<string, unknown> }) => {
      // Get token from connection params
      const token = ctx.connectionParams?.authToken as string | undefined;
      
      if (token) {
        const payload = verifyToken(token);
        if (payload) {
          const row = userQueries.findById.get(payload.userId) as UserRow | undefined;
          if (row) {
            return {
              user: {
                id: row.id,
                username: row.username,
                createdAt: row.created_at,
              },
            };
          }
        }
      }
      
      return { user: null };
    },
  },
  wsServer
);

// Create Apollo Server
const server = new ApolloServer({
  schema,
  context: async ({ req }): Promise<Context> => {
    // Extract user from JWT token
    const token = extractToken(req.headers.authorization);
    
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const row = userQueries.findById.get(payload.userId) as UserRow | undefined;
        if (row) {
          return {
            user: {
              id: row.id,
              username: row.username,
              createdAt: row.created_at,
            },
          };
        }
      }
    }
    
    return { user: null };
  },
  plugins: [
    // Proper shutdown for the HTTP server
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// Start server
const PORT = process.env.PORT || 4001;

async function startServer() {
  await server.start();
  
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: false, // We handle CORS at the Express level
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🔌 WebSocket ready at ws://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📊 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
