<?php
/**
 * REST API: Users Endpoint (PHP + JSON Database)
 * Handles registration, user list, profile updates, and enforces 2-Admin limit.
 */
require_once __DIR__ . '/../database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $users = Database::get_users();
        // Return sanitized list (strip passwords if needed, but keep demo credentials)
        send_json([
            'success' => true,
            'total' => count($users),
            'adminCount' => Database::count_admins(),
            'maxAdmins' => MAX_ADMIN_COUNT,
            'users' => $users
        ]);
        break;

    case 'POST':
        $data = get_json_input();
        if (empty($data['name']) || empty($data['email'])) {
            send_json(['success' => false, 'message' => 'Full Name and Email are required.'], 400);
        }

        $role = $data['role'] ?? 'student';
        $user_id = 'user-' . time();

        $new_user = [
            'id' => $user_id,
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'password' => $data['password'] ?? 'password123',
            'role' => $role,
            'avatar' => $data['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            'phone' => $data['phone'] ?? '+254 7',
            'title' => $data['title'] ?? ($role === 'instructor' ? 'Studio Faculty' : 'Architecture Scholar'),
            'institution' => $data['institution'] ?? INSTITUTION_NAME,
            'bio' => $data['bio'] ?? '',
            'enrolledCourseIds' => [],
            'completedCourseIds' => [],
            'learningHours' => 0,
            'streakDays' => 1,
            'status' => $role === 'instructor' ? 'pending_approval' : 'active',
            'registeredAt' => date('Y-m-d')
        ];

        $res = Database::save_user($new_user);
        if ($res['success']) {
            send_json($res, 201);
        } else {
            send_json($res, 403);
        }
        break;

    case 'PUT':
        $data = get_json_input();
        $id = $_GET['id'] ?? ($data['id'] ?? null);
        if (!$id) {
            send_json(['success' => false, 'message' => 'User ID is required.'], 400);
        }

        $res = Database::update_user($id, $data);
        if ($res['success']) {
            send_json($res);
        } else {
            send_json($res, 400);
        }
        break;

    default:
        send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
?>
