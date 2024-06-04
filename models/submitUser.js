const db = require("./connection");

const createUser = async (username, password, role) => {
  const [result] = await db.execute(
    "INSERT INTO yiniz_submitUsers (username, password, role) VALUES (?, ?, ?)",
    [username, password, role]
  );
  return result;
};

const findUserByUsername = async (username) => {
  const [rows] = await db.execute(
    "SELECT * FROM yiniz_submitUsers WHERE username = ?",
    [username]
  );
  return rows[0];
};

module.exports = { createUser, findUserByUsername };
