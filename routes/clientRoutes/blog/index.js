const express = require("express");
const router = express.Router();
const blogController = require("../../../controllers/blogController");

// Route to display all posts
router.get("/", blogController.getAllPostsPage);

module.exports = router;
