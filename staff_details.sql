-- =========================
-- STAFF DETAILS
-- =========================

CREATE TABLE staff (
                       staff_id INT PRIMARY KEY AUTO_INCREMENT,
                       first_name VARCHAR(50) NOT NULL,
                       last_name VARCHAR(50) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       telephone VARCHAR(20),
                       address VARCHAR(200),
                       position VARCHAR(50),
                       staff_type VARCHAR(30),
                       date_joined DATE,
                       status VARCHAR(20) DEFAULT 'Active'
);


-- =========================
-- STAFF ATTENDANCE
-- =========================

CREATE TABLE staff_attendance (
                                  attendance_id INT PRIMARY KEY AUTO_INCREMENT,
                                  staff_id INT NOT NULL,
                                  attendance_date DATE NOT NULL,
                                  attendance_status VARCHAR(20) NOT NULL,
                                  remarks VARCHAR(200),

                                  FOREIGN KEY (staff_id)
                                      REFERENCES staff(staff_id)
                                      ON DELETE CASCADE
                                      ON UPDATE CASCADE,

                                  UNIQUE (staff_id, attendance_date)
);


-- =========================
-- STAFF LEAVE REQUEST
-- =========================

CREATE TABLE staff_leave_request (
                                     leave_id INT PRIMARY KEY AUTO_INCREMENT,
                                     staff_id INT NOT NULL,
                                     leave_type VARCHAR(30) NOT NULL,
                                     start_date DATE NOT NULL,
                                     end_date DATE NOT NULL,
                                     reason VARCHAR(300),
                                     request_date DATE NOT NULL,
                                     leave_status VARCHAR(20) DEFAULT 'Pending',

                                     FOREIGN KEY (staff_id)
                                         REFERENCES staff(staff_id)
                                         ON DELETE CASCADE
                                         ON UPDATE CASCADE
);

-- STAFF ATTENDANCE
-- =========================

CREATE TABLE staff_attendance (
                                  attendance_id INT PRIMARY KEY AUTO_INCREMENT,
                                  staff_id INT NOT NULL,
                                  attendance_date DATE NOT NULL,
                                  attendance_status VARCHAR(20) NOT NULL,
                                  remarks VARCHAR(200),

                                  FOREIGN KEY (staff_id)
                                      REFERENCES staff(staff_id)
                                      ON DELETE CASCADE
                                      ON UPDATE CASCADE,

                                  UNIQUE (staff_id, attendance_date)
);


-- STAFF LEAVE REQUEST
-- =========================

CREATE TABLE staff_leave_request (
                                     leave_id INT PRIMARY KEY AUTO_INCREMENT,
                                     staff_id INT NOT NULL,
                                     leave_type VARCHAR(30) NOT NULL,
                                     start_date DATE NOT NULL,
                                     end_date DATE NOT NULL,
                                     reason VARCHAR(300),
                                     request_date DATE NOT NULL,
                                     leave_status VARCHAR(20) DEFAULT 'Pending',

                                     FOREIGN KEY (staff_id)
                                         REFERENCES staff(staff_id)
                                         ON DELETE CASCADE
                                         ON UPDATE CASCADE
);

/////////////////////////////////---values-----//////////////////
-- =========================
-- VALUES FOR STAFF TABLE
-- =========================

INSERT INTO staff
(first_name, last_name, email, telephone, address, position, staff_type, date_joined, status)
VALUES
('User1', 'Staff', 'user1@gmail.com', '0771234567', 'Matale', 'Teacher', 'Academic', '2024-01-15', 'Active'),
('User2', 'Staff', 'user2@gmail.com', '0712345678', 'Dambulla', 'Teacher', 'Academic', '2023-06-10', 'Active'),
('User3', 'Staff', 'user3@gmail.com', '0763456789', 'Kandy', 'Accountant', 'Administrative', '2022-03-20', 'Active'),
('User4', 'Staff', 'user4@gmail.com', '0754567890', 'Ukuwela', 'Teacher', 'Academic', '2025-01-05', 'Active'),
('User5', 'Staff', 'user5@gmail.com', '0785678901', 'Rattota', 'Office Assistant', 'Administrative', '2021-08-12', 'Active');


-- =========================
-- VALUES FOR STAFF ATTENDANCE
-- =========================

INSERT INTO staff_attendance
(staff_id, attendance_date, attendance_status, remarks)
VALUES
    (1, '2026-09-28', 'Present', 'On time'),
    (2, '2026-09-28', 'Present', 'On time'),
    (3, '2026-09-28', 'Absent', 'Sick leave'),
    (4, '2026-09-28', 'Late', 'Arrived late'),
    (5, '2026-09-28', 'Present', 'On time'),

    (1, '2026-09-29', 'Present', 'On time'),
    (2, '2026-09-29', 'Late', 'Traffic delay'),
    (3, '2026-09-29', 'Present', 'On time'),
    (4, '2026-09-29', 'Present', 'On time'),
    (5, '2026-09-29', 'Absent', 'Personal reason');


-- =========================
-- VALUES FOR STAFF LEAVE REQUEST
-- =========================

INSERT INTO staff_leave_request
(staff_id, leave_type, start_date, end_date, reason, request_date, leave_status)
VALUES
    (1, 'Annual Leave', '2026-10-05', '2026-10-07',
     'Personal reasons', '2026-09-20', 'Pending'),

    (2, 'Medical Leave', '2026-09-30', '2026-10-01',
     'Medical appointment', '2026-09-25', 'Approved'),

    (3, 'Annual Leave', '2026-10-10', '2026-10-12',
     'Family function', '2026-09-22', 'Pending'),

    (4, 'Half Day', '2026-10-03', '2026-10-03',
     'Personal appointment', '2026-09-27', 'Approved'),

    (5, 'Casual Leave', '2026-10-15', '2026-10-15',
     'Personal matter', '2026-09-28', 'Rejected');