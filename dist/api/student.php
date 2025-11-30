<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');
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
    if ($action === 'get_bookmarks') {
        $userId = $_GET['user_id'];
        $stmt = $pdo->prepare("SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $bookmarks = $stmt->fetchAll();
        
        // Transform for frontend
        $formatted = array_map(function($b) {
            return [
                'courseId' => $b['course_id'],
                'lessonId' => $b['lesson_id'],
                'courseTitle' => $b['course_title'],
                'lessonTitle' => $b['lesson_title'],
                'timestamp' => strtotime($b['created_at']) * 1000
            ];
        }, $bookmarks);
        
        echo json_encode(['success' => true, 'bookmarks' => $formatted]);
    } elseif ($action === 'get_calendar_events') {
        // For now, return all events. In future, filter by user's courses
        $stmt = $pdo->prepare("SELECT * FROM calendar_events WHERE event_date >= NOW() ORDER BY event_date ASC");
        $stmt->execute();
        $events = $stmt->fetchAll();
        
        $formatted = array_map(function($e) {
            return [
                'id' => $e['id'],
                'title' => $e['title'],
                'date' => $e['event_date'],
                'type' => $e['type'],
                'course' => 'General' // Placeholder, join with courses table if needed
            ];
        }, $events);
        
        echo json_encode(['success' => true, 'events' => $formatted]);
    } elseif ($action === 'get_grades') {
        $userId = $_GET['user_id'];
        $stmt = $pdo->prepare("SELECT * FROM grades WHERE user_id = ?");
        $stmt->execute([$userId]);
        $grades = $stmt->fetchAll();
        echo json_encode(['success' => true, 'grades' => $grades]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'save_bookmark') {
        $userId = $data->user_id;
        $lessonId = $data->lesson_id;
        $courseId = $data->course_id;
        $courseTitle = $data->course_title;
        $lessonTitle = $data->lesson_title;
        
        try {
            $stmt = $pdo->prepare("INSERT INTO bookmarks (user_id, lesson_id, course_id, course_title, lesson_title) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $lessonId, $courseId, $courseTitle, $lessonTitle]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Already bookmarked']);
        }
    } elseif ($action === 'remove_bookmark') {
        $userId = $data->user_id;
        $lessonId = $data->lesson_id;
        
        $stmt = $pdo->prepare("DELETE FROM bookmarks WHERE user_id = ? AND lesson_id = ?");
        $stmt->execute([$userId, $lessonId]);
        echo json_encode(['success' => true]);
    } elseif ($action === 'update_profile') {
        $userId = $data->user_id;
        $name = $data->name;
        $bio = $data->bio;
        $avatar = $data->avatar;
        $socialLinks = json_encode($data->social_links);
        
        $stmt = $pdo->prepare("UPDATE users SET name = ?, bio = ?, avatar = ?, social_links = ? WHERE id = ?");
        if ($stmt->execute([$name, $bio, $avatar, $socialLinks, $userId])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
        }
    }
}
?>
