<?php
session_start();
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? ($_GET['action'] ?? '');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'check_session') {
    if (isset($_SESSION['user_id'])) {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Fetch additional data
            $uid = $user['id'];
            
            // Achievements
            $stmt = $pdo->prepare("SELECT achievement_id as id, unlocked_at FROM user_achievements WHERE user_id = ?");
            $stmt->execute([$uid]);
            $achievements = $stmt->fetchAll();

            // Lessons
            $stmt = $pdo->prepare("SELECT lesson_id FROM completed_lessons WHERE user_id = ?");
            $stmt->execute([$uid]);
            $lessons = $stmt->fetchAll(PDO::FETCH_COLUMN);

            // Quizzes
            $stmt = $pdo->prepare("SELECT quiz_id FROM completed_quizzes WHERE user_id = ?");
            $stmt->execute([$uid]);
            $quizzes = $stmt->fetchAll(PDO::FETCH_COLUMN);

            $user['achievements'] = $achievements;
            $user['completedLessons'] = $lessons;
            $user['completedQuizzes'] = $quizzes;
            
            unset($user['password']);
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false]);
        }
    } else {
        echo json_encode(['success' => false]);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = getDBConnection();

    if ($action === 'login') {
        $email = $data->email;
        $password = $data->password; 
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            if (password_verify($password, $user['password']) || $password === $user['password']) {
                $_SESSION['user_id'] = $user['id']; // Set session
                
                $uid = $user['id'];
                
                // Achievements
                $stmt = $pdo->prepare("SELECT achievement_id as id, unlocked_at FROM user_achievements WHERE user_id = ?");
                $stmt->execute([$uid]);
                $achievements = $stmt->fetchAll();

                // Lessons
                $stmt = $pdo->prepare("SELECT lesson_id FROM completed_lessons WHERE user_id = ?");
                $stmt->execute([$uid]);
                $lessons = $stmt->fetchAll(PDO::FETCH_COLUMN);

                // Quizzes
                $stmt = $pdo->prepare("SELECT quiz_id FROM completed_quizzes WHERE user_id = ?");
                $stmt->execute([$uid]);
                $quizzes = $stmt->fetchAll(PDO::FETCH_COLUMN);

                $user['achievements'] = $achievements;
                $user['completedLessons'] = $lessons;
                $user['completedQuizzes'] = $quizzes;
                
                unset($user['password']);
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid password']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }

    } elseif ($action === 'register') {
        $email = $data->email;
        $name = $data->name;
        $password = $data->password;
        $role = $data->role ?? 'student';
        $cuatrimestre = $data->cuatrimestre ?? 1;
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO users (email, password, name, role, cuatrimestre) VALUES (?, ?, ?, ?, ?)");
        if ($stmt->execute([$email, $hashedPassword, $name, $role, $cuatrimestre])) {
            $id = $pdo->lastInsertId();
            $_SESSION['user_id'] = $id; // Set session
            
            echo json_encode(['success' => true, 'user' => [
                'id' => $id, 
                'email' => $email, 
                'name' => $name, 
                'role' => $role,
                'achievements' => [],
                'completedLessons' => [],
                'completedQuizzes' => []
            ]]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
    } elseif ($action === 'logout') {
        session_destroy();
        echo json_encode(['success' => true]);
    }
}
?>
