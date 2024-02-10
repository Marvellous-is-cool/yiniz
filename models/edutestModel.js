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

module.exports = {
  getStudentByUsernameAndPassword,
  getRandomQuestions,
};
