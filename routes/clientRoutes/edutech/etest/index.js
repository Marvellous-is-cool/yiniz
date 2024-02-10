const express = require("express");
const router = express.Router();
const edutestController = require("../../../../controllers/edutestController");

router.get("/test/session", (req, res) => {
  console.log("INDEX ROUTER: Request received for test session page");
  return edutestController.getRandomQuestions(req, res);
});

router.get("/etest", (req, res) => {
  console.log("INDEX ROUTER: Request received for etest page");
  return res.render("edutech/etest/login", {
    flashMessages: req.flash("error"),
  });
});

router.get("/test/welcome", (req, res) => {
  console.log("INDEX ROUTER: Request received for test welcome page");
  return res.render("edutech/etest/intro-page", {
    flashMessages: req.flash("error"),
  });
});

module.exports = router;
