-- ==============================================
-- YINIZ PROJECT - COMPLETE MYSQL SCHEMA
-- Compatible with MySQL 5.7+ and 8.0+
-- Includes ML Integration Features
-- Date: August 11, 2025
-- ==============================================

-- Create database
CREATE DATABASE IF NOT EXISTS yiniz_db;
USE yiniz_db;

-- Set charset for proper unicode support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ==============================================
-- 1. EDUTEST MODULE TABLES
-- ==============================================

-- Test students table
CREATE TABLE IF NOT EXISTS yiniz_teststudents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matric_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    scores INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_matric_number (matric_number),
    INDEX idx_scores (scores)
);

-- Test questions table (Enhanced with ML features)
CREATE TABLE IF NOT EXISTS yiniz_etest (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    subject VARCHAR(100) DEFAULT 'General',
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    -- ML Integration Fields
    predicted_difficulty ENUM('easy', 'medium', 'hard') NULL DEFAULT NULL,
    prediction_confidence DECIMAL(3,2) NULL DEFAULT NULL,
    calculated_difficulty ENUM('easy', 'medium', 'hard') NULL DEFAULT NULL,
    difficulty_confidence DECIMAL(3,2) NULL DEFAULT NULL,
    performance_metrics JSON NULL DEFAULT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice',
    last_analyzed TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subject (subject),
    INDEX idx_difficulty (difficulty),
    INDEX idx_question_difficulty (predicted_difficulty, calculated_difficulty),
    INDEX idx_question_subject (subject),
    INDEX idx_question_confidence (prediction_confidence)
);

-- Test sessions table
CREATE TABLE IF NOT EXISTS yiniz_test_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_name VARCHAR(100) NOT NULL,
    starthour INT NOT NULL,
    endhour INT NOT NULL,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_sessions (is_active, starthour, endhour)
);

-- Student answers with ML analysis
CREATE TABLE IF NOT EXISTS yiniz_student_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(50) NOT NULL,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    time_spent INT DEFAULT 0 COMMENT 'Time spent in seconds',
    actual_score DECIMAL(3,2) DEFAULT 0,
    predicted_score DECIMAL(3,2) NULL DEFAULT NULL,
    comprehension_cluster INT NULL DEFAULT NULL,
    ml_analysis JSON NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (question_id) REFERENCES yiniz_etest(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES yiniz_teststudents(matric_number) ON DELETE CASCADE,
    
    INDEX idx_student_question (student_id, question_id),
    INDEX idx_question_time (question_id, created_at),
    INDEX idx_student_time (student_id, created_at)
);

-- ML model training history
CREATE TABLE IF NOT EXISTS yiniz_ml_training_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    model_type ENUM('difficulty', 'score', 'comprehension') NOT NULL,
    training_accuracy DECIMAL(4,3) NULL DEFAULT NULL,
    test_accuracy DECIMAL(4,3) NULL DEFAULT NULL,
    samples_used INT DEFAULT 0,
    feature_count INT DEFAULT 0,
    training_duration INT DEFAULT 0 COMMENT 'Training time in seconds',
    model_version VARCHAR(20) NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_model_time (model_type, created_at)
);

-- Question difficulty alerts
CREATE TABLE IF NOT EXISTS yiniz_question_alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    alert_type ENUM('too_easy', 'too_hard', 'confusing', 'mismatch') NOT NULL,
    description TEXT NULL,
    success_rate DECIMAL(4,3) NULL DEFAULT NULL,
    confidence DECIMAL(3,2) NULL DEFAULT NULL,
    sample_size INT DEFAULT 0,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (question_id) REFERENCES yiniz_etest(id) ON DELETE CASCADE,
    
    INDEX idx_question_alert (question_id, alert_type),
    INDEX idx_resolved_time (resolved, created_at)
);

-- ==============================================
-- 2. BLOG MODULE TABLES
-- ==============================================

-- Bloggers table
CREATE TABLE IF NOT EXISTS yiniz_bloggers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_active_bloggers (is_active)
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS yiniz_bloggerposts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blogger_username VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    category VARCHAR(100) DEFAULT 'General',
    likes INT DEFAULT 0,
    views INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (blogger_username) REFERENCES yiniz_bloggers(username) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_blogger_posts (blogger_username),
    INDEX idx_category (category),
    INDEX idx_published (is_published),
    INDEX idx_created_date (created_at DESC)
);

-- Post likes tracking table
CREATE TABLE IF NOT EXISTS yiniz_post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES yiniz_bloggerposts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (post_id, ip_address),
    INDEX idx_post_likes (post_id),
    INDEX idx_ip_likes (ip_address)
);

-- Post dislikes tracking table
CREATE TABLE IF NOT EXISTS yiniz_post_dislikes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES yiniz_bloggerposts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_dislike (post_id, ip_address),
    INDEX idx_post_dislikes (post_id),
    INDEX idx_ip_dislikes (ip_address)
);

-- ==============================================
-- 3. ASSIGNMENT SUBMISSION MODULE TABLES
-- ==============================================

-- Submission users table
CREATE TABLE IF NOT EXISTS yiniz_submitusers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    email VARCHAR(255) DEFAULT NULL,
    full_name VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_active_users (is_active)
);

-- Assignment submissions table
CREATE TABLE IF NOT EXISTS yiniz_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    level VARCHAR(10) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) DEFAULT NULL,
    file_size BIGINT DEFAULT NULL,
    file_type VARCHAR(100) DEFAULT NULL,
    submission_status ENUM('pending', 'reviewed', 'approved', 'rejected') DEFAULT 'pending',
    grade VARCHAR(10) DEFAULT NULL,
    feedback TEXT DEFAULT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(50) DEFAULT NULL,
    INDEX idx_student_level (student_name, level),
    INDEX idx_submission_date (submitted_at DESC),
    INDEX idx_status (submission_status),
    INDEX idx_level (level)
);

-- ==============================================
-- 4. ECOMMERCE MODULE TABLES
-- ==============================================

-- Sellers table
CREATE TABLE IF NOT EXISTS yiniz_sellers (
    seller_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    business_name VARCHAR(255) DEFAULT NULL,
    business_type VARCHAR(100) DEFAULT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_seller_email (email),
    INDEX idx_verified_sellers (is_verified, is_active),
    INDEX idx_business_type (business_type)
);

-- Products table
CREATE TABLE IF NOT EXISTS yiniz_products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category VARCHAR(100) DEFAULT NULL,
    sub_category VARCHAR(100) DEFAULT NULL,
    product_image VARCHAR(255) DEFAULT NULL,
    sku VARCHAR(100) DEFAULT NULL,
    weight DECIMAL(8, 2) DEFAULT NULL,
    dimensions VARCHAR(100) DEFAULT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES yiniz_sellers(seller_id) ON DELETE CASCADE,
    INDEX idx_seller_products (seller_id),
    INDEX idx_category (category),
    INDEX idx_price (price),
    INDEX idx_featured (is_featured),
    INDEX idx_active_products (is_active),
    INDEX idx_stock (stock_quantity)
);

-- ==============================================
-- 5. SESSION STORAGE TABLE
-- ==============================================

-- Sessions table (for express-mysql-session)
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ==============================================
-- 6. ML ANALYTICS VIEWS
-- ==============================================

-- Create view for question analytics
CREATE VIEW yiniz_question_analytics AS
SELECT 
    q.id,
    q.question,
    q.subject,
    q.predicted_difficulty,
    q.prediction_confidence,
    q.calculated_difficulty,
    q.difficulty_confidence,
    COUNT(sa.id) as total_answers,
    AVG(sa.actual_score) as avg_score,
    AVG(sa.time_spent) as avg_time_spent,
    CASE 
        WHEN COUNT(sa.id) > 0 
        THEN SUM(CASE WHEN sa.actual_score >= 0.6 THEN 1 ELSE 0 END) / COUNT(sa.id)
        ELSE NULL 
    END as success_rate,
    STDDEV(sa.actual_score) as score_variance,
    q.last_analyzed
FROM yiniz_etest q
LEFT JOIN yiniz_student_answers sa ON q.id = sa.question_id
GROUP BY q.id, q.question, q.subject, q.predicted_difficulty, q.prediction_confidence, 
         q.calculated_difficulty, q.difficulty_confidence, q.last_analyzed;

-- Create view for student performance analytics
CREATE VIEW yiniz_student_performance AS
SELECT 
    ts.matric_number,
    ts.full_name,
    ts.scores as final_score,
    COUNT(sa.id) as questions_answered,
    AVG(sa.actual_score) as avg_question_score,
    AVG(sa.time_spent) as avg_time_per_question,
    AVG(sa.predicted_score) as avg_ml_predicted_score,
    MAX(sa.created_at) as last_activity
FROM yiniz_teststudents ts
LEFT JOIN yiniz_student_answers sa ON ts.matric_number = sa.student_id
GROUP BY ts.matric_number, ts.full_name, ts.scores;

-- ==============================================
-- 7. SAMPLE DATA INSERTION
-- ==============================================

-- Insert sample test students
INSERT IGNORE INTO yiniz_teststudents (matric_number, full_name, scores) VALUES
('LIN/2021/001', 'John Doe', 0),
('LIN/2021/002', 'Jane Smith', 0),
('LIN/2021/003', 'Mike Johnson', 0),
('LIN/2021/004', 'Sarah Wilson', 0),
('LIN/2021/005', 'David Brown', 0),
('LIN/2021/006', 'Alice Cooper', 0),
('LIN/2021/007', 'Bob Martin', 0),
('LIN/2021/008', 'Carol Davis', 0),
('LIN/2021/009', 'Daniel Garcia', 0),
('LIN/2021/010', 'Eva Rodriguez', 0);

-- Insert sample test questions with ML predictions
INSERT IGNORE INTO yiniz_etest (question, option_a, option_b, option_c, option_d, correct_answer, subject, predicted_difficulty, prediction_confidence, question_type) VALUES
('What is the capital of Nigeria?', 'Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'B', 'Geography', 'easy', 0.85, 'multiple_choice'),
('Which programming language is known for web development?', 'Python', 'JavaScript', 'C++', 'Java', 'B', 'Computer Science', 'medium', 0.78, 'multiple_choice'),
('What is 15 + 25?', '30', '35', '40', '45', 'C', 'Mathematics', 'easy', 0.92, 'multiple_choice'),
('Who wrote "Things Fall Apart"?', 'Wole Soyinka', 'Chinua Achebe', 'Chimamanda Adichie', 'Ben Okri', 'B', 'Literature', 'medium', 0.73, 'multiple_choice'),
('What is the chemical symbol for water?', 'H2O', 'CO2', 'NaCl', 'O2', 'A', 'Chemistry', 'easy', 0.95, 'multiple_choice'),
('Which planet is closest to the sun?', 'Venus', 'Earth', 'Mercury', 'Mars', 'C', 'Science', 'medium', 0.81, 'multiple_choice'),
('What is the square root of 144?', '10', '11', '12', '13', 'C', 'Mathematics', 'medium', 0.79, 'multiple_choice'),
('In which year did Nigeria gain independence?', '1958', '1959', '1960', '1961', 'C', 'History', 'medium', 0.74, 'multiple_choice'),
('What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Management Language', 'A', 'Computer Science', 'easy', 0.88, 'multiple_choice'),
('Which gas makes up most of Earth\'s atmosphere?', 'Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen', 'C', 'Science', 'hard', 0.67, 'multiple_choice'),
('What is the derivative of x²?', 'x', '2x', '2x²', 'x²/2', 'B', 'Mathematics', 'hard', 0.71, 'multiple_choice'),
('Who is the current President of Nigeria (as of 2024)?', 'Muhammadu Buhari', 'Bola Ahmed Tinubu', 'Goodluck Jonathan', 'Olusegun Obasanjo', 'B', 'Current Affairs', 'easy', 0.89, 'multiple_choice'),
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'C', 'Geography', 'easy', 0.96, 'multiple_choice'),
('Which of the following is a programming paradigm?', 'Object-Oriented', 'Functional', 'Procedural', 'All of the above', 'D', 'Computer Science', 'hard', 0.65, 'multiple_choice'),
('What is 7 × 8?', '54', '56', '58', '60', 'B', 'Mathematics', 'easy', 0.91, 'multiple_choice');

-- Insert sample test sessions
INSERT IGNORE INTO yiniz_test_sessions (session_name, starthour, endhour, is_active) VALUES
('Morning Session', 8, 17, TRUE),
('Evening Session', 18, 20, TRUE),
('Weekend Session', 10, 16, FALSE);

-- Insert sample ML training history
INSERT IGNORE INTO yiniz_ml_training_history (model_type, training_accuracy, test_accuracy, samples_used, feature_count, training_duration, model_version) VALUES 
    ('difficulty', 0.847, 0.823, 150, 45, 23, 'v1.0'),
    ('score', 0.892, 0.876, 180, 52, 31, 'v1.0'),
    ('comprehension', 0.789, 0.765, 120, 38, 19, 'v1.0');

-- Insert sample question alerts
INSERT IGNORE INTO yiniz_question_alerts (question_id, alert_type, description, success_rate, confidence, sample_size) VALUES
(10, 'too_hard', 'Question has low success rate: only 25.3% of students answered correctly', 0.253, 0.85, 18),
(14, 'too_hard', 'Question has low success rate: only 31.7% of students answered correctly', 0.317, 0.79, 22);

-- Insert sample blogger (password should be hashed in real usage)
INSERT IGNORE INTO yiniz_bloggers (username, password, country, dob, email, bio) VALUES
('admin_blogger', '$2b$10$example.hash.here', 'Nigeria', '1990-01-01', 'admin@yiniz.com', 'Admin blogger for the Yiniz platform'),
('tech_writer', '$2b$10$example.hash.here', 'Nigeria', '1985-05-15', 'tech@yiniz.com', 'Technology and education content creator');

-- Insert sample blog posts
INSERT IGNORE INTO yiniz_bloggerposts (blogger_username, title, content, category, likes, views) VALUES
('admin_blogger', 'Welcome to Yiniz Platform', 'This is the official launch of the Yiniz educational platform with AI-powered features...', 'Announcements', 15, 250),
('tech_writer', 'The Future of AI in Education', 'Machine learning is revolutionizing how we approach personalized learning...', 'Technology', 42, 380);

-- Insert sample admin user (password should be hashed in real usage)
INSERT IGNORE INTO yiniz_submitusers (username, password, role, email, full_name) VALUES
('Admin', '$2b$10$example.hash.here', 'admin', 'admin@yiniz.com', 'System Administrator'),
('student1', '$2b$10$example.hash.here', 'student', 'student1@yiniz.com', 'Test Student'),
('teacher1', '$2b$10$example.hash.here', 'admin', 'teacher1@yiniz.com', 'Test Teacher');

-- Insert sample seller
INSERT IGNORE INTO yiniz_sellers (seller_name, email, business_name, phone, address, business_type, is_verified, is_active) VALUES
('Tech Solutions Ltd', 'contact@techsolutions.ng', 'Tech Solutions Nigeria', '+234-800-123-4567', '123 Victoria Island, Lagos, Nigeria', 'Electronics', TRUE, TRUE),
('EduBooks Store', 'info@edubooks.ng', 'Educational Books Nigeria', '+234-800-987-6543', '45 Wuse II, Abuja, Nigeria', 'Books & Education', TRUE, TRUE);

-- Insert sample products
INSERT IGNORE INTO yiniz_products (seller_id, product_name, description, price, stock_quantity, category, sub_category, sku, is_featured, is_active) VALUES
(1, 'Laptop Computer', 'High-performance laptop for students and professionals', 450000.00, 25, 'Electronics', 'Computers', 'LAP-001', TRUE, TRUE),
(1, 'Scientific Calculator', 'Advanced scientific calculator for mathematics and engineering', 15000.00, 50, 'Electronics', 'Calculators', 'CALC-001', FALSE, TRUE),
(2, 'Mathematics Textbook', 'Comprehensive mathematics textbook for secondary schools', 8500.00, 100, 'Books', 'Textbooks', 'MATH-TB-001', TRUE, TRUE),
(2, 'English Literature Guide', 'Study guide for West African literature', 6200.00, 75, 'Books', 'Study Guides', 'ENG-SG-001', FALSE, TRUE);

-- ==============================================
-- 8. SAMPLE STUDENT ANSWERS FOR ML TESTING
-- ==============================================

-- Insert sample student answers with timing data
INSERT IGNORE INTO yiniz_student_answers (student_id, question_id, answer_text, time_spent, actual_score) VALUES
('LIN/2021/001', 1, 'B', 15, 1.0),
('LIN/2021/001', 2, 'B', 25, 1.0),
('LIN/2021/001', 3, 'C', 12, 1.0),
('LIN/2021/002', 1, 'A', 18, 0.0),
('LIN/2021/002', 2, 'B', 30, 1.0),
('LIN/2021/002', 3, 'B', 20, 0.0),
('LIN/2021/003', 1, 'B', 10, 1.0),
('LIN/2021/003', 2, 'A', 45, 0.0),
('LIN/2021/003', 3, 'C', 8, 1.0),
('LIN/2021/004', 1, 'B', 22, 1.0),
('LIN/2021/004', 2, 'B', 35, 1.0),
('LIN/2021/004', 3, 'C', 14, 1.0);

-- ==============================================
-- 9. FINALIZATION
-- ==============================================

-- Update question analysis timestamps
UPDATE yiniz_etest SET last_analyzed = CURRENT_TIMESTAMP WHERE predicted_difficulty IS NOT NULL;

-- Commit all changes
COMMIT;

-- ==============================================
-- SUCCESS MESSAGE AND VERIFICATION
-- ==============================================

-- Display success message
SELECT 'Yiniz MySQL database schema with ML integration created successfully!' as status;

-- Show table counts for verification
SELECT 
    'Tables Created' as info,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = DATABASE();

-- Show sample data counts
SELECT 'Sample Students' as data_type, COUNT(*) as count FROM yiniz_teststudents
UNION ALL
SELECT 'Test Questions', COUNT(*) FROM yiniz_etest
UNION ALL
SELECT 'ML Training Records', COUNT(*) FROM yiniz_ml_training_history
UNION ALL
SELECT 'Question Alerts', COUNT(*) FROM yiniz_question_alerts
UNION ALL
SELECT 'Sample Answers', COUNT(*) FROM yiniz_student_answers
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM yiniz_bloggerposts
UNION ALL
SELECT 'Products', COUNT(*) FROM yiniz_products;

-- Show ML-enabled questions
SELECT 
    CONCAT('Questions with ML predictions: ', COUNT(*)) as ml_status
FROM yiniz_etest 
WHERE predicted_difficulty IS NOT NULL;

-- ==============================================
-- READY FOR YINIZ PLATFORM! 🎉
-- ==============================================
