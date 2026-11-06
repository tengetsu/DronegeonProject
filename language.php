<?php
require __DIR__ . '/session.php';
abyss_require_login();
header('Cache-Control: no-store');
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false]);
    exit;
}
$language = $_POST['language'] ?? '';
$token = $_POST['token'] ?? '';
if (!is_string($language) || !in_array($language, ['ja', 'en'], true)
    || !is_string($token) || !isset($_SESSION['abyss_language_token'])
    || !hash_equals($_SESSION['abyss_language_token'], $token)) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}
$_SESSION['abyss_portal_lang'] = $language;
echo json_encode(['ok' => true, 'language' => $language]);
