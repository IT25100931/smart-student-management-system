-- 1. DATABASE SETUP
CREATE DATABASE IF NOT EXISTS school_lms_db;
USE school_lms_db;

-- Drop existing tables
DROP TABLE IF EXISTS PAYMENT_SLIPS;
DROP TABLE IF EXISTS STUDENT_FEES;

-- 2. TABLE CREATION
-- Function : Student Fees / Payment Status Table
CREATE TABLE IF NOT EXISTS STUDENT_FEES (
    fee_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    fee_type VARCHAR(50) NOT NULL,              -- e.g., 'Semester Fee', 'Exam Fee'
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    payment_status ENUM('PAID', 'UNPAID', 'PARTIAL') DEFAULT 'UNPAID',
    payment_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function 7 & 8: Payment Slip Submissions Table
CREATE TABLE IF NOT EXISTS PAYMENT_SLIPS (
    slip_id INT PRIMARY KEY AUTO_INCREMENT,
    fee_id INT NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    slip_file_path VARCHAR(255) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    verified_by VARCHAR(20) NULL,               -- References STAFF(staff_id)
    verification_date TIMESTAMP NULL,
    remarks VARCHAR(255) NULL,
    CONSTRAINT fk_fee_ref FOREIGN KEY (fee_id) 
        REFERENCES STUDENT_FEES(fee_id) 
        ON DELETE CASCADE
);

-- 3. Insert Sample Data
-- Insert Student Fees Records (10 Distinct Records)
INSERT INTO STUDENT_FEES (fee_id, student_id, fee_type, total_amount, paid_amount, due_date, payment_status, payment_date)
VALUES 
(1,  'STU1001', 'Semester Fee', 50000.00, 50000.00, '2026-09-30', 'PAID',    '2026-09-10'),
(2,  'STU1002', 'Semester Fee', 50000.00,  5000.00, '2026-09-30', 'PARTIAL', '2026-09-11'),
(3,  'STU1003', 'Semester Fee', 50000.00, 25000.00, '2026-09-30', 'PARTIAL', '2026-09-12'),
(4,  'STU1004', 'Semester Fee', 50000.00,     0.00, '2026-09-30', 'UNPAID',  NULL),
(5,  'STU1005', 'Semester Fee',  5000.00,  5000.00, '2026-09-30', 'PAID',    '2026-09-01'),
(6,  'STU1006', 'Semester Fee', 50000.00,     0.00, '2026-09-30', 'UNPAID',  NULL),
(7,  'STU1007', 'Semester Fee', 50000.00, 30000.00, '2026-09-30', 'PARTIAL', '2026-09-18'),
(8,  'STU1008', 'Semester Fee',  5000.00,  5000.00, '2026-09-30', 'PAID',    '2026-09-16'),
(9,  'STU1009', 'Semester Fee', 50000.00, 43000.00, '2026-09-30', 'PARTIAL', '2026-09-03'),
(10, 'STU1010', 'Semester Fee', 50000.00,     0.00, '2026-09-30', 'UNPAID',  NULL);

-- Insert Payment Slip Records (Each with unique reference, valid fee_id, and matched student_id)
INSERT INTO PAYMENT_SLIPS (fee_id, student_id, payment_reference, amount, slip_file_path, submission_date, verification_status, verified_by, verification_date, remarks)
VALUES
(1,  'STU1001', 'REF-BOC-2026-001', 50000.00, '/uploads/slips/slip_stu1001_001.pdf', '2026-09-10 10:00:00', 'APPROVED', 'STF101', '2026-09-10 14:30:00', 'Full semester fee verified.'),
(2,  'STU1002', 'REF-COM-2026-002',  5000.00, '/uploads/slips/slip_stu1002_002.jpg', '2026-09-11 09:15:00', 'APPROVED', 'STF101', '2026-09-11 11:00:00', 'Part payment received.'),
(3,  'STU1003', 'REF-COM-2026-045', 25000.00, '/uploads/slips/slip_stu1003_045.jpg', '2026-09-12 09:30:00', 'APPROVED', 'STF101', '2026-09-12 11:15:00', 'First installment verified.'),
(4,  'STU1004', 'REF-SAMP-2026-102', 50000.00, '/uploads/slips/slip_stu1004_102.pdf', '2026-09-14 08:30:00', 'REJECTED', 'STF102', '2026-09-14 09:00:00', 'Payment slip unreadable. Please re-upload.'),
(5,  'STU1005', 'REF-HNB-2026-105',  5000.00, '/uploads/slips/slip_stu1005_105.pdf', '2026-09-01 10:15:00', 'APPROVED', 'STF101', '2026-09-01 12:00:00', 'Exam fee cleared.'),
(6,  'STU1006', 'REF-BOC-2026-018', 25000.00, '/uploads/slips/slip_stu1006_018.png', '2026-09-19 09:00:00', 'PENDING',  NULL,     NULL,                  'Submitted, awaiting verification.'),
(7,  'STU1007', 'REF-HNB-2026-089', 30000.00, '/uploads/slips/slip_stu1007_089.png', '2026-09-18 13:00:00', 'APPROVED', 'STF102', '2026-09-18 15:30:00', 'Installment payment confirmed.'),
(8,  'STU1008', 'REF-SAMP-2026-210',  5000.00, '/uploads/slips/slip_stu1008_210.pdf', '2026-09-16 11:20:00', 'APPROVED', 'STF101', '2026-09-16 14:00:00', 'Full payment verified.'),
(9,  'STU1009', 'REF-COM-2026-301', 43000.00, '/uploads/slips/slip_stu1009_301.pdf', '2026-09-03 14:10:00', 'APPROVED', 'STF102', '2026-09-03 16:45:00', 'Payment accepted.'),
(10, 'STU1010', 'REF-NDB-2026-440', 20000.00, '/uploads/slips/slip_stu1010_440.jpg', '2026-09-19 16:30:00', 'PENDING',  NULL,     NULL,                  'Recently submitted.');

-- 4. DISPLAY DATABASE STATE & VERIFICATION
-- Display schemas
SHOW TABLES;
DESCRIBE STUDENT_FEES;
DESCRIBE PAYMENT_SLIPS;

-- Display all records
SELECT * FROM STUDENT_FEES;
SELECT * FROM PAYMENT_SLIPS;

-- Check calculated outstanding balances (Function 6 verification)
SELECT 
    fee_id,
    student_id,
    fee_type,
    total_amount,
    paid_amount,
    (total_amount - paid_amount) AS outstanding_balance,
    payment_status,
    due_date
FROM STUDENT_FEES;