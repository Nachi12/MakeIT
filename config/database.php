<?php
/**
 * MakeIT - Database Configuration & PDO Wrapper Class
 * 
 * Provides a production-hardened PDO singleton with prepared statement helpers,
 * error handling, and transaction controls.
 */

declare(strict_types=1);

if (!defined('MAKEIT_INIT') && php_sapi_name() !== 'cli') {
    die('Direct access not permitted.');
}

// -----------------------------------------------------------------------------
// DATABASE CREDENTIALS
// Update these values to match your MySQL server / Hostinger cPanel settings
// -----------------------------------------------------------------------------
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_NAME', getenv('DB_NAME') ?: 'makeit');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Singleton Database Manager
 */
final class Database
{
    private static ?self $instance = null;
    private ?PDO $pdo = null;
    private ?string $connectionError = null;

    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct()
    {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_CHARSET
        );

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_PERSISTENT         => false,
            PDO::ATTR_TIMEOUT            => 1,
        ];

        try {
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            $this->pdo->exec("SET NAMES " . DB_CHARSET . " COLLATE utf8mb4_unicode_ci");
            $this->ensureSchema();
        } catch (PDOException $e) {
            $this->connectionError = $e->getMessage();
            // Fallback to SQLite for local development / testing if MySQL daemon is not active
            $sqlitePath = dirname(__DIR__) . '/database/makeit.sqlite';
            $initScript = dirname(__DIR__) . '/database/init_sqlite.php';
            if (file_exists($initScript)) {
                require_once $initScript;
                try {
                    $this->pdo = init_sqlite_database($sqlitePath);
                } catch (\Throwable $sqliteEx) {
                    $this->pdo = null;
                    error_log("SQLite Fallback Notice: " . $sqliteEx->getMessage());
                }
            } else {
                $this->pdo = null;
            }
            error_log("MySQL Connection Notice: " . $e->getMessage());
        }
    }

    /**
     * Ensure database tables possess all required columns across MySQL & SQLite
     */
    private function ensureSchema(): void
    {
        if ($this->pdo === null) return;
        try {
            $driver = $this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            if ($driver === 'mysql') {
                // Invoices table
                $invCols = $this->pdo->query("SHOW COLUMNS FROM invoices")->fetchAll(PDO::FETCH_COLUMN);
                if (!in_array('client_id', $invCols, true)) {
                    $this->pdo->exec("ALTER TABLE invoices ADD COLUMN client_id INT UNSIGNED NULL DEFAULT NULL AFTER invoice_number");
                }
                if (!in_array('service', $invCols, true)) {
                    $this->pdo->exec("ALTER TABLE invoices ADD COLUMN service VARCHAR(100) NULL AFTER client_name");
                }
                if (!in_array('notes', $invCols, true)) {
                    $this->pdo->exec("ALTER TABLE invoices ADD COLUMN notes TEXT NULL AFTER paid_at");
                }
                if (!in_array('updated_at', $invCols, true)) {
                    $this->pdo->exec("ALTER TABLE invoices ADD COLUMN updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at");
                }

                // Revenue table
                $revCols = $this->pdo->query("SHOW COLUMNS FROM revenue")->fetchAll(PDO::FETCH_COLUMN);
                if (!in_array('client_name', $revCols, true)) {
                    $this->pdo->exec("ALTER TABLE revenue ADD COLUMN client_name VARCHAR(150) NULL DEFAULT NULL AFTER client_id");
                }

                // Leads table
                $leadCols = $this->pdo->query("SHOW COLUMNS FROM leads")->fetchAll(PDO::FETCH_COLUMN);
                if (!in_array('client_id', $leadCols, true)) {
                    $this->pdo->exec("ALTER TABLE leads ADD COLUMN client_id INT UNSIGNED NULL DEFAULT NULL AFTER id");
                }
                if (!in_array('service', $leadCols, true)) {
                    $this->pdo->exec("ALTER TABLE leads ADD COLUMN service VARCHAR(100) NULL DEFAULT NULL AFTER company");
                }
                if (!in_array('source', $leadCols, true)) {
                    $this->pdo->exec("ALTER TABLE leads ADD COLUMN source VARCHAR(50) NULL DEFAULT 'Website Form' AFTER message");
                }
                if (!in_array('call_status', $leadCols, true)) {
                    $this->pdo->exec("ALTER TABLE leads ADD COLUMN call_status VARCHAR(50) NOT NULL DEFAULT 'Not Called' AFTER status");
                }
                if (!in_array('last_called_at', $leadCols, true)) {
                    $this->pdo->exec("ALTER TABLE leads ADD COLUMN last_called_at DATETIME NULL DEFAULT NULL AFTER call_status");
                }
                if (!in_array('next_followup_at', $leadCols, true)) {
                    $this->pdo->exec("ALTER TABLE leads ADD COLUMN next_followup_at DATETIME NULL DEFAULT NULL AFTER last_called_at");
                }

                // Calls table
                $callCols = $this->pdo->query("SHOW COLUMNS FROM calls")->fetchAll(PDO::FETCH_COLUMN);
                if (!in_array('lead_id', $callCols, true)) {
                    $this->pdo->exec("ALTER TABLE calls ADD COLUMN lead_id BIGINT UNSIGNED NULL DEFAULT NULL AFTER id");
                }
                if (!in_array('client_id', $callCols, true)) {
                    $this->pdo->exec("ALTER TABLE calls ADD COLUMN client_id INT UNSIGNED NULL DEFAULT NULL AFTER lead_id");
                }
                if (!in_array('call_datetime', $callCols, true)) {
                    $this->pdo->exec("ALTER TABLE calls ADD COLUMN call_datetime DATETIME NULL DEFAULT NULL AFTER phone");
                }
                if (!in_array('next_followup_at', $callCols, true)) {
                    $this->pdo->exec("ALTER TABLE calls ADD COLUMN next_followup_at DATETIME NULL DEFAULT NULL AFTER outcome");
                }

                // crm_call_logs table
                $this->pdo->exec("
                    CREATE TABLE IF NOT EXISTS crm_call_logs (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        lead_id BIGINT UNSIGNED NULL DEFAULT NULL,
                        agent_phone VARCHAR(50) NOT NULL,
                        client_phone VARCHAR(50) NOT NULL,
                        provider VARCHAR(50) NOT NULL DEFAULT 'exotel',
                        call_sid VARCHAR(100) NULL DEFAULT NULL,
                        status VARCHAR(50) NOT NULL DEFAULT 'initiated',
                        duration INT NOT NULL DEFAULT 0,
                        recording_url VARCHAR(255) NULL DEFAULT NULL,
                        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        INDEX idx_ccl_lead (lead_id),
                        INDEX idx_ccl_sid (call_sid)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                ");
            } else if ($driver === 'sqlite') {
                $this->pdo->exec("
                    CREATE TABLE IF NOT EXISTS crm_call_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        lead_id INTEGER NULL,
                        agent_phone TEXT NOT NULL,
                        client_phone TEXT NOT NULL,
                        provider TEXT NOT NULL DEFAULT 'exotel',
                        call_sid TEXT NULL,
                        status TEXT NOT NULL DEFAULT 'initiated',
                        duration INTEGER NOT NULL DEFAULT 0,
                        recording_url TEXT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    );
                ");
            }
        } catch (\Throwable $ex) {
            error_log("Schema auto-migration notice: " . $ex->getMessage());
        }
    }

    /**
     * Check if database connection is actively established
     */
    public function isConnected(): bool
    {
        return $this->pdo !== null;
    }

    /**
     * Get connection error if any
     */
    public function getConnectionError(): ?string
    {
        return $this->connectionError;
    }

    /**
     * Prevent cloning
     */
    private function __clone() {}

    /**
     * Prevent unserializing
     */
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize singleton");
    }

    /**
     * Get Database instance
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Get raw PDO object
     */
    public function getConnection(): PDO
    {
        return $this->pdo;
    }

    /**
     * Shorthand to get PDO directly
     */
    public static function pdo(): PDO
    {
        return self::getInstance()->getConnection();
    }

    /**
     * Execute a query with prepared statement parameters
     *
     * @param string $sql
     * @param array<int|string, mixed> $params
     * @return PDOStatement
     */
    public function query(string $sql, array $params = []): PDOStatement
    {
        if ($this->pdo === null) {
            throw new PDOException("Database is not connected: " . ($this->connectionError ?? 'Unknown connection error'));
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * Fetch a single row
     *
     * @param string $sql
     * @param array<int|string, mixed> $params
     * @return array<string, mixed>|null
     */
    public function fetch(string $sql, array $params = []): ?array
    {
        $stmt = $this->query($sql, $params);
        $result = $stmt->fetch();
        return $result !== false ? $result : null;
    }

    /**
     * Fetch all matching rows
     *
     * @param string $sql
     * @param array<int|string, mixed> $params
     * @return array<int, array<string, mixed>>
     */
    public function fetchAll(string $sql, array $params = []): array
    {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }

    /**
     * Fetch a single scalar column value
     *
     * @param string $sql
     * @param array<int|string, mixed> $params
     * @param int $columnNumber
     * @return mixed
     */
    public function fetchColumn(string $sql, array $params = [], int $columnNumber = 0): mixed
    {
        $stmt = $this->query($sql, $params);
        $val = $stmt->fetchColumn($columnNumber);
        return $val !== false ? $val : null;
    }

    /**
     * Insert a row into a table
     *
     * @param string $table
     * @param array<string, mixed> $data
     * @return int Last insert ID
     */
    public function insert(string $table, array $data): int
    {
        $columns = array_keys($data);
        $placeholders = array_map(fn($col) => ':' . $col, $columns);

        $sql = sprintf(
            "INSERT INTO `%s` (`%s`) VALUES (%s)",
            preg_replace('/[^a-zA-Z0-9_]/', '', $table),
            implode('`, `', $columns),
            implode(', ', $placeholders)
        );

        $params = [];
        foreach ($data as $col => $val) {
            $params[':' . $col] = $val;
        }

        $this->query($sql, $params);
        return (int)$this->pdo->lastInsertId();
    }

    /**
     * Update table rows matching a condition
     *
     * @param string $table
     * @param array<string, mixed> $data
     * @param string $where e.g. "id = :id"
     * @param array<string, mixed> $whereParams
     * @return int Number of affected rows
     */
    public function update(string $table, array $data, string $where, array $whereParams = []): int
    {
        $setClauses = [];
        $params = [];

        foreach ($data as $col => $val) {
            $placeholder = ':set_' . $col;
            $setClauses[] = sprintf("`%s` = %s", $col, $placeholder);
            $params[$placeholder] = $val;
        }

        $sql = sprintf(
            "UPDATE `%s` SET %s WHERE %s",
            preg_replace('/[^a-zA-Z0-9_]/', '', $table),
            implode(', ', $setClauses),
            $where
        );

        // Merge set params with where params
        foreach ($whereParams as $key => $val) {
            $params[$key] = $val;
        }

        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }

    /**
     * Delete rows matching a condition
     *
     * @param string $table
     * @param string $where e.g. "id = :id"
     * @param array<string, mixed> $whereParams
     * @return int Number of affected rows
     */
    public function delete(string $table, string $where, array $whereParams = []): int
    {
        $sql = sprintf(
            "DELETE FROM `%s` WHERE %s",
            preg_replace('/[^a-zA-Z0-9_]/', '', $table),
            $where
        );

        $stmt = $this->query($sql, $whereParams);
        return $stmt->rowCount();
    }

    /**
     * Execute a statement and return affected row count
     */
    public function execute(string $sql, array $params = []): int
    {
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }


    /**
     * Get last inserted ID
     */
    public function lastInsertId(): string|int
    {
        return $this->pdo->lastInsertId();
    }

    /**
     * Transaction helpers
     */
    public function beginTransaction(): bool
    {
        return $this->pdo->beginTransaction();
    }

    public function commit(): bool
    {
        return $this->pdo->commit();
    }

    public function rollBack(): bool
    {
        return $this->pdo->rollBack();
    }
}
