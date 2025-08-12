// edutestModel.js
const db = require("./connection");
const dummyData = require("./dummyData");

// Function to test database connectivity
const testDbConnection = async () => {
  try {
    await db.execute("SELECT 1");
    return true;
  } catch (error) {
    console.warn(
      "Database connection failed, using dummy data:",
      error.message
    );
    return false;
  }
};

// Function to fetch student by username (matric number) and password (first word of full name)
const getStudentByUsernameAndPassword = async (username, password) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) {
    return dummyData.getStudentByUsernameAndPassword(username, password);
  }

  try {
    // Query the database to find a student with the given matric number and password
    // Use comma as delimiter since names are formatted as "LASTNAME, FIRSTNAME"
    // Convert both passwords to lowercase for case-insensitive matching
    const [rows] = await db.execute(
      "SELECT * FROM yiniz_teststudents WHERE matric_number = ? AND LOWER(SUBSTRING_INDEX(full_name, ',', 1)) = LOWER(?)",
      [username, password]
    );

    return rows[0]; // Return the first row (assuming only one student per matric number)
  } catch (error) {
    throw new Error(
      "Error fetching student by username and password: " + error.message
    );
  }
};

// Function to retrieve random questions from the database with ML analysis
const getRandomQuestions = async (limit = 20) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) {
    return dummyData.getRandomQuestions();
  }

  try {
    // Ensure limit is a valid integer
    const questionLimit = parseInt(limit) || 20;
    
    // Query to retrieve random questions (using query instead of execute)
    const [rows] = await db.query(
      `SELECT 
        id, question, option_a, option_b, option_c, option_d, correct_answer,
        subject, difficulty, created_at, updated_at
      FROM yiniz_etest 
      ORDER BY RAND() 
      LIMIT ${questionLimit}`
    );

    // Return questions with existing fields only
    return rows.map((question) => ({
      id: question.id,
      question: question.question,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      subject: question.subject,
      difficulty: question.difficulty, // Use the actual difficulty field
      created_at: question.created_at,
      updated_at: question.updated_at,
      question_type: "multiple_choice",
    }));
  } catch (error) {
    throw new Error("Error retrieving random questions: " + error.message);
  }
};

// Function to save student answer with ML analysis
const saveStudentAnswer = async (answerData) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) return true; // Skip for dummy data
  try {
    const {
      studentId,
      questionId,
      answerText,
      timeSpent,
      actualScore,
      predictedScore,
      comprehensionCluster,
      mlAnalysis,
    } = answerData;

    await db.execute(
      `
      INSERT INTO yiniz_student_answers 
      (student_id, question_id, answer_text, time_spent, actual_score, 
       predicted_score, comprehension_cluster, ml_analysis, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `,
      [
        studentId,
        questionId,
        answerText,
        timeSpent || 0,
        actualScore || 0,
        predictedScore || null,
        comprehensionCluster || null,
        mlAnalysis ? JSON.stringify(mlAnalysis) : null,
      ]
    );

    return true;
  } catch (error) {
    console.error("Error saving student answer:", error);
    return false;
  }
};

// Function to update question with ML predictions
const updateQuestionMLData = async (questionId, mlData) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) return true;
  try {
    const {
      predictedDifficulty,
      predictionConfidence,
      calculatedDifficulty,
      difficultyConfidence,
      performanceMetrics,
    } = mlData;

    await db.execute(
      `
      UPDATE yiniz_etest 
      SET 
        predicted_difficulty = ?,
        prediction_confidence = ?,
        calculated_difficulty = ?,
        difficulty_confidence = ?,
        performance_metrics = ?,
        last_analyzed = NOW()
      WHERE id = ?
    `,
      [
        predictedDifficulty,
        predictionConfidence,
        calculatedDifficulty,
        difficultyConfidence,
        performanceMetrics ? JSON.stringify(performanceMetrics) : null,
        questionId,
      ]
    );

    return true;
  } catch (error) {
    console.error("Error updating question ML data:", error);
    return false;
  }
};

// Function to get question performance data
const getQuestionAnswers = async (questionId) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) return [];
  try {
    const [rows] = await db.execute(
      `
      SELECT 
        sa.student_id,
        sa.answer_text,
        sa.time_spent,
        sa.actual_score,
        sa.predicted_score,
        sa.comprehension_cluster,
        sa.ml_analysis,
        sa.created_at,
        ts.matric_number,
        ts.full_name
      FROM yiniz_student_answers sa
      JOIN yiniz_teststudents ts ON sa.student_id = ts.matric_number
      WHERE sa.question_id = ?
      ORDER BY sa.created_at DESC
    `,
      [questionId]
    );

    return rows.map((row) => ({
      ...row,
      ml_analysis: row.ml_analysis ? JSON.parse(row.ml_analysis) : null,
    }));
  } catch (error) {
    console.error("Error getting question answers:", error);
    return [];
  }
};

// Function to retrieve test sessions from the database
const getTestSessions = async () => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) {
    return dummyData.getTestSessions();
  }

  try {
    // Query to retrieve test sessions
    const [rows] = await db.execute("SELECT * FROM yiniz_test_sessions");
    return rows; // Return the test sessions
  } catch (error) {
    throw new Error("Error retrieving test sessions: " + error.message);
  }
};

// Function to get current active session
const getCurrentActiveSession = async () => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) {
    return dummyData.getCurrentActiveSession();
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM yiniz_test_sessions WHERE is_active = 1 LIMIT 1"
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(
      "Error retrieving current active session: " + error.message
    );
  }
};

// Function to retrieve scores of users from the database
const getUserScores = async (username) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) {
    return dummyData.getUserScores(username);
  }

  try {
    const [rows] = await db.execute(
      "SELECT scores FROM yiniz_teststudents WHERE matric_number = ?",
      [username]
    );
    return rows[0]; // Return the first row (assuming only one score per user)
  } catch (error) {
    throw new Error("Error retrieving user scores: " + error.message);
  }
};

// Function to update user's scores in the database
const updateUserScores = async (username, score) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) {
    return dummyData.updateUserScores(username, score);
  }

  try {
    // Update user's scores in the database
    await db.execute(
      "UPDATE yiniz_teststudents SET scores = ? WHERE matric_number = ?",
      [score, username]
    );
  } catch (error) {
    throw new Error("Error updating user scores: " + error.message);
  }
};

// Function to retrieve user's data from the database
const getUserData = async (username) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) return dummyData.getUserData(username);
  try {
    const [rows] = await db.execute(
      "SELECT matric_number AS username, full_name, scores FROM yiniz_teststudents WHERE matric_number = ?",
      [username]
    );
    return rows[0]; // Return the user's data
  } catch (error) {
    throw new Error("Error retrieving user's data: " + error.message);
  }
};

// Function to retrieve students with scores greater than 0
const getStudentsWithScoresGreaterThanZero = async () => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) return dummyData.getStudentsWithScoresGreaterThanZero();
  try {
    const [rows] = await db.execute(
      "SELECT * FROM yiniz_teststudents WHERE scores > 0"
    );
    return rows; // Return students with scores greater than 0
  } catch (error) {
    throw new Error(
      "Error retrieving students with scores greater than 0: " + error.message
    );
  }
};

// Function to get student answers with question text for ML analysis
const getStudentAnswers = async (studentId) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) return [];
  
  try {
    const [rows] = await db.execute(`
      SELECT 
        sa.id,
        sa.student_id,
        sa.question_id,
        sa.answer_text,
        sa.time_spent,
        sa.actual_score,
        sa.predicted_score,
        sa.comprehension_cluster,
        sa.ml_analysis,
        q.question_text,
        q.correct_answer
      FROM student_answers sa
      JOIN yiniz_etest q ON sa.question_id = q.id
      WHERE sa.student_id = ?
      ORDER BY sa.created_at DESC
    `, [studentId]);
    return rows;
  } catch (error) {
    console.error("Error retrieving student answers:", error);
    return [];
  }
};

// Function to update ML analysis for a student answer
const updateStudentAnswerML = async (answerId, mlData) => {
  const isDbAvailable = await testDbConnection();
  if (!isDbAvailable) return false;
  
  try {
    await db.execute(`
      UPDATE student_answers 
      SET 
        predicted_score = ?,
        comprehension_cluster = ?,
        ml_analysis = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      mlData.predictedScore,
      mlData.comprehensionCluster,
      JSON.stringify(mlData.mlAnalysis),
      answerId
    ]);
    return true;
  } catch (error) {
    console.error("Error updating student answer ML data:", error);
    return false;
  }
};

module.exports = {
  getStudentByUsernameAndPassword,
  getRandomQuestions,
  getTestSessions,
  getCurrentActiveSession,
  getUserScores,
  updateUserScores,
  getUserData,
  getStudentsWithScoresGreaterThanZero,
  saveStudentAnswer,
  updateQuestionMLData,
  getQuestionAnswers,
  getStudentAnswers,
  updateStudentAnswerML,
};
