#!/usr/bin/env node

/**
 * Environment Setup Helper for Yiniz Project
 * Generates secure session secret and validates environment variables
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

console.log("🚀 Yiniz Project - Environment Setup Helper");
console.log("==========================================\n");

// Generate a secure session secret
const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
const envExamplePath = path.join(__dirname, ".env.example");

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log("📋 Copying .env.example to .env...");
    fs.copyFileSync(envExamplePath, envPath);
  } else {
    console.log("❌ No .env or .env.example file found!");
    process.exit(1);
  }
}

// Read current .env file
let envContent = fs.readFileSync(envPath, "utf8");

// Generate new session secret if placeholder exists
if (
  envContent.includes("generate-a-random-32-character-string-here") ||
  envContent.includes(
    "your-super-secret-session-key-change-this-to-random-string"
  )
) {
  const newSecret = generateSessionSecret();

  envContent = envContent.replace(
    /SESSION_SECRET=.*$/m,
    `SESSION_SECRET=${newSecret}`
  );

  fs.writeFileSync(envPath, envContent);

  console.log("🔐 Generated secure session secret");
  console.log(`🔑 SESSION_SECRET=${newSecret.substring(0, 10)}...\n`);
}

// Validate required environment variables
const requiredVars = [
  "MYSQL_HOST",
  "MYSQL_USER",
  "MYSQL_PASSWORD",
  "MYSQL_DATABASE",
  "SESSION_SECRET",
];

console.log("🔍 Checking environment variables...");

requiredVars.forEach((varName) => {
  const envRegex = new RegExp(`${varName}=(.+)`, "m");
  const match = envContent.match(envRegex);

  if (
    !match ||
    match[1].includes("your_") ||
    match[1].includes("change-this")
  ) {
    console.log(`⚠️  ${varName} needs to be configured`);
  } else {
    console.log(`✅ ${varName} is configured`);
  }
});

console.log("\n🎯 Next Steps:");
console.log("1. Update your .env file with real database credentials");
console.log(
  "2. For Railway: Just deploy - they auto-configure MySQL variables"
);
console.log(
  "3. For other platforms: Set environment variables in their dashboard"
);
console.log("\n🚀 Your Yiniz app is ready to deploy!");
