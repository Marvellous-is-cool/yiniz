const express = require("express");
const router = express.Router();
const edutestController = require("../../../../controllers/edutestController");

// Debug route for production troubleshooting
router.get("/debug", (req, res) => {
  const debugInfo = {
    message: "Server is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    sessionConfig: {
      secure: process.env.NODE_ENV === "production" && process.env.USE_HTTPS === "true",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    },
    session: req.session,
    sessionID: req.sessionID,
    cookies: req.headers.cookie,
    userAgent: req.get('User-Agent'),
    host: req.get('Host'),
    protocol: req.protocol,
    secure: req.secure,
  };
  
  // In production, limit sensitive info
  if (process.env.NODE_ENV === "production") {
    delete debugInfo.session;
    delete debugInfo.sessionID;
  }
  
  res.json(debugInfo);
});

// Production login test route
router.get("/test-login", (req, res) => {
  res.send(`
    <html>
    <head><title>Login Test</title></head>
    <body>
      <h2>Production Login Test</h2>
      <form action="/edu/etest/proceed" method="post">
        <div style="margin: 10px;">
          <label>Username:</label>
          <input type="text" name="loginUsername" value="2024/55022" required>
        </div>
        <div style="margin: 10px;">
          <label>Password:</label>
          <input type="text" name="loginPassword" value="abdulhamid" required>
        </div>
        <button type="submit" style="margin: 10px; padding: 10px;">Test Login</button>
      </form>
      
      <h3>Debug Info:</h3>
      <p>Environment: ${process.env.NODE_ENV}</p>
      <p>HTTPS: ${process.env.USE_HTTPS}</p>
      <p>Protocol: ${req.protocol}</p>
      <p>Secure: ${req.secure}</p>
      <p>Host: ${req.get('Host')}</p>
    </body>
    </html>
  `);
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
