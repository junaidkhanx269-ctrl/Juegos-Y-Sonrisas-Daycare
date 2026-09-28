<?php
/**
 * Hostinger Production Router for Juegos Y Sonrisas Daycare
 * Works automatically on all Hostinger Apache / LiteSpeed web servers.
 */

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Clean request path to prevent path traversal
$cleanUri = ltrim(str_replace(['../', '..\\'], '', $requestUri), '/');

// Check if static file requested exists inside dist/ (e.g. assets/*, images/*, uploads/*)
if (!empty($cleanUri)) {
    $distFilePath = __DIR__ . '/dist/' . $cleanUri;
    if (is_file($distFilePath)) {
        $ext = strtolower(pathinfo($distFilePath, PATHINFO_EXTENSION));
        $contentTypes = [
            'js'    => 'application/javascript; charset=utf-8',
            'mjs'   => 'application/javascript; charset=utf-8',
            'css'   => 'text/css; charset=utf-8',
            'png'   => 'image/png',
            'jpg'   => 'image/jpeg',
            'jpeg'  => 'image/jpeg',
            'gif'   => 'image/gif',
            'svg'   => 'image/svg+xml',
            'webp'  => 'image/webp',
            'ico'   => 'image/x-icon',
            'woff'  => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf'   => 'font/ttf',
            'json'  => 'application/json; charset=utf-8',
            'txt'   => 'text/plain; charset=utf-8',
            'xml'   => 'application/xml; charset=utf-8',
        ];

        if (isset($contentTypes[$ext])) {
            header('Content-Type: ' . $contentTypes[$ext]);
        }
        header('Cache-Control: public, max-age=31536000, immutable');
        readfile($distFilePath);
        exit;
    }
}

// Serve dist/index.html for all SPA routes
$distIndex = __DIR__ . '/dist/index.html';
if (file_exists($distIndex)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($distIndex);
    exit;
}

// Fallback to root index.html
$rootIndex = __DIR__ . '/index.html';
if (file_exists($rootIndex)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($rootIndex);
    exit;
}

http_response_code(503);
echo "Building application... please verify dist/index.html is committed.";
