<?php
require_once 'db.php';

$pdo = getDBConnection();

echo "Running migrations...<br>";

// 1. Users Table Updates (Ensure columns exist)
// We can't easily check columns in a portable way without complex queries, 
// so we'll just try to add them and ignore errors if they exist, or use a more robust migration system.
// For this prototype, we'll assume the basic users table exists and we might need to add columns.
// A better approach for a prototype is to just create the table if it doesn't exist with all columns.

$sql_users = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    avatar VARCHAR(255),
    bio TEXT,
    social_links JSON,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    cuatrimestre INT DEFAULT 1,
    group_name VARCHAR(50),
    status ENUM('active', 'suspended', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$pdo->exec($sql_users);
echo "Users table checked.<br>";

// 2. Groups Table
$sql_groups = "CREATE TABLE IF NOT EXISTS student_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$pdo->exec($sql_groups);
echo "Groups table checked.<br>";

// 3. Calendar Events
$sql_events = "CREATE TABLE IF NOT EXISTS calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    type ENUM('assignment', 'quiz', 'class', 'other') NOT NULL,
    course_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$pdo->exec($sql_events);
echo "Calendar Events table checked.<br>";

// 4. Bookmarks
$sql_bookmarks = "CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    course_id INT NOT NULL,
    course_title VARCHAR(255),
    lesson_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_bookmark (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)";
$pdo->exec($sql_bookmarks);
echo "Bookmarks table checked.<br>";

// 5. Grades / Academic Record
$sql_grades = "CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id VARCHAR(50) NOT NULL,
    grade DECIMAL(4, 2),
    status ENUM('enrolled', 'completed', 'pending', 'failed') DEFAULT 'pending',
    quarter_id INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_grade (user_id, subject_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)";
$pdo->exec($sql_grades);
echo "Grades table checked.<br>";

// 6. Authorized Emails (already in admin.php but good to have here)
$sql_auth_emails = "CREATE TABLE IF NOT EXISTS authorized_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$pdo->exec($sql_auth_emails);
echo "Authorized Emails table checked.<br>";

// 7. Teacher Assignments
$sql_assignments = "CREATE TABLE IF NOT EXISTS teacher_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    course_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_assignment (teacher_id, course_id),
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
)";
$pdo->exec($sql_assignments);
echo "Teacher Assignments table checked.<br>";

echo "Migrations completed successfully.";
?>
