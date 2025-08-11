#!/usr/bin/env node

console.log("🔍 DEBUGGING EDU/ETEST LOGIN ISSUES...\n");

async function debugLogin() {
  try {
    // Load environment variables
    require("dotenv").config();

    // Test 1: Check Environment Variables
    console.log("1️⃣ Environment Variables:");
    console.log("   MYSQL_HOST:", process.env.MYSQL_HOST);
    console.log("   MYSQL_USER:", process.env.MYSQL_USER);
    console.log(
      "   MYSQL_PASSWORD:",
      process.env.MYSQL_PASSWORD ? "***hidden***" : "MISSING!"
    );
    console.log("   MYSQL_DATABASE:", process.env.MYSQL_DATABASE);
    console.log("   MYSQL_PORT:", process.env.MYSQL_PORT);

    // Test 2: Test Database Connection
    console.log("\n2️⃣ Testing Database Connection...");
    try {
      const db = require("./models/connection");

      // Wait a bit for connection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (db.isDbConnected()) {
        console.log("   ✅ Database connected successfully");

        // Test 3: Check Test Students Table
        console.log("\n3️⃣ Checking Test Students...");
        const [students] = await db.execute(
          "SELECT * FROM yiniz_teststudents LIMIT 5"
        );
        console.log(`   ✅ Found ${students.length} test students:`);
        students.forEach((student) => {
          console.log(
            `      ${student.matric_number} - ${student.full_name} (Score: ${student.scores})`
          );
        });

        // Test 4: Check Test Sessions
        console.log("\n4️⃣ Checking Test Sessions...");
        const [sessions] = await db.execute(
          "SELECT * FROM yiniz_test_sessions WHERE is_active = 1"
        );
        console.log(`   ✅ Found ${sessions.length} active test sessions:`);

        const currentHour = new Date().getHours();
        console.log(`   Current hour: ${currentHour}`);

        sessions.forEach((session) => {
          const isActive =
            currentHour >= session.starthour && currentHour < session.endhour;
          const status = isActive ? "🟢 ACTIVE NOW" : "🔴 INACTIVE";
          console.log(
            `      ${session.session_name}: ${session.starthour}:00 - ${session.endhour}:00 ${status}`
          );
        });

        // Test 5: Test Login Logic
        console.log("\n5️⃣ Testing Login Logic...");
        const testCredentials = [
          { username: "LIN/2021/001", password: "John" },
          { username: "LIN/2021/002", password: "Jane" },
          { username: "LIN/2021/003", password: "Mike" },
        ];

        for (const cred of testCredentials) {
          try {
            const [rows] = await db.execute(
              "SELECT * FROM yiniz_teststudents WHERE matric_number = ? AND SUBSTRING_INDEX(full_name, ' ', 1) = ?",
              [cred.username, cred.password]
            );

            if (rows.length > 0) {
              const student = rows[0];
              console.log(
                `   ✅ Login SUCCESS: ${cred.username}/${cred.password} - ${student.full_name}`
              );

              // Check if already completed test
              if (student.scores > 0) {
                console.log(
                  `      ⚠️  Already completed test with score: ${student.scores}`
                );
              } else {
                console.log(
                  `      🎯 Ready to take test (current score: ${student.scores})`
                );
              }
            } else {
              console.log(
                `   ❌ Login FAILED: ${cred.username}/${cred.password}`
              );
            }
          } catch (error) {
            console.log(
              `   ❌ Login ERROR for ${cred.username}: ${error.message}`
            );
          }
        }

        // Test 6: Check Questions
        console.log("\n6️⃣ Checking Test Questions...");
        const [questions] = await db.execute(
          "SELECT COUNT(*) as count FROM yiniz_etest"
        );
        console.log(`   ✅ Found ${questions[0].count} questions in database`);
      } else {
        console.log("   ❌ Database not connected");
        console.log(
          "   🔧 SOLUTION: Check MySQL server is running and credentials are correct"
        );
      }
    } catch (dbError) {
      console.log("   ❌ Database connection failed:", dbError.message);
      console.log("   🔧 SOLUTIONS:");
      console.log("      1. Make sure MySQL server is running");
      console.log('      2. Verify database "yiniz_db" exists');
      console.log("      3. Check credentials in .env file");
      console.log("      4. Import the database schema if not done");
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎯 COMMON ISSUES & SOLUTIONS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("1. DATABASE NOT CONNECTED:");
    console.log("   • Start MySQL: brew services start mysql");
    console.log(
      "   • Import schema: mysql -u coolbuoy -p yiniz_db < database/yiniz_complete_schema.sql"
    );
    console.log("");
    console.log("2. LOGIN FAILS WITH CORRECT CREDENTIALS:");
    console.log("   • Check test session time windows");
    console.log("   • Verify student data exists in database");
    console.log("   • Check if student already completed test (score > 0)");
    console.log("");
    console.log("3. SESSION TIME ISSUE:");
    console.log("   • Update session hours in yiniz_test_sessions table");
    console.log("   • Or temporarily disable time check in controller");
  } catch (error) {
    console.error("Debug script failed:", error.message);
  }
}

debugLogin();
