-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 01, 2022 at 11:36 AM
-- Server version: 10.7.3-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `test_table`
--

CREATE TABLE `test_table` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `email` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `random_num` int(11) NOT NULL DEFAULT 0,
  `random_string` varchar(128) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `test_table`
--

INSERT INTO `test_table` (`id`, `name`, `email`, `random_num`, `random_string`) VALUES
(1, 'name', 'email@asdasd.asdas', 51, '13CCA'),
(2, 'name2', 'asdasd@asadasdasd@hg', 60, 'c_AaC'),
(3, 'Mary Plummer', 'Plummer@adsd.asd', 46, 'A-11@'),
(4, 'Danyaal Webber', 'Webber@adsd.asd', 40, '_a$A@'),
(5, 'Fallon Blake', 'Blake@adsd.asd', 55, '31C2A'),
(6, 'Jace Koch', 'Koch@adsd.asd', 55, 'ba2$3'),
(7, 'Tianna Robles', 'Robles@adsd.asd', 10, 'b13-3'),
(8, 'Montague Petersen', 'Petersen@adsd.asd', 55, '_A$@a'),
(9, 'Minahil Mahoney', 'Mahoney@adsd.asd', 55, 'aB2_-'),
(10, 'Barbara Kay', 'Kay@adsd.asd', 13, '2aab1'),
(11, 'Maksymilian Mcgregor', 'Mcgregor@adsd.asd', 69, '2Bb3-'),
(12, 'Sophie Hogg', 'Hogg@adsd.asd', 26, '3C--B'),
(13, 'Nur Mcdougall', 'Mcdougall@adsd.asd', 94, 'BaCc@'),
(14, 'Gerrard Goff', 'Goff@adsd.asd', 23, '--BA$'),
(15, 'Randy Elliott', 'Elliott@adsd.asd', 92, '_c-c_'),
(16, 'Jayson Morrison', 'Morrison@adsd.asd', 22, 'C12Bc'),
(17, 'Kayson Floyd', 'Floyd@adsd.asd', 97, 'BA_CC'),
(18, 'Mercedes Humphreys', 'Humphreys@adsd.asd', 46, 'bCc2c'),
(19, 'Cain Beltran', 'Beltran@adsd.asd', 21, '_BA-3'),
(20, 'Vikki Armstrong', 'Armstrong@adsd.asd', 49, '-12bA'),
(21, 'Md Lara', 'Lara@adsd.asd', 83, 'cB-@A'),
(22, 'Hina Jarvis', 'Jarvis@adsd.asd', 77, 'BA-1@'),
(23, 'Gene Mcmanus', 'Mcmanus@adsd.asd', 37, '-$3a_'),
(24, 'Jiya Rush', 'Rush@adsd.asd', 34, 'a$Ba-'),
(25, 'Zayan Lovell', 'Lovell@adsd.asd', 48, '_-bb@'),
(26, 'Reilly Dalby', 'Dalby@adsd.asd', 40, 'A-1@-'),
(27, 'Dawood Fisher', 'Fisher@adsd.asd', 45, '-c@AC'),
(28, 'Amos Stokes', 'Stokes@adsd.asd', 96, 'Cca1a'),
(29, 'Dominique Vaughn', 'Vaughn@adsd.asd', 64, '21B@1'),
(30, 'Jose Velazquez', 'Velazquez@adsd.asd', 24, 'c-B-$'),
(31, 'Luella Dixon', 'Dixon@adsd.asd', 10, '223A_'),
(32, 'Tadhg Simons', 'Simons@adsd.asd', 58, '-a3@3'),
(33, 'Claude Herbert', 'Herbert@adsd.asd', 72, '3b1a2'),
(34, 'Mischa Beasley', 'Beasley@adsd.asd', 84, '_B-Ca'),
(35, 'Jameson Dennis', 'Dennis@adsd.asd', 14, 'aB$@2'),
(36, 'Karishma Tapia', 'Tapia@adsd.asd', 78, '-2C-$'),
(37, 'Danial Macias', 'Macias@adsd.asd', 69, '3aCc2'),
(38, 'Gino Phelps', 'Phelps@adsd.asd', 11, 'a@a33'),
(39, 'Belinda Lambert', 'Lambert@adsd.asd', 18, 'b2C$B'),
(40, 'Kaylen Pratt', 'Pratt@adsd.asd', 50, 'aca2C'),
(41, 'Eilish Mills', 'Mills@adsd.asd', 95, '2-2bA'),
(42, 'Ayomide Derrick', 'Derrick@adsd.asd', 46, 'B3aCC'),
(43, 'Jagdeep Churchill', 'Churchill@adsd.asd', 25, '2-c-B'),
(44, 'Phyllis Bean', 'Bean@adsd.asd', 69, 'B2_C@'),
(45, 'Franky Wynn', 'Wynn@adsd.asd', 81, '@$cC@'),
(46, 'Franco Obrien', 'Obrien@adsd.asd', 97, '_3cB-'),
(47, 'Dolly Parkes', 'Parkes@adsd.asd', 55, '$2@AB'),
(48, 'Joseff Rawlings', 'Rawlings@adsd.asd', 62, 'AC$A-'),
(49, 'Jaidon Riggs', 'Riggs@adsd.asd', 46, '1a1c3'),
(50, 'Amarah Stuart', 'Stuart@adsd.asd', 34, 'cBBaB'),
(51, 'Ceara Eaton', 'Eaton@adsd.asd', 23, '3aA@a'),
(52, 'Alanis Sharp', 'Sharp@adsd.asd', 92, 'a_@B_'),
(53, 'Flora Combs', 'Combs@adsd.asd', 23, 'baa-_'),
(54, 'Alyx Colon', 'Colon@adsd.asd', 99, '_Aa_1'),
(55, 'Shanice Workman', 'Workman@adsd.asd', 58, '@B@3$'),
(56, 'Ebonie Luna', 'Luna@adsd.asd', 74, '@2B-$'),
(57, 'Robert Suarez', 'Suarez@adsd.asd', 94, '3cbcb'),
(58, 'Gracie-Mai Blevins', 'Blevins@adsd.asd', 59, '3@b_$'),
(59, 'Nate William', 'William@adsd.asd', 93, '@1BCA'),
(60, 'Amelia-Grace Peters', 'Peters@adsd.asd', 97, 'BcA1$'),
(61, 'Aedan Barker', 'Barker@adsd.asd', 18, 'b$BaA'),
(62, 'Tara Webster', 'Webster@adsd.asd', 61, '_A$2@'),
(63, 'Dillan Sargent', 'Sargent@adsd.asd', 62, 'aCc11'),
(64, 'Om Watt', 'Watt@adsd.asd', 28, '2bc3B'),
(65, 'Mcauley Hayden', 'Hayden@adsd.asd', 35, 'ABb@-'),
(66, 'Etta Barrow', 'Barrow@adsd.asd', 79, '_-a2@'),
(67, 'Roscoe Emery', 'Emery@adsd.asd', 12, 'b_1C2'),
(68, 'Reon Parra', 'Parra@adsd.asd', 83, '_Aa$c'),
(69, 'Bradleigh Slater', 'Slater@adsd.asd', 12, 'c@B_c'),
(70, 'Ellie Trujillo', 'Trujillo@adsd.asd', 68, '-a1B_'),
(71, 'Florence Barnett', 'Barnett@adsd.asd', 27, '23Bb$'),
(72, 'Hussain Neale', 'Neale@adsd.asd', 10, 'B1BCC'),
(73, 'Rahul Bell', 'Bell@adsd.asd', 49, 'b-C3$'),
(74, 'Raymond Knott', 'Knott@adsd.asd', 24, '@2_C@'),
(75, 'Christopher Oakley', 'Oakley@adsd.asd', 57, 'Cb_2@'),
(76, 'Kenya Mata', 'Mata@adsd.asd', 20, 'CaB@1'),
(77, 'Nile Griffiths', 'Griffiths@adsd.asd', 12, '3$_Bb'),
(78, 'Nathanial Crowther', 'Crowther@adsd.asd', 78, '13$$-'),
(79, 'Guy Kirkpatrick', 'Kirkpatrick@adsd.asd', 75, '@B2_A'),
(80, 'Jayden Steele', 'Steele@adsd.asd', 44, 'b2A3B'),
(81, 'Lance Shaffer', 'Shaffer@adsd.asd', 73, '2$3b1'),
(82, 'Leen Cortez', 'Cortez@adsd.asd', 42, 'bb$3c'),
(83, 'Arvin Hartley', 'Hartley@adsd.asd', 75, 'BcBcb'),
(84, 'Eilidh Mitchell', 'Mitchell@adsd.asd', 57, 'C2BBb'),
(85, 'Ailish Goulding', 'Goulding@adsd.asd', 51, '-B$-2'),
(86, 'Lucien Weston', 'Weston@adsd.asd', 77, '23$Bc'),
(87, 'Marina OGallagher', 'Gallagher@adsd.asd', 39, '3$$C-'),
(88, 'Ronan Kearns', 'Kearns@adsd.asd', 46, 'AcC@@'),
(89, 'Saffa Christie', 'Christie@adsd.asd', 12, '@$cA2'),
(90, 'Gracie-Mae Kaur', 'Kaur@adsd.asd', 93, 'a@@2A'),
(91, 'Kanye Trevino', 'Trevino@adsd.asd', 59, '3b2-2'),
(92, 'Lamar Ford', 'Ford@adsd.asd', 99, 'c$@c1'),
(93, 'Eathan Sanford', 'Sanford@adsd.asd', 35, '_21-_'),
(94, 'Ksawery Worthington', 'Worthington@adsd.asd', 52, 'C-$1-'),
(95, 'Kaylee Cameron', 'Cameron@adsd.asd', 52, 'BBaB@'),
(96, 'Jonathan Rhodes', 'Rhodes@adsd.asd', 97, '@2_A2'),
(97, 'Jarod Rocha', 'Rocha@adsd.asd', 49, '3A$@2'),
(98, 'Hasnain Milne', 'Milne@adsd.asd', 33, '$_C--'),
(99, 'Ivie Crane', 'Crane@adsd.asd', 11, 'c$aCB'),
(100, 'Arun Lindsey', 'Lindsey@adsd.asd', 37, '$-_$@'),
(101, 'Renee Bryan', 'Bryan@adsd.asd', 50, 'b_$@2'),
(102, 'name', 'email@asdasd.asdas', 42, '_BA$_'),
(103, 'name2', 'asdasd@asadasdasd@hg', 50, 'a1aaC'),
(104, 'Mary Plummer', 'Plummer@adsd.asd', 25, 'c@_@c'),
(105, 'Danyaal Webber', 'Webber@adsd.asd', 55, '3_A2$'),
(106, 'Fallon Blake', 'Blake@adsd.asd', 98, '3a-_$'),
(107, 'Jace Koch', 'Koch@adsd.asd', 49, '2@ACC'),
(108, 'Tianna Robles', 'Robles@adsd.asd', 29, '31ABA'),
(109, 'Montague Petersen', 'Petersen@adsd.asd', 79, 'A3A_c'),
(110, 'Minahil Mahoney', 'Mahoney@adsd.asd', 28, '_B-__'),
(111, 'Barbara Kay', 'Kay@adsd.asd', 75, 'BcAa@'),
(112, 'Maksymilian Mcgregor', 'Mcgregor@adsd.asd', 10, '_23B3'),
(113, 'Sophie Hogg', 'Hogg@adsd.asd', 84, 'a$C-A'),
(114, 'Nur Mcdougall', 'Mcdougall@adsd.asd', 22, 'cBA@3'),
(115, 'Gerrard Goff', 'Goff@adsd.asd', 27, '@b-AB'),
(116, 'Randy Elliott', 'Elliott@adsd.asd', 61, '22@-B'),
(117, 'Jayson Morrison', 'Morrison@adsd.asd', 34, 'CCb_$'),
(118, 'Kayson Floyd', 'Floyd@adsd.asd', 66, '$@2-a'),
(119, 'Mercedes Humphreys', 'Humphreys@adsd.asd', 40, '1bC32'),
(120, 'Cain Beltran', 'Beltran@adsd.asd', 82, '__A1-'),
(121, 'Vikki Armstrong', 'Armstrong@adsd.asd', 12, 'BCC2_'),
(122, 'Md Lara', 'Lara@adsd.asd', 75, '-112B'),
(123, 'Hina Jarvis', 'Jarvis@adsd.asd', 59, 'cBcbB'),
(124, 'Gene Mcmanus', 'Mcmanus@adsd.asd', 60, '_cB-_'),
(125, 'Jiya Rush', 'Rush@adsd.asd', 24, '@Abb-'),
(126, 'Zayan Lovell', 'Lovell@adsd.asd', 21, 'c23CC'),
(127, 'Reilly Dalby', 'Dalby@adsd.asd', 22, 'Ab3_C'),
(128, 'Dawood Fisher', 'Fisher@adsd.asd', 40, '$aCB_'),
(129, 'Amos Stokes', 'Stokes@adsd.asd', 34, 'b3@b@'),
(130, 'Dominique Vaughn', 'Vaughn@adsd.asd', 40, 'B$$_3'),
(131, 'Jose Velazquez', 'Velazquez@adsd.asd', 87, 'BAC_1'),
(132, 'Luella Dixon', 'Dixon@adsd.asd', 36, '_-c-B'),
(133, 'Tadhg Simons', 'Simons@adsd.asd', 90, 'A$1Aa'),
(134, 'Claude Herbert', 'Herbert@adsd.asd', 60, '_2bbC'),
(135, 'Mischa Beasley', 'Beasley@adsd.asd', 24, '31ca1'),
(136, 'Jameson Dennis', 'Dennis@adsd.asd', 19, '3@bB1'),
(137, 'Karishma Tapia', 'Tapia@adsd.asd', 12, 'BB2@c'),
(138, 'Danial Macias', 'Macias@adsd.asd', 86, 'bbCb_'),
(139, 'Gino Phelps', 'Phelps@adsd.asd', 26, '1B_ba'),
(140, 'Belinda Lambert', 'Lambert@adsd.asd', 39, '3cbBC'),
(141, 'Kaylen Pratt', 'Pratt@adsd.asd', 17, 'B@@_c'),
(142, 'Eilish Mills', 'Mills@adsd.asd', 51, '-bC@2'),
(143, 'Ayomide Derrick', 'Derrick@adsd.asd', 13, 'BB2-a'),
(144, 'Jagdeep Churchill', 'Churchill@adsd.asd', 83, 'aCaca'),
(145, 'Phyllis Bean', 'Bean@adsd.asd', 95, '2-c__'),
(146, 'Franky Wynn', 'Wynn@adsd.asd', 37, '_bb-C'),
(147, 'Franco Obrien', 'Obrien@adsd.asd', 73, '3@1c1'),
(148, 'Dolly Parkes', 'Parkes@adsd.asd', 62, '1@CB_'),
(149, 'Joseff Rawlings', 'Rawlings@adsd.asd', 83, 'a1ab-'),
(150, 'Jaidon Riggs', 'Riggs@adsd.asd', 41, '$1C@1'),
(151, 'Amarah Stuart', 'Stuart@adsd.asd', 35, 'bACAC'),
(152, 'Ceara Eaton', 'Eaton@adsd.asd', 44, '_2@Ca'),
(153, 'Alanis Sharp', 'Sharp@adsd.asd', 14, 'B@2_B'),
(154, 'Flora Combs', 'Combs@adsd.asd', 18, 'b2Ab@'),
(155, 'Alyx Colon', 'Colon@adsd.asd', 38, '_a_bc'),
(156, 'Shanice Workman', 'Workman@adsd.asd', 38, '_@ab2'),
(157, 'Ebonie Luna', 'Luna@adsd.asd', 65, 'BCb-A'),
(158, 'Robert Suarez', 'Suarez@adsd.asd', 21, 'B3b3_'),
(159, 'Gracie-Mai Blevins', 'Blevins@adsd.asd', 82, 'BB1bB'),
(160, 'Nate William', 'William@adsd.asd', 66, '$C-B_'),
(161, 'Amelia-Grace Peters', 'Peters@adsd.asd', 75, '3cC13'),
(162, 'Aedan Barker', 'Barker@adsd.asd', 76, '_bAba'),
(163, 'Tara Webster', 'Webster@adsd.asd', 56, '21-AA'),
(164, 'Dillan Sargent', 'Sargent@adsd.asd', 43, '$_A1-'),
(165, 'Om Watt', 'Watt@adsd.asd', 38, 'B_3CC'),
(166, 'Mcauley Hayden', 'Hayden@adsd.asd', 50, '3@c3C'),
(167, 'Etta Barrow', 'Barrow@adsd.asd', 39, '_23Cc'),
(168, 'name', 'email@asdasd.asdas', 34, 'cC31A'),
(169, 'name2', 'asdasd@asadasdasd@hg', 46, 'b3$1b'),
(170, 'Mary Plummer', 'Plummer@adsd.asd', 26, 'Cc@AB'),
(171, 'Danyaal Webber', 'Webber@adsd.asd', 72, 'B2@b@'),
(172, 'Fallon Blake', 'Blake@adsd.asd', 92, 'B1b_2'),
(173, 'Jace Koch', 'Koch@adsd.asd', 56, '$a--A'),
(174, 'Tianna Robles', 'Robles@adsd.asd', 85, 'cb-c2'),
(175, 'Montague Petersen', 'Petersen@adsd.asd', 69, '22A2$'),
(176, 'Minahil Mahoney', 'Mahoney@adsd.asd', 77, 'aA@2_'),
(177, 'Barbara Kay', 'Kay@adsd.asd', 81, 'C_211'),
(178, 'Maksymilian Mcgregor', 'Mcgregor@adsd.asd', 74, '$caaA'),
(179, 'Sophie Hogg', 'Hogg@adsd.asd', 28, '-a2C@'),
(180, 'Nur Mcdougall', 'Mcdougall@adsd.asd', 89, '@@CC2'),
(181, 'Gerrard Goff', 'Goff@adsd.asd', 81, '_C$A_'),
(182, 'Randy Elliott', 'Elliott@adsd.asd', 38, 'BB1c1'),
(183, 'Jayson Morrison', 'Morrison@adsd.asd', 29, '-_B--'),
(184, 'Kayson Floyd', 'Floyd@adsd.asd', 20, 'BCCb-'),
(185, 'Mercedes Humphreys', 'Humphreys@adsd.asd', 96, 'c1@B1'),
(186, 'Cain Beltran', 'Beltran@adsd.asd', 49, 'BCC2_'),
(187, 'Vikki Armstrong', 'Armstrong@adsd.asd', 38, 'BB2-b'),
(188, 'Md Lara', 'Lara@adsd.asd', 35, '-c@-A'),
(189, 'Hina Jarvis', 'Jarvis@adsd.asd', 50, 'A$1Ac'),
(190, 'Gene Mcmanus', 'Mcmanus@adsd.asd', 46, 'BcC@-'),
(191, 'Jiya Rush', 'Rush@adsd.asd', 71, 'C32$1'),
(192, 'Zayan Lovell', 'Lovell@adsd.asd', 29, 'Abaca'),
(193, 'Reilly Dalby', 'Dalby@adsd.asd', 11, '2-a2-'),
(194, 'Dawood Fisher', 'Fisher@adsd.asd', 50, 'a3b$c'),
(195, 'Amos Stokes', 'Stokes@adsd.asd', 25, 'Ab3@2'),
(196, 'Dominique Vaughn', 'Vaughn@adsd.asd', 58, '-bc3-'),
(197, 'Jose Velazquez', 'Velazquez@adsd.asd', 26, '@B2$1'),
(198, 'Luella Dixon', 'Dixon@adsd.asd', 34, 'C3@1c'),
(199, 'Tadhg Simons', 'Simons@adsd.asd', 86, '$a_@B'),
(200, 'Claude Herbert', 'Herbert@adsd.asd', 45, '@3@2$'),
(201, 'Mischa Beasley', 'Beasley@adsd.asd', 50, '1C12A'),
(202, 'Jameson Dennis', 'Dennis@adsd.asd', 13, '3b3@b'),
(203, 'Karishma Tapia', 'Tapia@adsd.asd', 85, '-Ab31'),
(204, 'Danial Macias', 'Macias@adsd.asd', 18, 'c3Bb2'),
(205, 'Gino Phelps', 'Phelps@adsd.asd', 95, 'BAC@_'),
(206, 'Belinda Lambert', 'Lambert@adsd.asd', 53, '2a@$B'),
(207, 'Kaylen Pratt', 'Pratt@adsd.asd', 61, '3cbB_'),
(208, 'Eilish Mills', 'Mills@adsd.asd', 44, '3C_@c'),
(209, 'Ayomide Derrick', 'Derrick@adsd.asd', 28, '2cB$B'),
(210, 'Jagdeep Churchill', 'Churchill@adsd.asd', 89, '22@AA'),
(211, 'Phyllis Bean', 'Bean@adsd.asd', 81, 'aCB$B'),
(212, 'Franky Wynn', 'Wynn@adsd.asd', 37, '3cb-b'),
(213, 'Franco Obrien', 'Obrien@adsd.asd', 26, 'B$_bc'),
(214, 'Dolly Parkes', 'Parkes@adsd.asd', 96, '1@A_c'),
(215, 'Joseff Rawlings', 'Rawlings@adsd.asd', 35, 'B-__-'),
(216, 'Jaidon Riggs', 'Riggs@adsd.asd', 57, '3-2ba'),
(217, 'Amarah Stuart', 'Stuart@adsd.asd', 82, 'cbABa'),
(218, 'Ceara Eaton', 'Eaton@adsd.asd', 49, 'A@1bB'),
(219, 'Alanis Sharp', 'Sharp@adsd.asd', 79, '_c-bc'),
(220, 'Flora Combs', 'Combs@adsd.asd', 60, '23_a$'),
(221, 'Alyx Colon', 'Colon@adsd.asd', 53, '-1@B3'),
(222, 'Shanice Workman', 'Workman@adsd.asd', 76, 'aA$1c'),
(223, 'Ebonie Luna', 'Luna@adsd.asd', 30, '$b2c_'),
(224, 'Robert Suarez', 'Suarez@adsd.asd', 93, '$@31C'),
(225, 'Gracie-Mai Blevins', 'Blevins@adsd.asd', 95, '2C$b3'),
(226, 'Nate William', 'William@adsd.asd', 99, '1Aa@2'),
(227, 'Amelia-Grace Peters', 'Peters@adsd.asd', 18, 'C12c_'),
(228, 'Aedan Barker', 'Barker@adsd.asd', 54, '$@@2_'),
(229, 'Tara Webster', 'Webster@adsd.asd', 25, 'A3a$-'),
(230, 'Dillan Sargent', 'Sargent@adsd.asd', 46, '_$@2$'),
(231, 'Om Watt', 'Watt@adsd.asd', 55, '1BBc3'),
(232, 'Mcauley Hayden', 'Hayden@adsd.asd', 38, '-@CAb'),
(233, 'Etta Barrow', 'Barrow@adsd.asd', 14, '321_@');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `test_table`
--
ALTER TABLE `test_table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `test_table`
--
ALTER TABLE `test_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=234;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
