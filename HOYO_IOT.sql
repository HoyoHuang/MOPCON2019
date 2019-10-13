-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2019 年 10 月 12 日 09:41
-- 伺服器版本： 5.6.43
-- PHP 版本： 7.2.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `HOYO_IOT`
--

-- --------------------------------------------------------

--
-- 資料表結構 `Copy`
--

CREATE TABLE `Copy` (
  `id` int(11) NOT NULL COMMENT '主鍵',
  `Create_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `LastUpdate_Time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='--複製用^';

-- --------------------------------------------------------

--
-- 資料表結構 `Data`
--

CREATE TABLE `Data` (
  `id` int(11) NOT NULL COMMENT '主鍵',
  `Create_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `LastUpdate_Time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `RecordTime` char(14) NOT NULL,
  `Device_id` int(11) NOT NULL,
  `Temperature1` float NOT NULL,
  `Humidity1` float NOT NULL,
  `Watt1` int(5) NOT NULL COMMENT '用電瓦',
  `is_Del` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N' COMMENT '是否刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='--複製用^';

-- --------------------------------------------------------

--
-- 資料表結構 `Device`
--

CREATE TABLE `Device` (
  `id` int(11) NOT NULL COMMENT '主鍵',
  `Create_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `LastUpdate_Time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Store_id` int(11) NOT NULL,
  `Member_id` int(11) DEFAULT NULL,
  `Token` varchar(256) NOT NULL,
  `SN` varchar(128) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `PowerSwitch` enum('Y','N') NOT NULL DEFAULT 'N',
  `is_Control` enum('Y','N') NOT NULL DEFAULT 'N',
  `DigitalIO` varchar(8192) DEFAULT NULL,
  `DataColumn` varchar(8192) DEFAULT NULL,
  `is_Del` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N' COMMENT '是否刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='--複製用^';

-- --------------------------------------------------------

--
-- 資料表結構 `Situation`
--

CREATE TABLE `Situation` (
  `id` int(11) NOT NULL COMMENT '主鍵',
  `Create_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `LastUpdate_Time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Member_id` int(11) NOT NULL,
  `Name` varchar(256) NOT NULL,
  `RemotePin` tinyint(4) NOT NULL,
  `Token` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='--複製用^';

-- --------------------------------------------------------

--
-- 資料表結構 `SituationControl`
--

CREATE TABLE `SituationControl` (
  `id` int(11) NOT NULL COMMENT '主鍵',
  `Create_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `LastUpdate_Time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Member_id` int(11) NOT NULL,
  `Situation_id` int(11) NOT NULL,
  `Device_id` int(11) NOT NULL,
  `Action` enum('on','off') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='--複製用^';

-- --------------------------------------------------------

--
-- 資料表結構 `Steps`
--

CREATE TABLE `Steps` (
  `id` int(11) NOT NULL COMMENT '主鍵',
  `Create_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `Device_id` int(11) NOT NULL,
  `step` int(11) NOT NULL,
  `latitude` decimal(15,12) NOT NULL,
  `longitude` decimal(15,12) NOT NULL,
  `distance` decimal(8,2) NOT NULL,
  `speed` decimal(5,2) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='--IoT 計步器^';

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `Copy`
--
ALTER TABLE `Copy`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `Data`
--
ALTER TABLE `Data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `RecordTime` (`RecordTime`),
  ADD KEY `Device_id` (`Device_id`);

--
-- 資料表索引 `Device`
--
ALTER TABLE `Device`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Member_id` (`Member_id`,`SN`),
  ADD KEY `Store_id` (`Store_id`);

--
-- 資料表索引 `Situation`
--
ALTER TABLE `Situation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Member_id` (`Member_id`);

--
-- 資料表索引 `SituationControl`
--
ALTER TABLE `SituationControl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Member_id_2` (`Member_id`,`Situation_id`,`Device_id`),
  ADD KEY `Member_id` (`Member_id`),
  ADD KEY `Device_id` (`Device_id`),
  ADD KEY `Situation_id` (`Situation_id`);

--
-- 資料表索引 `Steps`
--
ALTER TABLE `Steps`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動增長(AUTO_INCREMENT)
--

--
-- 使用資料表自動增長(AUTO_INCREMENT) `Copy`
--
ALTER TABLE `Copy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵';

--
-- 使用資料表自動增長(AUTO_INCREMENT) `Data`
--
ALTER TABLE `Data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵';

--
-- 使用資料表自動增長(AUTO_INCREMENT) `Device`
--
ALTER TABLE `Device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵';

--
-- 使用資料表自動增長(AUTO_INCREMENT) `Situation`
--
ALTER TABLE `Situation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵';

--
-- 使用資料表自動增長(AUTO_INCREMENT) `SituationControl`
--
ALTER TABLE `SituationControl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵';

--
-- 使用資料表自動增長(AUTO_INCREMENT) `Steps`
--
ALTER TABLE `Steps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵';

--
-- 已傾印資料表的限制(constraint)
--

--
-- 資料表的限制(constraint) `Data`
--
ALTER TABLE `Data`
  ADD CONSTRAINT `Data_ibfk_1` FOREIGN KEY (`Device_id`) REFERENCES `Device` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制(constraint) `Device`
--
ALTER TABLE `Device`
  ADD CONSTRAINT `Device_ibfk_1` FOREIGN KEY (`Store_id`) REFERENCES `Member`.`Member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制(constraint) `Situation`
--
ALTER TABLE `Situation`
  ADD CONSTRAINT `Situation_ibfk_1` FOREIGN KEY (`Member_id`) REFERENCES `Member`.`Member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制(constraint) `SituationControl`
--
ALTER TABLE `SituationControl`
  ADD CONSTRAINT `SituationControl_ibfk_1` FOREIGN KEY (`Situation_id`) REFERENCES `Situation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SituationControl_ibfk_2` FOREIGN KEY (`Member_id`) REFERENCES `Member`.`Member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SituationControl_ibfk_3` FOREIGN KEY (`Device_id`) REFERENCES `Device` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
