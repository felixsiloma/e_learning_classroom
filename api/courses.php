<?php
/**
 * REST API: Courses Endpoint (PHP + JSON Database)
 */
require_once __DIR__ . '/../database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $courses = Database::get_courses();
        send_json([
            'success' => true,
            'total' => count($courses),
            'courses' => $courses
        ]);
        break;

    case 'POST':
        $data = get_json_input();
        if (empty($data['title'])) {
            send_json(['success' => false, 'message' => 'Course title is required.'], 400);
        }
        $res = Database::save_course($data);
        send_json($res, 201);
        break;

    case 'PUT':
        $data = get_json_input();
        $id = $_GET['id'] ?? ($data['id'] ?? null);
        if (!$id) {
            send_json(['success' => false, 'message' => 'Course ID is required.'], 400);
        }
        $res = Database::update_course($id, $data);
        send_json($res);
        break;

    default:
        send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
?>
