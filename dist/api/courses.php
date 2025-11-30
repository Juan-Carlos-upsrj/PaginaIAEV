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
            $modules = $data->modules ?? [];

            $pdo->beginTransaction();
            try {
                $stmt = $pdo->prepare("INSERT INTO courses (title, subtitle, description, thumbnail, cuatrimestre) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$title, $subtitle, $description, $thumbnail, $cuatrimestre]);
                $courseId = $pdo->lastInsertId();

                foreach ($modules as $mIndex => $module) {
                    $stmtMod = $pdo->prepare("INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)");
                    $stmtMod->execute([$courseId, $module->title, $mIndex]);
                    $moduleId = $pdo->lastInsertId();

                    if (isset($module->lessons)) {
                        foreach ($module->lessons as $lIndex => $lesson) {
                            $stmtLes = $pdo->prepare("INSERT INTO lessons (id, module_id, title, duration, video_url, content, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)");
                            // Use provided ID or generate one if it's a timestamp
                            $lessonId = $lesson->id; 
                            $stmtLes->execute([$lessonId, $moduleId, $lesson->title, $lesson->duration, $lesson->videoId, $lesson->description, $lIndex]);
                        }
                    }
                }
                $pdo->commit();
                echo json_encode(['success' => true, 'id' => $courseId]);
            } catch (Exception $e) {
                $pdo->rollBack();
                throw $e;
            }

        } elseif ($action === 'update_course') {
            $id = $data->id;
            $title = $data->title;
            $subtitle = $data->subtitle;
            $description = $data->description;
            $thumbnail = $data->thumbnail;
            $cuatrimestre = $data->cuatrimestre;
            $status = $data->status;
            $modules = $data->modules ?? [];

            $pdo->beginTransaction();
            try {
                $stmt = $pdo->prepare("UPDATE courses SET title=?, subtitle=?, description=?, thumbnail=?, cuatrimestre=?, status=? WHERE id=?");
                $stmt->execute([$title, $subtitle, $description, $thumbnail, $cuatrimestre, $status, $id]);

                // Simple update strategy: Update existing, Insert new. 
                foreach ($modules as $mIndex => $module) {
                    // Check if module exists
                    $stmtCheck = $pdo->prepare("SELECT id FROM modules WHERE id = ? AND course_id = ?");
                    $stmtCheck->execute([$module->id, $id]);
                    if ($stmtCheck->fetch()) {
                        // Update
                        $stmtUpdate = $pdo->prepare("UPDATE modules SET title=?, order_index=? WHERE id=?");
                        $stmtUpdate->execute([$module->title, $mIndex, $module->id]);
                        $moduleId = $module->id;
                    } else {
                        // Insert
                        $stmtInsert = $pdo->prepare("INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)");
                        $stmtInsert->execute([$id, $module->title, $mIndex]);
                        $moduleId = $pdo->lastInsertId();
                    }

                    if (isset($module->lessons)) {
                        foreach ($module->lessons as $lIndex => $lesson) {
                            $stmtCheckLes = $pdo->prepare("SELECT id FROM lessons WHERE id = ? AND module_id = ?");
                            $stmtCheckLes->execute([$lesson->id, $moduleId]);
                            if ($stmtCheckLes->fetch()) {
                                // Update
                                $stmtUpdLes = $pdo->prepare("UPDATE lessons SET title=?, duration=?, video_url=?, content=?, order_index=? WHERE id=?");
                                $stmtUpdLes->execute([$lesson->title, $lesson->duration, $lesson->videoId, $lesson->description, $lIndex, $lesson->id]);
                            } else {
                                // Insert
                                $stmtInsLes = $pdo->prepare("INSERT INTO lessons (id, module_id, title, duration, video_url, content, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)");
                                $stmtInsLes->execute([$lesson->id, $moduleId, $lesson->title, $lesson->duration, $lesson->videoId, $lesson->description, $lIndex]);
                            }
                        }
                    }
                }
                
                $pdo->commit();
                echo json_encode(['success' => true]);
            } catch (Exception $e) {
                $pdo->rollBack();
                throw $e;
            }

        } elseif ($action === 'delete_course') {
            $id = $data->id;
            $stmt = $pdo->prepare("DELETE FROM courses WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
