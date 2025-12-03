import { Context } from "../types";

export const Query = {
  currentUser: (_: unknown, __: unknown, { data, currentUserId }: Context) => {
    const user = data.users.find((u) => u.id === currentUserId);
    return user;
  },
  postsByUser: (
    _: unknown,
    { userId }: { userId: string },
    { data }: Context
  ) => {
    const posts = data.posts.filter((p) => p.userId === userId);
    return posts;
  },
};
