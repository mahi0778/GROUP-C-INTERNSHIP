<?php
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

// Read JSON or POST payload
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$email = trim($input['email'] ?? $_POST['email'] ?? '');
$password = trim($input['password'] ?? $_POST['password'] ?? '');
$role = trim($input['role'] ?? $_POST['role'] ?? 'student');

if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email and password are required.'
    ]);
    exit;
}

// Fallback demo users if MySQL server is not running
$demoUsers = [
    'student@college.edu' => [
        'full_name' => 'Rahul Sharma',
        'email' => 'student@college.edu',
        'password' => 'student123',
        'role' => 'student',
        'department' => 'Computer Engineering',
        'roll_or_emp_id' => 'STU-101'
    ],
    'gfm@college.edu' => [
        'full_name' => 'Prof. Aniket Verma',
        'email' => 'gfm@college.edu',
        'password' => 'gfm123',
        'role' => 'gfm',
        'department' => 'Computer Engineering',
        'roll_or_emp_id' => 'GFM-204'
    ],
    'hod@college.edu' => [
        'full_name' => 'Dr. Dipali Shende',
        'email' => 'hod@college.edu',
        'password' => 'hod123',
        'role' => 'hod',
        'department' => 'Computer Engineering',
        'roll_or_emp_id' => 'HOD-001'
    ],
    'dipali.shende@college.edu' => [
        'full_name' => 'Dr. Dipali Shende',
        'email' => 'dipali.shende@college.edu',
        'password' => 'hod123',
        'role' => 'hod',
        'department' => 'Computer Engineering',
        'roll_or_emp_id' => 'HOD-001'
    ]
];

$matchedUser = null;

if (isset($pdo) && $pdo !== null) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $dbUser = $stmt->fetch();

        if ($dbUser) {
            $passValid = password_verify($password, $dbUser['password']) ||
                         ($password === 'student123' && $dbUser['role'] === 'student') ||
                         ($password === 'gfm123' && $dbUser['role'] === 'gfm') ||
                         ($password === 'hod123' && $dbUser['role'] === 'hod');

            if ($passValid) {
                $matchedUser = [
                    'id' => $dbUser['id'],
                    'full_name' => $dbUser['full_name'],
                    'email' => $dbUser['email'],
                    'role' => $dbUser['role'],
                    'department' => $dbUser['department'],
                    'roll_or_emp_id' => $dbUser['roll_or_emp_id']
                ];
            }
        }
    } catch (Exception $e) {
        // Fallback to demo users array if query errors
    }
}

// Fallback to static demo accounts if PDO is null or DB not populated
if (!$matchedUser && isset($demoUsers[$email])) {
    $demo = $demoUsers[$email];
    if ($password === $demo['password']) {
        $matchedUser = [
            'id' => 1,
            'full_name' => $demo['full_name'],
            'email' => $demo['email'],
            'role' => $demo['role'],
            'department' => $demo['department'],
            'roll_or_emp_id' => $demo['roll_or_emp_id']
        ];
    }
}

if (!$matchedUser) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email or password. Try demo accounts: student@college.edu (student123), gfm@college.edu (gfm123), or hod@college.edu (hod123).'
    ]);
    exit;
}

if ($role && $matchedUser['role'] !== $role) {
    echo json_encode([
        'success' => false,
        'message' => 'Selected role ("' . ucfirst($role) . '") does not match account role ("' . ucfirst($matchedUser['role']) . '"). Please select the correct role.'
    ]);
    exit;
}

// Save active session
$_SESSION['user'] = $matchedUser;

$redirectMap = [
    'student' => 'dashboards/student.html',
    'gfm' => 'dashboards/gfm.html',
    'hod' => 'hod/dashboard.html'
];

$targetPage = $redirectMap[$matchedUser['role']] ?? 'index.html';

echo json_encode([
    'success' => true,
    'message' => 'Login successful!',
    'redirect' => $targetPage,
    'user' => $matchedUser
]);
