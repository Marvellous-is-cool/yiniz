const express = require("express");
const router = express.Router();
const edutestController = require("../../../../controllers/edutestController");

// Debug route for production troubleshooting
router.get("/debug", (req, res) => {
  const debugInfo = {
    message: "Server is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    sessionConfig: {
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.USE_HTTPS === "true",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    },
    session: req.session,
    sessionID: req.sessionID,
    cookies: req.headers.cookie,
    userAgent: req.get("User-Agent"),
    host: req.get("Host"),
    protocol: req.protocol,
    secure: req.secure,
  };

  // In production, limit sensitive info
  if (process.env.NODE_ENV === "production") {
    delete debugInfo.session;
    delete debugInfo.sessionID;
  }

  res.json(debugInfo);
});

// NEW: Debug route to check database connectivity and questions
router.get("/debug/database", async (req, res) => {
  try {
    const connection = require("../../../../models/connection");

    // Test database connection
    const dbStatus = connection.isDbConnected
      ? connection.isDbConnected()
      : false;

    // Get question count from correct table
    const [questionCount] = await connection.query(
      "SELECT COUNT(*) as total FROM yiniz_etest"
    );

    // Get sample questions with answers from correct table
    const [sampleQuestions] = await connection.query(`
      SELECT 
        id,
        question,
        option_a,
        option_b, 
        option_c,
        option_d,
        correct_answer
      FROM yiniz_etest 
      LIMIT 3
    `);

    // Get student count from correct table
    const [studentCount] = await connection.query(
      "SELECT COUNT(*) as total FROM yiniz_teststudents"
    );

    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      database: {
        connected: dbStatus,
        questionsTotal: questionCount[0].total,
        studentsTotal: studentCount[0].total,
      },
      sampleQuestions: sampleQuestions,
      message: "Database and questions verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// NEW: Debug route to test question randomization
router.get("/debug/questions", async (req, res) => {
  try {
    const edutestModel = require("../../../../models/edutestModel");

    // Get random questions (same as test does)
    const randomQuestions = await edutestModel.getRandomQuestions(5);

    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      questionsCount: randomQuestions.length,
      questions: randomQuestions.map((q) => ({
        questionId: q.id,
        question: q.question.substring(0, 100) + "...", // Preview only
        hasOptions: !!(q.option_a && q.option_b && q.option_c && q.option_d),
        correctAnswer: q.correct_answer,
        difficulty: q.difficulty,
        subject: q.subject,
      })),
      message: "Random questions loaded successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// NEW: Debug route to test ML service specifically
router.get("/debug/ml", async (req, res) => {
  try {
    const mlService = require("../../../../helpers/mlService");
    
    // Check ML service health
    console.log("🔍 Checking ML service health...");
    const isHealthy = await mlService.checkHealth();
    console.log("✅ ML service health result:", isHealthy);
    
    let testAnalysis = null;
    let analysisError = null;
    
    if (isHealthy && isHealthy.healthy) {
      // Test ML analysis with a sample question
      try {
        console.log("🧠 Testing ML analysis...");
        testAnalysis = await mlService.analyzeQuestion({
          question_text: "What is the capital of Nigeria?",
          question_type: "multiple_choice",
          subject: "Geography",
          correct_answer: "B"
        });
        console.log("📊 ML analysis result:", JSON.stringify(testAnalysis, null, 2));
      } catch (error) {
        console.error("❌ ML analysis error:", error);
        analysisError = error.message;
      }
    }
    
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      mlService: {
        healthy: isHealthy,
        testAnalysis: testAnalysis,
        analysisError: analysisError,
        message: (isHealthy && isHealthy.healthy) ? "ML service is working" : "ML service is not available"
      }
    });
    
  } catch (error) {
    console.error("💥 ML debug error:", error);
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// NEW: Debug route to test student authentication
router.get("/debug/auth/:matricNumber/:firstName", async (req, res) => {
  try {
    const { matricNumber, firstName } = req.params;
    const edutestModel = require("../../../../models/edutestModel");

    // Test authentication (same as login does)
    const student = await edutestModel.authenticateStudent(
      matricNumber,
      firstName
    );

    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      matricNumber: matricNumber,
      firstName: firstName,
      authenticated: !!student,
      studentInfo: student
        ? {
            id: student.id,
            matric_number: student.matric_number,
            full_name: student.full_name,
            scores: student.scores,
          }
        : null,
      message: student ? "Authentication successful" : "Authentication failed",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Production login test route
router.get("/test-login", (req, res) => {
  res.send(`
    <html>
    <head><title>Login Test</title></head>
    <body>
      <h2>Production Login Test</h2>
      <form action="/edu/etest/proceed" method="post">
        <div style="margin: 10px;">
          <label>Username:</label>
          <input type="text" name="loginUsername" value="2024/55022" required>
        </div>
        <div style="margin: 10px;">
          <label>Password:</label>
          <input type="text" name="loginPassword" value="abdulhamid" required>
        </div>
        <button type="submit" style="margin: 10px; padding: 10px;">Test Login</button>
      </form>
      
      <h3>Debug Info:</h3>
      <p>Environment: ${process.env.NODE_ENV}</p>
      <p>HTTPS: ${process.env.USE_HTTPS}</p>
      <p>Protocol: ${req.protocol}</p>
      <p>Secure: ${req.secure}</p>
      <p>Host: ${req.get("Host")}</p>
    </body>
    </html>
  `);
});

// NEW: Comprehensive test dashboard
router.get("/test-dashboard", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Yiniz Test Environment Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; }
            .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { border-left: 5px solid #4CAF50; }
            .error { border-left: 5px solid #f44336; }
            .warning { border-left: 5px solid #ff9800; }
            .info { border-left: 5px solid #2196F3; }
            h1 { color: #333; text-align: center; }
            h2 { color: #555; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            button { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
            button:hover { background: #45a049; }
            .btn-info { background: #2196F3; } .btn-info:hover { background: #1976D2; }
            .btn-warning { background: #ff9800; } .btn-warning:hover { background: #f57c00; }
            pre { background: #f8f8f8; padding: 15px; border-radius: 4px; overflow-x: auto; }
            .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 Yiniz Test Environment Dashboard</h1>
            
            <div class="card info">
                <h2>🔧 Quick Tests</h2>
                <button onclick="testDatabase()">Test Database & Questions</button>
                <button onclick="testQuestions()" class="btn-info">Test Question Loading</button>
                <button onclick="testAuth()" class="btn-warning">Test Student Auth</button>
                <button onclick="testLogin()">Go to Login Test</button>
            </div>
            
            <div class="status-grid">
                <div class="card" id="db-status">
                    <h3>📊 Database Status</h3>
                    <p>Click "Test Database & Questions" to check</p>
                </div>
                
                <div class="card" id="questions-status">
                    <h3>❓ Questions Status</h3>
                    <p>Click "Test Question Loading" to check</p>
                </div>
                
                <div class="card" id="auth-status">
                    <h3>🔐 Authentication Status</h3>
                    <p>Click "Test Student Auth" to check</p>
                </div>
            </div>
            
            <div class="card" id="results">
                <h2>📋 Test Results</h2>
                <pre id="output">No tests run yet. Click the buttons above to start testing.</pre>
            </div>
        </div>
        
        <script>
            async function testDatabase() {
                updateOutput('🔄 Testing database connection and questions...');
                try {
                    const response = await fetch('/edu/debug/database');
                    const data = await response.json();
                    
                    document.getElementById('db-status').className = 'card ' + (data.status === 'success' ? 'success' : 'error');
                    document.getElementById('db-status').innerHTML = \`
                        <h3>📊 Database Status</h3>
                        <p><strong>Status:</strong> \${data.status}</p>
                        <p><strong>Connected:</strong> \${data.database?.connected ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Questions:</strong> \${data.database?.questionsTotal || 0}</p>
                        <p><strong>Students:</strong> \${data.database?.studentsTotal || 0}</p>
                    \`;
                    
                    updateOutput(JSON.stringify(data, null, 2));
                } catch (error) {
                    updateOutput('❌ Database test failed: ' + error.message);
                    document.getElementById('db-status').className = 'card error';
                }
            }
            
            async function testQuestions() {
                updateOutput('🔄 Testing question randomization...');
                try {
                    const response = await fetch('/edu/debug/questions');
                    const data = await response.json();
                    
                    document.getElementById('questions-status').className = 'card ' + (data.status === 'success' ? 'success' : 'error');
                    document.getElementById('questions-status').innerHTML = \`
                        <h3>❓ Questions Status</h3>
                        <p><strong>Status:</strong> \${data.status}</p>
                        <p><strong>Random Questions:</strong> \${data.questionsCount || 0}</p>
                        <p><strong>All Have Options:</strong> \${data.questions?.every(q => q.hasOptions) ? '✅ Yes' : '❌ No'}</p>
                    \`;
                    
                    updateOutput(JSON.stringify(data, null, 2));
                } catch (error) {
                    updateOutput('❌ Questions test failed: ' + error.message);
                    document.getElementById('questions-status').className = 'card error';
                }
            }
            
            async function testAuth() {
                updateOutput('🔄 Testing student authentication...');
                try {
                    const response = await fetch('/edu/debug/auth/2024/55022/abdulhamid');
                    const data = await response.json();
                    
                    document.getElementById('auth-status').className = 'card ' + (data.authenticated ? 'success' : 'error');
                    document.getElementById('auth-status').innerHTML = \`
                        <h3>🔐 Authentication Status</h3>
                        <p><strong>Test Student:</strong> 2024/55022 (abdulhamid)</p>
                        <p><strong>Authenticated:</strong> \${data.authenticated ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Student Found:</strong> \${data.studentInfo ? '✅ Yes' : '❌ No'}</p>
                    \`;
                    
                    updateOutput(JSON.stringify(data, null, 2));
                } catch (error) {
                    updateOutput('❌ Auth test failed: ' + error.message);
                    document.getElementById('auth-status').className = 'card error';
                }
            }
            
            function testLogin() {
                window.open('/edu/test-login', '_blank');
            }
            
            function updateOutput(text) {
                document.getElementById('output').textContent = text;
            }
            
            // Auto-run tests on page load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    testDatabase();
                    setTimeout(() => testQuestions(), 1000);
                    setTimeout(() => testAuth(), 2000);
                }, 500);
            });
        </script>
    </body>
    </html>
  `);
});

// login page
router.get("/etest", (req, res) => {
  return res.render("edutech/etest/login", {
    flashMessages: req.flash("error"),
  });
});

// POST route to handle login
router.post("/etest/proceed", edutestController.login);

router.get("/test/getQuestions", (req, res) => {
  return edutestController.getRandomQuestions(req, res);
});

// Route using isAuthenticated middleware
router.get("/test/welcome", edutestController.isAuthenticated, (req, res) => {
  return res.render("edutech/etest/intro-page", {
    flashMessages: req.flash("error"),
  });
});

// Route using isAuthenticated middleware
router.get("/test/session", edutestController.isAuthenticated, (req, res) => {
  return res.render("edutech/etest/index", {
    flashMessages: req.flash("error"),
    username: res.locals.username, // Pass the username to the view
  });
});

// POST route to update user's scores
router.post("/test/update-score", edutestController.updateUserScores);

router.get(
  "/test/session-ended",
  edutestController.scoresAuthenticate,
  edutestController.sessionEnded
);

router.get("/logout", edutestController.logout);

// Route to render the scoreboard page, protected with authentication logic
router.get(
  "/test/scores",
  edutestController.scoresAuthenticate,
  edutestController.showScores
);

// NEW: ML Dashboard route (for teachers/admins)
router.get("/ml/dashboard", (req, res) => {
  res.render("edutech/etest/ml-dashboard");
});

// NEW ML-powered routes for teacher insights
router.get(
  "/insights/question/:questionId",
  edutestController.getQuestionInsights
);
router.get("/insights/overall", edutestController.getOverallInsights);
router.post("/ml/train", edutestController.trainMLModels);

module.exports = router;
