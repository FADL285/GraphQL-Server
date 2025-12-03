import Database from "better-sqlite3";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";

// Ensure data directory exists
const dataDir = join(__dirname, "../../data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const dbPath = join(dataDir, "app.db");
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize schema immediately (tables must exist before prepared statements)
function initSchema(): void {
  const schemaPath = join(__dirname, "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");
  db.exec(schema);
}

// Initialize schema on module load
initSchema();

// Seed initial data if needed
export function initDatabase(): void {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
    count: number;
  };

  if (userCount.count === 0) {
    seedDatabase();
  }

  console.log("📦 Database initialized");
}

// Seed initial data
function seedDatabase(): void {
  const hashedPassword = bcrypt.hashSync("password123", 10);

  // Insert sample users
  const insertUser = db.prepare(
    "INSERT INTO users (id, username, password) VALUES (?, ?, ?)"
  );

  insertUser.run("user-1", "andy25", hashedPassword);
  insertUser.run("user-2", "sarah_dev", hashedPassword);
  insertUser.run("user-3", "mike_codes", hashedPassword);

  // Insert sample posts
  const insertPost = db.prepare(
    "INSERT INTO posts (id, content, user_id) VALUES (?, ?, ?)"
  );

  insertPost.run("post-1", "Hello world! This is my first post.", "user-1");
  insertPost.run("post-2", "Learning GraphQL is fun!", "user-1");
  insertPost.run("post-3", "Just deployed my first app 🚀", "user-2");
  insertPost.run("post-4", "Coffee and code - perfect combo ☕", "user-3");

  // Insert sample messages
  const insertMessage = db.prepare(
    "INSERT INTO messages (id, content, user_id) VALUES (?, ?, ?)"
  );

  insertMessage.run("msg-1", "Hey everyone! Welcome to the chat!", "user-1");
  insertMessage.run("msg-2", "Hi Andy! Great to be here.", "user-2");
  insertMessage.run("msg-3", "Hello folks! 👋", "user-3");

  console.log("🌱 Database seeded with initial data");
}

// User queries
export const userQueries = {
  findById: db.prepare("SELECT * FROM users WHERE id = ?"),
  findByUsername: db.prepare("SELECT * FROM users WHERE username = ?"),
  findAll: db.prepare("SELECT id, username, created_at FROM users"),
  create: db.prepare(
    "INSERT INTO users (id, username, password) VALUES (?, ?, ?)"
  ),
};

// Post queries
export const postQueries = {
  findById: db.prepare("SELECT * FROM posts WHERE id = ?"),
  findAll: db.prepare("SELECT * FROM posts ORDER BY created_at DESC"),
  findByUserId: db.prepare(
    "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC"
  ),
  create: db.prepare(
    "INSERT INTO posts (id, content, user_id) VALUES (?, ?, ?)"
  ),
  update: db.prepare(
    "UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
  ),
  delete: db.prepare("DELETE FROM posts WHERE id = ? AND user_id = ?"),
};

// Message queries
export const messageQueries = {
  findAll: db.prepare(
    "SELECT * FROM messages ORDER BY created_at DESC LIMIT ?"
  ),
  create: db.prepare(
    "INSERT INTO messages (id, content, user_id) VALUES (?, ?, ?)"
  ),
};
