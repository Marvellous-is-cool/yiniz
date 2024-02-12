const express = require("express");
const router = express.Router();
const edutestController = require("../../../../controllers/edutestController");

// login page
router.get("/etest", (req, res) => {
  return res.render("edutech/etest/login", {
    flashMessages: req.flash("error"),
  });
});

// POST route to handle login
router.post("/etest/proceed", edutestController.login);

router.get("/test/getQuestions", (req, res) => {
  return edutestController.getRandomQuestions(req, res);
});

// Route using isAuthenticated middleware
router.get("/test/welcome", edutestController.isAuthenticated, (req, res) => {
  return res.render("edutech/etest/intro-page", {
    flashMessages: req.flash("error"),
  });
});

// Route using isAuthenticated middleware
router.get("/test/session", edutestController.isAuthenticated, (req, res) => {
  return res.render("edutech/etest/index", {
    flashMessages: req.flash("error"),
    username: res.locals.username, // Pass the username to the view
  });
});

// POST route to update user's scores
router.post("/test/update-score", edutestController.updateUserScores);

router.get(
  "/test/session-ended",
  edutestController.scoresAuthenticate,
  edutestController.sessionEnded
);

router.get("/logout", edutestController.logout);

module.exports = router;
