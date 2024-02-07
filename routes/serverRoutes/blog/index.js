// Import necessary modules
const express = require("express");
const router = express.Router();
const checkBloggerValidator = require("../../../middlewares/checkBloggerValidator");
const bloggerModel = require("../../../models/bloggerModel");
const blogController = require("../../../controllers/blogController");
const uploadFile = require("../../../helpers/uploadFile");

// Your route definitions go here

router.get("/home", async (req, res) => {
  try {
    // Ensure username is defined in the session
    if (!req.session.username) {
      throw new Error("Blogger username is not defined in session");
    }

    const username = req.session.username;

    // Fetch blogger information and posts using session for blogger username
    const blogger = await bloggerModel.getBloggerByUsername(username);
    const bloggerPosts = await bloggerModel.getBloggerPostsByUsername(username);

    // Get the current hour
    const currentTime = new Date().getHours();

    // Get the greeting based on the current time
    const greeting = getGreeting(currentTime);

    console.log("Blogger Data:", blogger);
    console.log("Blogger Posts:", bloggerPosts);

    res.render("blog/blogger/home", {
      currentUser: blogger,
      greeting,
      posts: bloggerPosts,
      currentYear: new Date().getFullYear(),
    });
  } catch (error) {
    console.error("Error fetching blogger data:", error);
    req.flash("error", "An error occurred while loading the blogger page");
    res.redirect("/admin/blog/blogger/login");
  }
});

// Define the getGreeting function
const getGreeting = (currentTime) => {
  // Define your greeting logic here based on the current time
  // For example:
  if (currentTime < 12) {
    return "Good morning!";
  } else if (currentTime < 18) {
    return "Good afternoon!";
  } else {
    return "Good evening!";
  }
};

router.get("/login", (req, res) => {
  res.render("blog/blogger/login", { flashMessages: req.flash("error") });
});

router.post(
  "/login",
  checkBloggerValidator.loginValidators,
  checkBloggerValidator.validate,
  async (req, res, next) => {
    try {
      console.log("Login Request Body:", req.body);

      // Call the login controller method and await its result
      const blogger = await blogController.login(req, res);
      console.log("Blogger is:", blogger);

      // Check if the blogger object exists and has the username property
      if (blogger && blogger.username) {
        // If login is successful, store the username in the session
        req.session.username = blogger.username;
        console.log("stored sucessfully");

        console.log("now redirecting....");

        // Redirect to blogger home page after successful login
        return res.redirect("/admin/blog/blogger/home");
      } else {
        // If login fails, redirect to login page with an error message
        req.flash("error", "Incorrect username or password");
        return res.redirect("/admin/blog/blogger/login");
      }
    } catch (error) {
      console.error("Error during login:", error);
      req.flash("error", "An error occurred during login");
      return res.redirect("/admin/blog/blogger/login");
    }
  }
);

// Signup route
router.get("/signup", (req, res) => {
  res.render("blog/blogger/signup", { flashMessages: req.flash("error") });
});

router.post(
  "/signup",
  checkBloggerValidator.signupValidators,
  checkBloggerValidator.validate,
  async (req, res, next) => {
    try {
      console.log("Signup Request Body:", req.body);

      // Call the signup controller method
      await blogController.signup(req, res); // Call the signup function

      // If signup is successful, store the username in the session
      req.session.username = req.body.username; // Assuming the username is available in the request body

      // Redirect to blogger home page after successful signup
      res.redirect("/admin/blog/blogger/home");
    } catch (error) {
      console.error("Error during signup:", error);
      req.flash("error", "An error occurred during signup");
      res.redirect("/admin/blog/blogger/signup");
    }
  }
);

// Define route for rendering the new post form
router.get("/new-post", blogController.isAuthenticated, (req, res) => {
  res.render("blog/blogger/new-post", {
    currentYear: new Date().getFullYear(),
  }); // Pass currentYear to the view
});

// Define route for handling submission of new post form
router.post("/new-post", blogController.isAuthenticated, async (req, res) => {
  try {
    const bloggerUsername = req.session.username; // Get blogger username from session
    const { title, content } = req.body; // Get post data from request body
    let image;

    // Check if an image file was uploaded
    if (req.files && req.files.image) {
      image = req.files.image; // Get the uploaded image file
    } else {
      // If no image was uploaded, redirect with an error message
      req.flash("error", "Please upload an image");
      return res.redirect("/admin/blog/blogger/new-post");
    }

    // Call the controller method to create a new post and upload the image
    await blogController.createPost(bloggerUsername, title, content, image);

    // Redirect to blogger home page after post creation
    res.redirect("/admin/blog/blogger/home");
  } catch (error) {
    console.error("Error creating new post:", error);
    req.flash("error", "An error occurred while creating the post");
    res.redirect("/admin/blog/blogger/home");
  }
});

router.get("/logout", blogController.logout);

module.exports = router;
