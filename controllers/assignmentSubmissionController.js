const { uploadFilePdf } = require("../helpers/uploadFile");
const db = require("../models/connection");
const {
  findSubmissionByStudentNameAndMatricNumber,
} = require("../models/submitUser");

const uploadFile = async (req, res) => {
  const { student_name, matric_number } = req.body;
  const file = req.files.pdf;

  try {
    if (!file) {
      req.flash("error", "PDF is required");
      return res.redirect("/yap/submit");
    }

    // Check for existing submissions
    const existingSubmissionByName =
      await findSubmissionByStudentNameAndMatricNumber(student_name, null);
    const existingSubmissionByMatricNumber =
      await findSubmissionByStudentNameAndMatricNumber(null, matric_number);
    if (existingSubmissionByName || existingSubmissionByMatricNumber) {
      req.flash(
        "error",
        "A submission with this student name or matric number already exists"
      );
      return res.redirect("/yap/submit");
    }

    // Check if there is an existing submission with the same combination of student name and matric number
    const existingSubmission = await findSubmissionByStudentNameAndMatricNumber(
      student_name,
      matric_number
    );
    if (existingSubmission) {
      req.flash(
        "error",
        "A submission with this student name and matric number already exists"
      );
      return res.redirect("/yap/submit");
    }

    // Create a submission object to store the title and file path
    const submission = {
      title: student_name,
      pdf: "", // Initial placeholder for the file path
    };

    // Use the helper to upload the file and set the file path in the submission object
    await uploadFilePdf(file, submission);

    // Insert the submission data into the database
    await db.execute(
      "INSERT INTO yiniz_submissions (student_name, matric_number, file_path) VALUES (?, ?, ?)",
      [student_name, matric_number, submission.pdf]
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
    const [submissions] = await db.execute("SELECT * FROM yiniz_submissions");
    res.render("submitAss/submissions", { submissions });
  } catch (err) {
    res.status(500).send("Error retrieving submissions");
  }
};

module.exports = { uploadFile, getSubmissions };
