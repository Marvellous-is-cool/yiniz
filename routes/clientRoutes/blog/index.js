const express = require("express");
const router = express.Router();
const blogController = require("../../../controllers/blogController");
const trackIP = require("../../../middlewares/ipMiddleware"); // Import the IP tracking middleware

// Route to display all posts
router.get("/", blogController.getAllPostsPage);

// Route to like a post
router.post("/like/:postId", trackIP, blogController.likePost);

// Route to dislike a post
router.post("/dislike/:postId", trackIP, blogController.dislikePost);

module.exports = router;
