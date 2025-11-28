-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255), -- Added password column
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    cuatrimestre INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Completed Lessons Table
CREATE TABLE IF NOT EXISTS completed_lessons (
    user_id INT,
    lesson_id INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Completed Quizzes Table
CREATE TABLE IF NOT EXISTS completed_quizzes (
    user_id INT,
    quiz_id INT,
    score INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, quiz_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    user_id INT,
    achievement_id VARCHAR(50),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Assigned Courses Table (for teachers/admin assignments)
CREATE TABLE IF NOT EXISTS assigned_courses (
    user_id INT,
    course_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
