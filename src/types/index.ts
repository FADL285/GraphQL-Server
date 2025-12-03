export interface User {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  content: string;
  userId: string;
}

export interface DataSource {
  users: User[];
  posts: Post[];
}

export interface Context {
  data: DataSource;
  currentUserId: string;
}
