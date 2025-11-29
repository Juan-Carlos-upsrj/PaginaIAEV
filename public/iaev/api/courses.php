<?php
require_once 'config.php';
require_once 'db.php';

header('Content-Type: application/json');

// Handle CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? ($_GET['action'] ?? '');
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDBConnection();

    if ($method === 'GET') {
        if ($action === 'get_courses') {
            $status = $_GET['status'] ?? 'active';
            $sql = "SELECT * FROM courses";
            if ($status !== 'all') {
                $sql .= " WHERE status = :status";
            }
            $stmt = $pdo->prepare($sql);
            if ($status !== 'all') {
                $stmt->execute([':status' => $status]);
            } else {
                $stmt->execute();
            }
            $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch modules and lessons for each course
            foreach ($courses as &$course) {
                $stmtModules = $pdo->prepare("SELECT * FROM modules WHERE course_id = ? ORDER BY order_index");
                $stmtModules->execute([$course['id']]);
                $course['modules'] = $stmtModules->fetchAll(PDO::FETCH_ASSOC);

                foreach ($course['modules'] as &$module) {
                    $stmtLessons = $pdo->prepare("SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index");
                    $stmtLessons->execute([$module['id']]);
                    $module['lessons'] = $stmtLessons->fetchAll(PDO::FETCH_ASSOC);
                }
            }

            echo json_encode(['success' => true, 'courses' => $courses]);
        }
    } elseif ($method === 'POST') {
        if ($action === 'create_course') {
            $title = $data->title;
            $subtitle = $data->subtitle ?? '';
            $description = $data->description ?? '';
            $thumbnail = $data->thumbnail ?? '';
            $cuatrimestre = $data->cuatrimestre ?? 1;

            $stmt = $pdo->prepare("INSERT INTO courses (title, subtitle, description, thumbnail, cuatrimestre) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$title, $subtitle, $description, $thumbnail, $cuatrimestre]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

        } elseif ($action === 'update_course') {
            $id = $data->id;
            $title = $data->title;
            $subtitle = $data->subtitle;
            $description = $data->description;
            $thumbnail = $data->thumbnail;
            $cuatrimestre = $data->cuatrimestre;
            $status = $data->status;

            $stmt = $pdo->prepare("UPDATE courses SET title=?, subtitle=?, description=?, thumbnail=?, cuatrimestre=?, status=? WHERE id=?");
            $stmt->execute([$title, $subtitle, $description, $thumbnail, $cuatrimestre, $status, $id]);
            echo json_encode(['success' => true]);

        } elseif ($action === 'delete_course') {
            $id = $data->id;
            $stmt = $pdo->prepare("DELETE FROM courses WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        }
        // TODO: Add actions for modules and lessons management
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
