<?php
require __DIR__ . '/session.php';
if (!abyss_logged_in()) {
    http_response_code(403);
    exit('Forbidden');
}
$files = [
    'style.css' => ['style.css', 'text/css; charset=utf-8'],
    'game.js' => ['game.js', 'text/javascript; charset=utf-8'],
    'walk' => ['SE/Walk.mp3', 'audio/mpeg'],
    'wall' => ['SE/The Wall Moves.mp3', 'audio/mpeg'],
    'bgm' => ['BGM/Live-at-hisomine_-July-2026.mp3', 'audio/mpeg'],
];
$key = (string)($_GET['file'] ?? '');
if (!array_key_exists($key, $files)) {
    http_response_code(404);
    exit;
}
[$relative, $mime] = $files[$key];
$path = __DIR__ . '/' . $relative;
if (!is_file($path)) {
    http_response_code(404);
    exit('Audio or asset file not found: ' . htmlspecialchars($relative));
}
header('Content-Type: ' . $mime);
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');
$size = filesize($path);
$start = 0;
$end = $size - 1;
// HTTP byte ranges allow browsers to seek within large audio files.
if (isset($_SERVER['HTTP_RANGE'])) {
    if (!preg_match('/^bytes=(\d*)-(\d*)$/', $_SERVER['HTTP_RANGE'], $m)) {
        http_response_code(416); header('Content-Range: bytes */' . $size); exit;
    }
    if ($m[1] === '' && $m[2] !== '') {
        $start = max(0, $size - (int)$m[2]);
    } else {
        $start = (int)$m[1];
        if ($m[2] !== '') $end = min($end, (int)$m[2]);
    }
    if ($start > $end || $start >= $size) {
        http_response_code(416); header('Content-Range: bytes */' . $size); exit;
    }
    http_response_code(206);
    header("Content-Range: bytes $start-$end/$size");
}
header('Accept-Ranges: bytes');
header('Content-Length: ' . ($end - $start + 1));
$fh = fopen($path, 'rb');
fseek($fh, $start);
$left = $end - $start + 1;
while ($left > 0 && !feof($fh)) {
    $data = fread($fh, min(65536, $left));
    if ($data === false || $data === '') break;
    echo $data;
    $left -= strlen($data);
}
fclose($fh);
