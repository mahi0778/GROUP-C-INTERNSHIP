<?php
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

// Ensure GFM user is logged in
$user = $_SESSION['user'] ?? null;
if (!$user || $user['role'] !== 'gfm') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

if (!isset($pdo) || $pdo === null) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

// Parse request payload
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$subject = trim($input['subject'] ?? '');
$date = trim($input['date'] ?? '');
$time_slot = trim($input['time_slot'] ?? '');
$records = $input['records'] ?? [];

if (empty($subject) || empty($date) || empty($records)) {
    echo json_encode([
        'success' => false,
        'message' => 'Subject, date, and student records are required.'
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO attendance (student_id, subject, date, time_slot, status, remarks) 
        VALUES (:student_id, :subject, :date, :time_slot, :status, :remarks)
    ");

    foreach ($records as $rec) {
        $student_id = (int)$rec['student_id'];
        $status = $rec['status'] === 'Present' ? 'Present' : 'Absent';
        $remarks = $status === 'Present' ? 'Regular' : 'Absent';

        $stmt->execute([
            'student_id' => $student_id,
            'subject' => $subject,
            'date' => $date,
            'time_slot' => $time_slot ?: '09:30 AM - 10:30 AM',
            'status' => $status,
            'remarks' => $remarks
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => "Attendance for $subject on $date saved successfully."
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while saving attendance: ' . $e->getMessage()
    ]);
}
?>
