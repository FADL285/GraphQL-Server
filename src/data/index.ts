import { DataSource } from "../types";

// Shared data instance (singleton pattern)
// This ensures mutations persist across requests
export const data: DataSource = {
  posts: [
    {
      id: "xyz-1",
      content: "First Post - Hello world",
      userId: "abc-1",
    },
    {
      id: "xyz-2",
      content: "Second Post - Hello again",
      userId: "abc-1",
    },
    {
      id: "xyz-3",
      content: "Random Post",
      userId: "abc-2",
    },
  ],
  users: [
    {
      id: "abc-1",
      username: "andy25",
    },
    {
      id: "abc-2",
      username: "randomUser",
    },
  ],
};

export const currentUserId = "abc-1";
