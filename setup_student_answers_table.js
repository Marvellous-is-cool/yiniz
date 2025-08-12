const db = require('./models/connection');

async function createStudentAnswersTable() {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS yiniz_student_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        question_id INT NOT NULL,
        answer_text TEXT,
        time_spent INT DEFAULT 0,
        actual_score TINYINT DEFAULT 0,
        predicted_score DECIMAL(3,2) NULL,
        comprehension_cluster VARCHAR(50) NULL,
        ml_analysis TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_student_id (student_id),
        INDEX idx_question_id (question_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await db.execute(createTableSQL);
    console.log('✅ yiniz_student_answers table created successfully');
    
    // Also add the student_answers table name (without yiniz_ prefix for compatibility)
    const createAliasTableSQL = `
      CREATE TABLE IF NOT EXISTS student_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        question_id INT NOT NULL,
        answer_text TEXT,
        time_spent INT DEFAULT 0,
        actual_score TINYINT DEFAULT 0,
        predicted_score DECIMAL(3,2) NULL,
        comprehension_cluster VARCHAR(50) NULL,
        ml_analysis TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_student_id (student_id),
        INDEX idx_question_id (question_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await db.execute(createAliasTableSQL);
    console.log('✅ student_answers table created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating student_answers table:', error);
    process.exit(1);
  }
}

createStudentAnswersTable();
