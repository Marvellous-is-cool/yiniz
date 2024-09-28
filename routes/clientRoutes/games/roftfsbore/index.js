// index.js
const express = require("express");
const router = express.Router();

// game page
router.get("/", (req, res) => {
  res.render("games/roftfsbore/index");
});

module.exports = router;
