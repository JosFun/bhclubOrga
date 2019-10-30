-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: bhclub
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `av_drinks`
--

DROP TABLE IF EXISTS `av_drinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `av_drinks` (
  `av_abrechnung_id` int(11) NOT NULL,
  `drink_id` int(11) NOT NULL,
  `drink_count` int(11) NOT NULL,
  PRIMARY KEY (`av_abrechnung_id`,`drink_id`),
  KEY `drink_id` (`drink_id`),
  CONSTRAINT `av_drinks_ibfk_1` FOREIGN KEY (`av_abrechnung_id`) REFERENCES `av_verkauf` (`av_abrechnung_id`),
  CONSTRAINT `av_drinks_ibfk_2` FOREIGN KEY (`drink_id`) REFERENCES `rohgetraenke` (`drink_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `av_drinks`
--

LOCK TABLES `av_drinks` WRITE;
/*!40000 ALTER TABLE `av_drinks` DISABLE KEYS */;
INSERT INTO `av_drinks` VALUES (1,10,102),(1,22,102),(1,65,102),(30,33,5),(30,55,2),(31,33,5),(31,55,2),(35,63,2),(35,82,5),(36,13,0),(36,14,0),(36,15,0),(36,17,0),(36,19,0),(36,20,0),(36,21,0),(36,24,0),(36,26,0),(36,27,0),(36,29,0),(36,31,0),(36,32,0),(36,33,0),(36,34,0),(36,35,0),(36,36,0),(36,38,0),(36,40,0),(36,41,0),(36,42,0),(36,43,0),(36,44,0),(36,46,0),(36,47,0),(36,48,0),(36,49,0),(36,52,0),(36,53,0),(36,54,0),(36,55,0),(36,56,0),(36,57,0),(36,58,0),(36,59,0),(36,60,0),(36,61,0),(36,62,0),(36,63,0),(36,64,0),(36,65,0),(36,66,0),(36,67,0),(36,68,0),(36,69,0),(36,70,0),(36,71,0),(36,72,0),(36,73,0),(36,74,0),(36,75,4),(36,76,0),(36,77,0),(36,78,0),(36,79,0),(36,80,0),(36,81,0),(36,82,0),(36,83,0),(36,84,0),(36,85,3),(36,86,0),(36,87,0),(37,13,0),(37,53,0),(37,54,0),(37,55,0),(37,56,0),(37,57,0),(37,58,0),(37,59,0),(37,60,0),(37,61,0),(37,62,0),(37,63,0),(37,64,0),(37,65,0),(37,66,0),(37,67,3),(37,68,0),(37,69,0),(37,70,0),(37,71,4),(37,72,0),(37,73,0),(37,74,0),(37,75,14),(37,76,0),(37,77,0),(37,78,0),(37,79,0),(37,80,0),(37,81,0),(37,82,0),(37,83,0),(37,84,0),(37,85,0),(37,86,0),(37,87,0),(38,13,0),(38,14,0),(38,15,0),(38,17,0),(38,19,0),(38,20,0),(38,21,0),(38,24,0),(38,26,0),(38,27,0),(38,29,0),(38,31,0),(38,32,0),(38,33,0),(38,34,0),(38,35,0),(38,36,12),(38,38,3),(38,40,0),(38,41,0),(38,42,0),(38,43,0),(38,44,0),(38,46,0),(38,47,0),(38,48,0),(38,49,0),(38,52,0),(38,53,0),(38,54,0),(38,55,0),(38,56,13),(38,57,0),(38,58,0),(38,59,0),(38,60,0),(38,61,0),(38,62,0),(38,63,0),(38,64,0),(38,65,0),(38,66,0),(38,67,3),(38,68,0),(38,69,0),(38,70,0),(38,71,4),(38,72,0),(38,73,0),(38,74,0),(38,75,0),(38,76,0),(38,77,0),(38,78,0),(38,79,0),(38,80,0),(38,81,0),(38,82,0),(38,83,0),(38,84,0),(38,85,0),(38,86,0),(38,87,0),(39,13,0),(39,14,0),(39,15,0),(39,17,0),(39,19,0),(39,20,0),(39,21,0),(39,24,0),(39,26,0),(39,27,0),(39,29,0),(39,31,0),(39,32,0),(39,33,0),(39,34,0),(39,35,0),(39,36,0),(39,38,0),(39,40,1),(39,41,0),(39,42,1),(39,43,0),(39,44,0),(39,46,0),(39,47,0),(39,48,0),(39,49,0),(39,52,0),(39,53,0),(39,54,0),(39,55,0),(39,56,0),(39,57,0),(39,58,0),(39,59,2),(39,60,0),(39,61,0),(39,62,3),(39,63,0),(39,64,4),(39,65,3),(39,66,1),(39,67,0),(39,68,3),(39,69,0),(39,70,1),(39,71,2),(39,72,0),(39,73,0),(39,74,0),(39,75,0),(39,76,0),(39,77,0),(39,78,0),(39,79,0),(39,80,0),(39,81,0),(39,82,2),(39,83,0),(39,84,35),(39,85,7),(39,86,0),(39,87,0);
/*!40000 ALTER TABLE `av_drinks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `av_snacks`
--

DROP TABLE IF EXISTS `av_snacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `av_snacks` (
  `av_abrechnung_id` int(11) NOT NULL,
  `snack_id` int(11) NOT NULL,
  `snack_count` int(11) NOT NULL,
  PRIMARY KEY (`av_abrechnung_id`,`snack_id`),
  KEY `snack_id` (`snack_id`),
  CONSTRAINT `av_snacks_ibfk_1` FOREIGN KEY (`av_abrechnung_id`) REFERENCES `av_verkauf` (`av_abrechnung_id`),
  CONSTRAINT `av_snacks_ibfk_2` FOREIGN KEY (`snack_id`) REFERENCES `snacks` (`snack_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `av_snacks`
--

LOCK TABLES `av_snacks` WRITE;
/*!40000 ALTER TABLE `av_snacks` DISABLE KEYS */;
INSERT INTO `av_snacks` VALUES (37,2,0),(38,2,2),(39,2,0);
/*!40000 ALTER TABLE `av_snacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `av_verkauf`
--

DROP TABLE IF EXISTS `av_verkauf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `av_verkauf` (
  `av_abrechnung_id` int(11) NOT NULL AUTO_INCREMENT,
  `av_abrechnung_datum` varchar(100) NOT NULL,
  `money_count_100` int(11) NOT NULL,
  `money_count_50` int(11) NOT NULL,
  `money_count_20` int(11) NOT NULL,
  `money_count_10` int(11) NOT NULL,
  `money_count_5` int(11) NOT NULL,
  `money_count_2` int(11) NOT NULL,
  `money_count_1` int(11) NOT NULL,
  `money_count_05` int(11) NOT NULL,
  `money_count_02` int(11) NOT NULL,
  `money_count_01` int(11) NOT NULL,
  `money_count_005` int(11) NOT NULL,
  `money_count_002` int(11) NOT NULL,
  `money_count_001` int(11) NOT NULL,
  `money` float DEFAULT NULL,
  `product_value` float DEFAULT NULL,
  PRIMARY KEY (`av_abrechnung_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `av_verkauf`
--

LOCK TABLES `av_verkauf` WRITE;
/*!40000 ALTER TABLE `av_verkauf` DISABLE KEYS */;
INSERT INTO `av_verkauf` VALUES (1,'03-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(2,'04-10-2019',10,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(3,'04-10-2019',0,2,0,0,0,0,0,0,0,0,0,0,0,100,100),(4,'04-10-2019',0,0,0,0,0,2,0,0,0,0,0,0,0,100,100),(5,'04-10-2019',0,0,1,0,0,0,0,0,0,0,0,0,0,100,100),(6,'04-10-2019',0,0,0,1,1,0,0,0,0,0,0,0,0,100,100),(7,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(8,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(9,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(10,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(11,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(12,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(13,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(14,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(15,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(16,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(17,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(18,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(19,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(20,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(21,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(22,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(23,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(24,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(25,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(26,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(27,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(28,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(29,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(30,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(31,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(32,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(33,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(34,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(35,'04-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(36,'05-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(37,'05-10-2019',0,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(38,'05-10-2019',1,0,0,0,0,0,0,0,0,0,0,0,0,100,100),(39,'06-10-2019',0,0,1,0,3,16,22,13,31,14,2,2,6,NULL,NULL);
/*!40000 ALTER TABLE `av_verkauf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rohgetraenke`
--

DROP TABLE IF EXISTS `rohgetraenke`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rohgetraenke` (
  `drink_id` int(11) NOT NULL AUTO_INCREMENT,
  `drink_name` varchar(100) NOT NULL,
  `drink_type` varchar(100) NOT NULL,
  `bottle_size` float NOT NULL,
  `bottle_cost` float NOT NULL,
  `trader` varchar(100) NOT NULL,
  `internal_price` float NOT NULL,
  `portion_size` float NOT NULL,
  `external_addition` float NOT NULL,
  `portion_price` float NOT NULL,
  `external_price_bottle` float NOT NULL,
  `weight_bottle` float NOT NULL,
  `deposit_bottle` float NOT NULL,
  `skListe` tinyint(1) NOT NULL,
  `avVerkauf` tinyint(1) NOT NULL,
  `bierKarte` tinyint(1) NOT NULL,
  `barKarte` tinyint(1) NOT NULL,
  `abrechnung` tinyint(1) NOT NULL,
  PRIMARY KEY (`drink_id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rohgetraenke`
--

LOCK TABLES `rohgetraenke` WRITE;
/*!40000 ALTER TABLE `rohgetraenke` DISABLE KEYS */;
INSERT INTO `rohgetraenke` VALUES (5,'Absolut Wodka','Schnaps-eiskalt',1,15.7,'W',18.7,0.04,22.34,2,50,345,0,1,0,0,1,1),(6,'Absolut Citron','Schnaps-eiskalt',1,16.1,'W',19.2,0.04,22,2,50,456,0,1,0,0,1,1),(7,'Absolut Kurant','Schnaps-eiskalt',1,16.1,'W',19.2,0.04,22,2,50,345,0,1,0,0,1,1),(8,'Absolut 100','Schnaps-eiskalt',1,23,'W',27.4,0.04,22.69,2.4,60,546,0,1,0,0,1,1),(9,'Absolut Rasperri','Schnaps-eiskalt',1,16.5,'W',19.7,0.04,21.54,2,50,765,0,1,0,0,1,1),(10,'Absolut Ruby Red','Schnaps-eiskalt',1,16.1,'W',19.2,0.04,22,2,50,456,0,1,0,0,1,1),(11,'Absolut Pears','Schnaps-eiskalt',1,16.1,'W',19.2,0.04,21.92,2,50,546,0,1,0,0,1,1),(12,'Absolut Vanilla','Schnaps-eiskalt',1,16.1,'W',19.2,0.04,22,2,50,457,0,1,0,0,1,1),(13,'Bacardi Black','Barschnaps',1,15.5,'W',18.5,0.04,20.71,1.9,47.5,457,0,1,1,0,1,1),(14,'Bacardi White','Barschnaps',1,13.3,'W',15.9,0.04,22,1.9,47.5,345,0,1,1,0,1,1),(15,'Baileys','Barschnaps',1,15.55,'W',18.6,0.04,18,1.76,44,345,0,1,1,0,1,1),(16,'Beerenfrucht','Likör-gekühlt',0.7,3.94,'M',4.7,0.04,22,1.5,26.25,424,0,1,0,0,0,0),(17,'Berliner Luft','Likör-gekühlt',0.7,5.03,'W',6,0.04,27,1.8,31.5,503,0,1,1,0,1,1),(18,'Bols Blue Curacao','Barschnaps',0.7,7.99,'W',9.6,0.04,25,2,35,456,0,1,0,0,1,1),(19,'Cachasa','Barschnaps',1,11.79,'W',14.1,0.04,36,2.6,65,345,0,1,1,0,1,1),(20,'Captain Morgan White','Barschnaps',1,12.91,'W',15.4,0.04,23,1.89,47.25,517,0,1,1,0,1,1),(21,'Captain Morgan Gold','Barschnaps',1,14,'W',16.7,0.04,22,1.89,47.25,517,0,1,1,0,1,1),(22,'Cointreau','Barschnaps',1,22.65,'W',27,0.04,23,2.4,60,345,0,1,0,0,1,1),(23,'NH Doppelkorn','Schnaps-eiskalt',1,7.55,'W',9,0.04,20,1.5,37.5,234,0,1,0,0,1,1),(24,'Dos Mas','Barschnaps',0.7,8.5,'W',10.2,0.04,22,1.8,31.5,234,0,1,1,0,1,1),(25,'Eierlikör','Barschnaps',0.7,3.35,'W',4,0.04,23,1.5,26.25,234,0,1,0,0,1,1),(26,'Ficken','Likör-gekühlt',0.7,9.2,'W',11,0.04,20,1.8,31.5,482,0,1,1,0,1,1),(27,'Ceepers Gin','Barschnaps',1,8.65,'W',10.3,0.04,19,1.5,37.5,462,0,1,1,0,1,1),(28,'Goldkrone','Barschnaps',1,6.36,'M',7.6,0.04,22,1.5,37.5,567,0,1,0,0,1,1),(29,'Havana Club 3 Jahre','Barschnaps',1,16.37,'W',19.5,0.04,19,1.9,47.5,596,0,1,1,0,1,1),(30,'Havana Club 7 Jahre','Barschnaps',1,19.76,'W',23.6,0.04,22,2.2,55,123,0,1,0,0,1,1),(31,'Jack Daniels','Barschnaps',1,22.65,'W',27,0.04,22,2.4,60,678,0,1,1,0,1,1),(32,'Jägermeister','Schnaps-eiskalt',1,13.55,'W',16.2,0.04,23,2,50,567,0,1,1,0,1,1),(33,'Jim Beam','Barschnaps',1,16.48,'W',19.7,0.04,21,2,50,547,0,1,1,0,1,1),(34,'Licor 43','Barschnaps',1,18.25,'W',21.8,0.04,19,2,50,345,0,1,1,0,1,1),(35,'Liqeur de Pêche','Likör-gekühlt',0.7,6.32,'W',7.6,0.04,18,1.5,26.25,861,0,1,1,0,1,1),(36,'Kahlua','Barschnaps',0.7,11.34,'W',13.5,0.04,21,2,35,456,0,1,1,0,1,1),(37,'Kirschlikör','Barschnaps',0.7,3.35,'W',4,0.04,23,1.5,26.25,456,0,1,0,0,1,1),(38,'Malibu','Barschnaps',1,15.11,'W',18,0.04,22,2,50,573,0,1,1,0,1,1),(39,'Moskovskaya','Schnaps-eiskalt',1,12.99,'W',15.5,0.04,24,2,50,678,0,1,0,0,1,1),(40,'Pfeffi','Likör-gekühlt',0.7,3.1,'W',3.7,0.04,23,1.5,26.25,323,0,1,1,0,1,1),(41,'Ramazotti','Schnaps-eiskalt',1,15.92,'W',19,0.04,22,2,50,516,0,1,1,0,1,1),(42,'Saure Kirsche','Likör-gekühlt',0.7,2.76,'M',3.3,0.04,23,1.5,26.25,320,0,1,1,0,1,1),(43,'Sambuca Molinari','Schnaps-eiskalt',1,15.51,'M',18.5,0.04,22,2,50,456,0,1,1,0,1,1),(44,'Smirnoff Wodka','Barschnaps',1,12.28,'W',14.7,0.04,16,1.49,37.25,505,0,1,1,0,1,1),(45,'Stolichnaya','Schnaps-eiskalt',1,18.1,'W',21.6,0.04,20,2,50,579,0,1,0,0,1,1),(46,'Stroh 80','Barschnaps',0.5,11.74,'W',14,0.04,22,2.4,30,897,0,1,1,0,1,1),(47,'Tanqueray','Barschnaps',1,18.5,'W',22.1,0.04,19,1.97,49.25,661,0,1,1,0,1,1),(48,'Tequila Gold','Barschnaps',1,15,'W',17.9,0.04,22,2,50,741,0,1,1,0,1,1),(49,'Tequila Silver','Barschnaps',1,15,'W',17.9,0.04,22,2,50,741,0,1,1,0,1,1),(50,'Tullamore Dew','Barschnaps',1,18.39,'W',21.9,0.04,27,2.4,60,789,0,1,0,0,1,1),(51,'Grenadine','Barschnaps',0.75,4.95,'M',5.9,0.04,1,0.4,7.5,345,0,1,0,0,1,0),(52,'Klopfer','Barschnaps',0.02,0.27,'M',0.4,0.02,0.34,0.4,0.4,557,0,1,1,0,1,0),(53,'Granini Ananas','Saft',1,1.74,'W',2.3,0.2,1.75,1,5,345,0.15,0,1,0,1,1),(54,'Granini Apfel','Saft',1,1.34,'W',1.8,0.2,2.2,1,5,123,0.15,0,1,0,1,1),(55,'Granini Banane','Saft',1,1.48,'W',2,0.2,2,1,5,345,0.15,0,1,0,1,1),(56,'Granini Cranberry','Saft',1,1.87,'W',2.4,0.2,1.9,1,5,345,0.15,0,1,0,1,1),(57,'Granini Kirsche','Saft',1,1.81,'W',2.3,0.2,2,1,5,783,0.15,0,1,0,1,1),(58,'Granini Mango','Saft',1,1.76,'W',2.3,0.2,1.9,1,5,543,0.15,0,1,0,1,1),(59,'Granini Maracuja','Saft',1,1.76,'W',2.3,0.2,2,1,5,345,0.15,0,1,0,1,1),(60,'Granini Orange','Saft',1,1.5,'W',2,0.2,2,1,5,345,0.15,0,1,0,1,1),(61,'Granini Pfirsich','Saft',1,1.48,'W',2,0.2,2,1,5,234,0.15,0,1,0,1,1),(62,'Coca Cola','AFG',1,0.9,'W',1.3,0.2,1.2,0.55,2.75,234,0.15,0,1,0,1,1),(63,'Coca Cola','AFG',0.33,0.51,'W',0.7,0.33,2,1.54,1.54,234,0.08,0,1,1,0,1),(64,'Fanta','AFG',1,0.8,'W',1.1,0.2,1.2,0.6,3,345,0.15,0,1,0,1,1),(65,'Sprite','AFG',1,0.8,'W',1.1,0.2,1.2,0.6,3,345,0.15,0,1,0,1,1),(66,'Spezi','AFG',0.5,0.37,'W',0.6,0.5,1,1.2,1.2,345,0.08,0,1,0,0,0),(67,'TWQ Bitter Lemon','AFG',1,0.69,'W',1,0.2,1.5,0.6,3,234,0.15,0,1,0,1,1),(68,'TWQ Tonic','AFG',1,0.69,'W',1,0.2,1.5,0.6,3,345,0.15,0,1,0,1,1),(69,'TWQ Mineralwasser','AFG',1,0.48,'W',0.8,0.2,0.75,0.4,2,345,0.15,0,1,0,1,1),(70,'TWQ Ginger Ale','AFG',1,0.69,'W',1,0.2,0.5,0.4,2,234,0.15,0,1,0,1,1),(71,'TWQ AsaScho','AFG',1,0.7,'W',1,0.2,1.5,0.6,3,234,0.15,0,1,0,0,0),(72,'Rotkäppchen Sekt','Wein/Sekt',0.75,3.35,'M',4,0.1,4,1.2,9,234,0,1,1,0,1,1),(73,'Prosecco','Wein/Sekt',0.75,2.09,'M',2.5,0.1,4.5,1,7.5,345,0,1,1,0,1,1),(74,'Schöfferhofer Grapefruit','Bier',0.33,0.49,'W',0.7,0.33,2.2,1.6,1.6,456,0.08,0,1,1,0,1),(75,'Hasseröder Pils','Bier',0.5,0.58,'W',0.8,0.5,1.8,2,2,345,0.08,0,1,0,0,0),(76,'Hasseröder Pils','Bier',50,90.2,'W',107.4,0.5,1.5,2.2,220,4567,0,0,1,1,0,1),(77,'Becks Blue (alkoholfrei)','Bier',0.33,0.55,'W',0.8,0.33,2,1.6,1.6,456,0.08,0,1,1,0,1),(78,'Bibop','Bier',0.33,0.51,'W',0.7,0.33,2,1.6,1.6,345,0.08,0,1,1,0,1),(79,'Heineken','Bier',0.33,0.72,'W',1,0.33,2.4,2,2,123,0.08,0,1,1,0,1),(80,'Franziskaner Hell','Bier',0.5,0.75,'W',1,0.5,1.5,2,2,122,0.08,0,1,1,0,1),(81,'Franziskaner Dunkel','Bier',1,0.75,'W',1,0.5,2.2,2,4,123,0.08,0,1,1,0,1),(82,'Köstritzer Schwarz','Bier',0.5,0.62,'W',0.9,0.5,1.8,2,2,123,0.08,0,1,1,0,1),(83,'Desperados','Bier',0.33,0.94,'W',1.2,0.33,2.1,2.2,2.2,234,0.08,0,1,1,0,1),(84,'Pilgerstoff','Bier',0.5,0.69,'W',0.9,0.5,1.2,1.7,1.7,234,0.08,0,1,1,0,1),(85,'Bitburger Pils','Bier',0.5,0.65,'W',0.9,0.5,1.7,2,2,234,0.08,0,1,0,0,1),(86,'Bitburger Pils','Bier',50,97.55,'W',116.1,0.5,1.4,2.2,220,1234,0,0,1,1,0,1),(87,'Hofbräu','Bier',50,108.1,'W',128.7,0.5,1.1,2.2,220,1234,0,0,1,1,0,1);
/*!40000 ALTER TABLE `rohgetraenke` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `snacks`
--

DROP TABLE IF EXISTS `snacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `snacks` (
  `snack_id` int(11) NOT NULL AUTO_INCREMENT,
  `snack_name` varchar(100) NOT NULL,
  `snack_cost` float NOT NULL,
  `snack_price` float NOT NULL,
  `skListe` tinyint(1) NOT NULL,
  `avVerkauf` tinyint(1) NOT NULL,
  `bierKarte` tinyint(1) NOT NULL,
  `barKarte` tinyint(1) NOT NULL,
  `abrechnung` tinyint(1) NOT NULL,
  PRIMARY KEY (`snack_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `snacks`
--

LOCK TABLES `snacks` WRITE;
/*!40000 ALTER TABLE `snacks` DISABLE KEYS */;
INSERT INTO `snacks` VALUES (2,'Chips',1,1.1,1,1,1,0,0);
/*!40000 ALTER TABLE `snacks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-30 10:54:05
