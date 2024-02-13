// edutestModel.js
const db = require("./connection");

// Function to fetch student by username (matric number) and password (first word of full name)
const getStudentByUsernameAndPassword = async (username, password) => {
  try {
    // Query the database to find a student with the given matric number and password
    const [rows] = await db.execute(
      "SELECT * FROM yiniz_teststudents WHERE matric_number = ? AND SUBSTRING_INDEX(full_name, ' ', 1) = ?",
      [username, password]
    );

    return rows[0]; // Return the first row (assuming only one student per matric number)
  } catch (error) {
    throw new Error(
      "Error fetching student by username and password: " + error.message
    );
  }
};

// Function to retrieve random questions from the database
const getRandomQuestions = async () => {
  try {
    // Query to retrieve 20 random questions
    const [rows] = await db.execute(
      "SELECT * FROM yiniz_etest ORDER BY RAND() LIMIT 20"
    );
    return rows; // Return the randomly selected questions
  } catch (error) {
    throw new Error("Error retrieving random questions: " + error.message);
  }
};

// Function to retrieve test sessions from the database
const getTestSessions = async () => {
  try {
    // Query to retrieve test sessions
    const [rows] = await db.execute("SELECT * FROM yiniz_test_sessions");
    return rows; // Return the test sessions
  } catch (error) {
    throw new Error("Error retrieving test sessions: " + error.message);
  }
};

// Function to retrieve scores of users from the database
const getUserScores = async (username) => {
  try {
    const [rows] = await db.execute(
      "SELECT scores FROM yiniz_teststudents WHERE matric_number = ?",
      [username]
    );
    return rows[0]; // Return the first row (assuming only one score per user)
  } catch (error) {
    throw new Error("Error retrieving user scores: " + error.message);
  }
};

// Function to update user's scores in the database
const updateUserScores = async (username, score) => {
  try {
    // Update user's scores in the database
    await db.execute(
      "UPDATE yiniz_teststudents SET scores = ? WHERE matric_number = ?",
      [score, username]
    );
  } catch (error) {
    throw new Error("Error updating user scores: " + error.message);
  }
};

// Function to retrieve user's data from the database
const getUserData = async (username) => {
  try {
    const [rows] = await db.execute(
      "SELECT matric_number AS username, full_name, scores FROM yiniz_teststudents WHERE matric_number = ?",
      [username]
    );
    return rows[0]; // Return the user's data
  } catch (error) {
    throw new Error("Error retrieving user's data: " + error.message);
  }
};

// Function to retrieve students with scores greater than 0
const getStudentsWithScoresGreaterThanZero = async () => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM yiniz_teststudents WHERE scores > 0"
    );
    return rows; // Return students with scores greater than 0
  } catch (error) {
    throw new Error(
      "Error retrieving students with scores greater than 0: " + error.message
    );
  }
};

module.exports = {
  getStudentByUsernameAndPassword,
  getRandomQuestions,
  getTestSessions,
  getUserScores,
  updateUserScores,
  getUserData,
  getStudentsWithScoresGreaterThanZero,
};
