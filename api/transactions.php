<?php
/**
 * REST API: Transactions & M-Pesa Ledger Endpoint (PHP + JSON Database)
 */
require_once __DIR__ . '/../database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        send_json([
            'success' => true,
            'transactions' => Database::get_transactions()
        ]);
        break;

    case 'POST':
        $data = get_json_input();
        if (empty($data['amount']) || empty($data['courseId'])) {
            send_json(['success' => false, 'message' => 'Amount and Course ID are required.'], 400);
        }

        $receipt_number = 'HYC-' . strtoupper(substr(uniqid(), -6)) . '-' . date('Y');
        $new_txn = [
            'id' => 'txn-' . time(),
            'receiptNumber' => $receipt_number,
            'studentId' => $data['studentId'] ?? 'user-student-1',
            'studentName' => $data['studentName'] ?? 'Felix Siloma',
            'studentEmail' => $data['studentEmail'] ?? 'felixsiloma@gmail.com',
            'courseId' => $data['courseId'],
            'courseTitle' => $data['courseTitle'] ?? 'Studio Course',
            'amount' => (int)$data['amount'],
            'currency' => CURRENCY_CODE,
            'paymentMethod' => $data['paymentMethod'] ?? 'mpesa',
            'paymentDetails' => $data['paymentDetails'] ?? ['phone' => '+254 712 345 678'],
            'status' => 'completed',
            'timestamp' => date('Y-m-d H:i:s')
        ];

        $res = Database::save_transaction($new_txn);
        send_json($res, 201);
        break;

    default:
        send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
?>
