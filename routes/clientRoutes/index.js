// index.js
const express = require("express");
const router = express.Router();
const businessRouter = require("./business");

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

// Car rush
router.get("/nikigames/carrush", (req, res) => {
  res.render("games/game1/carrush");
});

router.get("/edu", (req, res) => {
  res.render("edutech/index");
});

router.get("/blog", (req, res) => {
  res.render("blog/blogger/login");
});

// Use the business router for /ecommerce
router.use("/ecommerce", businessRouter);

module.exports = router;
