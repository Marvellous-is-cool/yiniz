// Import necessary modules
const bloggerModel = require("../models/bloggerModel");
const uploadFile = require("../helpers/uploadFile"); // Import the uploadFile helper

// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to login page
    req.flash("error", "You need to login first");
    res.redirect("/admin/blog/blogger/login");
  }
};

// Render the blogger page
exports.getBloggerPage = async (req, res) => {
  try {
    // Fetch blogger information and posts using session for blogger username
    const blogger = await bloggerModel.getBloggerByUsername(
      req.session.username
    );
    const bloggerPosts = await bloggerModel.getBloggerPostsByUsername(
      req.session.username
    );

    // Get the current hour
    const currentTime = new Date().getHours();

    // Get the greeting based on the current time
    const greeting = getGreeting(currentTime);

    console.log("Blogger Data:", blogger);
    console.log("Blogger Posts:", bloggerPosts);

    res.render("blog/blogger/blogger", {
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
};

// Login logic
exports.login = async (req, res) => {
  try {
    const { loginUsername, loginPassword } = req.body;

    console.log("Login Request Body:", req.body);

    // Check if the username and password match a record in the database
    const blogger = await bloggerModel.getUserByUsernameAndPassword(
      loginUsername,
      loginPassword
    );

    console.log("Login User:", blogger);

    if (blogger && blogger.username) {
      // Set the username in the session and redirect to blogger page
      req.session.username = blogger.username; // Set the username in the session
      res.redirect("/admin/blog/blogger/home");
    } else {
      // Incorrect username or password, redirect back to login with an error message
      req.flash("error", "Incorrect username or password");
      res.redirect("/admin/blog/blogger/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "An error occurred during login");
    res.redirect("/admin/blog/blogger/login");
  }
};

// Signup logic
exports.signup = async (req, res) => {
  try {
    const { regUsername, country, dob, regPassword } = req.body;

    console.log("Signup Request Body:", req.body);

    if (!regUsername || !country || !dob || !regPassword) {
      req.flash("error", "All fields are required");
      return res.redirect("/admin/blog/blogger/login");
    }

    // Call createUser method which will return the ID of the newly created user
    await bloggerModel.createUser(regUsername, regPassword, country, dob);

    // Set the username in the session and redirect to blogger home page
    req.session.username = regUsername;
    res.redirect("/admin/blog/blogger/home");
  } catch (error) {
    console.error("Error during signup:", error);
    req.flash("error", "An error occurred during signup");
    res.redirect("/admin/blog/blogger/login");
  }
};

// Create post logic
exports.createPost = async (req, res) => {
  try {
    const bloggerUsername = req.session.username; // Get blogger username from session
    const { title, content } = req.body; // Get post data from request body
    const image = req.files && req.files.image; // Get the uploaded image

    if (!image) {
      // If no image is uploaded, set a flash error message
      req.flash("error", "Image is required");
      return res.redirect("/admin/blog/blogger/new-post");
    }

    // Call the uploadFile helper to handle the image upload
    await uploadFile(image, req.body);

    // Call the controller method to create a new post
    await bloggerModel.createPost(
      bloggerUsername,
      title,
      content,
      req.body.image
    );

    // Redirect to blogger home page after post creation
    res.redirect("/admin/blog/blogger/home");
  } catch (error) {
    console.error("Error creating new post:", error);
    req.flash("error", "An error occurred while creating the post");
    res.redirect("/admin/blog/blogger/new-post");
  }
};

// Render the new post page
exports.renderNewPostPage = (req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Render the new post page with current year
    res.render("blog/blogger/new-post", { currentYear });
  } catch (error) {
    console.error("Error rendering new post page:", error);
    req.flash("error", "An error occurred while rendering the new post page");
    res.redirect("/admin/blog/blogger/home");
  }
};

// Logout logic
exports.logout = async (req, res) => {
  try {
    // Clear the username from the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/admin/blog/blogger/login"); // Redirect to login page
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.redirect("/admin/blog/blogger/home"); // Redirect to home page with error handling if needed
  }
};
