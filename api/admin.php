<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// Handle CORS if needed (for development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? ($_GET['action'] ?? '');

$pdo = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'get_students') {
        $stmt = $pdo->prepare("SELECT id, name, email, role, xp, level, cuatrimestre, group_name, status, created_at FROM users WHERE role = 'student'");
        $stmt->execute();
        $students = $stmt->fetchAll();
        echo json_encode(['success' => true, 'students' => $students]);
    } elseif ($action === 'get_teachers') {
        $stmt = $pdo->prepare("SELECT id, name, email, role, bio, avatar, created_at FROM users WHERE role = 'teacher'");
        $stmt->execute();
        $teachers = $stmt->fetchAll();
        
        // Fetch assigned courses for each teacher
        foreach ($teachers as &$teacher) {
            $stmtCourses = $pdo->prepare("SELECT course_id FROM teacher_assignments WHERE teacher_id = ?");
            $stmtCourses->execute([$teacher['id']]);
            $teacher['assignedCourses'] = $stmtCourses->fetchAll(PDO::FETCH_COLUMN);
        }
        
        echo json_encode(['success' => true, 'teachers' => $teachers]);
    } elseif ($action === 'get_authorized_emails') {
        $stmt = $pdo->prepare("SELECT email FROM authorized_emails");
        $stmt->execute();
        $emails = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode(['success' => true, 'emails' => $emails]);
    } elseif ($action === 'get_groups') {
        $stmt = $pdo->prepare("SELECT name FROM student_groups ORDER BY name");
        $stmt->execute();
        $groups = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode(['success' => true, 'groups' => $groups]);
    } elseif ($action === 'get_global_stats') {
        // Calculate real stats
        $stats = [
            'averageAttendance' => 85, // Placeholder until we have attendance table
            'averageGrade' => 0,
            'totalStudents' => 0,
            'activeCourses' => 0
        ];

        // Total Students
        $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
        $stats['totalStudents'] = $stmt->fetchColumn();

        // Active Courses (assuming all courses in DB are active for now)
        $stmt = $pdo->query("SELECT COUNT(*) FROM courses");
        $stats['activeCourses'] = $stmt->fetchColumn();

        // Average Grade
        $stmt = $pdo->query("SELECT AVG(grade) FROM grades WHERE status = 'completed'");
        $avg = $stmt->fetchColumn();
        $stats['averageGrade'] = $avg ? round($avg, 1) : 0;

        echo json_encode(['success' => true, 'stats' => $stats]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
            if ($e->getCode() == 23000) {
                echo json_encode(['success' => false, 'message' => 'Email already authorized']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Database error']);
            }
        }
    } elseif ($action === 'update_user_status') {
        $userId = $data->user_id;
        $status = $data->status;
        
        $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
        if ($stmt->execute([$status, $userId])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update status']);
        }
    } elseif ($action === 'update_student') {
        $id = $data->id;
        $name = $data->name;
        $email = $data->email;
        $cuatrimestre = $data->cuatrimestre;
        $group_name = $data->group_name;

        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, cuatrimestre = ?, group_name = ? WHERE id = ?");
        if ($stmt->execute([$name, $email, $cuatrimestre, $group_name, $id])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update student']);
        }
    } elseif ($action === 'update_teacher') {
        $id = $data->id;
        $name = $data->name;
        $email = $data->email;
        $bio = $data->bio ?? '';

        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?");
        if ($stmt->execute([$name, $email, $bio, $id])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update teacher']);
        }
    } elseif ($action === 'add_group') {
        $name = strtoupper(trim($data->name));
        try {
            $stmt = $pdo->prepare("INSERT INTO student_groups (name) VALUES (?)");
            $stmt->execute([$name]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Group already exists or error']);
        }
    } elseif ($action === 'update_group') {
        $oldName = $data->old_name;
        $newName = strtoupper(trim($data->new_name));
        
        try {
            $pdo->beginTransaction();
            // Update group name in groups table
            $stmt = $pdo->prepare("UPDATE student_groups SET name = ? WHERE name = ?");
            $stmt->execute([$newName, $oldName]);
            
            // Update users who were in this group
            $stmt = $pdo->prepare("UPDATE users SET group_name = ? WHERE group_name = ?");
            $stmt->execute([$newName, $oldName]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Failed to update group']);
        }
    } elseif ($action === 'remove_group') {
        $name = $data->name;
        $stmt = $pdo->prepare("DELETE FROM student_groups WHERE name = ?");
        if ($stmt->execute([$name])) {
            // Optionally clear group from users
            $stmt = $pdo->prepare("UPDATE users SET group_name = NULL WHERE group_name = ?");
            $stmt->execute([$name]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to remove group']);
        }
    } elseif ($action === 'assign_course') {
        $teacherId = $data->teacher_id;
        $courseId = $data->course_id;
        
        try {
            $stmt = $pdo->prepare("INSERT INTO teacher_assignments (teacher_id, course_id) VALUES (?, ?)");
            $stmt->execute([$teacherId, $courseId]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Assignment already exists']);
        }
    } elseif ($action === 'delete_user') {
        $userId = $data->user_id;
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        if ($stmt->execute([$userId])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
        }
    }
}
?>
