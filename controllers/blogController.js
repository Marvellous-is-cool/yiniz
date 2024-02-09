// Import necessary modules
const bloggerModel = require("../models/bloggerModel");
const uploadFile = require("../helpers/uploadFile"); // Import the uploadFile helper

// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    console.log("BLOG CONTROLLER: Session found, user saved sucessfully");
    console.log("The session: ", req.session);
    return next(); // Add return here
  } else {
    // User is not authenticated, redirect to login page
    req.flash("error", "You need to login first");
    console.log("BLOG CONTROLLER: Session not found");
    console.log("The session: ", req.session);
    return res.redirect("/admin/blog/blogger/login"); // Add return here
  }
};

// Render the blogger page (admin)
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

    console.log("BLOGCONTROLLER: Blogger Data:", blogger);
    console.log("BLOGCONTROLLER: Blogger Posts:", bloggerPosts);

    return res.render("blog/blogger/blogger", {
      // Add return here
      currentUser: blogger,
      greeting,
      posts: bloggerPosts,
      currentYear: new Date().getFullYear(),
    });
  } catch (error) {
    console.error("BLOGCONTROLLER: Error fetching blogger data:", error);
    req.flash("error", "An error occurred while loading the blogger page");
    return res.redirect("/admin/blog/blogger/login"); // Add return here
  }
};

exports.getAllPostsPage = async (req, res) => {
  try {
    // Fetch all posts
    const allPosts = await bloggerModel.getAllPosts();

    // Render the view with all posts data
    return res.render("blog/index", {
      posts: allPosts,
      currentYear: new Date().getFullYear(),
    });
  } catch (error) {
    console.error("BLOGCONTROLLER: Error fetching all posts:", error);
    req.flash("error", "An error occurred while loading all posts page");
    return res.redirect("/"); // Redirect to home page or handle the error appropriately
  }
};

// Login logic
exports.login = async (req, res) => {
  try {
    const { loginUsername, loginPassword } = req.body;

    console.log("BLOGCONTROLLER: Login Request Body:", req.body);

    // Check if the username and password match a record in the database
    const blogger = await bloggerModel.getUserByUsernameAndPassword(
      loginUsername,
      loginPassword
    );

    console.log("BLOGCONTROLLER: Login User:", blogger);

    if (blogger && blogger.username) {
      // Set the username in the session and redirect to blogger page
      req.session.username = blogger.username;
      console.log(
        "BLOGCONTROLLER: User logged in successfully. Session username set to:",
        req.session.username
      );
      console.log("BLOGCONTROLLER: Session:", req.session);
      return res.redirect("/admin/blog/blogger/home"); // Add return here
    } else {
      // Incorrect username or password, redirect back to login with an error message
      req.flash("error", "Incorrect username or password");
      return res.redirect("/admin/blog/blogger/login"); // Add return here
    }
  } catch (error) {
    console.error("BLOGCONTROLLER: Error during login:", error);
    req.flash("error", "An error occurred during login");
    return res.redirect("/admin/blog/blogger/login"); // Add return here
  }
};

// Signup logic
exports.signup = async (req, res) => {
  try {
    const { regUsername, country, dob, regPassword } = req.body;

    if (!regUsername || !country || !dob || !regPassword) {
      req.flash("error", "All fields are required");
      return res.redirect("/admin/blog/blogger/login");
    }

    await bloggerModel.createUser(regUsername, regPassword, country, dob);

    req.session.username = regUsername;
    return res.redirect("/admin/blog/blogger/home");
  } catch (error) {
    console.error("BLOGCONTROLLER: Error during signup:", error);
    req.flash("error", "An error occurred during signup");
    return res.redirect("/admin/blog/blogger/login");
  }
};

// Fetch post by ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await bloggerModel.getPostById(postId);

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("BLOGCONTROLLER: Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create post logic
exports.createPost = async (req, res) => {
  try {
    const bloggerUsername = req.session.username; // Get blogger username from session
    const { title, content, category } = req.body; // Get post data from request body
    const image = req.files && req.files.image; // Get the uploaded image

    if (!image) {
      // If no image is uploaded, set a flash error message
      req.flash("error", "Image is required");
      return res.redirect("/admin/blog/blogger/new-post"); // Add return here
    }

    // Call the uploadFile helper to handle the image upload
    await uploadFile(image, req.body);

    // Call the controller method to create a new post
    await bloggerModel.createPost(
      bloggerUsername,
      title,
      content,
      req.body.image,
      category
    );

    // Redirect to blogger home page after post creation
    return res.redirect("/admin/blog/blogger/home"); // Add return here
  } catch (error) {
    console.error("BLOGCONTROLLER: Error creating new post:", error);
    req.flash("error", "An error occurred while creating the post");
    return res.redirect("/admin/blog/blogger/new-post"); // Add return here
  }
};

// Render the new post page
exports.renderNewPostPage = (req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Render the new post page with current year
    return res.render("blog/blogger/new-post", { currentYear }); // Add return here
  } catch (error) {
    console.error("BLOGCONTROLLER: Error rendering new post page:", error);
    req.flash("error", "An error occurred while rendering the new post page");
    return res.redirect("/admin/blog/blogger/home"); // Add return here
  }
};

// Logout logic
exports.logout = async (req, res) => {
  try {
    // Clear the username from the session
    req.session.destroy((err) => {
      if (err) {
        console.error("BLOGCONTROLLER: Error destroying session:", err);
      }
      return res.redirect("/admin/blog/blogger/login"); // Add return here
    });
  } catch (error) {
    console.error("BLOGCONTROLLER: Error during logout:", error);
    return res.redirect("/admin/blog/blogger/home"); // Add return here
  }
};
