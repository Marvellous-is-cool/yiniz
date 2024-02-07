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
    "SELECT * FROM yiniz_bloggerposts WHERE blogger_username = ?",
    [username]
  );
  return rows; // Return all rows
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
const createPost = async (bloggerUsername, title, content, image) => {
  try {
    // Insert new post into the database
    const result = await db.query(
      "INSERT INTO yiniz_bloggerposts (blogger_username, title, content, image) VALUES (?, ?, ?, ?)",
      [bloggerUsername, title, content, image]
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
  createUser,
  createPost,
};
