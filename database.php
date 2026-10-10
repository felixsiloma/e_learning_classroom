<?php
/**
 * HYCLASS Studio Academy - Database Abstraction Layer (JSON & Render PostgreSQL)
 */
require_once __DIR__ . '/config.php';

class Database {
    private static $pdo = null;

    /**
     * Get or initialize PDO connection to Render PostgreSQL if DATABASE_URL is available
     */
    public static function get_pdo() {
        if (self::$pdo !== null) return self::$pdo;
        
        $db_url = RENDER_DATABASE_URL;
        if (!empty($db_url)) {
            try {
                $parsed = parse_url($db_url);
                $host = $parsed['host'] ?? 'localhost';
                $port = $parsed['port'] ?? '5432';
                $user = $parsed['user'] ?? '';
                $pass = $parsed['pass'] ?? '';
                $dbname = ltrim($parsed['path'] ?? '', '/');

                $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";
                self::$pdo = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
                return self::$pdo;
            } catch (Exception $e) {
                error_log("Render PostgreSQL PDO connection note: " . $e->getMessage());
            }
        }
        return null;
    }

    /**
     * Read data from JSON database file
     */
    public static function read_json($filename) {
        $path = DATA_DIR . '/' . $filename;
        if (!file_exists($path)) {
            return [];
        }
        $content = file_get_contents($path);
        $data = json_decode($content, true);
        return is_array($data) ? $data : [];
    }

    /**
     * Write data to JSON database file with safe file locking
     */
    public static function write_json($filename, $data) {
        if (!is_dir(DATA_DIR)) {
            mkdir(DATA_DIR, 0777, true);
        }
        $path = DATA_DIR . '/' . $filename;
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        return file_put_contents($path, $json, LOCK_EX) !== false;
    }

    // -------------------------------------------------------------
    // USERS OPERATIONS & 2-ADMIN RULE
    // -------------------------------------------------------------
    public static function get_users() {
        return self::read_json('users.json');
    }

    public static function get_user_by_id($id) {
        $users = self::get_users();
        foreach ($users as $u) {
            if ($u['id'] === $id) return $u;
        }
        return null;
    }

    public static function get_user_by_email($email) {
        $users = self::get_users();
        $target = strtolower(trim($email));
        foreach ($users as $u) {
            if (strtolower(trim($u['email'])) === $target) return $u;
        }
        return null;
    }

    public static function count_admins() {
        $users = self::get_users();
        $count = 0;
        foreach ($users as $u) {
            if (isset($u['role']) && $u['role'] === 'admin') {
                $count++;
            }
        }
        return $count;
    }

    public static function save_user($new_user) {
        $users = self::get_users();

        // Check duplicate email
        foreach ($users as $u) {
            if (strtolower($u['email']) === strtolower($new_user['email'])) {
                return ['success' => false, 'message' => 'An account with this email already exists.'];
            }
        }

        // ENFORCE STRICT TWO-ADMIN RULE
        if (isset($new_user['role']) && $new_user['role'] === 'admin') {
            if (self::count_admins() >= MAX_ADMIN_COUNT) {
                return [
                    'success' => false, 
                    'message' => 'Admin Quota Exceeded: Only two (2) administrators are allowed in HYCLASS Studio Academy.'
                ];
            }
        }

        $users[] = $new_user;
        self::write_json('users.json', $users);
        return ['success' => true, 'user' => $new_user];
    }

    public static function update_user($id, $updates) {
        $users = self::get_users();
        $found = false;

        // Check 2-admin rule if changing role to admin
        if (isset($updates['role']) && $updates['role'] === 'admin') {
            $current_admin_count = self::count_admins();
            $existing_user = self::get_user_by_id($id);
            if ($existing_user && $existing_user['role'] !== 'admin' && $current_admin_count >= MAX_ADMIN_COUNT) {
                return [
                    'success' => false, 
                    'message' => 'Admin Quota Exceeded: Only two administrators are allowed on the platform.'
                ];
            }
        }

        foreach ($users as &$u) {
            if ($u['id'] === $id) {
                foreach ($updates as $k => $v) {
                    $u[$k] = $v;
                }
                $found = true;
                break;
            }
        }

        if ($found) {
            self::write_json('users.json', $users);
            return ['success' => true, 'user' => self::get_user_by_id($id)];
        }
        return ['success' => false, 'message' => 'User not found.'];
    }

    public static function reset_password($identifier, $new_password, $is_admin = false) {
        if (strlen($new_password) < 6) {
            return ['success' => false, 'message' => 'Password must be at least 6 characters long.'];
        }

        $users = self::get_users();
        $found = false;
        $target_name = '';

        foreach ($users as &$u) {
            if ($u['id'] === $identifier || strtolower($u['email']) === strtolower(trim($identifier))) {
                $u['password'] = $new_password;
                $target_name = $u['name'];
                $found = true;
                break;
            }
        }

        if ($found) {
            self::write_json('users.json', $users);
            $msg = $is_admin 
                ? "Admin Priority Override applied: Password successfully reset for {$target_name}."
                : "Password updated successfully. You can now log in with your new credentials.";
            return ['success' => true, 'message' => $msg];
        }

        return ['success' => false, 'message' => 'Account not found with provided identifier.'];
    }

    // -------------------------------------------------------------
    // COURSES OPERATIONS
    // -------------------------------------------------------------
    public static function get_courses() {
        return self::read_json('courses.json');
    }

    public static function save_course($course) {
        $courses = self::get_courses();
        if (empty($course['id'])) {
            $course['id'] = 'course-' . time();
        }
        $courses[] = $course;
        self::write_json('courses.json', $courses);
        return ['success' => true, 'course' => $course];
    }

    public static function update_course($id, $updates) {
        $courses = self::get_courses();
        foreach ($courses as &$c) {
            if ($c['id'] === $id) {
                foreach ($updates as $k => $v) {
                    $c[$k] = $v;
                }
                self::write_json('courses.json', $courses);
                return ['success' => true, 'course' => $c];
            }
        }
        return ['success' => false, 'message' => 'Course not found'];
    }

    // -------------------------------------------------------------
    // SITE SETTINGS
    // -------------------------------------------------------------
    public static function get_settings() {
        return self::read_json('settings.json');
    }

    public static function update_settings($updates) {
        $settings = self::get_settings();
        foreach ($updates as $k => $v) {
            $settings[$k] = $v;
        }
        self::write_json('settings.json', $settings);
        return ['success' => true, 'settings' => $settings];
    }

    // -------------------------------------------------------------
    // TRANSACTIONS
    // -------------------------------------------------------------
    public static function get_transactions() {
        return self::read_json('transactions.json');
    }

    public static function save_transaction($txn) {
        $transactions = self::get_transactions();
        array_unshift($transactions, $txn);
        self::write_json('transactions.json', $transactions);
        return ['success' => true, 'transaction' => $txn];
    }
}
?>
