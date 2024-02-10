// Import necessary modules
const bloggerModel = require("../models/bloggerModel");
const uploadFile = require("../helpers/uploadFile"); // Import the uploadFile helper

// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    console.log("BLOG CONTROLLER: Session found, user saved successfully");
    console.log("The session: ", req.session);
    return next();
  } else {
    // User is not authenticated, redirect to login page
    req.flash("error", "You need to login first");
    console.log("BLOG CONTROLLER: Session not found");
    console.log("The session: ", req.session);
    return res.redirect("/admin/blog/blogger/login");
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

    console.log("BLOG CONTROLLER: Blogger Data:", blogger);
    console.log("BLOG CONTROLLER: Blogger Posts:", bloggerPosts);

    return res.render("blog/blogger/blogger", {
      currentUser: blogger,
      greeting,
      posts: bloggerPosts,
      currentYear: new Date().getFullYear(),
    });
  } catch (error) {
    console.error("BLOG CONTROLLER: Error fetching blogger data:", error);
    req.flash("error", "An error occurred while loading the blogger page");
    return res.redirect("/admin/blog/blogger/login");
  }
};

// Render the page with all posts
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
    console.error("BLOG CONTROLLER: Error fetching all posts:", error);
    req.flash("error", "An error occurred while loading all posts page");
    return res.redirect("/"); // Redirect to home page or handle the error appropriately
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    await bloggerModel.likePost(postId);
    const updatedPost = await bloggerModel.getPostById(postId);
    res.json(updatedPost);
    console.log("BLOG CONTROLLER: Post liked successfully");
  } catch (error) {
    console.error("BLOG CONTROLLER: Error liking post:", error);
    res.status(500).json({ error: "An error occurred while liking the post" });
  }
};

// Dislike a post
exports.dislikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    await bloggerModel.dislikePost(postId);
    const updatedPost = await bloggerModel.getPostById(postId);
    res.json(updatedPost);
    console.log("BLOG CONTROLLER: Post disliked successfully");
  } catch (error) {
    console.error("BLOG CONTROLLER: Error disliking post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while disliking the post" });
  }
};

// Login logic
exports.login = async (req, res) => {
  try {
    const { loginUsername, loginPassword } = req.body;

    console.log("BLOG CONTROLLER: Login Request Body:", req.body);

    // Check if the username and password match a record in the database
    const blogger = await bloggerModel.getUserByUsernameAndPassword(
      loginUsername,
      loginPassword
    );

    console.log("BLOG CONTROLLER: Login User:", blogger);

    if (blogger && blogger.username) {
      // Set the username in the session and redirect to blogger page
      req.session.username = blogger.username;
      console.log(
        "BLOG CONTROLLER: User logged in successfully. Session username set to:",
        req.session.username
      );
      console.log("BLOG CONTROLLER: Session:", req.session);
      return res.redirect("/admin/blog/blogger/home");
    } else {
      // Incorrect username or password, redirect back to login with an error message
      req.flash("error", "Incorrect username or password");
      return res.redirect("/admin/blog/blogger/login");
    }
  } catch (error) {
    console.error("BLOG CONTROLLER: Error during login:", error);
    req.flash("error", "An error occurred during login");
    return res.redirect("/admin/blog/blogger/login");
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
    console.error("BLOG CONTROLLER: Error during signup:", error);
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
    console.error("BLOG CONTROLLER: Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create post logic
exports.createPost = async (req, res) => {
  try {
    const bloggerUsername = req.session.username;
    const { title, content, category } = req.body;
    const image = req.files && req.files.image;

    if (!image) {
      req.flash("error", "Image is required");
      return res.redirect("/admin/blog/blogger/new-post");
    }

    await uploadFile(image, req.body);

    await bloggerModel.createPost(
      bloggerUsername,
      title,
      content,
      req.body.image,
      category
    );

    return res.redirect("/admin/blog/blogger/home");
  } catch (error) {
    console.error("BLOG CONTROLLER: Error creating new post:", error);
    req.flash("error", "An error occurred while creating the post");
    return res.redirect("/admin/blog/blogger/new-post");
  }
};

// Render the new post page
exports.renderNewPostPage = (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    return res.render("blog/blogger/new-post", { currentYear });
  } catch (error) {
    console.error("BLOG CONTROLLER: Error rendering new post page:", error);
    req.flash("error", "An error occurred while rendering the new post page");
    return res.redirect("/admin/blog/blogger/home");
  }
};

// Logout logic
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("BLOG CONTROLLER: Error destroying session:", err);
      }
      return res.redirect("/admin/blog/blogger/login");
    });
  } catch (error) {
    console.error("BLOG CONTROLLER: Error during logout:", error);
    return res.redirect("/admin/blog/blogger/home");
  }
};
