CREATE DATABASE STAFF_MANAGEMENT;

CREATE TABLE staff (
                       staff_id INT PRIMARY KEY,
                       user_id INT,
                       first_name VARCHAR(50) NOT NULL,
                       last_name VARCHAR(50) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       contact_no VARCHAR(20),
                       class VARCHAR(50),
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

CREATE TABLE LEAVE_REQUESTS (
                                leave_id INT PRIMARY KEY AUTO_INCREMENT,
                                staff_id INT NOT NULL,
                                leave_type VARCHAR(50) NOT NULL,
                                start_date DATE NOT NULL,
                                end_date DATE NOT NULL,
                                total_days INT NOT NULL,
                                reason VARCHAR(255),
                                status VARCHAR(20) NOT NULL,
                                approved_by INT,
                                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                                FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id)
);

//--subject--//
SELECT
    s.staff_id,
    s.first_name,
    s.last_name,
    c.class_name,
    sub.subject_name
FROM STAFF s
         JOIN CLASS c ON s.staff_id = c.staff_id
         JOIN SUBJECT sub ON c.subject_id = sub.subject_id
WHERE s.staff_id = 'STF101';

///---view salary and other relevant fields--//
SELECT
    salary_id,
    staff_id,
    salary_month,
    salary_year,
    base_salary,
    allowances,
    deductions,
    net_salary,
    payment_date,
    payment_status
FROM STAFF_SALARY
WHERE staff_id = 'STF101';


//--insert into leave request--//
INSERT INTO LEAVE_REQUESTS
(
    staff_id,
    leave_type,
    start_date,
    end_date,
    total_days,
    reason,
    status
)
VALUES
    (
        'STF101',
        'Day Off',
        '2026-10-05',
        '2026-10-05',
        '5',
        'Personal work',
        'PENDING'
    );

//--give reason for leave request and other relevant details--//
SELECT
    leave_id,
    leave_type,
    start_date,
    end_date,
    total_days,
    reason,
    status,
    applied_at
FROM LEAVE_REQUESTS
WHERE staff_id = 'STF101';

-- CLASS TABLE
-

CREATE TABLE CLASS (
                       class_id INT PRIMARY KEY AUTO_INCREMENT,
                       class_name VARCHAR(50) NOT NULL,
                       grade INT NOT NULL,
                       section VARCHAR(10),
                       academic_year INT NOT NULL
);


-- SUBJECT TABLE


CREATE TABLE SUBJECT (
                         subject_id INT PRIMARY KEY AUTO_INCREMENT,
                         subject_name VARCHAR(100) NOT NULL,
                         subject_code VARCHAR(20) UNIQUE NOT NULL
);


-- STAFF CLASS SUBJECT ASSIGNMENT

CREATE TABLE STAFF_CLASS_SUBJECT (
                                     assignment_id INT PRIMARY KEY AUTO_INCREMENT,
                                     staff_id INT NOT NULL,
                                     class_id INT NOT NULL,
                                     subject_id INT NOT NULL,

                                     FOREIGN KEY (staff_id)
                                         REFERENCES STAFF(staff_id)
                                         ON DELETE CASCADE
                                         ON UPDATE CASCADE,

                                     FOREIGN KEY (class_id)
                                         REFERENCES CLASS(class_id)
                                         ON DELETE CASCADE
                                         ON UPDATE CASCADE,

                                     FOREIGN KEY (subject_id)
                                         REFERENCES SUBJECT(subject_id)
                                         ON DELETE CASCADE
                                         ON UPDATE CASCADE
);

INSERT INTO CLASS
(class_name, grade, section, academic_year)
VALUES
    ('Grade 6A', 6, 'A', 2026),
    ('Grade 7A', 7, 'A', 2026),
    ('Grade 8A', 8, 'A', 2026),
    ('Grade 9A', 9, 'A', 2026);

INSERT INTO SUBJECT
(subject_name, subject_code)
VALUES
    ('Mathematics', 'MATH'),
    ('Science', 'SCI'),
    ('English', 'ENG'),
    ('Information Technology', 'IT'),
    ('Sinhala', 'SIN');

INSERT INTO STAFF_CLASS_SUBJECT
(staff_id, class_id, subject_id)
VALUES
    (101, 3, 1),
    (101, 3, 2),
    (102, 2, 3),
    (102, 4, 4);

