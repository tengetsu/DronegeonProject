<?php
// All authentication happens server-side; do not expose credentials to JavaScript.
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name('ABYSSSESSID');
session_set_cookie_params([
    'lifetime' => 0, 'path' => '/', 'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Lax'
]);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
function abyss_logged_in(): bool { return !empty($_SESSION['abyss_authenticated']); }
function abyss_require_login(): void {
    if (!abyss_logged_in()) { header('Location: index.php'); exit; }
}
