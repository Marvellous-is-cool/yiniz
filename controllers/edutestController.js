const edutestModel = require("../models/edutestModel");

// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    console.log("EDU CONTROLLER: Session found, user saved successfully");
    console.log("The session: ", req.session);
    return next();
  } else {
    // User is not authenticated, redirect to login page
    req.flash("error", "You need to login first");
    console.log("EDU CONTROLLER: Session not found");
    console.log("The session: ", req.session);
    return res.redirect("/edu/etest/login");
  }
};

// Login logic for students
exports.login = async (req, res) => {
  try {
    const { loginUsername, loginPassword } = req.body;

    console.log("EDUTESTCONTROLLER: Login Request Body:", req.body);

    // Check if the username and password match a record in the database
    const student = await edutestModel.getStudentByUsernameAndPassword(
      loginUsername,
      loginPassword
    );

    console.log("EDUTESTCONTROLLER: Login Student:", student);

    if (student && student.matric_number) {
      // Set the username in the session and redirect to student dashboard
      req.session.username = student.matric_number;
      console.log(
        "EDUTESTCONTROLLER: Student logged in successfully. Session username set to:",
        req.session.username
      );
      console.log("EDUTESTCONTROLLER: Session:", req.session);
      return res.redirect("/edu/etest/home");
    } else {
      // Incorrect username or password, redirect back to login with an error message
      req.flash("error", "Incorrect username or password");
      return res.redirect("/edu/etest/login");
    }
  } catch (error) {
    console.error("EDUTESTCONTROLLER: Error during login:", error);
    req.flash("error", "An error occurred during login");
    return res.redirect("/edu/etest/login");
  }
};

// Controller function to retrieve random questions
exports.getRandomQuestions = async (req, res) => {
  try {
    const limit = 20; // Number of random questions to retrieve
    console.log("EDUTESTCONTROLLER: Retrieving random questions...");
    const questions = await edutestModel.getRandomQuestions(limit);
    console.log("EDUTESTCONTROLLER: Random questions retrieved:", questions);
    return res.render("edutech/etest/index", { questions });
  } catch (error) {
    console.error(
      "EDUTESTCONTROLLER: Error retrieving random questions:",
      error
    );
    req.flash("error", "An error occurred while retrieving questions");
    return res.redirect("/edu/etest/home");
  }
};
