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
                         room_no VARCHAR(20),
                         schedule_time DATETIME,
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
                                leave_type VARCHAR(50) NOT NULL,
                                start_date DATE NOT NULL,
                                end_date DATE NOT NULL,
                                total_days INT NOT NULL,
                                reason VARCHAR(500),
                                status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                                approved_by INT,
                                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                                FOREIGN KEY (staff_id)
                                    REFERENCES STAFF(staff_id),

                                FOREIGN KEY (approved_by)
                                    REFERENCES STAFF(staff_id)
);