<?php
/**
 * MakeIT Admin — Native PDF Invoice Generator
 *
 * Produces standard-compliant, standalone PDF 1.4 documents without requiring
 * external composer dependencies. Designed specifically for MakeIT agency client invoices.
 */

declare(strict_types=1);

final class MakeIT_Invoice_PDF
{
    private array $invoice;
    private ?array $client;

    public function __construct(array $invoice, array|false|null $client = null)
    {
        $this->invoice = $invoice;
        $this->client = is_array($client) ? $client : null;
    }

    /**
     * Build and return the raw PDF binary string.
     */
    public function render(): string
    {
        $inv = $this->invoice;
        $client = $this->client ?? [];

        $invNumber = (string)($inv['invoice_number'] ?? 'INV-' . date('Y') . '-001');
        $clientName = (string)($inv['client_name'] ?? ($client['client_name'] ?? 'Client'));
        $companyName = (string)($client['company_name'] ?? ($inv['company_name'] ?? $clientName));
        $clientEmail = (string)($client['email'] ?? ($inv['client_email'] ?? 'billing@' . strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $clientName)) . '.com'));
        $clientPhone = (string)($client['phone'] ?? ($inv['client_phone'] ?? '+91 98000 00000'));
        $service = (string)($inv['service'] ?? 'Digital Solutions');
        $amount = (float)($inv['amount'] ?? 0.0);
        $status = strtolower((string)($inv['status'] ?? 'paid'));
        $issueDate = !empty($inv['created_at']) ? date('M j, Y', strtotime((string)$inv['created_at'])) : date('M j, Y');
        $dueDate = !empty($inv['due_date']) ? date('M j, Y', strtotime((string)$inv['due_date'])) : date('M j, Y', time() + 86400 * 14);
        $paidDate = !empty($inv['paid_at']) ? date('M j, Y', strtotime((string)$inv['paid_at'])) : null;
        $notes = trim((string)($inv['notes'] ?? ''));
        if (empty($notes)) {
            $notes = "Deliverable: Professional " . $service . " engineering & implementation milestones as per service agreement.";
        }

        $formattedAmount = 'INR ' . number_format($amount, 2);

        // Graphics and Text Stream Buffer
        $s = [];

        // -------------------------------------------------------------
        // 1. TOP HEADER BANNER (Dark Navy #0A0F1D)
        // -------------------------------------------------------------
        $s[] = "q";
        $s[] = "0.039 0.059 0.114 rg"; // #0A0F1D
        $s[] = "0 730 595.28 111.89 re f";

        // Mint Accent Stripe #00F5A0 (height 4pt at bottom of header banner)
        $s[] = "0 0.96 0.627 rg"; // #00F5A0
        $s[] = "0 726 595.28 4 re f";
        $s[] = "Q";

        // Brand Title & Tagline in Header Banner
        $s[] = "BT /F2 22 Tf 1 1 1 rg 45 798 Td (MakeIT) Tj ET";
        $s[] = "BT /F1 9 Tf 0.58 0.64 0.72 rg 45 784 Td (DIGITAL PRODUCT & ENGINEERING STUDIO) Tj ET";

        // Studio Contact Info in Header Banner (left side)
        $s[] = "BT /F1 8 Tf 0.80 0.85 0.90 rg 45 765 Td (Studio: Bangalore-560010, Karnataka, India) Tj ET";
        $s[] = "BT /F1 8 Tf 0.80 0.85 0.90 rg 45 753 Td (Phone: +91 9035344513  |  Web: makeit.agency  |  Email: billing@makeit.agency) Tj ET";

        // Header Banner (right side): INVOICE text & number
        $s[] = "BT /F2 20 Tf 1 1 1 rg 420 798 Td (INVOICE) Tj ET";
        $s[] = "BT /F2 12 Tf 0 0.96 0.627 rg 420 782 Td (" . $this->escapePdf($invNumber) . ") Tj ET";

        // -------------------------------------------------------------
        // 2. INVOICE META & STATUS BAR (y=670 to 710)
        // -------------------------------------------------------------
        // Light Gray Background Bar
        $s[] = "q";
        $s[] = "0.96 0.97 0.98 rg";
        $s[] = "45 668 505.28 42 re f";
        $s[] = "0.88 0.90 0.93 RG 0.5 w";
        $s[] = "45 668 505.28 42 re S";
        $s[] = "Q";

        // Issue Date
        $s[] = "BT /F1 8 Tf 0.40 0.45 0.50 rg 60 694 Td (DATE OF ISSUE) Tj ET";
        $s[] = "BT /F2 10 Tf 0.08 0.12 0.18 rg 60 679 Td (" . $this->escapePdf($issueDate) . ") Tj ET";

        // Due Date
        $s[] = "BT /F1 8 Tf 0.40 0.45 0.50 rg 180 694 Td (PAYMENT DUE) Tj ET";
        $s[] = "BT /F2 10 Tf 0.08 0.12 0.18 rg 180 679 Td (" . $this->escapePdf($dueDate) . ") Tj ET";

        // Invoice Number Block
        $s[] = "BT /F1 8 Tf 0.40 0.45 0.50 rg 300 694 Td (INVOICE REFERENCE) Tj ET";
        $s[] = "BT /F2 10 Tf 0.08 0.12 0.18 rg 300 679 Td (" . $this->escapePdf($invNumber) . ") Tj ET";

        // Status Badge Pill (Right side of meta bar)
        $badgeX = 430;
        $badgeY = 678;
        $badgeW = 100;
        $badgeH = 22;

        if ($status === 'paid') {
            // Emerald Green Badge
            $s[] = "q 0.05 0.65 0.40 rg {$badgeX} {$badgeY} {$badgeW} {$badgeH} re f Q";
            $s[] = "BT /F2 9 Tf 1 1 1 rg " . ($badgeX + 18) . " " . ($badgeY + 7) . " Td (PAID IN FULL) Tj ET";
        } elseif ($status === 'pending') {
            // Amber Badge
            $s[] = "q 0.90 0.55 0.05 rg {$badgeX} {$badgeY} {$badgeW} {$badgeH} re f Q";
            $s[] = "BT /F2 9 Tf 1 1 1 rg " . ($badgeX + 26) . " " . ($badgeY + 7) . " Td (PENDING) Tj ET";
        } else {
            // Slate Gray Badge
            $s[] = "q 0.40 0.45 0.55 rg {$badgeX} {$badgeY} {$badgeW} {$badgeH} re f Q";
            $s[] = "BT /F2 9 Tf 1 1 1 rg " . ($badgeX + 32) . " " . ($badgeY + 7) . " Td (" . strtoupper($status) . ") Tj ET";
        }

        // -------------------------------------------------------------
        // 3. BILLED TO / CLIENT SECTION (y=570 to 650)
        // -------------------------------------------------------------
        $s[] = "BT /F2 9 Tf 0.35 0.40 0.50 rg 45 645 Td (BILLED TO) Tj ET";
        $s[] = "BT /F2 13 Tf 0.06 0.09 0.14 rg 45 628 Td (" . $this->escapePdf($clientName) . ") Tj ET";
        if (!empty($companyName) && strtolower($companyName) !== strtolower($clientName)) {
            $s[] = "BT /F1 10 Tf 0.20 0.25 0.30 rg 45 614 Td (" . $this->escapePdf($companyName) . ") Tj ET";
            $s[] = "BT /F1 9 Tf 0.35 0.40 0.48 rg 45 600 Td (" . $this->escapePdf($clientEmail) . "  |  " . $this->escapePdf($clientPhone) . ") Tj ET";
        } else {
            $s[] = "BT /F1 9 Tf 0.35 0.40 0.48 rg 45 614 Td (" . $this->escapePdf($clientEmail) . "  |  " . $this->escapePdf($clientPhone) . ") Tj ET";
        }

        // Service Category Badge on Right of Client block
        $s[] = "BT /F1 8 Tf 0.45 0.50 0.55 rg 380 645 Td (PROJECT / SERVICE CATEGORY) Tj ET";
        $s[] = "BT /F2 11 Tf 0.08 0.12 0.20 rg 380 630 Td (" . $this->escapePdf($service) . ") Tj ET";
        if ($paidDate && $status === 'paid') {
            $s[] = "BT /F1 8 Tf 0.05 0.60 0.35 rg 380 615 Td (Settled on: " . $this->escapePdf($paidDate) . ") Tj ET";
        }

        // Horizontal Divider Line
        $s[] = "q 0.85 0.88 0.92 RG 0.7 w 45 580 m 550.28 580 l S Q";

        // -------------------------------------------------------------
        // 4. LINE ITEMS TABLE (y=440 to 570)
        // -------------------------------------------------------------
        $tblY = 550;
        // Table Header
        $s[] = "q 0.08 0.12 0.18 rg 45 {$tblY} 505.28 24 re f Q";
        $s[] = "BT /F2 8.5 Tf 1 1 1 rg 55 " . ($tblY + 8) . " Td (DESCRIPTION & SCOPE) Tj ET";
        $s[] = "BT /F2 8.5 Tf 1 1 1 rg 310 " . ($tblY + 8) . " Td (CATEGORY) Tj ET";
        $s[] = "BT /F2 8.5 Tf 1 1 1 rg 395 " . ($tblY + 8) . " Td (QTY / UNITS) Tj ET";
        $s[] = "BT /F2 8.5 Tf 1 1 1 rg 470 " . ($tblY + 8) . " Td (AMOUNT (INR)) Tj ET";

        // Row 1: Primary Service Deliverable
        $row1Y = 490;
        $s[] = "q 0.98 0.99 1.0 rg 45 {$row1Y} 505.28 55 re f Q";
        $s[] = "q 0.88 0.90 0.94 RG 0.5 w 45 {$row1Y} 505.28 55 re S Q";

        // Main description title
        $itemTitle = $service . " — Project Milestone Deliverable";
        $s[] = "BT /F2 10 Tf 0.08 0.12 0.20 rg 55 " . ($row1Y + 38) . " Td (" . $this->escapePdf($itemTitle) . ") Tj ET";

        // Truncate/wrap notes cleanly
        $cleanNotes = preg_replace('/\s+/', ' ', $notes);
        if (strlen($cleanNotes) > 65) {
            $notesLine1 = substr($cleanNotes, 0, 62) . '...';
            $s[] = "BT /F1 8 Tf 0.35 0.40 0.48 rg 55 " . ($row1Y + 24) . " Td (" . $this->escapePdf($notesLine1) . ") Tj ET";
            $s[] = "BT /F1 7.5 Tf 0.50 0.55 0.62 rg 55 " . ($row1Y + 11) . " Td (Comprehensive QA, security review & production sign-off) Tj ET";
        } else {
            $s[] = "BT /F1 8.5 Tf 0.35 0.40 0.48 rg 55 " . ($row1Y + 22) . " Td (" . $this->escapePdf($cleanNotes) . ") Tj ET";
        }

        // Col 2: Service
        $s[] = "BT /F1 9 Tf 0.20 0.25 0.35 rg 310 " . ($row1Y + 32) . " Td (" . $this->escapePdf($service) . ") Tj ET";

        // Col 3: Qty
        $s[] = "BT /F1 9 Tf 0.20 0.25 0.35 rg 405 " . ($row1Y + 32) . " Td (1 Milestone) Tj ET";

        // Col 4: Amount
        $s[] = "BT /F2 10.5 Tf 0.06 0.09 0.15 rg 465 " . ($row1Y + 32) . " Td (" . $this->escapePdf($formattedAmount) . ") Tj ET";

        // -------------------------------------------------------------
        // 5. TOTALS & FINANCIAL SUMMARY (y=370 to 480)
        // -------------------------------------------------------------
        $sumX = 330;
        $sumW = 220.28;

        // Subtotal
        $s[] = "BT /F1 9 Tf 0.35 0.40 0.48 rg " . ($sumX + 10) . " 465 Td (Subtotal:) Tj ET";
        $s[] = "BT /F1 9.5 Tf 0.10 0.15 0.22 rg " . ($sumX + 130) . " 465 Td (" . $this->escapePdf($formattedAmount) . ") Tj ET";

        // Taxes (Goods and Services Tax GST)
        $s[] = "BT /F1 8.5 Tf 0.40 0.45 0.52 rg " . ($sumX + 10) . " 448 Td (GST / Applicable Tax:) Tj ET";
        $s[] = "BT /F1 8.5 Tf 0.40 0.45 0.52 rg " . ($sumX + 130) . " 448 Td (Included) Tj ET";

        // Horizontal Line above Grand Total
        $s[] = "q 0.80 0.85 0.90 RG 0.7 w " . ($sumX + 5) . " 440 m 550.28 440 l S Q";

        // Grand Total Box (Dark Background)
        $s[] = "q 0.04 0.07 0.12 rg " . ($sumX + 5) . " 408 " . ($sumW - 5) . " 26 re f Q";
        $s[] = "BT /F2 10 Tf 1 1 1 rg " . ($sumX + 15) . " 417 Td (TOTAL AMOUNT:) Tj ET";
        $s[] = "BT /F2 11 Tf 0 0.96 0.627 rg " . ($sumX + 115) . " 417 Td (" . $this->escapePdf($formattedAmount) . ") Tj ET";

        // -------------------------------------------------------------
        // 6. BANKING & PAYMENT INSTRUCTIONS CARD (Left side, y=360 to 475)
        // -------------------------------------------------------------
        $payX = 45;
        $payY = 360;
        $payW = 270;
        $payH = 115;

        // Payment info box container
        $s[] = "q 0.97 0.98 0.99 rg {$payX} {$payY} {$payW} {$payH} re f Q";
        $s[] = "q 0.88 0.91 0.94 RG 0.6 w {$payX} {$payY} {$payW} {$payH} re S Q";

        $s[] = "BT /F2 8.5 Tf 0.15 0.20 0.30 rg " . ($payX + 12) . " " . ($payY + 98) . " Td (PAYMENT INSTRUCTIONS & BANK DETAILS) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.45 0.50 0.58 rg " . ($payX + 12) . " " . ($payY + 82) . " Td (Beneficiary: MakeIT Technologies) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.45 0.50 0.58 rg " . ($payX + 12) . " " . ($payY + 70) . " Td (Bank: HDFC Bank Limited) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.45 0.50 0.58 rg " . ($payX + 12) . " " . ($payY + 58) . " Td (Account No: 50200084920194) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.45 0.50 0.58 rg " . ($payX + 12) . " " . ($payY + 46) . " Td (IFSC Code: HDFC0001234) Tj ET";
        $s[] = "BT /F2 8 Tf 0.05 0.55 0.35 rg " . ($payX + 12) . " " . ($payY + 30) . " Td (Instant UPI ID: 9035344513@upi) Tj ET";
        $s[] = "BT /F1 7 Tf 0.55 0.60 0.68 rg " . ($payX + 12) . " " . ($payY + 16) . " Td (Please cite Invoice Reference in transfer memo) Tj ET";

        // -------------------------------------------------------------
        // 7. TERMS, CONDITIONS & SIGNATURE (y=210 to 340)
        // -------------------------------------------------------------
        $termsY = 320;
        $s[] = "BT /F2 8.5 Tf 0.20 0.25 0.32 rg 45 {$termsY} Td (TERMS & CONDITIONS) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.40 0.45 0.52 rg 45 " . ($termsY - 14) . " Td (1. Payment is strictly due by the due date specified on this invoice.) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.40 0.45 0.52 rg 45 " . ($termsY - 26) . " Td (2. All intellectual property & source code licenses transfer upon full milestone settlement.) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.40 0.45 0.52 rg 45 " . ($termsY - 38) . " Td (3. Inquiries regarding this invoice should be addressed to billing@makeit.agency.) Tj ET";

        // Authorized Signature Block (Right side)
        $sigX = 390;
        $sigY = 270;
        $s[] = "q 0.85 0.88 0.92 RG 0.8 w {$sigX} {$sigY} m 540 {$sigY} l S Q";
        $s[] = "BT /F2 8.5 Tf 0.10 0.15 0.22 rg {$sigX} " . ($sigY - 14) . " Td (Authorized Signatory) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.40 0.45 0.55 rg {$sigX} " . ($sigY - 26) . " Td (MakeIT Technologies Bangalore) Tj ET";

        // Verification Stamp / Seal Graphic
        $stampX = 405;
        $stampY = 300;
        $s[] = "q 0.05 0.65 0.40 RG 1 w {$stampX} {$stampY} 115 32 re S Q";
        $s[] = "BT /F2 8 Tf 0.05 0.65 0.40 rg " . ($stampX + 16) . " " . ($stampY + 18) . " Td (OFFICIALLY VERIFIED) Tj ET";
        $s[] = "BT /F1 7 Tf 0.05 0.65 0.40 rg " . ($stampX + 22) . " " . ($stampY + 8) . " Td (MAKEIT STUDIO CRM) Tj ET";

        // -------------------------------------------------------------
        // 8. BOTTOM FOOTER (y=40 to 90)
        // -------------------------------------------------------------
        $s[] = "q 0.88 0.90 0.93 RG 0.5 w 45 90 m 550.28 90 l S Q";
        $s[] = "BT /F2 8 Tf 0.20 0.25 0.35 rg 45 74 Td (MakeIT Technologies — Crafting modern digital products, scalable software & intelligent AI.) Tj ET";
        $s[] = "BT /F1 7.5 Tf 0.50 0.55 0.60 rg 45 60 Td (Registered Studio: Bangalore-560010, Karnataka, India | CIN: U72200KA2024PTC184920 | billing@makeit.agency) Tj ET";
        $s[] = "BT /F1 7 Tf 0.60 0.65 0.70 rg 45 46 Td (This document is a computer-generated tax invoice and is legally valid without physical ink signature.) Tj ET";

        // -------------------------------------------------------------
        // ASSEMBLE PDF OBJECTS
        // -------------------------------------------------------------
        $contentStream = implode("\n", $s);
        $streamLen = strlen($contentStream);

        $objects = [];
        $objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
        $objects[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
        $objects[3] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>";
        $objects[4] = "<< /Length {$streamLen} >>\nstream\n{$contentStream}\nendstream";
        $objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
        $objects[6] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
        $objects[7] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>";

        $pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $offsets = [];

        foreach ($objects as $num => $obj) {
            $offsets[$num] = strlen($pdf);
            $pdf .= "{$num} 0 obj\n{$obj}\nendobj\n";
        }

        $xrefOffset = strlen($pdf);
        $totalObjs = count($objects) + 1;
        $pdf .= "xref\n0 {$totalObjs}\n";
        $pdf .= "0000000000 65535 f \n";
        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }

        $pdf .= "trailer\n<< /Size {$totalObjs} /Root 1 0 R /Info << /Title (Invoice {$invNumber}) /Author (MakeIT Digital Agency) /Creator (MakeIT CRM Billing System) >> >>\n";
        $pdf .= "startxref\n{$xrefOffset}\n%%EOF\n";

        return $pdf;
    }

    private function escapePdf(string $text): string
    {
        // Replace non-ASCII or problematic characters for standard PDF Type 1 encoding
        $ascii = iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $text);
        if ($ascii === false) {
            $ascii = $text;
        }
        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $ascii);
    }
}

/**
 * Functional entry point for generating client invoice PDFs.
 */
function generate_invoice_pdf(array $invoice, array|false|null $client = null): string
{
    $generator = new MakeIT_Invoice_PDF($invoice, $client);
    return $generator->render();
}
