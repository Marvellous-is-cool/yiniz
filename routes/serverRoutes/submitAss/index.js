const express = require("express");
const router = express.Router();
const assignmentSubmissionController = require("../../../controllers/assignmentSubmissionController");
const { isLecturer } = require("../../../middlewares/submitAuth");

router.get(
  "/submissions",
  isLecturer,
  (req, res, next) => {
    console.log("Reached submissions route");
    next();
  },
  assignmentSubmissionController.getSubmissions
);

module.exports = router;
