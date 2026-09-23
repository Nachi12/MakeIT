<?php
require_once __DIR__ . '/config/database.php';
$db = Database::getInstance();
if ($db->isConnected()) {
    echo "Connected successfully to SQLite or MySQL.\n";
    $pdo = $db->getConnection();
    echo "Driver: " . $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) . "\n";
} else {
    echo "Connection failed.\n";
    echo "Error: " . $db->getConnectionError() . "\n";
}
