// index.js
const express = require("express");
const router = express.Router();

// landing page
router.get("/", (req, res) => {
  res.render("games/index");
});

// Car rush
router.get("/carrush", (req, res) => {
  res.render("games/game1/carrush");
});

module.exports = router;
