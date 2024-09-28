const express = require("express");
const router = express.Router();
const roftfsboreAdminController = require("../../../../controllers/games/roftfsboreAdminController");

const roftfsboreAuthController = require("../../../../controllers/games/roftfsboreAuthController");

// Middleware to validate admin requests
const validateAdmin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    return res.redirect("/login");
  }
};

// List Videos
router.get("/videos", validateAdmin, roftfsboreAdminController.listVideos);

// View Video
router.get("/video/:id", validateAdmin, roftfsboreAdminController.viewVideo);

// Update Approval Status
router.post(
  "/video/:id/approve",
  validateAdmin,
  roftfsboreAdminController.updateApprovalStatus
);

// Download Logs
router.get(
  "/logs/download",
  validateAdmin,
  roftfsboreAdminController.downloadLogs
);

// Batch Delete Logs
router.post(
  "/logs/delete",
  validateAdmin,
  roftfsboreAdminController.deleteLogs
);

// Route for the login page (GET)
router.get("/login", roftfsboreAuthController.showLoginPage);

// Route to handle login form submission (POST)
router.post("/login", roftfsboreAuthController.handleLogin);

module.exports = router;
