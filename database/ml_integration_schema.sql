-- ML Integration Database Schema Updates for Yiniz
-- Run this after your existing yiniz_mysql_clean.sql

-- Add ML prediction columns to existing yiniz_etest table
ALTER TABLE yiniz_etest 
ADD COLUMN predicted_difficulty ENUM('easy', 'medium', 'hard') NULL DEFAULT NULL,
ADD COLUMN prediction_confidence DECIMAL(3,2) NULL DEFAULT NULL,
ADD COLUMN calculated_difficulty ENUM('easy', 'medium', 'hard') NULL DEFAULT NULL,
ADD COLUMN difficulty_confidence DECIMAL(3,2) NULL DEFAULT NULL,
ADD COLUMN performance_metrics JSON NULL DEFAULT NULL,
ADD COLUMN question_type VARCHAR(50) DEFAULT 'multiple_choice',
ADD COLUMN subject VARCHAR(100) DEFAULT 'General',
ADD COLUMN last_analyzed TIMESTAMP NULL DEFAULT NULL;

-- Create table to store student answers with ML analysis
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

-- Create table to store ML model training history
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

-- Create table to store question difficulty alerts
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

-- Insert sample data for testing (optional)
INSERT INTO yiniz_ml_training_history (model_type, training_accuracy, test_accuracy, samples_used, feature_count, training_duration, model_version)
VALUES 
    ('difficulty', 0.847, 0.823, 150, 45, 23, 'v1.0'),
    ('score', 0.892, 0.876, 180, 52, 31, 'v1.0'),
    ('comprehension', 0.789, 0.765, 120, 38, 19, 'v1.0');

-- Update existing questions with sample ML predictions (for demonstration)
UPDATE yiniz_etest 
SET 
    predicted_difficulty = CASE 
        WHEN CHAR_LENGTH(question) < 50 THEN 'easy'
        WHEN CHAR_LENGTH(question) < 100 THEN 'medium'
        ELSE 'hard'
    END,
    prediction_confidence = 0.75 + (RAND() * 0.20), -- Random confidence between 0.75-0.95
    question_type = 'multiple_choice',
    subject = CASE 
        WHEN question LIKE '%math%' OR question LIKE '%calculate%' OR question LIKE '%number%' THEN 'Mathematics'
        WHEN question LIKE '%science%' OR question LIKE '%biology%' OR question LIKE '%physics%' THEN 'Science'
        WHEN question LIKE '%history%' OR question LIKE '%war%' OR question LIKE '%president%' THEN 'History'
        WHEN question LIKE '%language%' OR question LIKE '%grammar%' OR question LIKE '%literature%' THEN 'Language'
        ELSE 'General Knowledge'
    END,
    last_analyzed = CURRENT_TIMESTAMP
WHERE predicted_difficulty IS NULL;

-- Create indexes for better performance
CREATE INDEX idx_question_difficulty ON yiniz_etest(predicted_difficulty, calculated_difficulty);
CREATE INDEX idx_question_subject ON yiniz_etest(subject);
CREATE INDEX idx_question_confidence ON yiniz_etest(prediction_confidence);

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
    SUM(CASE WHEN sa.actual_score >= 0.6 THEN 1 ELSE 0 END) / COUNT(sa.id) as success_rate,
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

-- Sample alert for demonstration
INSERT INTO yiniz_question_alerts (question_id, alert_type, description, success_rate, confidence, sample_size)
SELECT 
    id, 
    'too_hard' as alert_type,
    CONCAT('Question has low success rate: only ', ROUND(RAND() * 30, 1), '% of students answered correctly') as description,
    RAND() * 0.3 as success_rate,
    0.85 as confidence,
    FLOOR(15 + RAND() * 20) as sample_size
FROM yiniz_etest 
WHERE CHAR_LENGTH(question) > 150 
LIMIT 2;

COMMIT;

-- Verify the updates
SELECT 'ML schema updates completed successfully!' as status;
SELECT COUNT(*) as questions_with_predictions FROM yiniz_etest WHERE predicted_difficulty IS NOT NULL;
SELECT COUNT(*) as total_questions FROM yiniz_etest;
