// routes/serverRoute/submitAss/index.js
const express = require("express");
const router = express.Router();
const assignmentSubmissionController = require("../../../controllers/assignmentSubmissionController");
const { isLecturer } = require("../../../middlewares/submitAuth");

router.get(
  "/submissions",
  isLecturer,
  assignmentSubmissionController.getSubmissions
);

module.exports = router;
