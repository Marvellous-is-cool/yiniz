const express = require("express");
const { login, register } = require("../../../middlewares/submitAuth");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("submitAss/login");
});

router.post("/login", login);

router.get("/register", (req, res) => {
  res.render("submitAss/register");
});

router.post("/register", register);

router.get("/submit", (req, res) => {
  const username = req.query.username || req.session.user.username;
  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");
  res.render("submitAss/submit", { username, errorMessage, successMessage });
});

module.exports = router;
