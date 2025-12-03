/**
 * Main Application Logic
 */

// DOM Elements
const userInfoEl = document.getElementById("user-info");
const postsContainerEl = document.getElementById("posts-container");
const addPostFormEl = document.getElementById("add-post-form");
const postContentEl = document.getElementById("post-content");
const refreshBtnEl = document.getElementById("refresh-btn");
const messageEl = document.getElementById("message");

/**
 * Display user information
 */
async function displayUser() {
  try {
    userInfoEl.innerHTML = '<div class="loading">Loading user...</div>';
    const user = await getCurrentUser();

    if (!user) {
      userInfoEl.innerHTML = '<div class="error">No user found</div>';
      return;
    }

    userInfoEl.innerHTML = `
      <div class="user-card">
        <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
        <div class="user-details">
          <h3>${escapeHtml(user.username)}</h3>
          <p class="user-id">ID: ${escapeHtml(user.id)}</p>
        </div>
      </div>
    `;
  } catch (error) {
    userInfoEl.innerHTML = `<div class="error">Error: ${escapeHtml(error.message)}</div>`;
    console.error("Failed to load user:", error);
  }
}

/**
 * Display posts
 */
async function displayPosts() {
  try {
    postsContainerEl.innerHTML = '<div class="loading">Loading posts...</div>';
    const user = await getCurrentUser();

    if (!user) {
      postsContainerEl.innerHTML = '<div class="error">No user found</div>';
      return;
    }

    const posts = user.posts || [];

    if (posts.length === 0) {
      postsContainerEl.innerHTML = '<div class="empty-state">No posts yet. Add your first post below! 📝</div>';
      return;
    }

    postsContainerEl.innerHTML = posts
      .map(
        (post) => `
      <div class="post-card">
        <div class="post-content">${escapeHtml(post.content)}</div>
        <div class="post-meta">
          <span class="post-id">ID: ${escapeHtml(post.id)}</span>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    postsContainerEl.innerHTML = `<div class="error">Error: ${escapeHtml(error.message)}</div>`;
    console.error("Failed to load posts:", error);
  }
}

/**
 * Handle add post form submission
 */
async function handleAddPost(event) {
  event.preventDefault();

  const content = postContentEl.value.trim();

  if (!content) {
    showMessage("Please enter some content for your post.", "error");
    return;
  }

  try {
    // Disable form during submission
    const submitBtn = addPostFormEl.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding...";

    showMessage("Adding post...", "info");

    const newPost = await addPost(content);

    // Clear form
    postContentEl.value = "";

    showMessage("Post added successfully! 🎉", "success");

    // Refresh posts display
    await displayPosts();

    // Re-enable form
    submitBtn.disabled = false;
    submitBtn.textContent = "➕ Add Post";
  } catch (error) {
    showMessage(`Error: ${error.message}`, "error");
    const submitBtn = addPostFormEl.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = "➕ Add Post";
    console.error("Failed to add post:", error);
  }
}

/**
 * Show message to user
 */
function showMessage(text, type = "info") {
  messageEl.textContent = text;
  messageEl.className = `message message-${type}`;
  messageEl.style.display = "block";

  // Auto-hide success messages after 3 seconds
  if (type === "success") {
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
 * Initialize the application
 */
async function init() {
  // Load initial data
  await Promise.all([displayUser(), displayPosts()]);

  // Set up event listeners
  addPostFormEl.addEventListener("submit", handleAddPost);
  refreshBtnEl.addEventListener("click", async () => {
    refreshBtnEl.disabled = true;
    refreshBtnEl.textContent = "🔄 Refreshing...";
    await Promise.all([displayUser(), displayPosts()]);
    refreshBtnEl.disabled = false;
    refreshBtnEl.textContent = "🔄 Refresh";
    showMessage("Refreshed!", "success");
  });
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

