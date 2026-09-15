-- ============================================================================
-- 1. DATABASE CREATION & CONTEXT SWITCH
-- ============================================================================
CREATE DATABASE IF NOT EXISTS school_lms_db;
USE school_lms_db;

-- Drop dependent tables first if re-running script to avoid FK conflicts
DROP TABLE IF EXISTS payment_slips;
DROP TABLE IF EXISTS student_payments;

-- ============================================================================
-- 2. TABLE CREATION
-- ============================================================================

-- Function 6 & 8: Student Payments / Balances Table
CREATE TABLE student_payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    fee_type VARCHAR(50) NOT NULL,             -- e.g., 'Semester Fee', 'Exam Fee', 'Library Fine'
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    payment_status ENUM('PAID', 'UNPAID', 'PARTIAL') DEFAULT 'UNPAID',
    payment_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function 7 & 8: Payment Slip Submissions & Staff Verification Table
CREATE TABLE payment_slips (
    slip_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    slip_file_path VARCHAR(255) NOT NULL,
    verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    verified_by VARCHAR(50) NULL,              -- References Staff ID / Admin Username
    verification_date TIMESTAMP NULL,
    remarks VARCHAR(255) NULL,
    CONSTRAINT fk_payment_slip_ref FOREIGN KEY (payment_id) 
        REFERENCES student_payments(payment_id) 
        ON DELETE CASCADE
);

-- ============================================================================
-- 3. SAMPLE DATA INSERTION (FOR TESTING & DEMO)
-- ============================================================================

-- Insert Student Payment Records
INSERT INTO student_payments (payment_id, student_id, fee_type, total_amount, paid_amount, due_date, payment_status, payment_date)
VALUES 
(1, 'STU1001', 'Semester Fee', 50000.00, 50000.00, '2026-09-30', 'PAID', '2026-09-10'),
(2, 'STU1001', 'Exam Fee', 5000.00, 0.00, '2026-10-15', 'UNPAID', NULL),
(3, 'STU1002', 'Semester Fee', 50000.00, 25000.00, '2026-09-30', 'PARTIAL', '2026-09-12'),
(4, 'STU1003', 'Semester Fee', 50000.00, 0.00, '2026-09-30', 'UNPAID', NULL);

-- Insert Payment Slip Records
INSERT INTO payment_slips (payment_id, student_id, payment_reference, amount, slip_file_path, verification_status, verified_by, verification_date, remarks)
VALUES
(1, 'STU1001', 'REF-BOC-2026-001', 50000.00, '/uploads/slips/slip_stu1001_001.pdf', 'APPROVED', 'STAFF01', '2026-09-10 14:30:00', 'Full semester fee payment verified.'),
(3, 'STU1002', 'REF-COM-2026-045', 25000.00, '/uploads/slips/slip_stu1002_045.jpg', 'APPROVED', 'STAFF01', '2026-09-12 11:15:00', 'First installment verified.'),
(2, 'STU1001', 'REF-HNB-2026-089', 5000.00, '/uploads/slips/slip_stu1001_089.png', 'PENDING', NULL, NULL, NULL),
(4, 'STU1003', 'REF-SAMP-2026-102', 50000.00, '/uploads/slips/slip_stu1003_102.pdf', 'REJECTED', 'STAFF02', '2026-09-14 09:00:00', 'Payment slip unreadable. Please re-upload.');

-- ============================================================================
-- 4. DISPLAYING DATABASE STRUCTURE AND CONTENTS
-- ============================================================================

-- 4.1. Show Databases and Confirm Active Selection
SHOW DATABASES;
SELECT DATABASE() AS current_active_database;

-- 4.2. Show Created Tables
SHOW TABLES;

-- 4.3. Display Table Schemas (Columns, Data Types, Nullability, Keys)
DESCRIBE student_payments;
DESCRIBE payment_slips;

-- 4.4. Display Raw Table Contents
SELECT * FROM student_payments;
SELECT * FROM payment_slips;

-- ============================================================================
-- 5. BACKEND-ALIGNED TEST QUERIES (FUNCTIONAL VERIFICATION)
-- ============================================================================

-- Function 6: Display Outstanding Balances and Status per Student
SELECT 
    payment_id,
    student_id,
    fee_type,
    total_amount,
    paid_amount,
    (total_amount - paid_amount) AS outstanding_balance,
    due_date,
    payment_status,
    payment_date
FROM student_payments
WHERE student_id = 'STU1001';

-- Function 7: Display Slips Pending Staff Approval
SELECT 
    slip_id,
    payment_id,
    student_id,
    payment_reference,
    amount,
    submission_date,
    slip_file_path,
    verification_status
FROM payment_slips
WHERE verification_status = 'PENDING';

-- Function 8: Display Complete History (Joined Payment and Slip Records)
SELECT 
    p.student_id,
    p.fee_type,
    p.total_amount,
    p.paid_amount,
    (p.total_amount - p.paid_amount) AS balance,
    p.payment_status,
    s.payment_reference,
    s.amount AS slip_submitted_amount,
    s.verification_status,
    s.verified_by,
    s.remarks
FROM student_payments p
LEFT JOIN payment_slips s ON p.payment_id = s.payment_id
ORDER BY p.student_id, p.created_at DESC;