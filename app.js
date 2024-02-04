const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const flash = require("./middlewares/flash");
const checkValidators = require("./middlewares/checkValidators");
const { check } = require("express-validator");
const connection = require("./models/connection");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();

// Set up express-session and express-flash
const sessionStore = new MySQLStore(
  {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  },
  connection
);

const sess = {
  secret: process.env.SESSION_SECRET || "keyboard cat",
  store: sessionStore,
  cookie: {},
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

app.use(session(sess));
app.use(flash);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  res.locals.flashMessages = req.session.flashMessages;
  req.session.flashMessages = null;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define routes
app.use("/", require("./routes/clientRoutes/index"));

const authRoutes = require("./routes/serverRoutes/index");
app.use("/admin", authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
