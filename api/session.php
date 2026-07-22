<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

if (isset($_SESSION['user'])) {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    echo json_encode([
        'authenticated' => true,
        'user' => $_SESSION['user'],
        'csrf_token' => $_SESSION['csrf_token']
    ]);
} else {
    echo json_encode([
        'authenticated' => false,
        'user' => null,
        'csrf_token' => null
    ]);
}
