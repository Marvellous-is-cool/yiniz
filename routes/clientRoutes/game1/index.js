const express = require("express");
const router = express.Router();

// Car rush
router.get("/carrush", (req, res) => {
  res.render("games/game1/carrush");
});

module.exports = router;
