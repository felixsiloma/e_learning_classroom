<?php
/**
 * REST API: Password Reset Endpoint (PHP)
 * Handles self-service forgot password matrix reset and admin priority override.
 */
require_once __DIR__ . '/../database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Only POST requests are allowed.'], 405);
}

$data = get_json_input();
$identifier = $data['email'] ?? ($data['userId'] ?? null);
$new_password = $data['newPassword'] ?? null;
$is_admin = !empty($data['adminInitiated']);

if (empty($identifier)) {
    send_json(['success' => false, 'message' => 'User email or ID is required to reset password.'], 400);
}

if (empty($new_password)) {
    send_json(['success' => false, 'message' => 'New password cannot be empty.'], 400);
}

$res = Database::reset_password($identifier, $new_password, $is_admin);

if ($res['success']) {
    send_json($res, 200);
} else {
    send_json($res, 404);
}
?>
