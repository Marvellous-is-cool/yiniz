const express = require("express");
const { isAuthenticated } = require("../../../middlewares/submitAuth");
const assignmentSubmissionController = require("../../../controllers/assignmentSubmissionController");

const router = express.Router();

router.get("/submit", isAuthenticated, (req, res) => {
  res.render("submitAss/submit");
});
router.get("/success", isAuthenticated, (req, res) => {
  res.render("submitAss/success");
});

router.post(
  "/submit",
  isAuthenticated,
  assignmentSubmissionController.uploadFile
);

module.exports = router;
