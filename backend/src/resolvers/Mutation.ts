import { Context, Post } from "../types";

export const Mutation = {
  addPost: (
    _: unknown,
    { content }: { content: string },
    { data, currentUserId }: Context
  ): Post => {
    const newPost: Post = {
      id: `xyz-${Date.now()}`,
      content,
      userId: currentUserId,
    };
    data.posts.push(newPost);
    return newPost;
  },
};
