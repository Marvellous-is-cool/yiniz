const edutestModel = require("../models/edutestModel");

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    if (req.session.username) {
      // Retrieve the username from the session
      const username = req.session.username;

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
        const isActive = session.is_active === 1;
        const isWithinTimeWindow =
          currentHour >= session.starthour && currentHour <= session.endhour;
        return isActive && isWithinTimeWindow;
      });

      if (validSession) {
        // Pass the username to the router
        res.locals.username = username;
        return next();
      } else {
        req.flash("error", "Test session is not available at the moment.");
        return res.redirect("/edu/etest");
      }
    } else {
      // User is not authenticated, redirect to login page
      req.flash("error", "You need to login first");
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

    // Check if the username and password match a record in the database
    if (loginUsername === "Awoniyi" && loginPassword === "Admin") {
      req.session.username = loginUsername;

      // Handle JSON response for fetch requests
      if (req.get("Content-Type") === "application/json") {
        return res.json({ success: true, redirect: "/edu/test/scores" });
      }
      return res.redirect("/edu/test/scores");
    }

    const student = await edutestModel.getStudentByUsernameAndPassword(
      loginUsername,
      loginPassword
    );

    if (student && student.matric_number) {
      // Set the username in the session and redirect to student dashboard
      req.session.username = student.matric_number;

      // Handle JSON response for fetch requests
      if (req.get("Content-Type") === "application/json") {
        return res.json({ success: true, redirect: "/edu/test/welcome" });
      }

      return res.redirect("/edu/test/welcome");
    } else {
      // Incorrect username or password, redirect back to login with an error message
      req.flash("error", "Incorrect username or password");

      // Handle JSON response for fetch requests
      if (req.get("Content-Type") === "application/json") {
        return res.json({
          success: false,
          error: "Incorrect username or password",
        });
      }
      return res.redirect("/edu/etest");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "An error occurred during login");

    // Handle JSON response for fetch requests
    if (req.get("Content-Type") === "application/json") {
      return res.json({
        success: false,
        error: "An error occurred during login",
      });
    }
    return res.redirect("/edu/etest");
  }
};

// Controller function to retrieve random questions and test sessions
exports.getRandomQuestions = async (req, res) => {
  try {
    const limit = 20; // Number of random questions to retrieve
    const mlService = require("../helpers/mlService");

    // Check if ML service is available
    const isMLHealthy = await mlService.checkHealth();

    const questions = await edutestModel.getRandomQuestions(limit);
    const testSessions = await edutestModel.getTestSessions();

    // Skip ML analysis during question loading to ensure fast response
    // ML analysis will be done after test completion
    console.log(
      "📚 Questions loaded without ML analysis - analysis will run after test completion"
    );

    res.json({
      questions,
      testSessions,
      mlStatus: {
        available: isMLHealthy,
        analyzed: questions.filter((q) => q.predicted_difficulty).length,
        total: questions.length,
        note: "ML analysis will run after test completion",
      },
    });
  } catch (error) {
    console.error("EDUTESTCONTROLLER: Error retrieving questions:", error);
    req.flash("error", "An error occurred while retrieving questions");
    return res.redirect("/edu/etest/home");
  }
};

// Controller function to update user's scores with ML analysis
exports.updateUserScores = async (req, res) => {
  try {
    const { username, score, answers } = req.body; // Expect answers array with question details
    const mlService = require("../helpers/mlService");

    // Update user's final score in the database
    await edutestModel.updateUserScores(username, score);

    // Process each answer with ML analysis
    if (answers && Array.isArray(answers)) {
      for (const answerData of answers) {
        try {
          // ML analysis for each answer
          let mlAnalysis = null;
          if (answerData.questionText && answerData.userAnswer) {
            mlAnalysis = await mlService.analyzeAnswer({
              question_text: answerData.questionText,
              answer_text: answerData.userAnswer,
              question_type: answerData.questionType || "multiple_choice",
              correct_answer: answerData.correctAnswer,
              time_taken: answerData.timeSpent || 0,
            });
          }

          // Save answer with ML insights
          const saveData = {
            studentId: username,
            questionId: answerData.questionId,
            answerText: answerData.userAnswer,
            timeSpent: answerData.timeSpent || 0,
            actualScore: answerData.isCorrect ? 1 : 0,
            predictedScore:
              mlAnalysis?.score_prediction?.predicted_score || null,
            comprehensionCluster:
              mlAnalysis?.comprehension_analysis?.comprehension_cluster || null,
            mlAnalysis: mlAnalysis,
          };

          await edutestModel.saveStudentAnswer(saveData);

          // Check if we should update question difficulty
          const questionAnswers = await edutestModel.getQuestionAnswers(
            answerData.questionId
          );

          if (
            questionAnswers.length >= 10 &&
            questionAnswers.length % 5 === 0
          ) {
            // Every 5 answers after minimum threshold, update difficulty
            try {
              const performance = await mlService.getQuestionPerformance(
                answerData.questionId
              );

              if (performance) {
                await edutestModel.updateQuestionMLData(answerData.questionId, {
                  calculatedDifficulty: performance.calculated_difficulty,
                  difficultyConfidence: performance.difficulty_confidence,
                  performanceMetrics: performance.performance_metrics,
                });

                console.log(
                  `✅ Updated difficulty for question ${answerData.questionId}: ${performance.calculated_difficulty}`
                );
              }
            } catch (perfError) {
              console.error(
                `Failed to update question ${answerData.questionId} performance:`,
                perfError
              );
            }
          }
        } catch (answerError) {
          console.error(
            `Error processing answer for question ${answerData.questionId}:`,
            answerError
          );
        }
      }
    }

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

    // Trigger ML analysis for completed test (async, don't block the response)
    if (username) {
      console.log("🔬 Triggering post-test ML analysis for student:", username);
      setImmediate(async () => {
        try {
          const studentAnswers = await edutestModel.getStudentAnswers(username);
          console.log(
            `📊 Analyzing ${studentAnswers.length} student answers for ML insights`
          );

          for (const answer of studentAnswers) {
            try {
              if (answer.question_text && !answer.ml_analysis) {
                const mlAnalysis = await mlService.analyzeQuestion(
                  answer.question_text
                );
                if (mlAnalysis) {
                  await edutestModel.updateStudentAnswerML(answer.id, {
                    predictedScore:
                      mlAnalysis.score_prediction?.predicted_score,
                    comprehensionCluster:
                      mlAnalysis.comprehension_analysis?.comprehension_cluster,
                    mlAnalysis: mlAnalysis,
                  });
                  console.log(`✅ Updated ML analysis for answer ${answer.id}`);
                }
              }
            } catch (mlError) {
              console.error(
                `ML analysis failed for answer ${answer.id}:`,
                mlError
              );
            }
          }
          console.log(
            "🎉 Post-test ML analysis completed for student:",
            username
          );
        } catch (analysisError) {
          console.error("Post-test ML analysis error:", analysisError);
        }
      });
    }

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

// NEW: ML-powered question insights for teachers
exports.getQuestionInsights = async (req, res) => {
  try {
    const { questionId } = req.params;
    const mlService = require("../helpers/mlService");

    // Get question answers and performance data
    const answers = await edutestModel.getQuestionAnswers(questionId);
    const performance = await mlService.getQuestionPerformance(questionId);

    if (answers.length === 0) {
      return res.json({
        error: "No student responses found for this question",
        questionId,
        hasData: false,
      });
    }

    // Calculate basic metrics
    const successRate =
      answers.filter((a) => a.actual_score >= 0.6).length / answers.length;
    const avgTime =
      answers.reduce((sum, a) => sum + (a.time_spent || 0), 0) / answers.length;
    const avgScore =
      answers.reduce((sum, a) => sum + (a.actual_score || 0), 0) /
      answers.length;

    const insights = {
      questionId,
      hasData: true,
      sampleSize: answers.length,
      performance: {
        successRate: Math.round(successRate * 100) + "%",
        avgScore: Math.round(avgScore * 100) + "%",
        avgTime: Math.round(avgTime) + "s",
        totalAttempts: answers.length,
      },
      mlInsights: performance
        ? {
            calculatedDifficulty: performance.calculated_difficulty,
            confidence:
              Math.round(performance.difficulty_confidence * 100) + "%",
            recommendations: performance.recommendations || [],
            commonMistakes: performance.common_mistakes?.slice(0, 5) || [],
          }
        : null,
      studentResponses: answers.slice(0, 10).map((answer) => ({
        student: answer.full_name,
        matricNumber: answer.matric_number,
        answer: answer.answer_text,
        score: answer.actual_score,
        timeSpent: answer.time_spent + "s",
        comprehensionIssues:
          answer.ml_analysis?.comprehension_analysis?.issues_identified || [],
        submittedAt: new Date(answer.created_at).toLocaleString(),
      })),
    };

    res.json(insights);
  } catch (error) {
    console.error("Error getting question insights:", error);
    res.status(500).json({ error: "Failed to get question insights" });
  }
};

// NEW: Batch analyze all questions for teacher dashboard
exports.getOverallInsights = async (req, res) => {
  try {
    const mlService = require("../helpers/mlService");

    // Get all questions from recent tests (you might want to filter by date)
    const questions = await edutestModel.getRandomQuestions(100); // Get more for analysis

    const insights = {
      total: questions.length,
      withPredictions: questions.filter((q) => q.predicted_difficulty).length,
      withPerformanceData: questions.filter((q) => q.calculated_difficulty)
        .length,
      difficultyDistribution: {
        easy: questions.filter(
          (q) =>
            q.calculated_difficulty === "easy" ||
            q.predicted_difficulty === "easy"
        ).length,
        medium: questions.filter(
          (q) =>
            q.calculated_difficulty === "medium" ||
            q.predicted_difficulty === "medium"
        ).length,
        hard: questions.filter(
          (q) =>
            q.calculated_difficulty === "hard" ||
            q.predicted_difficulty === "hard"
        ).length,
      },
      accuracyRate: 0,
      needsAttention: [],
    };

    // Calculate prediction accuracy
    const questionsWithBoth = questions.filter(
      (q) => q.predicted_difficulty && q.calculated_difficulty
    );
    if (questionsWithBoth.length > 0) {
      const accurate = questionsWithBoth.filter(
        (q) => q.predicted_difficulty === q.calculated_difficulty
      );
      insights.accuracyRate = Math.round(
        (accurate.length / questionsWithBoth.length) * 100
      );
    }

    // Find questions that need attention
    for (const question of questions) {
      const answers = await edutestModel.getQuestionAnswers(question.id);
      if (answers.length >= 5) {
        // Only check questions with some responses
        const successRate =
          answers.filter((a) => a.actual_score >= 0.6).length / answers.length;

        if (successRate < 0.3) {
          // Too hard
          insights.needsAttention.push({
            id: question.id,
            text: question.question.substring(0, 80) + "...",
            issue: "Too difficult",
            successRate: Math.round(successRate * 100) + "%",
            responses: answers.length,
          });
        } else if (successRate > 0.95) {
          // Too easy
          insights.needsAttention.push({
            id: question.id,
            text: question.question.substring(0, 80) + "...",
            issue: "Too easy",
            successRate: Math.round(successRate * 100) + "%",
            responses: answers.length,
          });
        }
      }
    }

    res.json(insights);
  } catch (error) {
    console.error("Error getting overall insights:", error);
    res.status(500).json({ error: "Failed to get overall insights" });
  }
};

// NEW: Train ML models with latest data
exports.trainMLModels = async (req, res) => {
  try {
    const mlService = require("../helpers/mlService");

    const results = {
      difficulty: await mlService.trainModels("difficulty"),
      score: await mlService.trainModels("score"),
      comprehension: await mlService.trainModels("comprehension"),
    };

    res.json({
      message: "Model training initiated",
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error training ML models:", error);
    res.status(500).json({ error: "Failed to train ML models" });
  }
};
