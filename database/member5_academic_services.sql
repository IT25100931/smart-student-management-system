CREATE TABLE SUBJECTS (
                          subject_id INT PRIMARY KEY AUTO_INCREMENT,
                          subject_code VARCHAR(20) NOT NULL UNIQUE,
                          subject_name VARCHAR(100) NOT NULL,
                          description VARCHAR(500),
                          credits INT NOT NULL
);


CREATE TABLE CLASSES (
                         class_id INT PRIMARY KEY AUTO_INCREMENT,
                         subject_id INT NOT NULL,
                         staff_id INT NOT NULL,

                         class_name VARCHAR(20) NOT NULL,
                         room_no VARCHAR(20),

                         day_of_week VARCHAR(20) NOT NULL,
                         start_time TIME NOT NULL,
                         end_time TIME,

                         semester VARCHAR(20),
                         academic_year INT,

                         FOREIGN KEY (subject_id)
                             REFERENCES SUBJECTS(subject_id),

                         FOREIGN KEY (staff_id)
                             REFERENCES STAFF(staff_id)
);


CREATE TABLE LEAVE_REQUESTS (
                                leave_id INT PRIMARY KEY AUTO_INCREMENT,
                                staff_id INT NOT NULL,

                                leave_type VARCHAR(20) NOT NULL,

                                start_date DATE NOT NULL,
                                end_date DATE NOT NULL,

                                start_time TIME,
                                end_time TIME,

                                total_days INT,

                                reason VARCHAR(500),

                                status VARCHAR(20) NOT NULL DEFAULT 'PENDING',


                                approved_by INT,
                                approved_at DATETIME,

                                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                                FOREIGN KEY (staff_id)
                                    REFERENCES STAFF(staff_id),

                                FOREIGN KEY (approved_by)
                                    REFERENCES STAFF(staff_id),

                                CHECK (leave_type IN ('FULL_DAY', 'SHORT')),
                                CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);


CREATE TABLE LEAVE_BALANCES (
                                balance_id INT PRIMARY KEY AUTO_INCREMENT,

                                staff_id INT NOT NULL,
                                academic_year INT NOT NULL,

                                full_day_total INT NOT NULL DEFAULT 20,
                                short_leave_total INT NOT NULL DEFAULT 5,

                                monthly_full_day_total INT NOT NULL DEFAULT 3,
                                monthly_short_leave_total INT NOT NULL DEFAULT 1,

                                FOREIGN KEY (staff_id)
                                    REFERENCES STAFF(staff_id),

                                UNIQUE (staff_id, academic_year)
);