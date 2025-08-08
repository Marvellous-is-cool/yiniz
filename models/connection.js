const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Support for different database configurations
const getDatabaseConfig = () => {
  // If DATABASE_URL is provided (Render, Heroku style)
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      port: parseInt(url.port) || 3306,
    };
  }

  // Traditional environment variables
  return {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  };
};

// Create the connection pool to the database
const pool = mysql.createPool({
  ...getDatabaseConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
});

let isDbConnected = false;

pool
  .getConnection()
  .then((conn) => {
    isDbConnected = true;
    conn.release();
  })
  .catch((err) => {
    console.error(
      "Initial DB connection failed, using dummy data:",
      err.message
    );
    isDbConnected = false;
  });

pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err.message);
});

// Export the promise-based interface of the pool
module.exports = pool;
module.exports.isDbConnected = () => isDbConnected;
