-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: db_gestao_receita_ds2t
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_alergenos`
--

DROP TABLE IF EXISTS `tbl_alergenos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_alergenos` (
  `id_alergenos` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text NOT NULL,
  PRIMARY KEY (`id_alergenos`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_alergenos`
--

LOCK TABLES `tbl_alergenos` WRITE;
/*!40000 ALTER TABLE `tbl_alergenos` DISABLE KEYS */;
INSERT INTO `tbl_alergenos` VALUES (1,'Glúten','Proteína presente no trigo'),(2,'Lactose','Açúcar presente no leite'),(3,'Amendoim','Oleaginosa comum em alergias'),(4,'Ovos','Alérgeno comum em bolos'),(5,'Soja','Ingrediente presente em diversos alimentos');
/*!40000 ALTER TABLE `tbl_alergenos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_delete_alergenos_relations` BEFORE DELETE ON `tbl_alergenos` FOR EACH ROW BEGIN
    DELETE FROM tbl_ingredientes_alergenos WHERE id_alergenos = OLD.id_alergenos;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_categoria`
--

DROP TABLE IF EXISTS `tbl_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_categoria`
--

LOCK TABLES `tbl_categoria` WRITE;
/*!40000 ALTER TABLE `tbl_categoria` DISABLE KEYS */;
INSERT INTO `tbl_categoria` VALUES (1,'entradas','Categoria de entradas'),(2,'pratos_principais','Categoria de pratos principais'),(3,'acompanhamentos','Categoria de acompanhamentos'),(4,'saladas','Categoria de saladas'),(5,'sopas','Categoria de sopas'),(6,'massas','Categoria de massas'),(7,'carnes','Categoria de carnes'),(8,'frango','Categoria de frango'),(9,'peixes_e_frutos_do_mar','Categoria de peixes e frutos do mar'),(10,'lanches','Categoria de lanches'),(11,'petiscos','Categoria de petiscos'),(12,'sobremesas','Categoria de sobremesas'),(13,'bolos_e_tortas','Categoria de bolos e tortas'),(14,'bebidas','Categoria de bebidas'),(15,'vegano','Categoria vegana'),(16,'vegetariano','Categoria vegetariana'),(17,'light__fit','Categoria light/fit'),(18,'café_da_manhã','Categoria de café da manhã'),(19,'brunch','Categoria de brunch');
/*!40000 ALTER TABLE `tbl_categoria` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_delete_categoria_relations` BEFORE DELETE ON `tbl_categoria` FOR EACH ROW BEGIN
    DELETE FROM tbl_receita_categoria WHERE id_categoria = OLD.id_categoria;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_cozinha`
--

DROP TABLE IF EXISTS `tbl_cozinha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_cozinha` (
  `id_cozinha` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_cozinha`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_cozinha`
--

LOCK TABLES `tbl_cozinha` WRITE;
/*!40000 ALTER TABLE `tbl_cozinha` DISABLE KEYS */;
INSERT INTO `tbl_cozinha` VALUES (1,'Brasileira'),(5,'Francesa'),(2,'Italiana'),(3,'Japonesa'),(4,'Mexicana'),(6,'Outra');
/*!40000 ALTER TABLE `tbl_cozinha` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_delete_cozinha_relations` BEFORE DELETE ON `tbl_cozinha` FOR EACH ROW BEGIN
    DELETE FROM tbl_receita_cozinha WHERE id_cozinha = OLD.id_cozinha;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_ingredientes`
--

DROP TABLE IF EXISTS `tbl_ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ingredientes` (
  `id_ingredientes` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  PRIMARY KEY (`id_ingredientes`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ingredientes`
--

LOCK TABLES `tbl_ingredientes` WRITE;
/*!40000 ALTER TABLE `tbl_ingredientes` DISABLE KEYS */;
INSERT INTO `tbl_ingredientes` VALUES (1,'Farinha','Seco'),(2,'Açúcar','Seco'),(3,'Leite','Líquido'),(4,'Frango','Carne'),(5,'Arroz','Grão'),(6,'Penne','Seco'),(7,'Presunto','Carne'),(8,'Creme de Leite','Líquido'),(9,'Goma de Tapioca','Seco'),(10,'Ovo','Proteína'),(11,'Queijo Mussarela','Laticínio'),(12,'Canela em Pó','Tempero'),(13,'Carne Moída','Carne'),(14,'Molho de Tomate','Líquido'),(15,'Polvilho Azedo','Seco'),(16,'Chocolate Meio Amargo','Doce'),(17,'Manteiga','Gordura'),(18,'Limão','Fruta'),(19,'Leite Condensado','Líquido'),(20,'Bolacha Maisena','Seco');
/*!40000 ALTER TABLE `tbl_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_delete_ingredientes_relations` BEFORE DELETE ON `tbl_ingredientes` FOR EACH ROW BEGIN
    DELETE FROM tbl_receita_ingredientes WHERE id_ingredientes = OLD.id_ingredientes;
    DELETE FROM tbl_ingredientes_alergenos WHERE id_ingredientes = OLD.id_ingredientes;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_ingredientes_alergenos`
--

DROP TABLE IF EXISTS `tbl_ingredientes_alergenos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ingredientes_alergenos` (
  `id_ingredientes_alergenos` int NOT NULL AUTO_INCREMENT,
  `id_alergenos` int NOT NULL,
  `id_ingredientes` int NOT NULL,
  PRIMARY KEY (`id_ingredientes_alergenos`),
  KEY `id_ingredientes` (`id_ingredientes`),
  KEY `id_alergenos` (`id_alergenos`),
  CONSTRAINT `tbl_ingredientes_alergenos_ibfk_1` FOREIGN KEY (`id_ingredientes`) REFERENCES `tbl_ingredientes` (`id_ingredientes`),
  CONSTRAINT `tbl_ingredientes_alergenos_ibfk_2` FOREIGN KEY (`id_alergenos`) REFERENCES `tbl_alergenos` (`id_alergenos`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ingredientes_alergenos`
--

LOCK TABLES `tbl_ingredientes_alergenos` WRITE;
/*!40000 ALTER TABLE `tbl_ingredientes_alergenos` DISABLE KEYS */;
INSERT INTO `tbl_ingredientes_alergenos` VALUES (1,1,1),(2,2,2),(3,2,3),(4,4,4),(5,5,5),(6,1,6),(7,2,8),(8,4,10),(9,2,11),(10,2,16),(11,5,16),(12,2,17),(13,2,19),(14,1,20);
/*!40000 ALTER TABLE `tbl_ingredientes_alergenos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_modo_preparo`
--

DROP TABLE IF EXISTS `tbl_modo_preparo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_modo_preparo` (
  `id_modo_preparo` int NOT NULL AUTO_INCREMENT,
  `id_receita` int NOT NULL,
  `numero_passo` int NOT NULL,
  `descricao` text NOT NULL,
  PRIMARY KEY (`id_modo_preparo`),
  KEY `id_receita` (`id_receita`),
  CONSTRAINT `tbl_modo_preparo_ibfk_1` FOREIGN KEY (`id_receita`) REFERENCES `tbl_receita` (`id_receita`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_modo_preparo`
--

LOCK TABLES `tbl_modo_preparo` WRITE;
/*!40000 ALTER TABLE `tbl_modo_preparo` DISABLE KEYS */;
INSERT INTO `tbl_modo_preparo` VALUES (1,6,1,'Coloque 2 litros de água a ferver com uma pitada generosa de sal.'),(2,6,2,'Adicione o penne e cozinhe pelo tempo indicado na embalagem até ficar \"al dente\".'),(3,6,3,'Enquanto a massa cozinha, corte o presunto em cubos pequenos e reserve.'),(4,6,4,'Numa panela separada, aqueça o creme de leite, tempere e adicione o presunto.'),(5,6,5,'Escorra o macarrão e envolva-o imediatamente no molho quente antes de servir.'),(6,7,1,'Numa tigela pequena, parta o ovo e bata ligeiramente com um garfo.'),(7,7,2,'Adicione a goma de tapioca e uma pitada de sal, misturando até ficar homogéneo.'),(8,7,3,'Aqueça uma frigideira antiaderente em lume brando (unte levemente se necessário).'),(9,7,4,'Verta a mistura na frigideira e deixe firmar, como se fosse uma panqueca.'),(10,7,5,'Quando a massa estiver firme, coloque o queijo, dobre ao meio e deixe derreter.'),(11,8,1,'Pré-aqueça o forno a 180°C e unte uma forma com buraco no meio.'),(12,8,2,'Bata os ovos, a manteiga e o açúcar até obter um creme fofo e esbranquiçado.'),(13,8,3,'Adicione a farinha e o leite alternadamente, batendo em velocidade baixa.'),(14,8,4,'Junte o fermento e a canela, misturando delicadamente com uma colher.'),(15,8,5,'Despeje a massa na forma e leve ao forno por aproximadamente 40 minutos.'),(16,9,1,'No liquidificador, bata o leite, os ovos e a farinha até obter uma massa líquida.'),(17,9,2,'Aqueça uma frigideira e faça discos finos de massa, dourando dos dois lados.'),(18,9,3,'Numa panela, refogue a carne moída com temperos até ficar bem cozinhada.'),(19,9,4,'Recheie cada disco de massa com a carne e enrole-os cuidadosamente.'),(20,9,5,'Cubra com o molho de tomate aquecido e sirva de imediato.'),(21,10,1,'Ferva o leite, a água e o óleo numa panela até levantar fervura.'),(22,10,2,'Coloque o polvilho numa tigela e despeje o líquido fervente para escaldar.'),(23,10,3,'Aguarde a massa arrefecer um pouco e adicione os ovos e o queijo.'),(24,10,4,'Sove bem a massa com as mãos até que esta deixe de colar.'),(25,10,5,'Modele bolinhas de tamanho médio e leve a assar até ficarem douradas.'),(26,11,1,'Derreta o chocolate juntamente com a manteiga em banho-maria ou no micro-ondas.'),(27,11,2,'Numa outra tigela, misture bem o açúcar e os ovos.'),(28,11,3,'Incorpore o chocolate derretido à mistura de ovos e mexa bem.'),(29,11,4,'Adicione a farinha peneirada e misture até a massa ficar homogénea.'),(30,11,5,'Asse em forno médio por cerca de 25 minutos (o interior deve ficar húmido).'),(31,12,1,'Triture a bolacha maisena até virar uma farofa e misture com manteiga derretida.'),(32,12,2,'Forre o fundo e as laterais de uma forma com essa massa de bolacha.'),(33,12,3,'No liquidificador, bata o leite condensado com o sumo dos limões até engrossar.'),(34,12,4,'Despeje o creme de limão sobre a base de bolacha já preparada.'),(35,12,5,'Leve ao frigorífico por pelo menos 2 horas e decore com raspas de limão.');
/*!40000 ALTER TABLE `tbl_modo_preparo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_receita`
--

DROP TABLE IF EXISTS `tbl_receita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_receita` (
  `id_receita` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descricao` text NOT NULL,
  `tempo_preparo` int NOT NULL,
  `dificuldade` enum('facil','medio','dificil') NOT NULL,
  `data_criacao` date NOT NULL,
  `data_edicao` date DEFAULT NULL,
  `imagem` varchar(255) NOT NULL,
  PRIMARY KEY (`id_receita`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `tbl_receita_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_receita`
--

LOCK TABLES `tbl_receita` WRITE;
/*!40000 ALTER TABLE `tbl_receita` DISABLE KEYS */;
INSERT INTO `tbl_receita` VALUES (6,1,'Penne ao Molho Branco com Presunto','Massa penne com molho cremoso e cubos de presunto.',25,'facil','2025-12-12',NULL,'https://toquesenaistorage.blob.core.windows.net/tgsenai/Comidacompresunto.jpeg'),(7,1,'Crepioca de Queijo','Massa leve de tapioca com ovo recheada.',15,'facil','2025-12-12',NULL,'https://toquesenaistorage.blob.core.windows.net/tgsenai/crepioca.jpeg'),(8,1,'Bolo Caseiro de Canela','Bolo fofinho para o café da tarde.',45,'facil','2025-12-12',NULL,'https://toquesenaistorage.blob.core.windows.net/tgsenai/bolocaseiro.jpeg'),(9,1,'Panqueca de Carne Moída','Panquecas recheadas cobertas com molho vermelho.',40,'medio','2025-12-12',NULL,'https://toquesenaistorage.blob.core.windows.net/tgsenai/panquecacomcarnemoidaemolhodetomate.jpeg'),(10,1,'Pão de Queijo Mineiro','Tradicional, crocante por fora e macio por dentro.',35,'medio','2025-12-12',NULL,'https://toquesenaistorage.blob.core.windows.net/tgsenai/paodequeijo.jpeg'),(11,1,'Brownie de Chocolate','Sobremesa densa e muito chocolatuda.',50,'medio','2025-12-12',NULL,'https://toquesenaistorage.blob.core.windows.net/tgsenai/brownie.jpeg'),(12,1,'Torta Mousse de Limão','Base crocante com creme de limão refrescante.',30,'facil','2025-12-12',NULL,'https://toquesenaistorage.blob.core.windows.net/tgsenai/tortadelimao.jpeg');
/*!40000 ALTER TABLE `tbl_receita` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_delete_receita_relations` BEFORE DELETE ON `tbl_receita` FOR EACH ROW BEGIN 
    DELETE FROM tbl_modo_preparo WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_receita_ingredientes WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_usuario_notas_receita WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_receita_cozinha WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_receita_categoria WHERE id_receita = OLD.id_receita;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_receita_categoria`
--

DROP TABLE IF EXISTS `tbl_receita_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_receita_categoria` (
  `id_receita_categoria` int NOT NULL AUTO_INCREMENT,
  `id_receita` int NOT NULL,
  `id_categoria` int NOT NULL,
  PRIMARY KEY (`id_receita_categoria`),
  KEY `id_receita` (`id_receita`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `tbl_receita_categoria_ibfk_1` FOREIGN KEY (`id_receita`) REFERENCES `tbl_receita` (`id_receita`),
  CONSTRAINT `tbl_receita_categoria_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `tbl_categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_receita_categoria`
--

LOCK TABLES `tbl_receita_categoria` WRITE;
/*!40000 ALTER TABLE `tbl_receita_categoria` DISABLE KEYS */;
INSERT INTO `tbl_receita_categoria` VALUES (1,6,6),(2,7,10),(3,8,13),(4,9,6),(5,10,10),(6,11,12),(7,12,12);
/*!40000 ALTER TABLE `tbl_receita_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_receita_cozinha`
--

DROP TABLE IF EXISTS `tbl_receita_cozinha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_receita_cozinha` (
  `id_receita_cozinha` int NOT NULL AUTO_INCREMENT,
  `id_receita` int NOT NULL,
  `id_cozinha` int NOT NULL,
  PRIMARY KEY (`id_receita_cozinha`),
  KEY `id_receita` (`id_receita`),
  KEY `id_cozinha` (`id_cozinha`),
  CONSTRAINT `tbl_receita_cozinha_ibfk_1` FOREIGN KEY (`id_receita`) REFERENCES `tbl_receita` (`id_receita`),
  CONSTRAINT `tbl_receita_cozinha_ibfk_2` FOREIGN KEY (`id_cozinha`) REFERENCES `tbl_cozinha` (`id_cozinha`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_receita_cozinha`
--

LOCK TABLES `tbl_receita_cozinha` WRITE;
/*!40000 ALTER TABLE `tbl_receita_cozinha` DISABLE KEYS */;
INSERT INTO `tbl_receita_cozinha` VALUES (1,6,2),(2,7,1),(3,8,1),(4,9,1),(5,10,1),(6,11,6),(7,12,5);
/*!40000 ALTER TABLE `tbl_receita_cozinha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_receita_ingredientes`
--

DROP TABLE IF EXISTS `tbl_receita_ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_receita_ingredientes` (
  `id_receita_ingredientes` int NOT NULL AUTO_INCREMENT,
  `id_receita` int NOT NULL,
  `id_ingredientes` int NOT NULL,
  `quantidade` decimal(10,2) NOT NULL,
  `unidade` varchar(20) NOT NULL,
  PRIMARY KEY (`id_receita_ingredientes`),
  KEY `id_receita` (`id_receita`),
  KEY `id_ingredientes` (`id_ingredientes`),
  CONSTRAINT `tbl_receita_ingredientes_ibfk_1` FOREIGN KEY (`id_receita`) REFERENCES `tbl_receita` (`id_receita`),
  CONSTRAINT `tbl_receita_ingredientes_ibfk_2` FOREIGN KEY (`id_ingredientes`) REFERENCES `tbl_ingredientes` (`id_ingredientes`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_receita_ingredientes`
--

LOCK TABLES `tbl_receita_ingredientes` WRITE;
/*!40000 ALTER TABLE `tbl_receita_ingredientes` DISABLE KEYS */;
INSERT INTO `tbl_receita_ingredientes` VALUES (1,6,6,250.00,'g'),(2,6,7,100.00,'g'),(3,6,8,200.00,'ml'),(4,7,9,2.00,'col'),(5,7,10,1.00,'uni'),(6,7,11,50.00,'g'),(7,8,1,3.00,'xic'),(8,8,2,2.00,'xic'),(9,8,12,1.00,'col'),(10,9,13,300.00,'g'),(11,9,1,200.00,'g'),(12,9,14,1.00,'lt'),(13,10,15,500.00,'g'),(14,10,11,300.00,'g'),(15,10,10,3.00,'uni'),(16,11,16,200.00,'g'),(17,11,17,100.00,'g'),(18,11,2,1.00,'xic'),(19,12,20,200.00,'g'),(20,12,19,1.00,'lt'),(21,12,18,3.00,'uni');
/*!40000 ALTER TABLE `tbl_receita_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_usuario`
--

DROP TABLE IF EXISTS `tbl_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_usuario`
--

LOCK TABLES `tbl_usuario` WRITE;
/*!40000 ALTER TABLE `tbl_usuario` DISABLE KEYS */;
INSERT INTO `tbl_usuario` VALUES (1,'teste','teste@email.com','38a7bf73877582d879cfcd9b7fe0e9be:e8986514885c0cace335c26a2e4341bf97026cf6faebfcb625a55cfdea88c10ef4ee2ff07c97b2710dd48b611ca11d5ccf6de86b8797f38248be624379a4672a','user1.png'),(2,'Mariana Lima','mariana@email.com','abcde','user2.png'),(3,'João Pedro','joao@email.com','senha1','user3.png'),(4,'Lucas Rocha','lucas@email.com','senha2','user4.png'),(5,'Ana Souza','ana@email.com','pass123','user5.png');
/*!40000 ALTER TABLE `tbl_usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_delete_usuario_relations` BEFORE DELETE ON `tbl_usuario` FOR EACH ROW BEGIN
    DELETE FROM tbl_usuario_notas_receita WHERE id_usuario = OLD.id_usuario;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_usuario_notas_receita`
--

DROP TABLE IF EXISTS `tbl_usuario_notas_receita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_usuario_notas_receita` (
  `id_usuario_notas_receita` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_receita` int NOT NULL,
  `nota` decimal(2,1) NOT NULL,
  `descricao` varchar(200) NOT NULL,
  PRIMARY KEY (`id_usuario_notas_receita`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_receita` (`id_receita`),
  CONSTRAINT `tbl_usuario_notas_receita_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario` (`id_usuario`),
  CONSTRAINT `tbl_usuario_notas_receita_ibfk_2` FOREIGN KEY (`id_receita`) REFERENCES `tbl_receita` (`id_receita`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_usuario_notas_receita`
--

LOCK TABLES `tbl_usuario_notas_receita` WRITE;
/*!40000 ALTER TABLE `tbl_usuario_notas_receita` DISABLE KEYS */;
INSERT INTO `tbl_usuario_notas_receita` VALUES (1,1,6,4.5,'Ficou ótimo!'),(2,2,7,5.0,'Delicioso!'),(3,3,8,3.5,'Difícil, mas bom.'),(4,4,9,4.0,'Bem refrescante.'),(5,5,10,5.0,'Perfeito!');
/*!40000 ALTER TABLE `tbl_usuario_notas_receita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_alergenos_por_ingredientes`
--

DROP TABLE IF EXISTS `vw_alergenos_por_ingredientes`;
/*!50001 DROP VIEW IF EXISTS `vw_alergenos_por_ingredientes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_alergenos_por_ingredientes` AS SELECT 
 1 AS `id_ingredientes`,
 1 AS `ingrediente`,
 1 AS `alergeno`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_modo_preparo`
--

DROP TABLE IF EXISTS `vw_modo_preparo`;
/*!50001 DROP VIEW IF EXISTS `vw_modo_preparo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_modo_preparo` AS SELECT 
 1 AS `id_receita`,
 1 AS `titulo`,
 1 AS `numero_passo`,
 1 AS `descricao`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_notas_receitas`
--

DROP TABLE IF EXISTS `vw_notas_receitas`;
/*!50001 DROP VIEW IF EXISTS `vw_notas_receitas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_notas_receitas` AS SELECT 
 1 AS `usuario`,
 1 AS `receita`,
 1 AS `nota`,
 1 AS `comentario`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_receita_ingredientes`
--

DROP TABLE IF EXISTS `vw_receita_ingredientes`;
/*!50001 DROP VIEW IF EXISTS `vw_receita_ingredientes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_receita_ingredientes` AS SELECT 
 1 AS `id_receita`,
 1 AS `titulo`,
 1 AS `ingrediente`,
 1 AS `quantidade`,
 1 AS `unidade`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_receitas_completas`
--

DROP TABLE IF EXISTS `vw_receitas_completas`;
/*!50001 DROP VIEW IF EXISTS `vw_receitas_completas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_receitas_completas` AS SELECT 
 1 AS `id_receita`,
 1 AS `titulo`,
 1 AS `descricao`,
 1 AS `tempo_preparo`,
 1 AS `dificuldade`,
 1 AS `data_criacao`,
 1 AS `data_edicao`,
 1 AS `imagem`,
 1 AS `ingredientes`,
 1 AS `cozinhas`,
 1 AS `categorias`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'db_gestao_receita_ds2t'
--
/*!50003 DROP PROCEDURE IF EXISTS `filtrar_excluir_alergeno` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrar_excluir_alergeno`(IN p_alergeno VARCHAR(100))
BEGIN
    SELECT r.id_receita, r.titulo, r.descricao  
    FROM tbl_receita r
    WHERE r.id_receita NOT IN (
        SELECT ri.id_receita
        FROM tbl_receita_ingredientes ri
        JOIN tbl_ingredientes_alergenos ia ON ri.id_ingredientes = ia.id_ingredientes
        JOIN tbl_alergenos a ON ia.id_alergenos = a.id_alergenos
        WHERE a.nome = p_alergeno
    );
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `filtrar_por_categoria` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrar_por_categoria`(IN p_categoria VARCHAR(100))
BEGIN
    SELECT
        r.titulo,
        c.nome AS categoria,
        r.dificuldade,
        r.tempo_preparo
    FROM tbl_receita r
    JOIN tbl_receita_categoria rc ON r.id_receita = rc.id_receita
    JOIN tbl_categoria c ON rc.id_categoria = c.id_categoria
    WHERE c.nome = p_categoria
    GROUP BY r.id_receita, r.titulo, c.nome, r.dificuldade, r.tempo_preparo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `filtrar_por_cozinha` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrar_por_cozinha`(IN p_cozinha VARCHAR(100))
BEGIN
    SELECT
        r.titulo,
        cz.nome AS cozinha
    FROM tbl_receita r
    JOIN tbl_receita_cozinha rc ON r.id_receita = rc.id_receita
    JOIN tbl_cozinha cz ON rc.id_cozinha = cz.id_cozinha
    WHERE cz.nome = p_cozinha
    GROUP BY r.id_receita, r.titulo, cz.nome;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `filtrar_por_dificuldade` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrar_por_dificuldade`(IN p_dificuldade ENUM('facil', 'medio', 'dificil'))
BEGIN
    SELECT
        titulo,
        dificuldade,
        tempo_preparo
    FROM tbl_receita
    WHERE dificuldade = p_dificuldade
    ORDER BY tempo_preparo ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `filtrar_por_ingrediente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrar_por_ingrediente`(IN p_ingrediente VARCHAR(100))
BEGIN 
    SELECT
        r.id_receita,
        r.titulo,
        r.descricao,
        i.nome AS ingrediente
    FROM tbl_receita r
    JOIN tbl_receita_ingredientes ri ON r.id_receita = ri.id_receita
    JOIN tbl_ingredientes i ON ri.id_ingredientes = i.id_ingredientes
    WHERE i.nome LIKE CONCAT('%', p_ingrediente, '%');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `filtrar_por_tempo_maximo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrar_por_tempo_maximo`(IN p_tempo_maximo INT)
BEGIN
    SELECT 
        titulo, 
        tempo_preparo 
    FROM tbl_receita
    WHERE tempo_preparo <= p_tempo_maximo
    ORDER BY tempo_preparo ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_alergenos_por_ingredientes`
--

/*!50001 DROP VIEW IF EXISTS `vw_alergenos_por_ingredientes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_alergenos_por_ingredientes` AS select `i`.`id_ingredientes` AS `id_ingredientes`,`i`.`nome` AS `ingrediente`,`a`.`nome` AS `alergeno` from ((`tbl_ingredientes` `i` left join `tbl_ingredientes_alergenos` `ia` on((`ia`.`id_ingredientes` = `i`.`id_ingredientes`))) left join `tbl_alergenos` `a` on((`a`.`id_alergenos` = `ia`.`id_alergenos`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_modo_preparo`
--

/*!50001 DROP VIEW IF EXISTS `vw_modo_preparo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_modo_preparo` AS select `m`.`id_receita` AS `id_receita`,`r`.`titulo` AS `titulo`,`m`.`numero_passo` AS `numero_passo`,`m`.`descricao` AS `descricao` from (`tbl_modo_preparo` `m` join `tbl_receita` `r` on((`r`.`id_receita` = `m`.`id_receita`))) order by `m`.`id_receita`,`m`.`numero_passo` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_notas_receitas`
--

/*!50001 DROP VIEW IF EXISTS `vw_notas_receitas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_notas_receitas` AS select `u`.`nome` AS `usuario`,`r`.`titulo` AS `receita`,`n`.`nota` AS `nota`,`n`.`descricao` AS `comentario` from ((`tbl_usuario_notas_receita` `n` join `tbl_usuario` `u` on((`u`.`id_usuario` = `n`.`id_usuario`))) join `tbl_receita` `r` on((`r`.`id_receita` = `n`.`id_receita`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_receita_ingredientes`
--

/*!50001 DROP VIEW IF EXISTS `vw_receita_ingredientes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_receita_ingredientes` AS select `r`.`id_receita` AS `id_receita`,`r`.`titulo` AS `titulo`,`i`.`nome` AS `ingrediente`,`ri`.`quantidade` AS `quantidade`,`ri`.`unidade` AS `unidade` from ((`tbl_receita` `r` join `tbl_receita_ingredientes` `ri` on((`ri`.`id_receita` = `r`.`id_receita`))) join `tbl_ingredientes` `i` on((`i`.`id_ingredientes` = `ri`.`id_ingredientes`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_receitas_completas`
--

/*!50001 DROP VIEW IF EXISTS `vw_receitas_completas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_receitas_completas` AS select `r`.`id_receita` AS `id_receita`,`r`.`titulo` AS `titulo`,`r`.`descricao` AS `descricao`,`r`.`tempo_preparo` AS `tempo_preparo`,`r`.`dificuldade` AS `dificuldade`,`r`.`data_criacao` AS `data_criacao`,`r`.`data_edicao` AS `data_edicao`,`r`.`imagem` AS `imagem`,group_concat(distinct `i`.`nome` order by `i`.`nome` ASC separator ', ') AS `ingredientes`,group_concat(distinct `cz`.`nome` order by `cz`.`nome` ASC separator ', ') AS `cozinhas`,group_concat(distinct `cat`.`nome` order by `cat`.`nome` ASC separator ', ') AS `categorias` from ((((((`tbl_receita` `r` join `tbl_receita_ingredientes` `ri` on((`ri`.`id_receita` = `r`.`id_receita`))) join `tbl_ingredientes` `i` on((`i`.`id_ingredientes` = `ri`.`id_ingredientes`))) join `tbl_receita_cozinha` `rc` on((`rc`.`id_receita` = `r`.`id_receita`))) join `tbl_cozinha` `cz` on((`cz`.`id_cozinha` = `rc`.`id_cozinha`))) join `tbl_receita_categoria` `rcat` on((`rcat`.`id_receita` = `r`.`id_receita`))) join `tbl_categoria` `cat` on((`cat`.`id_categoria` = `rcat`.`id_categoria`))) group by `r`.`id_receita` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-12 13:45:35
