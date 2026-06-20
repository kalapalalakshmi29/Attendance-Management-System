-- ================================================
-- Attendance Management System - Database Schema
-- ================================================

-- Create and use database
CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

-- ── Students Table ────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    roll_no     VARCHAR(20)   NOT NULL UNIQUE,
    department  VARCHAR(50)   NOT NULL,
    year        INT           NOT NULL CHECK (year BETWEEN 1 AND 4),
    email       VARCHAR(100)  NOT NULL UNIQUE,
    INDEX idx_roll_no (roll_no),
    INDEX idx_department (department)
);

-- ── Attendance Table ──────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id      BIGINT      NOT NULL,
    attendance_date DATE        NOT NULL,
    status          ENUM('PRESENT','ABSENT') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_date (student_id, attendance_date),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_student_id (student_id)
);

-- ── Sample Data ───────────────────────────────────
INSERT INTO students (name, roll_no, department, year, email) VALUES
('Aarav Sharma',    'CS2024001', 'CSE',   1, 'aarav.sharma@college.edu'),
('Priya Patel',     'CS2024002', 'CSE',   1, 'priya.patel@college.edu'),
('Rahul Kumar',     'EC2024001', 'ECE',   2, 'rahul.kumar@college.edu'),
('Sneha Reddy',     'EC2024002', 'ECE',   2, 'sneha.reddy@college.edu'),
('Vikram Singh',    'ME2024001', 'MECH',  3, 'vikram.singh@college.edu'),
('Ananya Nair',     'CS2023001', 'CSE',   2, 'ananya.nair@college.edu'),
('Rohan Gupta',     'IT2024001', 'IT',    1, 'rohan.gupta@college.edu'),
('Pooja Mishra',    'EE2024001', 'EEE',   3, 'pooja.mishra@college.edu'),
('Arjun Verma',     'CS2022001', 'CSE',   3, 'arjun.verma@college.edu'),
('Kavitha Iyer',    'MB2024001', 'MBA',   1, 'kavitha.iyer@college.edu');

-- Sample attendance for today
INSERT INTO attendance (student_id, attendance_date, status) VALUES
(1, CURDATE(), 'PRESENT'),
(2, CURDATE(), 'PRESENT'),
(3, CURDATE(), 'ABSENT'),
(4, CURDATE(), 'PRESENT'),
(5, CURDATE(), 'ABSENT');
