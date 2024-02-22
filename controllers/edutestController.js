const edutestModel = require("../models/edutestModel");

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    if (req.session.username) {
      // Retrieve the username from the session
      const username = req.session.username;
      // console.log("EDU CONTROLLER: Session found, user saved successfully");
      // console.log("The session: ", req.session);

      // Check if the user has already completed the test (has a score)
      const userScore = await edutestModel.getUserScores(username);
      console.log(userScore);
      if (userScore && userScore.scores > 0) {
        req.flash("error", "You have already completed the test");
        return res.redirect("/edu/test/session-ended"); // Redirect to home or another appropriate page
      }

      // Retrieve test sessions from the database
      const testSessions = await edutestModel.getTestSessions();

      // Check if the current time falls within a valid test session period
      const now = new Date();
      const currentHour = now.getHours();

      // Check if the current time is within a valid test session
      const validSession = testSessions.some((session) => {
        return currentHour < session.endhour;
      });

      // Check if it's not 19 minutes before the end time of the test session
      const minutesBeforeEnd = 19; // Change this value as needed
      const remainingMinutes = 60 - now.getMinutes();
      const isBeforeEndTime = remainingMinutes >= minutesBeforeEnd;

      if (validSession && isBeforeEndTime) {
        // Pass the username to the router
        res.locals.username = username;
        return next();
      } else {
        req.flash("error", "Test session is not available at the moment.");
        console.log("Test session is not available at the moment.");
        return res.redirect("/edu/etest");
      }
    } else {
      // User is not authenticated, redirect to login page
      req.flash("error", "You need to login first");
      console.log("EDU CONTROLLER: Session not found");
      console.log("The session: ", req.session);
      return res.redirect("/edu/etest");
    }
  } catch (error) {
    console.error("EDU CONTROLLER: Error checking authentication:", error);
    req.flash("error", "An error occurred while checking authentication");
    return res.redirect("/edu/etest");
  }
};

// scores middleware
exports.scoresAuthenticate = async (req, res, next) => {
  try {
    // Check if the user's username is 'Admin' and password is 'Admin'
    if (
      req.session.username === "Awoniyi" &&
      req.body.loginPassword === "Admin"
    ) {
      // Redirect to a specific route (e.g., dashboard)
      return res.redirect("/edu/test/scores");
    }

    // Otherwise, continue with the regular authentication logic
    if (req.session.username) {
      // Retrieve the username from the session
      const username = req.session.username;
      console.log("Scores authentication successful for user:", username);

      // Pass the username to the router
      res.locals.username = username;
      return next();
    } else {
      // User is not authenticated, redirect to login page
      req.flash("error", "You need to login first");
      console.log("Scores authentication failed: Session not found");
      console.log("The session: ", req.session);
      return res.redirect("/edu/etest");
    }
  } catch (error) {
    console.error("Error during scores authentication:", error);
    req.flash("error", "An error occurred while checking authentication");
    return res.redirect("/edu/etest");
  }
};

// Login logic for students
exports.login = async (req, res) => {
  try {
    const { loginUsername, loginPassword } = req.body;

    // console.log("EDUTESTCONTROLLER: Login Request Body:", req.body);

    // Check if the username and password match a record in the database
    if (loginUsername === "Awoniyi" && loginPassword === "Admin") {
      req.session.username = loginUsername;
      return res.redirect("/edu/test/scores"); // Replace '/admin/dashboard' with the desired route
    }

    const student = await edutestModel.getStudentByUsernameAndPassword(
      loginUsername,
      loginPassword
    );

    // console.log("EDUTESTCONTROLLER: Login Student:", student);

    if (student && student.matric_number) {
      // Set the username in the session and redirect to student dashboard
      req.session.username = student.matric_number;
      // console.log(
      //   "EDUTESTCONTROLLER: Student logged in successfully. Session username set to:",
      //   req.session.username
      // );
      // console.log("EDUTESTCONTROLLER: Session:", req.session);
      return res.redirect("/edu/test/welcome");
    } else {
      // Incorrect username or password, redirect back to login with an error message
      req.flash("error", "Incorrect username or password");
      return res.redirect("/edu/etest");
    }
  } catch (error) {
    console.error("EDUTESTCONTROLLER: Error during login:", error);
    req.flash("error", "An error occurred during login");
    return res.redirect("/edu/etest");
  }
};

// Controller function to retrieve random questions and test sessions
exports.getRandomQuestions = async (req, res) => {
  try {
    const limit = 20; // Number of random questions to retrieve
    // console.log(
    //   "EDUTESTCONTROLLER: Retrieving random questions and test sessions..."
    // );
    const questions = await edutestModel.getRandomQuestions(limit);
    const testSessions = await edutestModel.getTestSessions();
    // console.log("EDUTESTCONTROLLER: Random questions retrieved:", questions);
    // console.log("EDUTESTCONTROLLER: Test sessions retrieved:", testSessions);
    res.json({ questions, testSessions }); // Modify the response to include both questions and test sessions
  } catch (error) {
    console.error(
      "EDUTESTCONTROLLER: Error retrieving random questions and test sessions:",
      error
    );
    req.flash(
      "error",
      "An error occurred while retrieving questions and test sessions"
    );
    return res.redirect("/edu/etest/home");
  }
};

// Controller function to update user's scores
exports.updateUserScores = async (req, res) => {
  try {
    const { username, score } = req.body;

    // Update user's scores in the database
    await edutestModel.updateUserScores(username, score);

    // Redirect to /edu/test/session-ended
    res.redirect("/edu/test/session-ended");
  } catch (error) {
    console.error("Error updating user scores:", error);
    // Redirect to /edu/test/session on error
    res.redirect("/edu/test/session");
  }
};

// Controller function to handle session ended
exports.sessionEnded = async (req, res) => {
  try {
    const username = req.session.username;
    const userScore = await edutestModel.getUserScores(username);
    const userFullName = req.session.full_name; // Assuming full name is stored in session
    const userMatric = req.session.matric_number; // Assuming matric number is stored in session

    if (userScore) {
      const userScores = userScore.scores; // Assuming scores are retrieved correctly
      return res.render("edutech/etest/ended", {
        flashMessages: req.flash("error"),
        username: username,
        userFullName: userFullName,
        userMatric: userMatric,
        userScore: userScores,
      });
    } else {
      // Handle if userScore is not found
      req.flash("error", "Failed to retrieve user scores");
      return res.redirect("/edu/test/session");
    }
  } catch (error) {
    console.error("Error handling session ended:", error);
    req.flash("error", "An error occurred while handling session ended");
    return res.redirect("/edu/test/session");
  }
};

// Logout logic
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("EDU CONTROLLER: Error destroying session:", err);
      }
      return res.redirect("/edu/etest");
    });
  } catch (error) {
    console.error("EDU CONTROLLER: Error during logout:", error);
    return res.redirect("/edu/etest");
  }
};

// Controller function to show scoreboard
exports.showScores = async (req, res) => {
  try {
    // Fetch students with scores greater than 0
    const students = await edutestModel.getStudentsWithScoresGreaterThanZero();

    // Render the scoreboard page with student data
    res.render("edutech/etest/scoreboard", { students });
  } catch (error) {
    console.error("Error showing scoreboard:", error);
    req.flash("error", "An error occurred while showing scoreboard");
    return res.redirect("/edu/etest");
  }
};
