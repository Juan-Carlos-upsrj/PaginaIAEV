<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? '';
$userId = $data->userId ?? null;

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'User ID required']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = getDBConnection();

    if ($action === 'complete_lesson') {
        $lessonId = $data->lessonId;
        $stmt = $pdo->prepare("INSERT IGNORE INTO completed_lessons (user_id, lesson_id) VALUES (?, ?)");
        $stmt->execute([$userId, $lessonId]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'complete_quiz') {
        $quizId = $data->quizId;
        $score = $data->score;
        $stmt = $pdo->prepare("INSERT INTO completed_quizzes (user_id, quiz_id, score) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score)");
        $stmt->execute([$userId, $quizId, $score]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'unlock_achievement') {
        $achievementId = $data->achievementId;
        $stmt = $pdo->prepare("INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)");
        $stmt->execute([$userId, $achievementId]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'update_xp') {
        $xp = $data->xp;
        $level = $data->level;
        $stmt = $pdo->prepare("UPDATE users SET xp = ?, level = ? WHERE id = ?");
        $stmt->execute([$xp, $level, $userId]);
        echo json_encode(['success' => true]);
    }
}
?>
