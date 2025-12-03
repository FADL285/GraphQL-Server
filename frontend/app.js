/**
 * Main Application Logic
 * Demonstrates GraphQL queries and mutations with native fetch
 */

// DOM Elements
const authSectionEl = document.getElementById("auth-section");
const loggedInSectionEl = document.getElementById("logged-in-section");
const loginFormEl = document.getElementById("login-form");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const loggedUserEl = document.getElementById("logged-user");
const logoutBtnEl = document.getElementById("logout-btn");
const postsContainerEl = document.getElementById("posts-container");
const addPostFormEl = document.getElementById("add-post-form");
const postContentEl = document.getElementById("post-content");
const refreshBtnEl = document.getElementById("refresh-btn");
const messageEl = document.getElementById("message");

// Current user state
let currentUser = null;

/**
 * Handle login form submission
 */
async function handleLogin(event) {
  event.preventDefault();

  const username = usernameEl.value.trim();
  const password = passwordEl.value;

  if (!username || !password) {
    showMessage("Please enter username and password", "error");
    return;
  }

  try {
    showMessage("Logging in...", "info");

    // Call login mutation
    const result = await login(username, password);

    // Store token
    setToken(result.token);
    currentUser = result.user;

    // Update UI
    showLoggedInState();
    showMessage(`Welcome, ${currentUser.username}!`, "success");

    // Load posts
    await displayPosts();
  } catch (error) {
    showMessage(`Login failed: ${error.message}`, "error");
  }
}

/**
 * Handle logout
 */
function handleLogout() {
  clearToken();
  currentUser = null;
  showLoggedOutState();
  showMessage("Logged out", "info");
}

/**
 * Show logged in UI state
 */
function showLoggedInState() {
  authSectionEl.style.display = "none";
  loggedInSectionEl.style.display = "block";
  loggedUserEl.textContent = currentUser.username;
}

/**
 * Show logged out UI state
 */
function showLoggedOutState() {
  authSectionEl.style.display = "block";
  loggedInSectionEl.style.display = "none";
  postsContainerEl.innerHTML = "";
}

/**
 * Display all posts
 */
async function displayPosts() {
  try {
    postsContainerEl.innerHTML = '<div class="loading">Loading posts...</div>';

    // Query all posts
    const posts = await getPosts();

    if (posts.length === 0) {
      postsContainerEl.innerHTML =
        '<div class="empty-state">No posts yet. Be the first to post!</div>';
      return;
    }

    // Render posts with delete button for own posts
    postsContainerEl.innerHTML = posts
      .map((post) => {
        const isOwnPost = currentUser && post.author.id === currentUser.id;
        return `
          <div class="post-card" data-id="${post.id}">
            <div class="post-header">
              <span class="post-author">@${escapeHtml(post.author.username)}</span>
              ${isOwnPost ? `<button class="btn btn-danger btn-sm delete-btn" data-id="${post.id}">🗑️</button>` : ""}
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-meta">
              <span class="post-date">${formatDate(post.createdAt)}</span>
            </div>
          </div>
        `;
      })
      .join("");

    // Attach delete handlers
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", handleDeletePost);
    });
  } catch (error) {
    postsContainerEl.innerHTML = `<div class="error">Error: ${escapeHtml(error.message)}</div>`;
  }
}

/**
 * Handle add post form submission
 */
async function handleAddPost(event) {
  event.preventDefault();

  const content = postContentEl.value.trim();

  if (!content) {
    showMessage("Please enter some content", "error");
    return;
  }

  try {
    const submitBtn = addPostFormEl.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding...";

    // Call createPost mutation
    await createPost(content);

    postContentEl.value = "";
    showMessage("Post added!", "success");

    // Refresh posts
    await displayPosts();

    submitBtn.disabled = false;
    submitBtn.textContent = "➕ Add Post";
  } catch (error) {
    showMessage(`Error: ${error.message}`, "error");
    const submitBtn = addPostFormEl.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = "➕ Add Post";
  }
}

/**
 * Handle delete post button click
 */
async function handleDeletePost(event) {
  const postId = event.target.dataset.id;

  if (!confirm("Delete this post?")) return;

  try {
    event.target.disabled = true;
    event.target.textContent = "...";

    // Call deletePost mutation
    await deletePost(postId);

    showMessage("Post deleted!", "success");

    // Refresh posts
    await displayPosts();
  } catch (error) {
    showMessage(`Error: ${error.message}`, "error");
    event.target.disabled = false;
    event.target.textContent = "🗑️";
  }
}

/**
 * Show message to user
 */
function showMessage(text, type = "info") {
  messageEl.textContent = text;
  messageEl.className = `message message-${type}`;
  messageEl.style.display = "block";

  if (type === "success" || type === "info") {
    setTimeout(() => {
      messageEl.style.display = "none";
    }, 3000);
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Initialize the application
 */
function init() {
  // Set up event listeners
  loginFormEl.addEventListener("submit", handleLogin);
  logoutBtnEl.addEventListener("click", handleLogout);
  addPostFormEl.addEventListener("submit", handleAddPost);
  refreshBtnEl.addEventListener("click", async () => {
    refreshBtnEl.disabled = true;
    refreshBtnEl.textContent = "🔄...";
    await displayPosts();
    refreshBtnEl.disabled = false;
    refreshBtnEl.textContent = "🔄 Refresh";
  });
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
