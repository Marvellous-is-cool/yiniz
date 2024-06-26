const bcrypt = require("bcryptjs");
const { findUserByUsername, createUser } = require("../models/submitUser");

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/yap/login");
  }
};

const isLecturer = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (username === "Admin" && password === "AdminRichard") {
    req.session.user = { username: "Admin", role: "admin" };
    req.flash("success", "Successfully logged in as Admin");
    return res.redirect("/admin/yap/submissions");
  }

  try {
    const user = await findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      req.flash("success", "Successfully logged in");
      return res.redirect(302, `/yap/submit?username=${username}`);
    } else {
      req.flash("error", "Invalid credentials");
      res.redirect("/yap/login");
    }
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/yap/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, hashedPassword, "student");
    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/yap/login");
  } catch (error) {
    if (error.message === "Username already exists") {
      req.flash("error", "Username already exists");
      res.redirect("/yap/register");
    } else {
      next(error);
    }
  }
};

module.exports = { isAuthenticated, isLecturer, login, register };
