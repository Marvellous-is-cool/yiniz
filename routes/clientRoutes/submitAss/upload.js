// routes/clientRoutes/submitAss/upload.js

const express = require("express");
const { isAuthenticated } = require("../../../middlewares/submitAuth");
const assignmentSubmissionController = require("../../../controllers/assignmentSubmissionController");

const router = express.Router();

router.get("/submit", (req, res) => {
  res.render("submitAss/submit", {
    errorMessage: req.flash("errorMessage") || [],
    successMessage: req.flash("successMessage") || [],
  });
});

router.get("/success", isAuthenticated, (req, res) => {
  res.render("submitAss/success", {
    successMessage: req.flash("success"),
  });
});

router.post(
  "/submit",
  isAuthenticated,
  assignmentSubmissionController.uploadFile
);

module.exports = router;
