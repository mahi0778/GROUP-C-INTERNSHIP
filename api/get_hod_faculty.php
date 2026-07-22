<?php
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

// Ensure user is logged in as HOD
$user = $_SESSION['user'] ?? null;
if (!$user || $user['role'] !== 'hod') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

if (!isset($pdo) || $pdo === null) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

try {
    $stmt = $pdo->query("SELECT * FROM faculty ORDER BY name ASC");
    $faculty = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $faculty
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while loading faculty: ' . $e->getMessage()
    ]);
}
?>
