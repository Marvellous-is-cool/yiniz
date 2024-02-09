const express = require("express");
const router = express.Router();
const blogController = require("../../../controllers/blogController");
const bloggerModel = require("../../../models/bloggerModel");

// Update the render function in the home
router.get("/home", blogController.isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;
    console.log("Username:", username); // Log the username

    // Fetch blogger information by username
    const blogger = await bloggerModel.getBloggerByUsername(username);
    console.log("Blogger:", blogger); // Log the blogger data

    // Fetch blogger posts by username
    const bloggerPosts = await bloggerModel.getBloggerPostsByUsername(username);
    console.log("Blogger Posts:", bloggerPosts); // Log the blogger posts

    const currentTime = new Date().getHours();
    const greeting = getGreeting(currentTime);

    return res.render("blog/blogger/home", {
      currentUser: blogger,
      greeting,
      posts: bloggerPosts,
      currentYear: new Date().getFullYear(),
    });
  } catch (error) {
    console.error("Error fetching blogger data:", error);
    req.flash("error", "An error occurred while loading the blogger page");
    return res.redirect("/admin/blog/blogger/login");
  }
});

const getGreeting = (currentTime) => {
  if (currentTime < 12) {
    return "Good morning!";
  } else if (currentTime < 18) {
    return "Good afternoon!";
  } else {
    return "Good evening!";
  }
};

router.get("/login", (req, res) => {
  return res.render("blog/blogger/login", {
    flashMessages: req.flash("error"),
  });
});

router.post("/login", blogController.login);

router.get("/signup", (req, res) => {
  return res.render("blog/blogger/signup", {
    flashMessages: req.flash("error"),
  });
});

router.post("/signup", blogController.signup);

router.get("/new-post", blogController.isAuthenticated, (req, res) => {
  // Get the session data
  const currentUser = req.session.username;

  // Render the new post page
  return res.render("blog/blogger/new-post", {
    currentUser,
    currentYear: new Date().getFullYear(),
  });
});

router.post(
  "/new-post",
  blogController.isAuthenticated,
  blogController.createPost
);

// Define a route to fetch a post by its ID
router.get("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await bloggerModel.getPostById(postId);
    return res.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the post" });
  }
});

router.get("/logout", blogController.logout);

module.exports = router;
