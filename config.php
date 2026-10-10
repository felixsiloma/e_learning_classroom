<?php
/**
 * HYCLASS Studio Academy - Core PHP Configuration
 * Oxford Academy of Architecture & Built Environment
 */

// Allow CORS for API consumers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Platform Constants
define('PLATFORM_NAME', 'HYCLASS Studio Academy');
define('INSTITUTION_NAME', 'Oxford School of Architecture & Built Environment');
define('CURRENCY_CODE', 'KES');
define('MAX_ADMIN_COUNT', 2); // Strict 2-Admin Quota Invariant
define('DATA_DIR', __DIR__ . '/data');

// Render PostgreSQL Database Connection String (from Render Environment or fallback to JSON files)
$database_url = getenv('DATABASE_URL') ?: getenv('RENDER_POSTGRES_URL');
define('RENDER_DATABASE_URL', $database_url ?: '');

/**
 * Returns JSON response with HTTP status code
 */
function send_json($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
}

/**
 * Reads JSON input body from client request
 */
function get_json_input() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
?>
