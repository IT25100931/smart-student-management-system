CREATE DATABASE STAFF;
USE STAFF;

CREATE TABLE staff (
                       staff_id INT PRIMARY KEY,
                       user_id INT,
                       first_name VARCHAR(50) NOT NULL,
                       last_name VARCHAR(50) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       contact_no VARCHAR(20),
                       department VARCHAR(50),
                       designation VARCHAR(50),
                       base_salary DECIMAL(10,2),
                       join_date DATE,
                       status VARCHAR(20)
);

CREATE TABLE staff_attendance (
                                  attendance_id INT PRIMARY KEY,
                                  staff_id INT NOT NULL,
                                  status VARCHAR(20) NOT NULL,
                                  check_in_time TIME,
                                  check_out_time TIME,
                                  remarks VARCHAR(200),

                                  FOREIGN KEY (staff_id)
                                      REFERENCES staff(staff_id)
                                      ON DELETE CASCADE
                                      ON UPDATE CASCADE
);



CREATE TABLE STAFF_SALARY (
                              salary_id INT PRIMARY KEY AUTO_INCREMENT,
                              staff_id INT NOT NULL,
                              salary_month INT NOT NULL,
                              salary_year INT NOT NULL,
                              base_salary DECIMAL(10,2) NOT NULL,
                              allowances DECIMAL(10,2) DEFAULT 0.00,
                              deductions DECIMAL(10,2) DEFAULT 0.00,
                              net_salary DECIMAL(10,2) NOT NULL,
                              payment_date DATE,
                              payment_status VARCHAR(20) NOT NULL,

                              FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id)
);

-- Populate staff
INSERT INTO staff
(staff_id, user_id, first_name, last_name, email, contact_no, department, designation, base_salary, join_date, status)
VALUES
    (1, 101, 'John', 'Doe', 'john.doe@school.com', '+1234567890', 'Science', 'Senior Teacher', 55000.00, '2023-01-15', 'Active'),
    (2, 102, 'Jane', 'Smith', 'jane.smith@school.com', '+1234567891', 'Mathematics', 'Head of Dept', 65000.00, '2021-08-01', 'Active'),
    (3, 103, 'Robert', 'Brown', 'robert.brown@school.com', '+1234567892', 'Administration', 'Clerk', 35000.00, '2024-03-10', 'Active');

-- Populate staff_attendance
INSERT INTO staff_attendance
(attendance_id, staff_id, status, check_in_time, check_out_time, remarks)
VALUES
    (101, 1, 'Present', '07:55:00', '16:05:00', 'On time'),
    (102, 2, 'Late', '08:25:00', '16:00:00', 'Traffic delay'),
    (103, 3, 'Absent', NULL, NULL, 'Medical leave');

-- Populate STAFF_SALARY
INSERT INTO STAFF_SALARY
(staff_id, salary_month, salary_year, base_salary, allowances, deductions, net_salary, payment_date, payment_status)
VALUES
    (1, 1, 2026, 55000.00, 3000.00, 1500.00, 56500.00, '2026-01-31', 'Paid'),
    (2, 1, 2026, 65000.00, 5000.00, 2000.00, 68000.00, '2026-01-31', 'Paid'),
    (3, 1, 2026, 35000.00, 1000.00, 500.00, 35500.00, NULL, 'Pending');
SELECT
    st.staff_id,
    CONCAT(st.first_name, ' ', st.last_name) AS staff_name,
    st.email,
    st.contact_no,
    st.department,
    st.designation,
    st.join_date
FROM staff st
WHERE st.status = 'Active'
ORDER BY st.department, staff_name;


SELECT
    sa.attendance_id,
    CONCAT(st.first_name, ' ', st.last_name) AS staff_name,
    st.department,
    sa.status AS attendance_status,
    sa.check_in_time,
    sa.check_out_time,
    sa.remarks
FROM staff_attendance sa
         JOIN staff st
              ON sa.staff_id = st.staff_id
ORDER BY st.department, staff_name;


SELECT
    ss.salary_id,
    CONCAT(st.first_name, ' ', st.last_name) AS staff_name,
    st.department,
    ss.salary_month,
    ss.salary_year,
    ss.base_salary,
    ss.allowances,
    ss.deductions,
    ss.net_salary,
    ss.payment_status,
    ss.payment_date
FROM STAFF_SALARY ss
         JOIN staff st
              ON ss.staff_id = st.staff_id
WHERE ss.salary_year = 2026
  AND ss.salary_month = 1
ORDER BY staff_name;

