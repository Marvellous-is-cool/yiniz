const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const crypto = require("crypto");
const connection = require("../models/connection");

const sessionSecret =
  process.env.SESSION_SECRET || crypto.randomBytes(20).toString("hex");

const sessionStore = new MySQLStore(
  {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000,
  },
  connection
);

const sessionConfig = {
  secret: sessionSecret,
  store: sessionStore,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
  },
  resave: false,
  saveUninitialized: false,
};

module.exports = session(sessionConfig);
