-- phpMyAdmin SQL Dump
-- version 4.0.10.18
-- https://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Mar 04, 2018 at 09:59 AM
-- Server version: 10.1.24-MariaDB-cll-lve
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `thumfpwk_content`
--

-- --------------------------------------------------------

--
-- Table structure for table `Projects`
--

CREATE TABLE IF NOT EXISTS `Projects` (
  `pID` int(11) NOT NULL AUTO_INCREMENT,
  `pName` text NOT NULL,
  `pCat` varchar(255) NOT NULL,
  `pDec` text NOT NULL,
  `pStatus` text NOT NULL,
  `pLink` text NOT NULL,
  PRIMARY KEY (`pID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `Projects`
--

INSERT INTO `Projects` (`pID`, `pName`, `pCat`, `pDec`, `pStatus`, `pLink`) VALUES
(1, 'Mining Incremental', 'game', 'A simple mining incremental game', 'In-Progress', '/Incremental/index.php'),
(2, 'Random Colour Gen', 'misc', 'A HEX/HSL random colour generator.', 'Done', '/ColourGen/index.php'),
(3, 'Simple Pomodoro Timer', 'misc', 'A simple pomodoro timer', 'Done', '/Tomato/index.php'),
(4, 'Breakout Game', 'game', 'Very basic breakout game', 'Unpolished/Dead', '/Breakout/index.php'),
(5, 'Snake Game', 'game', 'Javascript snake', 'Done', '/Snake/index.php'),
(7, 'Clock', 'misc', 'Soon to be JS clock', 'In-Progress', '/Clock/index.html'),
(8, 'Google', 'web', 'Google - Design by Copying', 'Done', '/DBC/Google/google.html'),
(9, 'Seagull Solutions', 'web', 'OC Marketing Website ', 'Done', '/OC/SeagullSolutions/index.html'),
(10, 'Perplex', 'web', 'Wordpress blog for science articles ', 'Ongoing', 'https://perplex.space'),
(11, 'Tetris', 'game', 'JS Tetris', 'Nearly Done', '/Tetris/tetris.html');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
