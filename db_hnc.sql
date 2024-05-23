-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 14.225.207.168    Database: db_hnc
-- ------------------------------------------------------
-- Server version	5.7.44

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
-- Table structure for table `tb_admin`
--

DROP TABLE IF EXISTS `tb_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` char(255) NOT NULL,
  `Password` char(255) NOT NULL,
  `GhiChu` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_admin`
--

LOCK TABLES `tb_admin` WRITE;
/*!40000 ALTER TABLE `tb_admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_canbots`
--

DROP TABLE IF EXISTS `tb_canbots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_canbots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `MaCBTS` char(50) NOT NULL,
  `Password` char(255) NOT NULL,
  `HoDem` varchar(255) NOT NULL,
  `Ten` varchar(255) NOT NULL,
  `SDT` char(11) NOT NULL,
  `GhiChu` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `MaCBTS` (`MaCBTS`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_canbots`
--

LOCK TABLES `tb_canbots` WRITE;
/*!40000 ALTER TABLE `tb_canbots` DISABLE KEYS */;
INSERT INTO `tb_canbots` VALUES (2,'DUYTUNG','12345678','Nguyễn Duy','Tùng','098712074','test'),(5,'CDEV','12345678','Nguyễn Mạnh','Cường','098712074','dev');
/*!40000 ALTER TABLE `tb_canbots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_canbots_hoso`
--

DROP TABLE IF EXISTS `tb_canbots_hoso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_canbots_hoso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `HoSo_ID` int(11) NOT NULL,
  `NgayXet` datetime NOT NULL,
  `CanBoTS_ID` int(11) DEFAULT NULL,
  `GhiChu` mediumtext,
  PRIMARY KEY (`id`),
  KEY `CanBoTS_ID` (`CanBoTS_ID`),
  KEY `HoSo_ID` (`HoSo_ID`),
  CONSTRAINT `tb_canbots_hoso_ibfk_1` FOREIGN KEY (`CanBoTS_ID`) REFERENCES `tb_canbots` (`id`),
  CONSTRAINT `tb_canbots_hoso_ibfk_2` FOREIGN KEY (`HoSo_ID`) REFERENCES `tb_hoso` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_canbots_hoso`
--

LOCK TABLES `tb_canbots_hoso` WRITE;
/*!40000 ALTER TABLE `tb_canbots_hoso` DISABLE KEYS */;
INSERT INTO `tb_canbots_hoso` VALUES (9,13,'2024-05-10 18:15:35',2,NULL),(10,14,'2024-05-13 15:37:40',2,NULL),(11,21,'2024-05-14 18:35:07',2,NULL),(12,20,'2024-05-17 16:07:34',2,NULL);
/*!40000 ALTER TABLE `tb_canbots_hoso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_hoso`
--

DROP TABLE IF EXISTS `tb_hoso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_hoso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `MaHoSo` char(11) NOT NULL,
  `HoDem` varchar(255) NOT NULL,
  `Ten` varchar(255) NOT NULL,
  `NgayThangNamSinh` date NOT NULL,
  `GioiTinh` varchar(5) NOT NULL,
  `DanToc` varchar(50) NOT NULL,
  `CCCD` char(15) NOT NULL,
  `MaTinh` char(11) NOT NULL,
  `MaQuanHuyen` char(11) NOT NULL,
  `MaPhuongXa` char(11) NOT NULL,
  `MaTinhTruong` char(11) NOT NULL,
  `MaQuanHuyenTruong` char(11) NOT NULL,
  `TenTruong` varchar(255) NOT NULL,
  `NamTotNghiep` char(10) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `SDT` char(11) NOT NULL,
  `DoiTuongUT` char(11) DEFAULT NULL,
  `KhuVucUT` char(11) NOT NULL,
  `DiaChi` varchar(255) NOT NULL,
  `NgayNop` datetime DEFAULT NULL,
  `Nganh_ID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_MaHoSo` (`MaHoSo`),
  UNIQUE KEY `CCCD` (`CCCD`,`Email`,`SDT`),
  UNIQUE KEY `SDT` (`SDT`),
  UNIQUE KEY `Email` (`Email`),
  KEY `Nganh_ID` (`Nganh_ID`),
  CONSTRAINT `tb_hoso_ibfk_1` FOREIGN KEY (`Nganh_ID`) REFERENCES `tb_nganh` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_hoso`
--

LOCK TABLES `tb_hoso` WRITE;
/*!40000 ALTER TABLE `tb_hoso` DISABLE KEYS */;
INSERT INTO `tb_hoso` VALUES (13,'24010000','Nguyễn Mạnh','Cường 2','2003-08-09','Nam','Kinh','837582758273','26','251','09067','01','18','THPT Phúc Thọ','2021','cc324234hh@gmail.com','0987683928','Không','KV2','Thị Trấn - Phúc Thọ - Hà Nội','2024-05-05 09:59:41',1),(14,'24060000','Nguyễn Mạnh','Cường 3','2003-08-09','Nam','Kinh','987423458374','01','272','09715','01','18','THPT Phúc Thọ','2021','dd324234hh@gmail.com','0987683929','Không','KV2','Thị Trấn - Phúc Thọ - Hà Nội','2024-05-05 09:59:41',6),(20,'24050000','Nguyễn Mạnh','Cường 10','2003-08-11','Nam','Kinh','837582222711','01','273','09787','01','18','THPT Phúc Thọ','2023','ee324234hh@gmail.com','0987333932','Không','KV4','Thị Trấn - Phúc Thọ - Hà Nội','2024-05-05 09:59:43',5),(21,'24020000','Phạm Xuân','Huy','2003-11-11','Nam','Kinh','030203001399','30','297','11056','21','05','THPT Đoàn Thượng','2021','xuanhuy11203@gmai.com','0379898784','01','KV2-NT','xuanhuy11203@gmail.com','2024-05-14 18:33:28',2),(28,'24010005','Nguyễn Mạnh','Cường 15','2003-08-09','Nam','Kinh','223758275836','26','251','09061','16','05','THPT yên lạc 2','2021','gg3242324hh@gmail.com','0987683939','Không','KV2','Xã trung kiên - Huyện Yên Lạc - tỉnh Vĩnh Phúc','2024-05-17 22:19:54',1),(29,'24040003','Nguyễn Mạnh','Cường 17','2003-08-09','Nam','Kinh','987222258337','26','251','09061','16','05','THPT yên lạc 2','2021','ii2224234hh@gmail.com','0987683937','Không','KV2','Xã trung kiên - Huyện Yên Lạc - tỉnh Vĩnh Phúc','2024-05-17 22:19:54',4),(30,'24070002','Nguyễn Mạnh','Cường 18','2003-08-09','Nam','Kinh','837582555738','26','251','09061','16','05','THPT yên lạc 2','2021','jj3242324hh@gmail.com','0987683947','Không','KV2','Xã trung kiên - Huyện Yên Lạc - tỉnh Vĩnh Phúc','2024-05-17 22:19:54',7),(31,'24040004','Nguyễn Mạnh','Cường 19','2003-08-10','Nam','Kinh','837582222739','26','251','09061','16','05','THPT yên lạc 2','2022','zz3242324hh@gmail.com','0987683232','Không','KV3','Xã trung kiên - Huyện Yên Lạc - tỉnh Vĩnh Phúc','2024-05-17 22:19:55',4),(32,'24050001','Nguyễn Mạnh','Cường 20','2003-08-11','Nam','Kinh','837582222740','26','251','09061','16','05','THPT yên lạc 2','2023','ee3242234hh@gmail.com','0987333941','Không','KV4','Xã trung kiên - Huyện Yên Lạc - tỉnh Vĩnh Phúc','2024-05-17 22:19:55',5);
/*!40000 ALTER TABLE `tb_hoso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_minhchung`
--

DROP TABLE IF EXISTS `tb_minhchung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_minhchung` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `BangKQ12` varchar(255) DEFAULT NULL,
  `HocBaBia` varchar(255) DEFAULT NULL,
  `ChungNhanTN` varchar(255) DEFAULT NULL,
  `ChungNhanUT` varchar(255) DEFAULT NULL,
  `HoSo_ID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HoSo_ID` (`HoSo_ID`),
  CONSTRAINT `tb_minhchung_ibfk_1` FOREIGN KEY (`HoSo_ID`) REFERENCES `tb_hoso` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tb_minhchung_ibfk_2` FOREIGN KEY (`HoSo_ID`) REFERENCES `tb_hoso` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_minhchung`
--

LOCK TABLES `tb_minhchung` WRITE;
/*!40000 ALTER TABLE `tb_minhchung` DISABLE KEYS */;
INSERT INTO `tb_minhchung` VALUES (13,'[]',NULL,NULL,NULL,13),(14,'[]',NULL,NULL,NULL,14),(20,'[]',NULL,NULL,NULL,20),(21,'[]',NULL,NULL,NULL,21),(28,'[]',NULL,NULL,NULL,28),(29,'[]',NULL,NULL,NULL,29),(30,'[]',NULL,NULL,NULL,30),(31,'[]',NULL,NULL,NULL,31),(32,'[]',NULL,NULL,NULL,32);
/*!40000 ALTER TABLE `tb_minhchung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_nganh`
--

DROP TABLE IF EXISTS `tb_nganh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_nganh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `MaNganh` char(11) NOT NULL,
  `TenNganh` varchar(255) NOT NULL,
  `GhiChu` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_nganh`
--

LOCK TABLES `tb_nganh` WRITE;
/*!40000 ALTER TABLE `tb_nganh` DISABLE KEYS */;
INSERT INTO `tb_nganh` VALUES (1,'01','Điều dưỡng','Ngành/nghề 1'),(2,'02','Dược','Ngành/nghề 2'),(3,'03','Kỹ thuật PHCN','Ngành/nghề 3'),(4,'04','Chăm sóc sắc đẹp','Ngành/nghề 4'),(5,'05','Kỹ thuật chế biến món ăn','Ngành/nghề 5'),(6,'06','Ngôn ngữ và văn hoá Hàn Quốc','Ngành/nghề 6'),(7,'07','Ngôn ngữ và văn hoá Trung Quốc','Ngành/nghề 7');
/*!40000 ALTER TABLE `tb_nganh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_xettuyen`
--

DROP TABLE IF EXISTS `tb_xettuyen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_xettuyen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `HoSo_ID` int(11) NOT NULL,
  `HinhThuc` varchar(255) NOT NULL,
  `DiemTB10` decimal(4,2) NOT NULL,
  `DiemTB11` decimal(4,2) NOT NULL,
  `DiemHKI12` decimal(4,2) NOT NULL,
  `TrangThai` tinyint(1) DEFAULT NULL,
  `GhiChu` mediumtext,
  PRIMARY KEY (`id`),
  KEY `HoSo_ID` (`HoSo_ID`),
  CONSTRAINT `tb_xettuyen_ibfk_1` FOREIGN KEY (`HoSo_ID`) REFERENCES `tb_hoso` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tb_xettuyen_ibfk_2` FOREIGN KEY (`HoSo_ID`) REFERENCES `tb_hoso` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_xettuyen`
--

LOCK TABLES `tb_xettuyen` WRITE;
/*!40000 ALTER TABLE `tb_xettuyen` DISABLE KEYS */;
INSERT INTO `tb_xettuyen` VALUES (13,13,'Xét tuyển học bạ',8.00,8.50,5.00,1,NULL),(14,14,'Xét tuyển học bạ',8.00,8.50,2.00,1,NULL),(20,20,'Xét tuyển học bạ',8.00,8.50,7.00,1,NULL),(21,21,'Xét tuyển bằng học bạ THPT',7.90,8.10,8.30,1,NULL),(28,28,'Xét tuyển học bạ',8.00,8.50,8.00,NULL,NULL),(29,29,'Xét tuyển học bạ',8.00,8.50,8.00,NULL,NULL),(30,30,'Xét tuyển học bạ',8.00,8.50,5.00,NULL,NULL),(31,31,'Xét tuyển học bạ',8.00,8.50,6.00,NULL,NULL),(32,32,'Xét tuyển học bạ',8.00,8.50,7.00,NULL,NULL);
/*!40000 ALTER TABLE `tb_xettuyen` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-18 11:47:13
