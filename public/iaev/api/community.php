<?php
require_once 'config.php';
require_once 'db.php';

header('Content-Type: application/json');

// Handle CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDBConnection();

    if ($method === 'GET' && $action === 'get_posts') {
        $courseId = isset($_GET['course_id']) ? intval($_GET['course_id']) : null;
        $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

        $sql = "
            SELECT 
                p.id, 
                p.content, 
                p.course_id, 
                p.created_at,
                u.name as author,
                u.email as author_email,
                (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) as likes,
                (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = :current_user_id) as is_liked
            FROM posts p
            JOIN users u ON p.user_id = u.id
        ";

        $params = [':current_user_id' => $userId];

        if ($courseId) {
            $sql .= " WHERE p.course_id = :course_id";
            $params[':course_id'] = $courseId;
        }

        $sql .= " ORDER BY p.created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format posts for frontend
        $formattedPosts = array_map(function($post) {
            return [
                'id' => intval($post['id']),
                'author' => $post['author'],
                'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($post['author']) . "&background=random",
                'content' => $post['content'],
                'likes' => intval($post['likes']),
                'comments' => 0, // Comments not implemented yet
                'timeAgo' => time_elapsed_string($post['created_at']),
                'isLiked' => $post['is_liked'] > 0,
                'courseId' => $post['course_id'] ? intval($post['course_id']) : null,
                'courseName' => null // Frontend can map this if needed, or we can join with courses table if it existed in DB
            ];
        }, $posts);

        echo json_encode(['success' => true, 'posts' => $formattedPosts]);
    } 
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';

        if ($action === 'create_post') {
            $userId = $input['user_id'];
            $content = $input['content'];
            $courseId = isset($input['course_id']) ? $input['course_id'] : null;

            if (!$userId || !$content) {
                throw new Exception("Missing required fields");
            }

            $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, course_id) VALUES (:user_id, :content, :course_id)");
            $stmt->execute([
                ':user_id' => $userId,
                ':content' => $content,
                ':course_id' => $courseId
            ]);

            echo json_encode(['success' => true, 'message' => 'Post created']);
        }
        elseif ($action === 'like_post') {
            $userId = $input['user_id'];
            $postId = $input['post_id'];

            // Check if already liked
            $checkStmt = $pdo->prepare("SELECT 1 FROM post_likes WHERE post_id = :post_id AND user_id = :user_id");
            $checkStmt->execute([':post_id' => $postId, ':user_id' => $userId]);
            
            if ($checkStmt->fetch()) {
                // Unlike
                $stmt = $pdo->prepare("DELETE FROM post_likes WHERE post_id = :post_id AND user_id = :user_id");
            } else {
                // Like
                $stmt = $pdo->prepare("INSERT INTO post_likes (post_id, user_id) VALUES (:post_id, :user_id)");
            }
            
            $stmt->execute([':post_id' => $postId, ':user_id' => $userId]);
            echo json_encode(['success' => true]);
        }
        else {
            throw new Exception("Invalid action");
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function time_elapsed_string($datetime, $full = false) {
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'año',
        'm' => 'mes',
        'w' => 'semana',
        'd' => 'día',
        'h' => 'hora',
        'i' => 'minuto',
        's' => 'segundo',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? 'hace ' . implode(', ', $string) : 'justo ahora';
}
?>
