const express = require("express");
const fileUpload = require("express-fileupload"); // Require express-fileupload module
const sessionManager = require("./middlewares/sessionManager");
const flash = require("./middlewares/flash");
// const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Set up session manager
app.use(sessionManager);

// Set up flash messages
app.use(flash);

// // Set up Helmet for security headers
// app.use(helmet());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware to pass flash messages to views
app.use((req, res, next) => {
  res.locals.flashMessages = req.session.flashMessages;
  req.session.flashMessages = null;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Configure file upload middleware
app.use(
  fileUpload({
    createParentPath: true, // Ensure the parent directory exists
    tempFileDir: "/temp", // Set temporary directory for file uploads
  })
);

// Define routes
app.use("/", require("./routes/clientRoutes/index"));

const authRoutes = require("./routes/serverRoutes/index");
app.use("/admin", authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
