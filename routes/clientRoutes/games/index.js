// index.js
const express = require("express");
const router = express.Router();
const roftfsboreRouter = require("./roftfsbore");

// landing page
router.get("/", (req, res) => {
  res.render("games/index");
});

// Car rush
router.get("/carrush", (req, res) => {
  res.render("games/game1/carrush");
});

// roftfsbore
router.use("/roftfsbore", roftfsboreRouter);

module.exports = router;
