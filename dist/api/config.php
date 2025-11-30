<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'bloombox_iaev');
define('DB_USER', 'bloombox_iaev');
define('DB_PASS', 'antigravity03A');

// CORS Configuration (Allow requests from your domain)
header("Access-Control-Allow-Origin: *"); // For development, restrict this in production if needed
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
