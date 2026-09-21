<?php
/**
 * MakeIT - Admin Panel Secure Logout
 */

declare(strict_types=1);

if (!defined('MAKEIT_INIT')) { define('MAKEIT_INIT', true); }
require_once dirname(__DIR__) . '/includes/init.php';

admin_logout();

redirect(ADMIN_URL . '/login.php');
