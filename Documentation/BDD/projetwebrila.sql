-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Lun 16 Janvier 2017 à 15:45
-- Version du serveur :  5.7.16-0ubuntu0.16.04.1
-- Version de PHP :  7.0.13-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `projetwebrila`
--

-- --------------------------------------------------------

--
-- Structure de la table `marqueurs`
--

CREATE TABLE `marqueurs` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lng` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeAlerte` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Contenu de la table `marqueurs`
--

INSERT INTO `marqueurs` (`id`, `name`, `lat`, `lng`, `typeAlerte`, `user`, `icon`, `date`) VALUES
(1, 'Accident de la route', '43.612741', '1.436270', 'Accident', 'bastien', 'img/accident.png', '2017-01-16 15:41:13'),
(2, 'Radar fixe', '43.616760', '1.413274', 'Radar', 'bastien', 'img/radar.png', '2017-01-16 15:41:13'),
(15, 'Trafic important', '43.5989492', '1.4660608', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13'),
(14, 'Accident de la route', '43.5922292', '1.4660608', 'Accident', 'bastien', 'img/accident.png', '2017-01-16 15:41:13'),
(13, 'Radar fixe', '43.6969492', '1.4660608', 'Radar', 'bastien', 'img/radar.png', '2017-01-16 15:41:13'),
(18, 'Accident de la route', '43.60069691', '1.97217115', 'Accident', 'bastien', 'img/accident.png', '2017-01-16 15:41:13'),
(19, 'Accident de la route', '43.28048648', '1.26717544', 'Accident', 'bastien', 'img/accident.png', '2017-01-16 15:41:13'),
(20, 'Accident de la route', '43.33789106', '1.01628243', 'Accident', 'bastien', 'img/accident.png', '2017-01-16 15:41:13'),
(21, 'Accident de la route', '43.48278458', '1.62233904', 'Accident', 'bastien', 'img/accident.png', '2017-01-16 15:41:13'),
(22, 'Accident de la route', '43.25485239', '1.06398831', 'Accident', 'bastien', 'img/accident.png', '2017-01-16 15:41:13'),
(23, 'Accident de la route', '43.77195179', '1.95731445', 'Accident', 'bastien', 'img/accident.png', '2017-01-16 15:41:13'),
(24, 'Radar fixe', '43.2149097', '1.23157601', 'Radar', 'dima', 'img/radar.png', '2017-01-16 15:41:13'),
(25, 'Radar fixe', '43.43391623', '1.21930476', 'Radar', 'dima', 'img/radar.png', '2017-01-16 15:41:13'),
(26, 'Radar fixe', '43.97139629', '1.62092157', 'Radar', 'dima', 'img/radar.png', '2017-01-16 15:41:13'),
(27, 'Radar fixe', '43.28454512', '1.85701673', 'Radar', 'dima', 'img/radar.png', '2017-01-16 15:41:13'),
(28, 'Radar fixe', '43.82871041', '0.94647523', 'Radar', 'dima', 'img/radar.png', '2017-01-16 15:41:13'),
(29, 'Radar fixe', '43.26297133', '1.78271664', 'Radar', 'dima', 'img/radar.png', '2017-01-16 15:41:13'),
(30, 'Radar fixe', '43.67690119', '1.30444367', 'Radar', 'dima', 'img/radar.png', '2017-01-16 15:41:13'),
(31, 'Radar fixe', '43.43930754', '0.98904921', 'Radar', 'dima', 'img/radar.png', '2017-01-16 15:41:13'),
(32, 'Trafic important', '43.73103447', '1.80212616', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13'),
(33, 'Trafic important', '43.41068033', '0.89727631', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13'),
(34, 'Trafic important', '43.85549731', '1.26905562', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13'),
(35, 'Trafic important', '43.30054689', '1.14120634', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13'),
(36, 'Trafic important', '43.70138552', '0.90777564', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13'),
(37, 'Trafic important', '43.33760333', '1.40260818', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13'),
(38, 'Trafic important', '43.69477732', '1.92937647', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13'),
(39, 'Trafic important', '43.25005269', '1.10217949', 'Trafic', 'bastien', 'img/trafic.png', '2017-01-16 15:41:13');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'bastien', 'password'),
(2, 'admin', 'password'),
(3, 'dima', 'password');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `marqueurs`
--
ALTER TABLE `marqueurs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `marqueurs`
--
ALTER TABLE `marqueurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
DELIMITER $$
--
-- Événements
--
CREATE DEFINER=`root`@`localhost` EVENT `Clean Marqueurs` ON SCHEDULE EVERY 1 HOUR STARTS '2017-01-16 15:45:15' ON COMPLETION NOT PRESERVE ENABLE COMMENT 'nettoyage des vieux marqueurs' DO DELETE FROM marqueurs WHERE date < (NOW() - INTERVAL 720 MINUTE)$$

DELIMITER ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
