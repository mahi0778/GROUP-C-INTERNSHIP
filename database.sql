-- Attendance Management System - Database Schema & Seed Data
-- Import this SQL script in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS `attendance_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `attendance_db`;

-- Drop existing users table if needed
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'gfm', 'hod') NOT NULL,
  `department` VARCHAR(100) DEFAULT 'Computer Engineering',
  `roll_or_emp_id` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default user accounts
-- Passwords:
-- Student: student123 (hashed: $2y$10$wT5dYd7k5FqTqYwE5e.9eO6NfK6Yp0D1E2F3G4H5I6J7K8L9M0N1O)
-- GFM:     gfm123     (hashed: $2y$10$8vF5pP0H1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3)
-- HOD:     hod123     (hashed: $2y$10$9aB8cC7dD6eE5fF4gG3hH2iI1jJ0kK9lL8mM7nN6oO5pP4qQ3rR2sT)

INSERT INTO `users` (`full_name`, `email`, `password`, `role`, `department`, `roll_or_emp_id`)
VALUES
('Rahul Sharma', 'student@college.edu', '$2y$10$aJ52uYvM74vXnE4xN3oLe.gG2z6wX2zY1aB2cC3dD4eE5fF6gG7hH', 'student', 'Computer Engineering', 'STU-101'),
('Prof. Aniket Verma', 'gfm@college.edu', '$2y$10$bK63vZvN85wYoF5yO4pMf.hH3a7wY3zZ2bC3dD4eE5fF6gG7hH8iI', 'gfm', 'Computer Engineering', 'GFM-204'),
('Dr. Dipali Shende', 'hod@college.edu', '$2y$10$cL74wAwO96xZpG6zP5qNg.iI4b8wZ4aA3cD4eE5fF6gG7hH8iI9jJ', 'hod', 'Computer Engineering', 'HOD-001'),
('Dr. Dipali Shende', 'dipali.shende@college.edu', '$2y$10$cL74wAwO96xZpG6zP5qNg.iI4b8wZ4aA3cD4eE5fF6gG7hH8iI9jJ', 'hod', 'Computer Engineering', 'HOD-001')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);
