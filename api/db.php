<?php
// DB Connection configuration
$host = '127.0.0.1';
$dbname = 'attendance_db';
$username = 'root';
$password = '';

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    // If DB fails to connect, return PDO null so login script can handle fallback or error response
    $pdo = null;
    $db_error = $e->getMessage();
}
