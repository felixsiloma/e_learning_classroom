<?php
/**
 * REST API: Site Settings Endpoint (PHP + JSON Database)
 */
require_once __DIR__ . '/../database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        send_json([
            'success' => true,
            'settings' => Database::get_settings()
        ]);
        break;

    case 'POST':
    case 'PUT':
        $data = get_json_input();
        $res = Database::update_settings($data);
        send_json($res);
        break;

    default:
        send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
?>
