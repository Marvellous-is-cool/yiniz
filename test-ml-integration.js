#!/usr/bin/env node

const path = require("path");

console.log("🚀 YINIZ ML INTEGRATION TEST SUITE\n");

async function runTests() {
  try {
    // Test 1: Check ML Service Connection
    console.log("1️⃣ Testing ML Service Connection...");
    try {
      const mlService = require("./helpers/mlService");
      const health = await mlService.checkHealth();

      if (health.healthy) {
        console.log("   ✅ ML Service is running and healthy");
        console.log(`   Status: ${health.status}`);
      } else {
        console.log(
          "   ⚠️  ML Service is offline - app will run in fallback mode"
        );
        console.log("   This is normal if ML service is not started yet");
      }
    } catch (error) {
      console.log("   ⚠️  ML Service connection failed:", error.message);
    }

    // Test 2: Check Database Connection
    console.log("\n2️⃣ Testing Database Connection...");
    try {
      const db = require("./models/connection");
      if (db.isDbConnected && db.isDbConnected()) {
        console.log("   ✅ Database connection established");
      } else {
        console.log("   ⚠️  Database not connected - using dummy data");
      }
    } catch (error) {
      console.log("   ⚠️  Database connection failed:", error.message);
    }

    // Test 3: Check Core Components
    console.log("\n3️⃣ Testing Core Components...");

    const components = [
      { name: "ML Service Client", path: "./helpers/mlService.js" },
      {
        name: "Edutest Controller",
        path: "./controllers/edutestController.js",
      },
      { name: "Edutest Model", path: "./models/edutestModel.js" },
      { name: "Database Connection", path: "./models/connection.js" },
    ];

    for (const component of components) {
      try {
        require(component.path);
        console.log(`   ✅ ${component.name} - loaded successfully`);
      } catch (error) {
        console.log(`   ❌ ${component.name} - failed: ${error.message}`);
      }
    }

    // Test 4: Check File Structure
    console.log("\n4️⃣ Testing File Structure...");
    const fs = require("fs");

    const requiredFiles = [
      "helpers/mlService.js",
      "views/edutech/etest/ml-dashboard.ejs",
      "public/js/etest/testSession.js",
      "database/yiniz_complete_schema.sql",
      "ML_INTEGRATION_README.md",
    ];

    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        console.log(`   ✅ ${file} - exists`);
      } else {
        console.log(`   ❌ ${file} - missing`);
      }
    }

    // Test 5: Functional Test with Sample Data
    console.log("\n5️⃣ Testing with Sample Data...");
    try {
      const edutestModel = require("./models/edutestModel");
      const questions = await edutestModel.getRandomQuestions(5);
      console.log(`   ✅ Retrieved ${questions.length} sample questions`);

      if (questions.length > 0) {
        console.log(
          `   Sample question: "${questions[0].question.substring(0, 50)}..."`
        );
      }
    } catch (error) {
      console.log("   ⚠️  Sample data test failed:", error.message);
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 TEST SUITE COMPLETE!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n🚀 NEXT STEPS:");
    console.log("1. Import the database schema: yiniz_complete_schema.sql");
    console.log("2. Start the ML service on localhost:8000 (if you have it)");
    console.log("3. Start your Yiniz server: npm start");
    console.log("4. Test with students: http://localhost:3000/edutech/etest");
    console.log(
      "5. View analytics: http://localhost:3000/edutech/etest/ml-dashboard"
    );

    console.log("\n💡 TESTING FLOW:");
    console.log(
      "   Students → Take tests → Data collected → ML analysis → Teacher insights"
    );
    console.log(
      "   The more students take tests, the better the ML predictions become!"
    );
  } catch (error) {
    console.error("Test suite failed:", error);
  }
}

runTests();
