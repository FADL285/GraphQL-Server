import { Context, User } from "../types";

export const UserResolvers = {
  posts: (parent: User, _: unknown, { data }: Context) => {
    const posts = data.posts.filter((p) => p.userId === parent.id);
    return posts;
  },
};
