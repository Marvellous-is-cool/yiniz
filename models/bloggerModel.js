// Import necessary modules
const db = require("./connection");

// Fetch user by username and password
const getUserByUsernameAndPassword = async (username, password) => {
  // Query the database to find a blogger with the given username and password
  const [rows] = await db.query(
    "SELECT * FROM yiniz_bloggers WHERE username = ? AND password = ?",
    [username, password]
  );
  return rows[0]; // Return the first row (assuming only one blogger per username/password)
};

// Fetch blogger information by username
const getBloggerByUsername = async (username) => {
  // Fetch blogger information from the database
  const [rows] = await db.query(
    "SELECT * FROM yiniz_bloggers WHERE username = ?",
    [username]
  );
  return rows[0]; // Return the first row (assuming only one blogger per username)
};

// Fetch blogger posts by username
const getBloggerPostsByUsername = async (username) => {
  // Fetch blogger posts from the database
  const [rows] = await db.query(
    "SELECT bp.* FROM yiniz_bloggerposts bp WHERE bp.blogger_username = ?",
    [username]
  );
  return rows; // Return all rows
};

// Fetch all posts
const getAllPosts = async () => {
  try {
    // Query the database to fetch all posts
    const [rows] = await db.query("SELECT * FROM yiniz_bloggerposts");
    return rows; // Return all rows
  } catch (error) {
    throw new Error("Error fetching all posts: " + error.message);
  }
};

// Fetch blogger ID by username
const getBloggerIdByUsername = async (username) => {
  // Fetch blogger ID from the database
  const [rows] = await db.query(
    "SELECT id FROM yiniz_bloggers WHERE username = ?",
    [username]
  );
  return rows[0].id; // Return the ID of the blogger
};

// Fetch post by ID
const getPostById = async (postId) => {
  // Fetch post from the database using post ID
  const [rows] = await db.query(
    "SELECT * FROM yiniz_bloggerposts WHERE id = ?",
    [postId]
  );
  return rows[0]; // Return the first row (assuming only one post per ID)
};

// Like a post
const likePost = async (postId, ipAddress) => {
  // Update the post in the database to increment likes
  await db.query(
    "UPDATE yiniz_bloggerposts SET likes = likes + 1 WHERE id = ?",
    [postId]
  );

  // Record the IP address of the user who liked the post
  await db.query(
    "INSERT INTO yiniz_post_likes (post_id, ip_address) VALUES (?, ?)",
    [postId, ipAddress]
  );
};

// Dislike a post
const dislikePost = async (postId, ipAddress) => {
  // Update the post in the database to decrement likes
  await db.query(
    "UPDATE yiniz_bloggerposts SET likes = likes - 1 WHERE id = ?",
    [postId]
  );

  // Record the IP address of the user who disliked the post
  await db.query(
    "INSERT INTO yiniz_post_dislikes (post_id, ip_address) VALUES (?, ?)",
    [postId, ipAddress]
  );
};

// Check if a user has already liked a post
const hasUserLikedPost = async (ipAddress, postId) => {
  const [rows] = await db.query(
    "SELECT * FROM yiniz_post_likes WHERE ip_address = ? AND post_id = ?",
    [ipAddress, postId]
  );
  return rows.length > 0;
};

// Check if a user has already disliked a post
const hasUserDislikedPost = async (ipAddress, postId) => {
  const [rows] = await db.query(
    "SELECT * FROM yiniz_post_dislikes WHERE ip_address = ? AND post_id = ?",
    [ipAddress, postId]
  );
  return rows.length > 0;
};

// Create a new user
const createUser = async (username, password, country, dob) => {
  try {
    // Insert new user into the database
    const result = await db.query(
      "INSERT INTO yiniz_bloggers (username, password, country, dob) VALUES (?, ?, ?, ?)",
      [username, password, country, dob]
    );

    return result.insertId; // Return the ID of the newly created user
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

// Create a new post
const createPost = async (bloggerUsername, title, content, image, category) => {
  try {
    // Insert new post into the database
    const result = await db.query(
      "INSERT INTO yiniz_bloggerposts (blogger_username, title, content, image, category) VALUES (?, ?, ?, ?, ?)",
      [bloggerUsername, title, content, image, category]
    );

    return result.insertId; // Return the ID of the newly created post
  } catch (error) {
    throw new Error("Error creating post: " + error.message);
  }
};

// Export all functions
module.exports = {
  getUserByUsernameAndPassword,
  getBloggerByUsername,
  getBloggerPostsByUsername,
  getBloggerIdByUsername,
  getPostById,
  likePost,
  dislikePost,
  hasUserLikedPost,
  hasUserDislikedPost,
  createUser,
  createPost,
  getAllPosts,
};
