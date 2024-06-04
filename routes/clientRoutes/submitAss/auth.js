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

module.exports = router;
