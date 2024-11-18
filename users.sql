-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 08, 2024 at 11:37 AM
-- Server version: 5.7.23-23
-- PHP Version: 8.1.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aarnainw_finance_prod_copy`
--

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `access_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `access_token_expiry` datetime NOT NULL,
  `refresh_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `refresh_token_expiry` datetime NOT NULL,
  `phone_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `region` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `device_type` text COLLATE utf8_unicode_ci,
  `android_id` text COLLATE utf8_unicode_ci,
  `battery_level` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `device_brand` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `carrier_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `device_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `device_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `package_install_source` text COLLATE utf8_unicode_ci,
  `mac_address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `app_installed` datetime DEFAULT NULL,
  `wifi_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `browser_type` text COLLATE utf8_unicode_ci,
  `user_agent` text COLLATE utf8_unicode_ci,
  `referer` text COLLATE utf8_unicode_ci,
  `platform` enum('Browser','Application') COLLATE utf8_unicode_ci NOT NULL,
  `fcm_token` text COLLATE utf8_unicode_ci,
  `session_started_at` datetime NOT NULL,
  `session_terminated_at` datetime DEFAULT NULL,
  `session_last_refreshed_at` datetime DEFAULT NULL,
  `session_active` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(255) NOT NULL,
  `user_full_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_mobile_number` bigint(255) NOT NULL,
  `user_alternate_number` bigint(255) DEFAULT NULL,
  `user_emergency_number` bigint(255) DEFAULT NULL,
  `user_whatsapp_number` bigint(255) NOT NULL,
  `user_email_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_gender` enum('M','F','O') COLLATE utf8_unicode_ci NOT NULL,
  `user_address` text COLLATE utf8_unicode_ci,
  `user_branch` int(255) NOT NULL,
  `user_department` int(255) NOT NULL,
  `user_position` int(255) NOT NULL,
  `user_reports_to` int(255) DEFAULT NULL,
  `user_doj` date DEFAULT NULL,
  `user_dob` date DEFAULT NULL,
  `user_referred_by` int(255) DEFAULT NULL,
  `user_type` enum('Full Time','Part Time','Remote') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Full Time',
  `user_bio` text COLLATE utf8_unicode_ci,
  `user_active` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y',
  `user_termination_date` date DEFAULT NULL,
  `otp` int(255) DEFAULT NULL,
  `otp_validity` datetime DEFAULT NULL,
  `user_login_attempts` int(255) DEFAULT NULL,
  `user_updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `user_branch` (`user_branch`),
  ADD KEY `user_department` (`user_department`),
  ADD KEY `user_position` (`user_position`),
  ADD KEY `user_reports_to` (`user_reports_to`),
  ADD KEY `user_referred_by` (`user_referred_by`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
