<?php
require __DIR__ . '/session.php';
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
if (strlen($_POST['username'] ?? '') > 128 || strlen($_POST['password'] ?? '') > 1024) {
    http_response_code(400);
    exit;
}
$now = time();
if (!isset($_SESSION['attempt_window']) || $now - $_SESSION['attempt_window'] > 300) {
    $_SESSION['attempt_window'] = $now;
    $_SESSION['attempt_count'] = 0;
}
if ($_SESSION['attempt_count'] >= 10) {
    http_response_code(429);
    exit('Too many attempts. Please try again later.');
}
$user = (string)($_POST['username'] ?? '');
$pass = (string)($_POST['password'] ?? '');
if (hash_equals(ABYSS_LOGIN_ID, $user) && password_verify($pass, ABYSS_PASSWORD_HASH)) {
    session_regenerate_id(true);
    $_SESSION['abyss_authenticated'] = true;
    unset($_SESSION['attempt_count'], $_SESSION['attempt_window']);
    header('Location: game.php');
    exit;
}
$_SESSION['attempt_count']++;
header('Location: index.php?error=1&lang=' . (($_SESSION['abyss_portal_lang'] ?? 'ja') === 'en' ? 'en' : 'ja') . '#login');
exit;
