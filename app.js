const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const crypto = require("crypto");
const dotenv = require("dotenv");
const connection = require("./models/connection");
const flashMiddleware = require("./middlewares/flash"); // Import flash middleware

dotenv.config();

// Import routes
const clientRoutes = require("./routes/clientRoutes/index");
const authRoutes = require("./routes/serverRoutes/index");

const app = express();

// Session configuration
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
    // secure: process.env.NODE_ENV === "development" ? false : true,
    secure: false,
  },
  resave: false,
  saveUninitialized: false,
};
// Set up session middleware
app.use(session(sessionConfig));

// Set up flash middleware
app.use(flashMiddleware);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// Configure file upload middleware
app.use(
  fileUpload({
    createParentPath: true,
    tempFileDir: "/temp",
  })
);

// Define routes
app.use("/", clientRoutes);
app.use("/admin", authRoutes);

// // 404
// app.use((req, res, next) => {
//   res.status(404).render("404");
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
