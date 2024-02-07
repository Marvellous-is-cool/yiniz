// middlewares/BloggerAuth.js
const bloggerModel = require("../models/bloggerModel");

exports.requireLogin = async (req, res, next) => {
  if (req.session.username) {
    // Blogger is logged in, proceed to the next middleware
    next();
  } else {
    // Blogger is not logged in, redirect to the login page
    res.redirect("/admin/blog/blogger/login");
  }
};

// Add more authentication-related middleware as needed
