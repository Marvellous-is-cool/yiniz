const db = require("./connection");

const createUser = async (username, password, role) => {
  try {
    const [result] = await db.execute(
      "INSERT INTO yiniz_submitusers (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );
    return result;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Username already exists");
    }
    throw error;
  }
};

const findUserByUsername = async (username) => {
  const [rows] = await db.execute(
    "SELECT * FROM yiniz_submitusers WHERE username = ?",
    [username]
  );
  return rows[0];
};

const findSubmissionByStudentNameAndLevel = async (student_name, level) => {
  const [rows] = await db.execute(
    "SELECT * FROM yiniz_submissions WHERE student_name = ? AND level = ?",
    [student_name, level]
  );
  return rows[0];
};

module.exports = {
  createUser,
  findUserByUsername,
  findSubmissionByStudentNameAndLevel,
};
