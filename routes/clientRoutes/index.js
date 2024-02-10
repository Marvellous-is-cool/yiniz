// index.js
const express = require("express");
const router = express.Router();
const businessRouter = require("./business");
const blogRouter = require("./blog");
const gamesRouter = require("./games");
const edutechRouter = require("./edutech");

// Landing Page Route
router.get("/", (req, res) => {
  // Define content for 'business', 'news', 'games', and 'education' cards
  const cards = [
    {
      title: "Business",
      content: "Explore our business hub for networking and opportunities.",
      link: "/ecommerce",
    },
    {
      title: "News",
      content: "Stay informed with the latest news and updates.",
      link: "/blog",
    },
    {
      title: "Games",
      content: "Discover the gaming world and join the fun.",
      link: "/games",
    },
    {
      title: "Edu-Tech",
      content: "Unlock knowledge and learning opportunities.",
      link: "/edu",
    },
  ];

  res.render("index", { cards });
});

// Ecommerce (business) Route
router.use("/ecommerce", businessRouter);

// Blog (news) Route
router.use("/blog", blogRouter);

// Games Route
router.use("/games", gamesRouter);

// Edutech Route
router.use("/edu", edutechRouter);

module.exports = router;
