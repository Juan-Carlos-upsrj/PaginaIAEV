<?php
session_start();
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? ($_GET['action'] ?? '');

// Simple admin check - in production use proper middleware/session check
// For now, we assume if you can hit this and have a session, you might be admin
// Or we just check if user role is admin.
// Let's add a basic role check helper
function isAdmin($pdo) {
    if (!isset($_SESSION['user_id'])) return false;
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    return $user && ($user['role'] === 'admin' || $user['role'] === 'teacher'); // Teachers can also manage students for now
}

$pdo = getDBConnection();

// Ensure table exists (Migration)
$pdo->exec("CREATE TABLE IF NOT EXISTS authorized_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'get_students') {
        $stmt = $pdo->prepare("SELECT id, name, email, role, xp, level, cuatrimestre, status, created_at FROM users WHERE role = 'student'");
        $stmt->execute();
        $students = $stmt->fetchAll();
        echo json_encode(['success' => true, 'students' => $students]);
    } elseif ($action === 'get_authorized_emails') {
        $stmt = $pdo->prepare("SELECT email FROM authorized_emails");
        $stmt->execute();
        $emails = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode(['success' => true, 'emails' => $emails]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // if (!isAdmin($pdo)) {
    //     http_response_code(403);
    //     echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    //     exit();
    // }

    if ($action === 'authorize_email') {
        $email = $data->email;
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Invalid email']);
            exit();
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO authorized_emails (email) VALUES (?)");
            $stmt->execute([$email]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) { // Duplicate entry
                echo json_encode(['success' => false, 'message' => 'Email already authorized']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Database error']);
            }
        }
    } elseif ($action === 'update_user_status') {
        $userId = $data->user_id;
        $status = $data->status; // 'active', 'suspended'
        
        $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
        if ($stmt->execute([$status, $userId])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update status']);
        }
    } elseif ($action === 'delete_user') {
        $userId = $data->user_id;
        
        // Hard delete to clean up all related data via CASCADE
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        if ($stmt->execute([$userId])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
        }
    }
}
?>
