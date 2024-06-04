const { uploadFilePdf } = require("../helpers/uploadFile");
const db = require("../models/connection");

const uploadFile = async (req, res) => {
  const { student_name } = req.body;
  const file = req.files.pdf; // Assuming you're using express-fileupload middleware

  try {
    if (!file) {
      req.flash("error", "PDF is required");
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
      "INSERT INTO yiniz_submissions (student_name, file_path) VALUES (?, ?)",
      [student_name, submission.pdf] // Use submission.pdf as the file_path
    );

    res.redirect("/yap/success");
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
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
