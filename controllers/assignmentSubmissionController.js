// controllers/assignmentSubmissionController.js
const { uploadFilePdfDoc } = require("../helpers/uploadFile");
const db = require("../models/connection");
const { findSubmissionByStudentNameAndLevel } = require("../models/submitUser");

const uploadFile = async (req, res) => {
  const { student_name, level } = req.body;
  const file = req.files.file;

  try {
    if (!file) {
      req.flash("error", "File is required");
      return res.redirect("/yap/submit");
    }

    // Check for existing submissions
    const existingSubmission = await findSubmissionByStudentNameAndLevel(
      student_name,
      level
    );
    if (existingSubmission) {
      req.flash(
        "error",
        "A submission with this student name and level already exists"
      );
      return res.redirect("/yap/submit");
    }

    // Create a submission object to store the title and file path
    const submission = { title: student_name, file: "" }; // Initial placeholder for the file path

    // Use the helper to upload the file and set the file path in the submission object
    await uploadFilePdfDoc(file, submission);

    // Insert the submission data into the database
    await db.execute(
      "INSERT INTO yiniz_submissions (student_name, level, file_path) VALUES (?, ?, ?)",
      [student_name, level, submission.file]
    );

    // Set success flash message
    req.flash("success", "Submission successful");

    // Redirect to success page
    res.redirect("/yap/success");
  } catch (err) {
    console.error("Error uploading file:", err);

    // Set error flash message with the actual error message
    req.flash("error", "Error uploading file: " + err.message);

    // Redirect back to submit page
    res.redirect("/yap/submit");
  }
};

const getSubmissions = async (req, res) => {
  try {
    const level = req.query.level; // Fetch level from query params

    let query = "SELECT * FROM yiniz_submissions";
    let queryParams = [];

    if (level && level !== "all") {
      query += " WHERE level = ?";
      queryParams.push(level);
    }

    query += " ORDER BY submitted_at DESC"; // Order by submitted_at descending

    const [submissions] = await db.execute(query, queryParams);

    // Group submissions by level for categorization
    const submissionsByLevel = {};

    submissions.forEach((submission) => {
      const level = submission.level;
      if (!submissionsByLevel[level]) {
        submissionsByLevel[level] = [];
      }
      submissionsByLevel[level].push(submission);
    });

    // Get unique levels from submissions
    const levels = Object.keys(submissionsByLevel);

    // Sort levels in ascending order (if needed)
    levels.sort((a, b) => parseInt(a) - parseInt(b));

    res.render("submitAss/submissions", {
      submissions: submissionsByLevel,
      levels,
    });
  } catch (err) {
    console.error("Error retrieving submissions:", err);
    res.status(500).send("Error retrieving submissions");
  }
};

module.exports = { uploadFile, getSubmissions };
