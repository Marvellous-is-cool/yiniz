-- ==============================================
-- YINIZ PROJECT - MYSQL SCHEMA (FIXED)
-- Compatible with MySQL 5.7+ and 8.0+
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

-- Test questions table
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subject (subject),
    INDEX idx_difficulty (difficulty)
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
-- 6. SAMPLE DATA INSERTION
-- ==============================================

-- Insert sample test students
INSERT IGNORE INTO yiniz_teststudents (matric_number, full_name, scores) VALUES
('LIN/2021/001', 'John Doe', 0),
('LIN/2021/002', 'Jane Smith', 0),
('LIN/2021/003', 'Mike Johnson', 0),
('LIN/2021/004', 'Sarah Wilson', 0),
('LIN/2021/005', 'David Brown', 0);

-- Insert sample test questions
INSERT IGNORE INTO yiniz_etest (question, option_a, option_b, option_c, option_d, correct_answer, subject) VALUES
('What is the capital of Nigeria?', 'Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'B', 'Geography'),
('Which programming language is known for web development?', 'Python', 'JavaScript', 'C++', 'Java', 'B', 'Computer Science'),
('What is 15 + 25?', '30', '35', '40', '45', 'C', 'Mathematics'),
('Who wrote "Things Fall Apart"?', 'Wole Soyinka', 'Chinua Achebe', 'Chimamanda Adichie', 'Ben Okri', 'B', 'Literature'),
('What is the chemical symbol for water?', 'H2O', 'CO2', 'NaCl', 'O2', 'A', 'Chemistry');

-- Insert sample test sessions
INSERT IGNORE INTO yiniz_test_sessions (session_name, starthour, endhour, is_active) VALUES
('Morning Session', 8, 17, TRUE),
('Evening Session', 18, 20, TRUE);

-- Insert sample blogger (password should be hashed in real usage)
INSERT IGNORE INTO yiniz_bloggers (username, password, country, dob) VALUES
('admin_blogger', '$2b$10$hash_here', 'Nigeria', '1990-01-01');

-- Insert sample admin user
INSERT IGNORE INTO yiniz_submitusers (username, password, role) VALUES
('Admin', '$2b$10$hash_here', 'admin'),
('student1', '$2b$10$hash_here', 'student');

-- Insert sample seller
INSERT IGNORE INTO yiniz_sellers (seller_name, email, business_name, is_verified, is_active) VALUES
('Test Seller', 'seller@example.com', 'Test Business', TRUE, TRUE);

-- Insert sample product
INSERT IGNORE INTO yiniz_products (seller_id, product_name, description, price, stock_quantity, category, is_active) VALUES
(1, 'Sample Product', 'This is a sample product description', 29.99, 100, 'Electronics', TRUE);

-- ==============================================
-- SETUP COMPLETE
-- ==============================================

SELECT 'MySQL database schema created successfully!' as status;
