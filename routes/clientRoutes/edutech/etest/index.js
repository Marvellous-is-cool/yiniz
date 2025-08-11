const express = require("express");
const router = express.Router();
const edutestController = require("../../../../controllers/edutestController");

// Debug route
router.get("/debug", (req, res) => {
  res.json({
    message: "Server is working",
    timestamp: new Date().toISOString(),
    session: req.session,
    sessionID: req.sessionID,
  });
});

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

// Route to render the scoreboard page, protected with authentication logic
router.get(
  "/test/scores",
  edutestController.scoresAuthenticate,
  edutestController.showScores
);

// NEW: ML Dashboard route (for teachers/admins)
router.get("/ml/dashboard", (req, res) => {
  res.render("edutech/etest/ml-dashboard");
});

// NEW ML-powered routes for teacher insights
router.get(
  "/insights/question/:questionId",
  edutestController.getQuestionInsights
);
router.get("/insights/overall", edutestController.getOverallInsights);
router.post("/ml/train", edutestController.trainMLModels);

module.exports = router;
