<?php
/**
 * MakeIT Admin — Invoices & Client Billing Management
 *
 * Full-featured client invoice generation, native PDF export, lifecycle status tracking,
 * and database-driven billing ledger integrated with CRM Clients & Revenue.
 */

declare(strict_types=1);

if (!defined('MAKEIT_INIT')) {
    define('MAKEIT_INIT', true);
}
require_once dirname(__DIR__) . '/includes/auth_guard.php';
require_once dirname(__DIR__, 2) . '/includes/pdf_generator.php';

$pageTitle = 'Invoices & Billing';
$breadcrumb = 'Invoices';
$pdo = Database::getInstance()->getConnection();

$error = null;
$success = null;

$validServices = ['Websites', 'Software', 'AI + Automation', 'UI/UX', 'Other'];
$validStatuses = ['paid', 'pending', 'draft', 'cancelled'];

// -----------------------------------------------------------------------------
// 1. GET ACTIONS: Direct PDF Export & Inline View
// -----------------------------------------------------------------------------
$actionGet = sanitize_text($_GET['action'] ?? '');
$invoiceIdGet = (int)($_GET['id'] ?? 0);

if (($actionGet === 'export_pdf' || $actionGet === 'view_pdf') && $invoiceIdGet > 0) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM invoices WHERE id = :id");
        $stmt->execute([':id' => $invoiceIdGet]);
        $inv = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$inv) {
            die('Invoice not found.');
        }

        // Fetch client details if available
        $client = null;
        if (!empty($inv['client_id'])) {
            $cStmt = $pdo->prepare("SELECT * FROM clients WHERE id = :cid LIMIT 1");
            $cStmt->execute([':cid' => $inv['client_id']]);
            $client = $cStmt->fetch(PDO::FETCH_ASSOC);
        }
        if (!$client && !empty($inv['client_name'])) {
            $cStmt = $pdo->prepare("SELECT * FROM clients WHERE client_name = :name OR company_name = :name LIMIT 1");
            $cStmt->execute([':name' => $inv['client_name']]);
            $client = $cStmt->fetch(PDO::FETCH_ASSOC);
        }
        $client = is_array($client) ? $client : null;

        $pdfBinary = generate_invoice_pdf($inv, $client);
        $cleanInvNum = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$inv['invoice_number']);
        $filename = "Invoice-{$cleanInvNum}.pdf";

        if (ob_get_level()) {
            ob_end_clean();
        }

        header('Content-Type: application/pdf');
        if ($actionGet === 'view_pdf') {
            header('Content-Disposition: inline; filename="' . $filename . '"');
        } else {
            header('Content-Disposition: attachment; filename="' . $filename . '"');
        }
        header('Content-Length: ' . strlen($pdfBinary));
        header('Cache-Control: private, max-age=0, must-revalidate');
        header('Pragma: public');
        echo $pdfBinary;
        exit;
    } catch (\Throwable $e) {
        $error = 'Failed to generate PDF: ' . $e->getMessage();
    }
}

// -----------------------------------------------------------------------------
// 2. POST ACTIONS: Create Invoice, Edit Invoice, Delete Invoice, Update Status
// -----------------------------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    if (!verify_csrf()) {
        $error = 'Security session expired. Please refresh the page and try again.';
    } else {
        $action = sanitize_text($_POST['action'] ?? '');
        $invoiceId = (int)($_POST['invoice_id'] ?? 0);

        // A. CREATE INVOICE
        if ($action === 'create_invoice') {
            $clientIdInput   = (int)($_POST['client_id'] ?? 0);
            $clientNameCustom = sanitize_text($_POST['client_name_custom'] ?? '');
            $invNumberInput  = trim(sanitize_text($_POST['invoice_number'] ?? ''));
            $serviceInput    = sanitize_text($_POST['service'] ?? 'Websites');
            $amountRaw       = trim($_POST['amount'] ?? '');
            $statusInput     = strtolower(trim(sanitize_text($_POST['status'] ?? 'pending')));
            $dueDateInput    = trim($_POST['due_date'] ?? '');
            $paidDateInput   = trim($_POST['paid_at'] ?? '');
            $notesInput      = sanitize_text($_POST['notes'] ?? '');

            // Amount validation
            if (!is_numeric($amountRaw) || (float)$amountRaw <= 0) {
                $error = 'Please provide a valid numeric invoice amount greater than 0.';
            } elseif (empty($dueDateInput)) {
                $error = 'Please provide a valid payment due date.';
            } else {
                $amountNumeric = (float)$amountRaw;
                $serviceVal = in_array($serviceInput, $validServices, true) ? $serviceInput : 'Websites';
                $statusVal = in_array($statusInput, $validStatuses, true) ? $statusInput : 'pending';

                try {
                    // Resolve client name and ID
                    $finalClientId = null;
                    $finalClientName = '';

                    if ($clientIdInput > 0) {
                        $cRow = $pdo->query("SELECT id, client_name, company_name FROM clients WHERE id = {$clientIdInput}")->fetch(PDO::FETCH_ASSOC);
                        if ($cRow) {
                            $finalClientId = (int)$cRow['id'];
                            $finalClientName = !empty($cRow['company_name']) ? $cRow['company_name'] : $cRow['client_name'];
                        }
                    }

                    if (empty($finalClientName)) {
                        if (!empty($clientNameCustom)) {
                            $finalClientName = $clientNameCustom;
                            // Optionally link existing client if already present, but never auto-create client
                            $chk = $pdo->prepare("SELECT id FROM clients WHERE company_name = :name OR client_name = :name LIMIT 1");
                            $chk->execute([':name' => $clientNameCustom]);
                            $existingCid = $chk->fetchColumn();
                            $finalClientId = $existingCid ? (int)$existingCid : null;
                        } else {
                            $finalClientName = 'Valued Client';
                            $finalClientId = null;
                        }
                    }

                // Resolve Invoice Number
                if (empty($invNumberInput)) {
                    $year = date('Y');
                    $maxNum = $pdo->query("SELECT invoice_number FROM invoices WHERE invoice_number LIKE 'INV-{$year}-%' ORDER BY id DESC LIMIT 1")->fetchColumn();
                    $seq = 1;
                    if ($maxNum && preg_match('/INV-\d{4}-(\d+)/', (string)$maxNum, $m)) {
                        $seq = ((int)$m[1]) + 1;
                    }
                    $finalInvNumber = sprintf('INV-%s-%03d', $year, $seq);
                } else {
                    $finalInvNumber = strtoupper($invNumberInput);
                }

                // Payment date
                $finalPaidAt = null;
                if ($statusVal === 'paid') {
                    $finalPaidAt = !empty($paidDateInput) ? date('Y-m-d H:i:s', strtotime($paidDateInput)) : date('Y-m-d H:i:s');
                }

                $nowStr = date('Y-m-d H:i:s');
                $dueFormatted = date('Y-m-d', strtotime($dueDateInput));

                $insertStmt = $pdo->prepare("
                        INSERT INTO invoices (invoice_number, client_id, client_name, service, amount, status, due_date, paid_at, notes, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $insertStmt->execute([
                        $finalInvNumber,
                        $finalClientId,
                        $finalClientName,
                        $serviceVal,
                        $amountNumeric,
                        $statusVal,
                        $dueFormatted,
                        $finalPaidAt,
                        $notesInput,
                        $nowStr,
                        $nowStr
                    ]);
                    $newInvoiceId = (int)$pdo->lastInsertId();

                    // If status is paid, record into revenue ledger as well
                    if ($statusVal === 'paid') {
                        $revStmt = $pdo->prepare("
                            INSERT INTO revenue (client_id, lead_id, invoice_id, amount, payment_type, payment_status, payment_date, service, notes, created_at, updated_at)
                            VALUES (?, NULL, ?, ?, 'Bank Transfer', 'Paid', ?, ?, ?, ?, ?)
                        ");
                        $revStmt->execute([
                            $finalClientId,
                            $newInvoiceId,
                            $amountNumeric,
                            $finalPaidAt,
                            $serviceVal,
                            "Settlement for Invoice {$finalInvNumber}: {$notesInput}",
                            $nowStr,
                            $nowStr
                        ]);
                    }

                    $success = "Invoice #{$finalInvNumber} for ₹" . number_format($amountNumeric, 2) . " generated successfully. Ready to export in PDF.";
                } catch (\Throwable $e) {
                    $error = 'Failed to create invoice: ' . $e->getMessage();
                }
            }
        }

        // B. EDIT INVOICE
        elseif ($action === 'edit_invoice' && $invoiceId > 0) {
            $serviceInput = sanitize_text($_POST['service'] ?? 'Websites');
            $amountRaw    = trim($_POST['amount'] ?? '');
            $statusInput  = strtolower(trim(sanitize_text($_POST['status'] ?? 'pending')));
            $dueDateInput = trim($_POST['due_date'] ?? '');
            $paidDateInput = trim($_POST['paid_at'] ?? '');
            $notesInput   = sanitize_text($_POST['notes'] ?? '');

            if (!is_numeric($amountRaw) || (float)$amountRaw <= 0) {
                $error = 'Please enter a valid numeric amount greater than 0.';
            } elseif (empty($dueDateInput)) {
                $error = 'Please provide a valid due date.';
            } else {
                $amountNumeric = (float)$amountRaw;
                $serviceVal = in_array($serviceInput, $validServices, true) ? $serviceInput : 'Websites';
                $statusVal = in_array($statusInput, $validStatuses, true) ? $statusInput : 'pending';
                $dueFormatted = date('Y-m-d', strtotime($dueDateInput));
                $nowStr = date('Y-m-d H:i:s');

                $finalPaidAt = null;
                if ($statusVal === 'paid') {
                    $finalPaidAt = !empty($paidDateInput) ? date('Y-m-d H:i:s', strtotime($paidDateInput)) : date('Y-m-d H:i:s');
                }

                try {
                    $updStmt = $pdo->prepare("
                        UPDATE invoices
                        SET service = :service,
                            amount = :amount,
                            status = :status,
                            due_date = :due_date,
                            paid_at = :paid_at,
                            notes = :notes,
                            updated_at = :updated_at
                        WHERE id = :id
                    ");
                    $updStmt->execute([
                        ':service'    => $serviceVal,
                        ':amount'     => $amountNumeric,
                        ':status'     => $statusVal,
                        ':due_date'   => $dueFormatted,
                        ':paid_at'    => $finalPaidAt,
                        ':notes'      => $notesInput,
                        ':updated_at' => $nowStr,
                        ':id'         => $invoiceId
                    ]);

                    // Sync with revenue table if marked paid
                    if ($statusVal === 'paid') {
                        $revExists = (int)$pdo->query("SELECT COUNT(*) FROM revenue WHERE invoice_id = {$invoiceId}")->fetchColumn();
                        if ($revExists === 0) {
                            $invRow = $pdo->query("SELECT * FROM invoices WHERE id = {$invoiceId}")->fetch(PDO::FETCH_ASSOC);
                            $revStmt = $pdo->prepare("
                                INSERT INTO revenue (client_id, lead_id, invoice_id, amount, payment_type, payment_status, payment_date, service, notes, created_at, updated_at)
                                VALUES (?, NULL, ?, ?, 'Bank Transfer', 'Paid', ?, ?, ?, ?, ?)
                            ");
                            $revStmt->execute([
                                $invRow['client_id'] ?? null,
                                $invoiceId,
                                $amountNumeric,
                                $finalPaidAt,
                                $serviceVal,
                                "Settlement for Invoice {$invRow['invoice_number']}",
                                $nowStr,
                                $nowStr
                            ]);
                        } else {
                            $pdo->prepare("UPDATE revenue SET amount = ?, payment_status = 'Paid', service = ?, updated_at = ? WHERE invoice_id = ?")
                                ->execute([$amountNumeric, $serviceVal, $nowStr, $invoiceId]);
                        }
                    }

                    $success = "Invoice #{$invoiceId} updated successfully.";
                } catch (\Throwable $e) {
                    $error = 'Failed to update invoice: ' . $e->getMessage();
                }
            }
        }

        // C. DELETE INVOICE
        elseif ($action === 'delete_invoice' && $invoiceId > 0) {
            try {
                $invRow = $pdo->query("SELECT invoice_number FROM invoices WHERE id = {$invoiceId}")->fetch(PDO::FETCH_ASSOC);
                $invNum = $invRow ? $invRow['invoice_number'] : "#{$invoiceId}";

                $delStmt = $pdo->prepare("DELETE FROM invoices WHERE id = :id");
                $delStmt->execute([':id' => $invoiceId]);

                // Unlink invoice from revenue ledger if exists
                $pdo->prepare("UPDATE revenue SET invoice_id = NULL WHERE invoice_id = :id")->execute([':id' => $invoiceId]);

                $success = "Invoice {$invNum} has been permanently deleted.";
            } catch (\Throwable $e) {
                $error = 'Failed to delete invoice: ' . $e->getMessage();
            }
        }
    }
}

// -----------------------------------------------------------------------------
// 3. STATS & DATA QUERIES
// -----------------------------------------------------------------------------
$stats = [
    'total_amount' => 0.0,
    'paid_amount' => 0.0,
    'pending_amount' => 0.0,
    'count_total' => 0,
    'count_paid' => 0,
    'count_pending' => 0
];

try {
    $statRows = $pdo->query("SELECT amount, status FROM invoices")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($statRows as $row) {
        $amt = (float)$row['amount'];
        $st = strtolower((string)$row['status']);
        $stats['total_amount'] += $amt;
        $stats['count_total']++;

        if ($st === 'paid') {
            $stats['paid_amount'] += $amt;
            $stats['count_paid']++;
        } elseif ($st === 'pending') {
            $stats['pending_amount'] += $amt;
            $stats['count_pending']++;
        }
    }
} catch (\Throwable $e) {
    error_log("Invoices stats error: " . $e->getMessage());
}

// Filters & Search
$statusFilter = strtolower(sanitize_text($_GET['status'] ?? 'all'));
$serviceFilter = sanitize_text($_GET['service'] ?? 'all');
$searchQuery = trim(sanitize_text($_GET['q'] ?? $_GET['search'] ?? ''));

$whereClauses = [];
$params = [];

if ($statusFilter !== 'all' && in_array($statusFilter, $validStatuses, true)) {
    $whereClauses[] = "LOWER(i.status) = :status";
    $params[':status'] = $statusFilter;
}

if ($serviceFilter !== 'all' && in_array($serviceFilter, $validServices, true)) {
    $whereClauses[] = "LOWER(i.service) = :service";
    $params[':service'] = strtolower($serviceFilter);
}

if (!empty($searchQuery)) {
    $whereClauses[] = "(i.invoice_number LIKE :q OR i.client_name LIKE :q OR i.service LIKE :q OR i.notes LIKE :q)";
    $params[':q'] = "%{$searchQuery}%";
}

$whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

$invoicesQuery = "
    SELECT i.*, 
           c.company_name as client_company, 
           c.email as client_email, 
           c.phone as client_phone
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    {$whereSql}
    ORDER BY i.id DESC
";

$invStmt = $pdo->prepare($invoicesQuery);
$invStmt->execute($params);
$invoices = $invStmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch clients list for Generate Invoice modal dropdown
$clientsList = $pdo->query("SELECT id, client_name, company_name, email, phone, service FROM clients ORDER BY client_name ASC")->fetchAll(PDO::FETCH_ASSOC);

// Auto-generate next suggested invoice number for modal
$year = date('Y');
$latestInv = $pdo->query("SELECT invoice_number FROM invoices WHERE invoice_number LIKE 'INV-{$year}-%' ORDER BY id DESC LIMIT 1")->fetchColumn();
$suggestedSeq = 1;
if ($latestInv && preg_match('/INV-\d{4}-(\d+)/', (string)$latestInv, $m)) {
    $suggestedSeq = ((int)$m[1]) + 1;
}
$suggestedInvoiceNumber = sprintf('INV-%s-%03d', $year, $suggestedSeq);

require_once dirname(__DIR__) . '/includes/admin_header.php';
?>

  <!-- Flash Alerts -->
  <?php if ($success): ?>
    <div class="admin-alert alert-success">
      <span><?= e($success) ?></span>
      <button type="button" onclick="this.parentElement.remove()" style="font-weight:bold; color:inherit;">✕</button>
    </div>
  <?php endif; ?>
  <?php if ($error): ?>
    <div class="admin-alert alert-error">
      <span><?= e($error) ?></span>
      <button type="button" onclick="this.parentElement.remove()" style="font-weight:bold; color:inherit;">✕</button>
    </div>
  <?php endif; ?>

  <!-- Page Header -->
  <div class="page-header">
    <div>
      <h1 class="page-title">Invoices &amp; Billing</h1>
      <p class="page-subtitle">Generate client invoices, export high-resolution PDFs, track receivables, and reconcile project billing.</p>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <button type="button" class="btn-primary-admin" onclick="openGenerateInvoiceModal()" style="padding: 9px 18px; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0, 245, 160, 0.2);">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="stroke-width: 2.5;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        <span>Generate Invoice</span>
      </button>
    </div>
  </div>

  <!-- Invoices KPI Grid (Amounts in ₹) -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">Total Invoiced</span>
        <div class="kpi-icon-wrap blue">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
      </div>
      <div class="kpi-value" style="font-size: 26px;">₹<?= number_format($stats['total_amount'], 2) ?></div>
      <div class="kpi-footer">
        <span class="kpi-tag positive"><?= (int)$stats['count_total'] ?> Invoices</span>
        <span>Across all clients</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">Paid &amp; Settled</span>
        <div class="kpi-icon-wrap lime">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>
      <div class="kpi-value" style="font-size: 26px; color: #047857;">₹<?= number_format($stats['paid_amount'], 2) ?></div>
      <div class="kpi-footer">
        <span class="kpi-tag positive"><?= (int)$stats['count_paid'] ?> Paid</span>
        <span>Funds collected</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">Pending Receivables</span>
        <div class="kpi-icon-wrap orange">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
      <div class="kpi-value" style="font-size: 26px; color: #b45309;">₹<?= number_format($stats['pending_amount'], 2) ?></div>
      <div class="kpi-footer">
        <span class="kpi-tag alert"><?= (int)$stats['count_pending'] ?> Pending</span>
        <span>Awaiting settlement</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">Studio Location</span>
        <div class="kpi-icon-wrap purple">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
      </div>
      <div class="kpi-value" style="font-size: 20px; font-weight: 700;">Bangalore</div>
      <div class="kpi-footer">
        <span class="kpi-tag positive">Karnataka 560010</span>
        <span>MakeIT Studio India</span>
      </div>
    </div>
  </div>

  <!-- Invoices Search & Filter Card -->
  <div class="data-card" style="margin-bottom: 20px; padding: 14px 18px;">
    <form method="GET" action="invoices.php" style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <!-- Search Input -->
      <div style="flex: 1; min-width: 240px; position: relative;">
        <input type="text" name="q" value="<?= e($searchQuery) ?>" placeholder="Search by invoice #, client name, service..." class="form-control" style="width: 100%; padding: 8px 12px 8px 34px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px;">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="position: absolute; left: 10px; top: 10px; color: var(--text-muted);">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <!-- Status Filter -->
      <div style="min-width: 150px;">
        <select name="status" class="form-control" onchange="this.form.submit()" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px; background: #ffffff;">
          <option value="all" <?= $statusFilter === 'all' ? 'selected' : '' ?>>All Statuses</option>
          <option value="paid" <?= $statusFilter === 'paid' ? 'selected' : '' ?>>Paid (Settled)</option>
          <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>Pending (Unpaid)</option>
          <option value="draft" <?= $statusFilter === 'draft' ? 'selected' : '' ?>>Draft</option>
        </select>
      </div>

      <!-- Service Filter -->
      <div style="min-width: 150px;">
        <select name="service" class="form-control" onchange="this.form.submit()" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px; background: #ffffff;">
          <option value="all" <?= $serviceFilter === 'all' ? 'selected' : '' ?>>All Services</option>
          <?php foreach ($validServices as $sv): ?>
            <option value="<?= e($sv) ?>" <?= $serviceFilter === $sv ? 'selected' : '' ?>><?= e($sv) ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <button type="submit" class="btn-action" style="padding: 8px 14px; font-size: 13px; background: var(--border-light);">Filter</button>
      <?php if (!empty($searchQuery) || $statusFilter !== 'all' || $serviceFilter !== 'all'): ?>
        <a href="invoices.php" class="btn-action" style="padding: 8px 14px; font-size: 13px; color: #dc2626;">Reset</a>
      <?php endif; ?>
    </form>
  </div>

  <!-- Invoices Table Data Card -->
  <div class="data-card">
    <div class="data-card-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 class="data-card-title">All Invoices (<?= count($invoices) ?>)</h2>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
          Generated client bills, milestone schedules, and one-click PDF export.
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <?php if (empty($invoices)): ?>
        <div style="text-align: center; padding: 48px 24px; color: var(--text-muted);">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="margin: 0 auto 12px; color: #cbd5e1;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div style="font-size: 16px; font-weight: 600; color: var(--text-dark); margin-bottom: 6px;">No invoices found</div>
          <p style="font-size: 13px; max-width: 420px; margin: 0 auto 16px;">
            <?= (!empty($searchQuery) || $statusFilter !== 'all' || $serviceFilter !== 'all') ? 'Try adjusting your search criteria or reset filters.' : 'Click below to generate the first invoice for a client and export it in PDF format.' ?>
          </p>
          <button type="button" class="btn-primary-admin" onclick="openGenerateInvoiceModal()" style="font-size: 13px; padding: 8px 18px;">
            + Generate First Invoice
          </button>
        </div>
      <?php else: ?>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client / Account</th>
              <th>Service</th>
              <th>Issued</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($invoices as $inv): ?>
              <?php 
                $st = strtolower((string)$inv['status']);
                $pillClass = match ($st) {
                    'paid' => 'status-paid',
                    'pending' => 'status-pending',
                    'draft' => 'status-draft',
                    default => 'status-inactive'
                };
              ?>
              <tr>
                <!-- Invoice # -->
                <td style="font-family: 'DM Mono', monospace; font-weight: 700; font-size: 12px; color: var(--text-dark);">
                  <a href="invoices.php?action=export_pdf&id=<?= (int)$inv['id'] ?>" title="Download PDF" style="color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                    <?= e($inv['invoice_number']) ?>
                  </a>
                </td>

                <!-- Client Name -->
                <td>
                  <strong style="color: var(--text-dark); font-size: 13px;"><?= e($inv['client_name']) ?></strong>
                  <?php if (!empty($inv['client_company']) && strtolower($inv['client_company']) !== strtolower($inv['client_name'])): ?>
                    <div style="font-size: 11px; color: var(--text-muted);"><?= e($inv['client_company']) ?></div>
                  <?php endif; ?>
                </td>

                <!-- Service -->
                <td>
                  <span class="service-tag" style="background: rgba(0, 245, 160, 0.08); color: #047857; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                    <?= e($inv['service'] ?: 'Digital Solutions') ?>
                  </span>
                </td>

                <!-- Issued -->
                <td style="font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-muted);">
                  <?= e(format_date($inv['created_at'], 'M j, Y')) ?>
                </td>

                <!-- Due Date -->
                <td style="font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-muted);">
                  <?= e(format_date($inv['due_date'], 'M j, Y')) ?>
                </td>

                <!-- Amount in ₹ -->
                <td style="font-family: 'DM Mono', monospace; font-weight: 700; font-size: 13px; color: var(--text-dark);">
                  ₹<?= number_format((float)$inv['amount'], 2) ?>
                </td>

                <!-- Status -->
                <td>
                  <span class="status-pill <?= $pillClass ?>">
                    <?= e(ucfirst($inv['status'])) ?>
                  </span>
                </td>

                <!-- Payment Date -->
                <td style="font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-muted);">
                  <?= !empty($inv['paid_at']) ? e(format_date($inv['paid_at'], 'M j, Y')) : '—' ?>
                </td>

                <!-- Action Buttons -->
                <td style="text-align: right; white-space: nowrap;">
                  <div style="display: inline-flex; gap: 6px; align-items: center;">
                    <!-- 1. Export PDF Button -->
                    <a href="invoices.php?action=export_pdf&id=<?= (int)$inv['id'] ?>" class="btn-action" title="Download PDF" style="color: #0284c7; background: #e0f2fe; padding: 5px 9px; font-size: 11px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="stroke-width: 2.2;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      <span>Export PDF</span>
                    </a>

                    <!-- 2. View Invoice Modal Button -->
                    <button type="button" class="btn-action" title="View Invoice" onclick="viewInvoice(<?= htmlspecialchars(json_encode($inv), ENT_QUOTES, 'UTF-8') ?>)" style="padding: 5px 8px; font-size: 11px; border-radius: 6px;">
                      👁️
                    </button>

                    <!-- 3. Edit Invoice Modal Button -->
                    <button type="button" class="btn-action" title="Edit Invoice" onclick="editInvoice(<?= htmlspecialchars(json_encode($inv), ENT_QUOTES, 'UTF-8') ?>)" style="padding: 5px 8px; font-size: 11px; border-radius: 6px;">
                      ✏️
                    </button>

                    <!-- 4. Delete Invoice Button -->
                    <button type="button" class="btn-action" title="Delete Invoice" onclick="confirmDeleteInvoice(<?= (int)$inv['id'] ?>, '<?= e(addslashes($inv['invoice_number'])) ?>')" style="color: #dc2626; background: #fee2e2; padding: 5px 8px; font-size: 11px; border-radius: 6px;">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>
  </div>

  <!-- =========================================================
       MODAL 1: GENERATE INVOICE FOR CLIENT
  ========================================================= -->
  <div id="generateInvoiceModal" class="modal-overlay" aria-hidden="true">
    <div class="modal-dialog" style="max-width: 580px;">
      <form method="POST" action="invoices.php">
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="create_invoice">

        <div class="modal-header">
          <div>
            <div class="modal-title">Generate Client Invoice</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
              Create a billing record and export in PDF with MakeIT agency branding.
            </div>
          </div>
          <button type="button" class="modal-close-btn" onclick="closeGenerateInvoiceModal()">✕</button>
        </div>

        <div class="modal-body" style="font-size: 13px;">
          <!-- Client Selector -->
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
              Select Client / Account *
            </label>
            <select name="client_id" id="genClientId" class="form-control" onchange="toggleCustomClientInput()" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px; background: #ffffff;">
              <option value="0">— Select Existing Client or Enter Below —</option>
              <?php foreach ($clientsList as $c): ?>
                <?php 
                  $dispName = !empty($c['company_name']) ? "{$c['company_name']} ({$c['client_name']})" : $c['client_name'];
                ?>
                <option value="<?= (int)$c['id'] ?>" data-service="<?= e($c['service'] ?? '') ?>" data-email="<?= e($c['email'] ?? '') ?>" data-phone="<?= e($c['phone'] ?? '') ?>">
                  <?= e($dispName) ?>
                </option>
              <?php endforeach; ?>
              <option value="-1">+ Enter New / Custom Client Name</option>
            </select>
          </div>

          <!-- Custom Client Name (hidden by default) -->
          <div class="form-group" id="customClientWrap" style="margin-bottom: 14px; display: none;">
            <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
              Custom Client / Company Name *
            </label>
            <input type="text" name="client_name_custom" id="genClientNameCustom" placeholder="e.g. Apex Global Logistics" class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px;">
          </div>

          <!-- Invoice Number & Service -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Invoice Reference # *
              </label>
              <input type="text" name="invoice_number" id="genInvoiceNumber" value="<?= e($suggestedInvoiceNumber) ?>" required class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600;">
            </div>

            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Service Category *
              </label>
              <select name="service" id="genService" required class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px; background: #ffffff;">
                <?php foreach ($validServices as $sv): ?>
                  <option value="<?= e($sv) ?>"><?= e($sv) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>

          <!-- Amount & Status -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Invoice Amount (₹) *
              </label>
              <div style="position: relative;">
                <span style="position: absolute; left: 10px; top: 9px; font-weight: 700; color: var(--text-muted); font-size: 14px;">₹</span>
                <input type="number" step="0.01" min="1" name="amount" id="genAmount" placeholder="85000.00" required class="form-control" style="width: 100%; padding: 8px 12px 8px 26px; border-radius: 8px; border: 1px solid var(--border-light); font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700;">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Billing Status *
              </label>
              <select name="status" id="genStatus" required class="form-control" onchange="togglePaidDateInput()" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px; background: #ffffff;">
                <option value="pending" selected>Pending (Awaiting Payment)</option>
                <option value="paid">Paid in Full (Settled)</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <!-- Due Date & Optional Paid Date -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Payment Due Date *
              </label>
              <input type="date" name="due_date" id="genDueDate" value="<?= date('Y-m-d', time() + 86400 * 14) ?>" required class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px;">
            </div>

            <div class="form-group" id="paidDateWrap" style="display: none;">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Date Settled / Paid
              </label>
              <input type="date" name="paid_at" id="genPaidAt" value="<?= date('Y-m-d') ?>" class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px;">
            </div>
          </div>

          <!-- Notes / Deliverable Scope -->
          <div class="form-group" style="margin-bottom: 6px;">
            <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
              Scope &amp; Line Items Description (Printed on Invoice)
            </label>
            <textarea name="notes" id="genNotes" rows="3" placeholder="e.g. Milestone 1: Headless corporate portal frontend, API gateway integrations, and production deployment sign-off." class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 12px; line-height: 1.5; resize: vertical;"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-action" onclick="closeGenerateInvoiceModal()" style="background: var(--main-bg);">Cancel</button>
          <button type="submit" class="btn-primary-admin" style="padding: 9px 20px; font-size: 13px;">
            Generate &amp; Save Invoice
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- =========================================================
       MODAL 2: VIEW INVOICE PREVIEW
  ========================================================= -->
  <div id="viewInvoiceModal" class="modal-overlay" aria-hidden="true">
    <div class="modal-dialog" style="max-width: 580px;">
      <div class="modal-header">
        <div>
          <div class="modal-title" id="viewInvTitle">Invoice Details</div>
          <div id="viewInvSubtitle" style="font-size: 12px; color: var(--text-muted); margin-top: 2px;"></div>
        </div>
        <button type="button" class="modal-close-btn" onclick="closeViewInvoiceModal()">✕</button>
      </div>

      <div class="modal-body" style="font-size: 13px;">
        <!-- Card preview banner -->
        <div style="background: #0A0F1D; color: #ffffff; padding: 18px 20px; border-radius: 10px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">MakeIT</div>
            <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">Bangalore Studio, Karnataka 560010</div>
          </div>
          <div style="text-align: right;">
            <div id="viewInvBadge" style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11px;"></div>
            <div id="viewInvAmount" style="font-size: 18px; font-weight: 800; color: #00F5A0; font-family: 'DM Mono', monospace; margin-top: 4px;"></div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
          <div>
            <span style="color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Billed To</span>
            <div id="viewInvClient" style="font-weight: 700; color: var(--text-dark); font-size: 14px;"></div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Service Category</span>
            <div id="viewInvService" style="font-weight: 600; color: var(--text-dark);"></div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Issue Date</span>
            <div id="viewInvIssueDate" style="font-family: 'DM Mono', monospace; color: var(--text-dark);"></div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Payment Due</span>
            <div id="viewInvDueDate" style="font-family: 'DM Mono', monospace; color: var(--text-dark);"></div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <span style="color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Scope / Line Items</span>
          <div id="viewInvNotes" style="background: var(--main-bg); padding: 10px 12px; border-radius: 8px; font-size: 12px; color: var(--text-dark); margin-top: 4px; line-height: 1.5;"></div>
        </div>

        <div style="border-top: 1px solid var(--border-light); padding-top: 14px; font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Studio Tel: +91 9035344513</span>
          <span>Payment via: HDFC Bank / 9035344513@upi</span>
        </div>
      </div>

      <div class="modal-footer" style="display: flex; justify-content: space-between;">
        <button type="button" class="btn-action" onclick="closeViewInvoiceModal()" style="background: var(--main-bg);">Close</button>
        <div style="display: flex; gap: 8px;">
          <a id="viewInvPdfBtn" href="#" class="btn-primary-admin" style="padding: 8px 18px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="stroke-width: 2.2;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- =========================================================
       MODAL 3: EDIT INVOICE MODAL
  ========================================================= -->
  <div id="editInvoiceModal" class="modal-overlay" aria-hidden="true">
    <div class="modal-dialog" style="max-width: 520px;">
      <form method="POST" action="invoices.php">
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="edit_invoice">
        <input type="hidden" name="invoice_id" id="editInvoiceId">

        <div class="modal-header">
          <div>
            <div class="modal-title">Edit Invoice</div>
            <div id="editInvoiceSubtitle" style="font-size: 12px; color: var(--text-muted); margin-top: 2px;"></div>
          </div>
          <button type="button" class="modal-close-btn" onclick="closeEditInvoiceModal()">✕</button>
        </div>

        <div class="modal-body" style="font-size: 13px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Amount (₹) *
              </label>
              <input type="number" step="0.01" min="1" name="amount" id="editAmount" required class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700;">
            </div>

            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Billing Status *
              </label>
              <select name="status" id="editStatus" required class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px; background: #ffffff;">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Service Category *
              </label>
              <select name="service" id="editService" required class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px; background: #ffffff;">
                <?php foreach ($validServices as $sv): ?>
                  <option value="<?= e($sv) ?>"><?= e($sv) ?></option>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
                Payment Due Date *
              </label>
              <input type="date" name="due_date" id="editDueDate" required class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 13px;">
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 6px;">
            <label class="form-label" style="font-weight: 600; font-size: 12px; color: var(--text-dark); margin-bottom: 6px; display: block;">
              Scope &amp; Line Items Description
            </label>
            <textarea name="notes" id="editNotes" rows="2" class="form-control" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 12px; line-height: 1.5; resize: vertical;"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-action" onclick="closeEditInvoiceModal()" style="background: var(--main-bg);">Cancel</button>
          <button type="submit" class="btn-primary-admin" style="padding: 8px 18px; font-size: 13px;">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- =========================================================
       MODAL 4: DELETE CONFIRMATION MODAL
  ========================================================= -->
  <div id="deleteInvoiceModal" class="modal-overlay" aria-hidden="true">
    <div class="modal-dialog" style="max-width: 440px;">
      <form method="POST" action="invoices.php">
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="delete_invoice">
        <input type="hidden" name="invoice_id" id="deleteInvoiceId">

        <div class="modal-header">
          <div class="modal-title" style="color: #dc2626;">Confirm Invoice Deletion</div>
          <button type="button" class="modal-close-btn" onclick="closeDeleteInvoiceModal()">✕</button>
        </div>

        <div class="modal-body" style="font-size: 13px; color: var(--text-dark); line-height: 1.5;">
          Are you sure you want to permanently delete <strong id="deleteInvoiceNumText">this invoice</strong>?
          <div style="margin-top: 8px; font-size: 12px; color: var(--text-muted);">
            This record will be permanently removed from your billing ledger and will not reoccur.
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-action" onclick="closeDeleteInvoiceModal()" style="background: var(--main-bg);">Cancel</button>
          <button type="submit" class="btn-primary-admin" style="background: #dc2626; color: #ffffff; padding: 8px 18px; font-size: 13px;">
            Permanently Delete
          </button>
        </div>
      </form>
    </div>
  </div>

  <script>
    // -------------------------------------------------------------
    // MODAL CONTROL & INTERACTIVITY
    // -------------------------------------------------------------
    function openGenerateInvoiceModal() {
      const m = document.getElementById('generateInvoiceModal');
      m.style.display = 'flex';
      m.setAttribute('aria-hidden', 'false');
    }

    function closeGenerateInvoiceModal() {
      const m = document.getElementById('generateInvoiceModal');
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');
    }

    function toggleCustomClientInput() {
      const sel = document.getElementById('genClientId');
      const wrap = document.getElementById('customClientWrap');
      const serviceSel = document.getElementById('genService');

      if (sel.value === '-1') {
        wrap.style.display = 'block';
        document.getElementById('genClientNameCustom').focus();
      } else {
        wrap.style.display = 'none';
        const opt = sel.options[sel.selectedIndex];
        const sVal = opt.getAttribute('data-service');
        if (sVal) {
          serviceSel.value = sVal;
        }
      }
    }

    function togglePaidDateInput() {
      const st = document.getElementById('genStatus').value;
      const wrap = document.getElementById('paidDateWrap');
      wrap.style.display = (st === 'paid') ? 'block' : 'none';
    }

    function viewInvoice(inv) {
      document.getElementById('viewInvTitle').textContent = 'Invoice ' + (inv.invoice_number || '');
      document.getElementById('viewInvSubtitle').textContent = 'Issued to ' + (inv.client_name || '');
      document.getElementById('viewInvClient').textContent = inv.client_name || '—';
      document.getElementById('viewInvService').textContent = inv.service || 'Digital Solutions';
      document.getElementById('viewInvIssueDate').textContent = (inv.created_at || '').substring(0, 10);
      document.getElementById('viewInvDueDate').textContent = inv.due_date || '—';
      document.getElementById('viewInvAmount').textContent = '₹' + parseFloat(inv.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('viewInvNotes').textContent = inv.notes || 'Professional engineering and milestone deliverables.';

      const badge = document.getElementById('viewInvBadge');
      const st = (inv.status || 'pending').toLowerCase();
      badge.textContent = st.toUpperCase();
      if (st === 'paid') {
        badge.style.background = '#059669';
        badge.style.color = '#ffffff';
      } else if (st === 'pending') {
        badge.style.background = '#d97706';
        badge.style.color = '#ffffff';
      } else {
        badge.style.background = '#64748b';
        badge.style.color = '#ffffff';
      }

      document.getElementById('viewInvPdfBtn').href = 'invoices.php?action=export_pdf&id=' + inv.id;

      const m = document.getElementById('viewInvoiceModal');
      m.style.display = 'flex';
      m.setAttribute('aria-hidden', 'false');
    }

    function closeViewInvoiceModal() {
      const m = document.getElementById('viewInvoiceModal');
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');
    }

    function editInvoice(inv) {
      document.getElementById('editInvoiceId').value = inv.id;
      document.getElementById('editInvoiceSubtitle').textContent = 'Editing ' + (inv.invoice_number || '') + ' (' + (inv.client_name || '') + ')';
      document.getElementById('editAmount').value = inv.amount;
      document.getElementById('editStatus').value = (inv.status || 'pending').toLowerCase();
      document.getElementById('editService').value = inv.service || 'Websites';
      document.getElementById('editDueDate').value = inv.due_date || '';
      document.getElementById('editNotes').value = inv.notes || '';

      const m = document.getElementById('editInvoiceModal');
      m.style.display = 'flex';
      m.setAttribute('aria-hidden', 'false');
    }

    function closeEditInvoiceModal() {
      const m = document.getElementById('editInvoiceModal');
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');
    }

    function confirmDeleteInvoice(id, num) {
      document.getElementById('deleteInvoiceId').value = id;
      document.getElementById('deleteInvoiceNumText').textContent = 'Invoice ' + num;

      const m = document.getElementById('deleteInvoiceModal');
      m.style.display = 'flex';
      m.setAttribute('aria-hidden', 'false');
    }

    function closeDeleteInvoiceModal() {
      const m = document.getElementById('deleteInvoiceModal');
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');
    }

    // Close modals on clicking overlay outside dialog
    window.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
        e.target.setAttribute('aria-hidden', 'true');
      }
    });
  </script>

<?php require_once dirname(__DIR__) . '/includes/admin_footer.php'; ?>
