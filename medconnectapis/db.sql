-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: localhost    Database: medconnectdb
-- ------------------------------------------------------
-- Server version	9.5.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '00546850-b2fe-11f0-8147-f26f4349a4ff:1-5383';

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add application',7,'add_application'),(22,'Can change application',7,'change_application'),(23,'Can delete application',7,'delete_application'),(24,'Can view application',7,'view_application'),(25,'Can add access token',6,'add_accesstoken'),(26,'Can change access token',6,'change_accesstoken'),(27,'Can delete access token',6,'delete_accesstoken'),(28,'Can view access token',6,'view_accesstoken'),(29,'Can add grant',9,'add_grant'),(30,'Can change grant',9,'change_grant'),(31,'Can delete grant',9,'delete_grant'),(32,'Can view grant',9,'view_grant'),(33,'Can add refresh token',11,'add_refreshtoken'),(34,'Can change refresh token',11,'change_refreshtoken'),(35,'Can delete refresh token',11,'delete_refreshtoken'),(36,'Can view refresh token',11,'view_refreshtoken'),(37,'Can add id token',10,'add_idtoken'),(38,'Can change id token',10,'change_idtoken'),(39,'Can delete id token',10,'delete_idtoken'),(40,'Can view id token',10,'view_idtoken'),(41,'Can add device grant',8,'add_devicegrant'),(42,'Can change device grant',8,'change_devicegrant'),(43,'Can delete device grant',8,'delete_devicegrant'),(44,'Can view device grant',8,'view_devicegrant'),(45,'Can add user',26,'add_user'),(46,'Can change user',26,'change_user'),(47,'Can delete user',26,'delete_user'),(48,'Can view user',26,'view_user'),(49,'Can add disease',14,'add_disease'),(50,'Can change disease',14,'change_disease'),(51,'Can delete disease',14,'delete_disease'),(52,'Can view disease',14,'view_disease'),(53,'Can add disease category',15,'add_diseasecategory'),(54,'Can change disease category',15,'change_diseasecategory'),(55,'Can delete disease category',15,'delete_diseasecategory'),(56,'Can view disease category',15,'view_diseasecategory'),(57,'Can add medicine category',19,'add_medicinecategory'),(58,'Can change medicine category',19,'change_medicinecategory'),(59,'Can delete medicine category',19,'delete_medicinecategory'),(60,'Can view medicine category',19,'view_medicinecategory'),(61,'Can add service',24,'add_service'),(62,'Can change service',24,'change_service'),(63,'Can delete service',24,'delete_service'),(64,'Can view service',24,'view_service'),(65,'Can add specialty',25,'add_specialty'),(66,'Can change specialty',25,'change_specialty'),(67,'Can delete specialty',25,'delete_specialty'),(68,'Can view specialty',25,'view_specialty'),(69,'Can add doctor',16,'add_doctor'),(70,'Can change doctor',16,'change_doctor'),(71,'Can delete doctor',16,'delete_doctor'),(72,'Can view doctor',16,'view_doctor'),(73,'Can add patient profile',20,'add_patientprofile'),(74,'Can change patient profile',20,'change_patientprofile'),(75,'Can delete patient profile',20,'delete_patientprofile'),(76,'Can view patient profile',20,'view_patientprofile'),(77,'Can add appointment',12,'add_appointment'),(78,'Can change appointment',12,'change_appointment'),(79,'Can delete appointment',12,'delete_appointment'),(80,'Can view appointment',12,'view_appointment'),(81,'Can add medicine',18,'add_medicine'),(82,'Can change medicine',18,'change_medicine'),(83,'Can delete medicine',18,'delete_medicine'),(84,'Can view medicine',18,'view_medicine'),(85,'Can add payment',21,'add_payment'),(86,'Can change payment',21,'change_payment'),(87,'Can delete payment',21,'delete_payment'),(88,'Can view payment',21,'view_payment'),(89,'Can add prescription',22,'add_prescription'),(90,'Can change prescription',22,'change_prescription'),(91,'Can delete prescription',22,'delete_prescription'),(92,'Can view prescription',22,'view_prescription'),(93,'Can add prescription detail',23,'add_prescriptiondetail'),(94,'Can change prescription detail',23,'change_prescriptiondetail'),(95,'Can delete prescription detail',23,'delete_prescriptiondetail'),(96,'Can view prescription detail',23,'view_prescriptiondetail'),(97,'Can add appointment service',13,'add_appointmentservice'),(98,'Can change appointment service',13,'change_appointmentservice'),(99,'Can delete appointment service',13,'delete_appointmentservice'),(100,'Can view appointment service',13,'view_appointmentservice'),(101,'Can add doctor schedule',17,'add_doctorschedule'),(102,'Can change doctor schedule',17,'change_doctorschedule'),(103,'Can delete doctor schedule',17,'delete_doctorschedule'),(104,'Can view doctor schedule',17,'view_doctorschedule'),(105,'Can add chat message',27,'add_chatmessage'),(106,'Can change chat message',27,'change_chatmessage'),(107,'Can delete chat message',27,'delete_chatmessage'),(108,'Can view chat message',27,'view_chatmessage'),(109,'Can add chat room',28,'add_chatroom'),(110,'Can change chat room',28,'change_chatroom'),(111,'Can delete chat room',28,'delete_chatroom'),(112,'Can view chat room',28,'view_chatroom'),(113,'Can add video call log',29,'add_videocalllog'),(114,'Can change video call log',29,'change_videocalllog'),(115,'Can delete video call log',29,'delete_videocalllog'),(116,'Can view video call log',29,'view_videocalllog');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_medconnectapp_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_medconnectapp_user_id` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2026-04-15 10:24:32.146273','10','Hai BS',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',26,1),(2,'2026-04-17 01:13:42.954856','10','Bác sĩ Hai BS',1,'[{\"added\": {}}]',16,1),(3,'2026-04-17 01:15:08.940993','4','DoctorSchedule object (4)',1,'[{\"added\": {}}]',17,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(4,'contenttypes','contenttype'),(12,'medconnectapp','appointment'),(13,'medconnectapp','appointmentservice'),(27,'medconnectapp','chatmessage'),(28,'medconnectapp','chatroom'),(14,'medconnectapp','disease'),(15,'medconnectapp','diseasecategory'),(16,'medconnectapp','doctor'),(17,'medconnectapp','doctorschedule'),(18,'medconnectapp','medicine'),(19,'medconnectapp','medicinecategory'),(20,'medconnectapp','patientprofile'),(21,'medconnectapp','payment'),(22,'medconnectapp','prescription'),(23,'medconnectapp','prescriptiondetail'),(24,'medconnectapp','service'),(25,'medconnectapp','specialty'),(26,'medconnectapp','user'),(29,'medconnectapp','videocalllog'),(6,'oauth2_provider','accesstoken'),(7,'oauth2_provider','application'),(8,'oauth2_provider','devicegrant'),(9,'oauth2_provider','grant'),(10,'oauth2_provider','idtoken'),(11,'oauth2_provider','refreshtoken'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-04-15 10:01:04.470044'),(2,'contenttypes','0002_remove_content_type_name','2026-04-15 10:01:04.523173'),(3,'auth','0001_initial','2026-04-15 10:01:04.705845'),(4,'auth','0002_alter_permission_name_max_length','2026-04-15 10:01:04.742224'),(5,'auth','0003_alter_user_email_max_length','2026-04-15 10:01:04.747367'),(6,'auth','0004_alter_user_username_opts','2026-04-15 10:01:04.752264'),(7,'auth','0005_alter_user_last_login_null','2026-04-15 10:01:04.757322'),(8,'auth','0006_require_contenttypes_0002','2026-04-15 10:01:04.759963'),(9,'auth','0007_alter_validators_add_error_messages','2026-04-15 10:01:04.765300'),(10,'auth','0008_alter_user_username_max_length','2026-04-15 10:01:04.772375'),(11,'auth','0009_alter_user_last_name_max_length','2026-04-15 10:01:04.779323'),(12,'auth','0010_alter_group_name_max_length','2026-04-15 10:01:04.791218'),(13,'auth','0011_update_proxy_permissions','2026-04-15 10:01:04.797205'),(14,'auth','0012_alter_user_first_name_max_length','2026-04-15 10:01:04.803543'),(15,'medconnectapp','0001_initial','2026-04-15 10:01:05.915261'),(16,'admin','0001_initial','2026-04-15 10:01:06.020405'),(17,'admin','0002_logentry_remove_auto_add','2026-04-15 10:01:06.028382'),(18,'admin','0003_logentry_add_action_flag_choices','2026-04-15 10:01:06.039811'),(19,'oauth2_provider','0001_initial','2026-04-15 10:01:06.594932'),(20,'oauth2_provider','0002_auto_20190406_1805','2026-04-15 10:01:06.690869'),(21,'oauth2_provider','0003_auto_20201211_1314','2026-04-15 10:01:06.744498'),(22,'oauth2_provider','0004_auto_20200902_2022','2026-04-15 10:01:07.106976'),(23,'oauth2_provider','0005_auto_20211222_2352','2026-04-15 10:01:07.190217'),(24,'oauth2_provider','0006_alter_application_client_secret','2026-04-15 10:01:07.221448'),(25,'oauth2_provider','0007_application_post_logout_redirect_uris','2026-04-15 10:01:07.276738'),(26,'oauth2_provider','0008_alter_accesstoken_token','2026-04-15 10:01:07.291089'),(27,'oauth2_provider','0009_add_hash_client_secret','2026-04-15 10:01:07.358698'),(28,'oauth2_provider','0010_application_allowed_origins','2026-04-15 10:01:07.407272'),(29,'oauth2_provider','0011_refreshtoken_token_family','2026-04-15 10:01:07.458553'),(30,'oauth2_provider','0012_add_token_checksum','2026-04-15 10:01:07.691209'),(31,'oauth2_provider','0013_alter_application_authorization_grant_type_device','2026-04-15 10:01:07.799522'),(32,'sessions','0001_initial','2026-04-15 10:01:07.833577'),(33,'medconnectapp','0002_alter_appointment_diagnosis','2026-04-15 10:10:57.113507'),(34,'medconnectapp','0003_alter_user_avatar','2026-04-15 10:20:18.705425'),(35,'medconnectapp','0004_chatroom_videocalllog_chatmessage','2026-04-17 01:07:16.045414');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('2kjticb1rwsvwi6e58dzio2m9t6kk209','.eJxVjDEOwjAMAP_iGUVBLonTkZ03VHbikAJKpKadEH9HlTrAene6N0y8rWXaui7TnGCEM5x-mXB8at1FenC9NxNbXZdZzJ6Yw3Zza0lf16P9GxTuBUZg4exQrNqAVqL3zJQkeCKUyNkGR0pp8HiJmQQtDVZydl6VSDE6-HwBBSE4qA:1wCxOR:CTewrFsFh7NFFA17DRLtrTo96A_fRWFWryYSEUAdAx0','2026-04-29 10:22:47.958635');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_appointment`
--

DROP TABLE IF EXISTS `medconnectapp_appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_appointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `start` datetime(6) NOT NULL,
  `reason` longtext,
  `symptoms` longtext,
  `note` longtext,
  `active_start` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `diagnosis_id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_appointment_doctor_active_start` (`doctor_id`,`active_start`),
  UNIQUE KEY `unique_appointment_user_active_start` (`user_id`,`active_start`),
  KEY `medconnectapp_appoin_diagnosis_id_49b3acc3_fk_medconnec` (`diagnosis_id`),
  CONSTRAINT `medconnectapp_appoin_diagnosis_id_49b3acc3_fk_medconnec` FOREIGN KEY (`diagnosis_id`) REFERENCES `medconnectapp_disease` (`id`),
  CONSTRAINT `medconnectapp_appoin_doctor_id_8b16fde3_fk_medconnec` FOREIGN KEY (`doctor_id`) REFERENCES `medconnectapp_doctor` (`user_id`),
  CONSTRAINT `medconnectapp_appoin_user_id_6566b019_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_appointment`
--

LOCK TABLES `medconnectapp_appointment` WRITE;
/*!40000 ALTER TABLE `medconnectapp_appointment` DISABLE KEYS */;
INSERT INTO `medconnectapp_appointment` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','SCHEDULED','2026-04-16 08:00:00.000000','Khám sức khỏe','Mệt mỏi','Đợi khám','2026-04-16 08:00:00.000000',1,1,4),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','COMPLETED','2026-04-15 09:00:00.000000','Đau họng','Ho, rát họng','Đã kê đơn thuốc','2026-04-15 09:00:00.000000',2,3,5),(3,0,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','CANCELED','2026-04-17 08:00:00.000000','Mờ mắt','Nhức mắt','Bệnh nhân bận đột xuất',NULL,3,1,6),(4,0,'2026-04-17 01:16:33.855010','2026-04-17 01:29:41.317752','SCHEDULED','2026-04-17 08:00:00.000000',NULL,NULL,NULL,NULL,8,1,10);
/*!40000 ALTER TABLE `medconnectapp_appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_appointmentservice`
--

DROP TABLE IF EXISTS `medconnectapp_appointmentservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_appointmentservice` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `appointment_id` bigint NOT NULL,
  `service_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medconnectapp_appoin_appointment_id_1e89bfb0_fk_medconnec` (`appointment_id`),
  KEY `medconnectapp_appoin_service_id_dfe8b8ea_fk_medconnec` (`service_id`),
  CONSTRAINT `medconnectapp_appoin_appointment_id_1e89bfb0_fk_medconnec` FOREIGN KEY (`appointment_id`) REFERENCES `medconnectapp_appointment` (`id`),
  CONSTRAINT `medconnectapp_appoin_service_id_dfe8b8ea_fk_medconnec` FOREIGN KEY (`service_id`) REFERENCES `medconnectapp_service` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_appointmentservice`
--

LOCK TABLES `medconnectapp_appointmentservice` WRITE;
/*!40000 ALTER TABLE `medconnectapp_appointmentservice` DISABLE KEYS */;
INSERT INTO `medconnectapp_appointmentservice` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',1,150000.00,2,1),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',1,200000.00,2,2),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',1,150000.00,1,1);
/*!40000 ALTER TABLE `medconnectapp_appointmentservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_chatmessage`
--

DROP TABLE IF EXISTS `medconnectapp_chatmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_chatmessage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `chat_type` varchar(10) NOT NULL,
  `content` longtext,
  `sender_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  `call_log_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `call_log_id` (`call_log_id`),
  KEY `medconnectapp_chatme_sender_id_6ab8ed0c_fk_medconnec` (`sender_id`),
  KEY `medconnectapp_chatme_room_id_a7189ca0_fk_medconnec` (`room_id`),
  CONSTRAINT `medconnectapp_chatme_call_log_id_fd393589_fk_medconnec` FOREIGN KEY (`call_log_id`) REFERENCES `medconnectapp_videocalllog` (`id`),
  CONSTRAINT `medconnectapp_chatme_room_id_a7189ca0_fk_medconnec` FOREIGN KEY (`room_id`) REFERENCES `medconnectapp_chatroom` (`id`),
  CONSTRAINT `medconnectapp_chatme_sender_id_6ab8ed0c_fk_medconnec` FOREIGN KEY (`sender_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_chatmessage`
--

LOCK TABLES `medconnectapp_chatmessage` WRITE;
/*!40000 ALTER TABLE `medconnectapp_chatmessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `medconnectapp_chatmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_chatroom`
--

DROP TABLE IF EXISTS `medconnectapp_chatroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_chatroom` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `appointment_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointment_id` (`appointment_id`),
  CONSTRAINT `medconnectapp_chatro_appointment_id_bd9ff7b4_fk_medconnec` FOREIGN KEY (`appointment_id`) REFERENCES `medconnectapp_appointment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_chatroom`
--

LOCK TABLES `medconnectapp_chatroom` WRITE;
/*!40000 ALTER TABLE `medconnectapp_chatroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `medconnectapp_chatroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_disease`
--

DROP TABLE IF EXISTS `medconnectapp_disease`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_disease` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `disease_category_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medconnectapp_diseas_disease_category_id_c1a2a55a_fk_medconnec` (`disease_category_id`),
  CONSTRAINT `medconnectapp_diseas_disease_category_id_c1a2a55a_fk_medconnec` FOREIGN KEY (`disease_category_id`) REFERENCES `medconnectapp_diseasecategory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_disease`
--

LOCK TABLES `medconnectapp_disease` WRITE;
/*!40000 ALTER TABLE `medconnectapp_disease` DISABLE KEYS */;
INSERT INTO `medconnectapp_disease` VALUES (1,1,'2026-04-15 08:00:00.000000','2026-04-15 08:00:00.000000','Chưa xác định',1),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Sốt xuất huyết',2),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Viêm phế quản cấp',3),(4,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Viêm loét dạ dày',4);
/*!40000 ALTER TABLE `medconnectapp_disease` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_diseasecategory`
--

DROP TABLE IF EXISTS `medconnectapp_diseasecategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_diseasecategory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_diseasecategory`
--

LOCK TABLES `medconnectapp_diseasecategory` WRITE;
/*!40000 ALTER TABLE `medconnectapp_diseasecategory` DISABLE KEYS */;
INSERT INTO `medconnectapp_diseasecategory` VALUES (1,1,'2026-04-15 08:00:00.000000','2026-04-15 08:00:00.000000','Bệnh lạ'),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Bệnh truyền nhiễm'),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Bệnh đường hô hấp'),(4,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Bệnh tiêu hóa');
/*!40000 ALTER TABLE `medconnectapp_diseasecategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_doctor`
--

DROP TABLE IF EXISTS `medconnectapp_doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_doctor` (
  `user_id` bigint NOT NULL,
  `background` longtext,
  `specialty_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `medconnectapp_doctor_specialty_id_938949fa_fk_medconnec` (`specialty_id`),
  CONSTRAINT `medconnectapp_doctor_specialty_id_938949fa_fk_medconnec` FOREIGN KEY (`specialty_id`) REFERENCES `medconnectapp_specialty` (`id`),
  CONSTRAINT `medconnectapp_doctor_user_id_57d7f032_fk_medconnectapp_user_id` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_doctor`
--

LOCK TABLES `medconnectapp_doctor` WRITE;
/*!40000 ALTER TABLE `medconnectapp_doctor` DISABLE KEYS */;
INSERT INTO `medconnectapp_doctor` VALUES (4,'10 năm kinh nghiệm nội khoa tại BV Chợ Rẫy',1),(5,'5 năm kinh nghiệm chuyên khoa Tai Mũi Họng',2),(6,'Bác sĩ chuyên khoa II Mắt',3),(10,'5 năm kinh nghiệm',2);
/*!40000 ALTER TABLE `medconnectapp_doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_doctorschedule`
--

DROP TABLE IF EXISTS `medconnectapp_doctorschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_doctorschedule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `hours` int NOT NULL,
  `duration` int NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medconnectapp_doctor_doctor_id_7f047439_fk_medconnec` (`doctor_id`),
  CONSTRAINT `medconnectapp_doctor_doctor_id_7f047439_fk_medconnec` FOREIGN KEY (`doctor_id`) REFERENCES `medconnectapp_doctor` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_doctorschedule`
--

LOCK TABLES `medconnectapp_doctorschedule` WRITE;
/*!40000 ALTER TABLE `medconnectapp_doctorschedule` DISABLE KEYS */;
INSERT INTO `medconnectapp_doctorschedule` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','2026-04-16 08:00:00.000000',4,15,4),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','2026-04-16 13:00:00.000000',4,15,5),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','2026-04-17 08:00:00.000000',4,15,6),(4,1,'2026-04-17 01:15:08.940098','2026-04-17 01:15:08.940124','2026-04-17 07:30:00.000000',5,15,10);
/*!40000 ALTER TABLE `medconnectapp_doctorschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_medicine`
--

DROP TABLE IF EXISTS `medconnectapp_medicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_medicine` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `stock` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `expired` date NOT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medconnectapp_medici_category_id_bdd48046_fk_medconnec` (`category_id`),
  CONSTRAINT `medconnectapp_medici_category_id_bdd48046_fk_medconnec` FOREIGN KEY (`category_id`) REFERENCES `medconnectapp_medicinecategory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_medicine`
--

LOCK TABLES `medconnectapp_medicine` WRITE;
/*!40000 ALTER TABLE `medconnectapp_medicine` DISABLE KEYS */;
INSERT INTO `medconnectapp_medicine` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Amoxicillin 500mg',500,5000.00,'Viên','2027-12-31',1),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Paracetamol 500mg',1000,2000.00,'Viên','2028-06-30',2),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Vitamin C 1000mg',300,3000.00,'Viên','2026-10-15',3);
/*!40000 ALTER TABLE `medconnectapp_medicine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_medicinecategory`
--

DROP TABLE IF EXISTS `medconnectapp_medicinecategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_medicinecategory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_medicinecategory`
--

LOCK TABLES `medconnectapp_medicinecategory` WRITE;
/*!40000 ALTER TABLE `medconnectapp_medicinecategory` DISABLE KEYS */;
INSERT INTO `medconnectapp_medicinecategory` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Kháng sinh'),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Giảm đau, hạ sốt'),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Vitamin & Khoáng chất');
/*!40000 ALTER TABLE `medconnectapp_medicinecategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_patientprofile`
--

DROP TABLE IF EXISTS `medconnectapp_patientprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_patientprofile` (
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  `gender` varchar(10) NOT NULL,
  `dob` date NOT NULL,
  `weight` double NOT NULL,
  `height` int NOT NULL,
  `allergies` longtext,
  `chronic_diseases` longtext,
  `blood_type` varchar(2) DEFAULT NULL,
  `address` longtext,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `medconnectapp_patien_user_id_30dc310d_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_patientprofile`
--

LOCK TABLES `medconnectapp_patientprofile` WRITE;
/*!40000 ALTER TABLE `medconnectapp_patientprofile` DISABLE KEYS */;
INSERT INTO `medconnectapp_patientprofile` VALUES (1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',1,'MALE','1990-05-10',65.5,170,'Không','Không','O','Quận 1, TP.HCM'),(1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',2,'FEMALE','1995-08-15',50,160,'Phấn hoa','Không','A','Quận 3, TP.HCM'),(1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',3,'MALE','1988-12-20',72,175,'Hải sản','Dạ dày','B','Quận 7, TP.HCM');
/*!40000 ALTER TABLE `medconnectapp_patientprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_payment`
--

DROP TABLE IF EXISTS `medconnectapp_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `status` varchar(10) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `appointment_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointment_id` (`appointment_id`),
  CONSTRAINT `medconnectapp_paymen_appointment_id_d92e88b5_fk_medconnec` FOREIGN KEY (`appointment_id`) REFERENCES `medconnectapp_appointment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_payment`
--

LOCK TABLES `medconnectapp_payment` WRITE;
/*!40000 ALTER TABLE `medconnectapp_payment` DISABLE KEYS */;
INSERT INTO `medconnectapp_payment` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','PAID',420000.00,2),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','PENDING',150000.00,1),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','PENDING',0.00,3);
/*!40000 ALTER TABLE `medconnectapp_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_prescription`
--

DROP TABLE IF EXISTS `medconnectapp_prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_prescription` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `appointment_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medconnectapp_prescr_appointment_id_1e61b96e_fk_medconnec` (`appointment_id`),
  CONSTRAINT `medconnectapp_prescr_appointment_id_1e61b96e_fk_medconnec` FOREIGN KEY (`appointment_id`) REFERENCES `medconnectapp_appointment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_prescription`
--

LOCK TABLES `medconnectapp_prescription` WRITE;
/*!40000 ALTER TABLE `medconnectapp_prescription` DISABLE KEYS */;
INSERT INTO `medconnectapp_prescription` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','DISPENSED',2),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','PENDING',1),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','PENDING',3);
/*!40000 ALTER TABLE `medconnectapp_prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_prescriptiondetail`
--

DROP TABLE IF EXISTS `medconnectapp_prescriptiondetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_prescriptiondetail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `quantity` int NOT NULL,
  `dose` int NOT NULL,
  `frequency` int NOT NULL,
  `duration_day` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `instruction` varchar(20) DEFAULT NULL,
  `medicine_id` bigint DEFAULT NULL,
  `prescription_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medconnectapp_prescr_medicine_id_b65a4bff_fk_medconnec` (`medicine_id`),
  KEY `medconnectapp_prescr_prescription_id_6744ce47_fk_medconnec` (`prescription_id`),
  CONSTRAINT `medconnectapp_prescr_medicine_id_b65a4bff_fk_medconnec` FOREIGN KEY (`medicine_id`) REFERENCES `medconnectapp_medicine` (`id`),
  CONSTRAINT `medconnectapp_prescr_prescription_id_6744ce47_fk_medconnec` FOREIGN KEY (`prescription_id`) REFERENCES `medconnectapp_prescription` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_prescriptiondetail`
--

LOCK TABLES `medconnectapp_prescriptiondetail` WRITE;
/*!40000 ALTER TABLE `medconnectapp_prescriptiondetail` DISABLE KEYS */;
INSERT INTO `medconnectapp_prescriptiondetail` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',10,1,2,5,5000.00,'AFTER_MEAL',1,1),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',10,1,2,5,2000.00,'AFTER_MEAL',2,1),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',20,1,1,20,3000.00,'BEFORE_MEAL',3,2);
/*!40000 ALTER TABLE `medconnectapp_prescriptiondetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_service`
--

DROP TABLE IF EXISTS `medconnectapp_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_service` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_service`
--

LOCK TABLES `medconnectapp_service` WRITE;
/*!40000 ALTER TABLE `medconnectapp_service` DISABLE KEYS */;
INSERT INTO `medconnectapp_service` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Xét nghiệm máu tổng quát',150000.00,'Phân tích 18 chỉ số máu'),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Chụp X-Quang Phổi',200000.00,'X-Quang tim phổi thẳng'),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Nội soi dạ dày',600000.00,'Nội soi không gây mê');
/*!40000 ALTER TABLE `medconnectapp_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_specialty`
--

DROP TABLE IF EXISTS `medconnectapp_specialty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_specialty` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_specialty`
--

LOCK TABLES `medconnectapp_specialty` WRITE;
/*!40000 ALTER TABLE `medconnectapp_specialty` DISABLE KEYS */;
INSERT INTO `medconnectapp_specialty` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Nội tổng quát','Khám các bệnh lý nội khoa cơ bản','default_specialty.png'),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Tai Mũi Họng','Chuyên khám và điều trị Tai Mũi Họng','default_specialty.png'),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Mắt','Khám và đo khúc xạ mắt','default_specialty.png');
/*!40000 ALTER TABLE `medconnectapp_specialty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_user`
--

DROP TABLE IF EXISTS `medconnectapp_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `role` varchar(20) NOT NULL,
  `phone` longtext NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_user`
--

LOCK TABLES `medconnectapp_user` WRITE;
/*!40000 ALTER TABLE `medconnectapp_user` DISABLE KEYS */;
INSERT INTO `medconnectapp_user` VALUES (1,'pbkdf2_sha256$1200000$mvPPCgjXVNowgpLmmgIUTV$RRkHClitqsqWhPk6S53hIN0DC6RZ5CUZgoO34UY6PTQ=',1,'admin','','','',1,'2026-04-15 10:06:26.634238','2026-04-15 10:06:26.634262',1,'PATIENT','',NULL),(2,'patient123',0,'patient1','Nguyễn','Văn A','patient1@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'PATIENT','0901111111',NULL),(3,'patient123',0,'patient2','Trần','Thị B','patient2@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'PATIENT','0902222222',NULL),(4,'patient123',0,'patient3','Lê','Văn C','patient3@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'PATIENT','0903333333',NULL),(5,'doctor123',0,'doctor1','Phạm','Bác Sĩ D','doctor1@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'DOCTOR','0904444444',NULL),(6,'doctor123',0,'doctor2','Hoàng','Bác Sĩ E','doctor2@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'DOCTOR','0905555555',NULL),(7,'doctor123',0,'doctor3','Vũ','Bác Sĩ F','doctor3@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'DOCTOR','0906666666',NULL),(8,'pbkdf2_sha256$1200000$Eeh4sRSz3q5W1rEWGhyqQQ$uleN2xaEfmPl8G4TeyF5o67b1H4Vnc5AQ/Pr6oLwu3Q=',0,'hau','Hau','Pham','hau@gmail.com',1,'2026-04-15 10:17:55.064532','2026-04-15 10:17:55.064563',0,'PATIENT','0987654321','image/upload/v1776248274/d4outkeghzi4x3tsuclc.jpg'),(10,'pbkdf2_sha256$1200000$rmFI3OBofICClGdnVPw1lZ$CbvRfyU2lPeZStqAXtYuhmG+jK5UY+GwaVvi/CLSSrY=',0,'bshai','Hai','BS','bshai@gmail.com',1,'2026-04-15 10:22:03.495070','2026-04-15 10:24:32.141094',0,'DOCTOR','0123456789','image/upload/d4outkeghzi4x3tsuclc.jpg');
/*!40000 ALTER TABLE `medconnectapp_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_user_groups`
--

DROP TABLE IF EXISTS `medconnectapp_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medconnectapp_user_groups_user_id_group_id_483d386a_uniq` (`user_id`,`group_id`),
  KEY `medconnectapp_user_groups_group_id_927139a7_fk_auth_group_id` (`group_id`),
  CONSTRAINT `medconnectapp_user_g_user_id_41dbb74d_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`),
  CONSTRAINT `medconnectapp_user_groups_group_id_927139a7_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_user_groups`
--

LOCK TABLES `medconnectapp_user_groups` WRITE;
/*!40000 ALTER TABLE `medconnectapp_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `medconnectapp_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_user_user_permissions`
--

DROP TABLE IF EXISTS `medconnectapp_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medconnectapp_user_user__user_id_permission_id_a6838880_uniq` (`user_id`,`permission_id`),
  KEY `medconnectapp_user_u_permission_id_d1b57051_fk_auth_perm` (`permission_id`),
  CONSTRAINT `medconnectapp_user_u_permission_id_d1b57051_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `medconnectapp_user_u_user_id_58b74546_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_user_user_permissions`
--

LOCK TABLES `medconnectapp_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `medconnectapp_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `medconnectapp_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_videocalllog`
--

DROP TABLE IF EXISTS `medconnectapp_videocalllog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_videocalllog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `start` datetime(6) NOT NULL,
  `end` datetime(6) DEFAULT NULL,
  `caller_id` bigint NOT NULL,
  `receiver_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medconnectapp_videoc_caller_id_f088b325_fk_medconnec` (`caller_id`),
  KEY `medconnectapp_videoc_receiver_id_a5a64e75_fk_medconnec` (`receiver_id`),
  KEY `medconnectapp_videoc_room_id_c3e736b3_fk_medconnec` (`room_id`),
  CONSTRAINT `medconnectapp_videoc_caller_id_f088b325_fk_medconnec` FOREIGN KEY (`caller_id`) REFERENCES `medconnectapp_user` (`id`),
  CONSTRAINT `medconnectapp_videoc_receiver_id_a5a64e75_fk_medconnec` FOREIGN KEY (`receiver_id`) REFERENCES `medconnectapp_user` (`id`),
  CONSTRAINT `medconnectapp_videoc_room_id_c3e736b3_fk_medconnec` FOREIGN KEY (`room_id`) REFERENCES `medconnectapp_chatroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_videocalllog`
--

LOCK TABLES `medconnectapp_videocalllog` WRITE;
/*!40000 ALTER TABLE `medconnectapp_videocalllog` DISABLE KEYS */;
/*!40000 ALTER TABLE `medconnectapp_videocalllog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_provider_accesstoken`
--

DROP TABLE IF EXISTS `oauth2_provider_accesstoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth2_provider_accesstoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  `expires` datetime(6) NOT NULL,
  `scope` longtext NOT NULL,
  `application_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NOT NULL,
  `source_refresh_token_id` bigint DEFAULT NULL,
  `id_token_id` bigint DEFAULT NULL,
  `token_checksum` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth2_provider_accesstoken_token_checksum_85319a26_uniq` (`token_checksum`),
  UNIQUE KEY `source_refresh_token_id` (`source_refresh_token_id`),
  UNIQUE KEY `id_token_id` (`id_token_id`),
  KEY `oauth2_provider_acce_application_id_b22886e1_fk_oauth2_pr` (`application_id`),
  KEY `oauth2_provider_acce_user_id_6e4c9a65_fk_medconnec` (`user_id`),
  CONSTRAINT `oauth2_provider_acce_application_id_b22886e1_fk_oauth2_pr` FOREIGN KEY (`application_id`) REFERENCES `oauth2_provider_application` (`id`),
  CONSTRAINT `oauth2_provider_acce_id_token_id_85db651b_fk_oauth2_pr` FOREIGN KEY (`id_token_id`) REFERENCES `oauth2_provider_idtoken` (`id`),
  CONSTRAINT `oauth2_provider_acce_source_refresh_token_e66fbc72_fk_oauth2_pr` FOREIGN KEY (`source_refresh_token_id`) REFERENCES `oauth2_provider_refreshtoken` (`id`),
  CONSTRAINT `oauth2_provider_acce_user_id_6e4c9a65_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_provider_accesstoken`
--

LOCK TABLES `oauth2_provider_accesstoken` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_accesstoken` DISABLE KEYS */;
INSERT INTO `oauth2_provider_accesstoken` VALUES (1,'SWhX25vFY6ZwqMbqq9LcCnbxJNFxA2','2026-04-17 11:10:55.977135','read write',1,8,'2026-04-17 01:10:55.978278','2026-04-17 01:10:55.978291',NULL,NULL,'1d43defb2756f83f2b56c3ae168549ecd5416ae419084211a744eac8e608c28d'),(2,'nTaoVlXoDGwgMQrSpWyQAuMm1h93KH','2026-04-17 11:25:47.364730','read write',1,1,'2026-04-17 01:25:47.365780','2026-04-17 01:25:47.365824',NULL,NULL,'b8ae74394654d3c41cb6910ed0d621204f0d8e6a26dd10d7ad7a9d2168e1e48a'),(3,'kkMIdeJbgBDp1cnIdQ02dPZAHc03p0','2026-04-17 11:26:04.786970','read write',1,8,'2026-04-17 01:26:04.787357','2026-04-17 01:26:04.787369',NULL,NULL,'8e5a5d2a3938a95db6a111cf1cfd0178aa4638f33bcedde97e7cdf16f7dd6d69');
/*!40000 ALTER TABLE `oauth2_provider_accesstoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_provider_application`
--

DROP TABLE IF EXISTS `oauth2_provider_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth2_provider_application` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` varchar(100) NOT NULL,
  `redirect_uris` longtext NOT NULL,
  `client_type` varchar(32) NOT NULL,
  `authorization_grant_type` varchar(44) NOT NULL,
  `client_secret` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `skip_authorization` tinyint(1) NOT NULL,
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NOT NULL,
  `algorithm` varchar(5) NOT NULL,
  `post_logout_redirect_uris` longtext NOT NULL,
  `hash_client_secret` tinyint(1) NOT NULL,
  `allowed_origins` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_id` (`client_id`),
  KEY `oauth2_provider_appl_user_id_79829054_fk_medconnec` (`user_id`),
  KEY `oauth2_provider_application_client_secret_53133678` (`client_secret`),
  CONSTRAINT `oauth2_provider_appl_user_id_79829054_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_provider_application`
--

LOCK TABLES `oauth2_provider_application` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_application` DISABLE KEYS */;
INSERT INTO `oauth2_provider_application` VALUES (1,'iYbA2m7iAfO5iPtcFjdi2bDz4MZmelvgFf0whxAT','','confidential','password','pbkdf2_sha256$1200000$Uzaol8qpI9kZdlx4JWHx0G$4lZU/g+5p8D7uHjKHr723ijEuR+6JGnvgr5/af9gKe8=','MedConnectApp',1,0,'2026-04-17 01:10:48.624845','2026-04-17 01:10:48.624875','','',1,'');
/*!40000 ALTER TABLE `oauth2_provider_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_provider_devicegrant`
--

DROP TABLE IF EXISTS `oauth2_provider_devicegrant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth2_provider_devicegrant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `device_code` varchar(100) NOT NULL,
  `user_code` varchar(100) NOT NULL,
  `scope` varchar(64) DEFAULT NULL,
  `interval` int NOT NULL,
  `expires` datetime(6) NOT NULL,
  `status` varchar(64) NOT NULL,
  `client_id` varchar(100) NOT NULL,
  `last_checked` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_code` (`device_code`),
  UNIQUE KEY `oauth2_provider_devicegrant_unique_device_code` (`device_code`),
  KEY `oauth2_provider_devi_user_id_1cec5156_fk_medconnec` (`user_id`),
  KEY `oauth2_provider_devicegrant_client_id_229dd06d` (`client_id`),
  CONSTRAINT `oauth2_provider_devi_user_id_1cec5156_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_provider_devicegrant`
--

LOCK TABLES `oauth2_provider_devicegrant` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_devicegrant` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth2_provider_devicegrant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_provider_grant`
--

DROP TABLE IF EXISTS `oauth2_provider_grant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth2_provider_grant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `expires` datetime(6) NOT NULL,
  `redirect_uri` longtext NOT NULL,
  `scope` longtext NOT NULL,
  `application_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NOT NULL,
  `code_challenge` varchar(128) NOT NULL,
  `code_challenge_method` varchar(10) NOT NULL,
  `nonce` varchar(255) NOT NULL,
  `claims` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `oauth2_provider_gran_application_id_81923564_fk_oauth2_pr` (`application_id`),
  KEY `oauth2_provider_grant_user_id_e8f62af8_fk_medconnectapp_user_id` (`user_id`),
  CONSTRAINT `oauth2_provider_gran_application_id_81923564_fk_oauth2_pr` FOREIGN KEY (`application_id`) REFERENCES `oauth2_provider_application` (`id`),
  CONSTRAINT `oauth2_provider_grant_user_id_e8f62af8_fk_medconnectapp_user_id` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_provider_grant`
--

LOCK TABLES `oauth2_provider_grant` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_grant` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth2_provider_grant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_provider_idtoken`
--

DROP TABLE IF EXISTS `oauth2_provider_idtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth2_provider_idtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `jti` char(32) NOT NULL,
  `expires` datetime(6) NOT NULL,
  `scope` longtext NOT NULL,
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NOT NULL,
  `application_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jti` (`jti`),
  KEY `oauth2_provider_idto_application_id_08c5ff4f_fk_oauth2_pr` (`application_id`),
  KEY `oauth2_provider_idto_user_id_dd512b59_fk_medconnec` (`user_id`),
  CONSTRAINT `oauth2_provider_idto_application_id_08c5ff4f_fk_oauth2_pr` FOREIGN KEY (`application_id`) REFERENCES `oauth2_provider_application` (`id`),
  CONSTRAINT `oauth2_provider_idto_user_id_dd512b59_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_provider_idtoken`
--

LOCK TABLES `oauth2_provider_idtoken` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_idtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth2_provider_idtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_provider_refreshtoken`
--

DROP TABLE IF EXISTS `oauth2_provider_refreshtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth2_provider_refreshtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `access_token_id` bigint DEFAULT NULL,
  `application_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NOT NULL,
  `revoked` datetime(6) DEFAULT NULL,
  `token_family` char(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `access_token_id` (`access_token_id`),
  UNIQUE KEY `oauth2_provider_refreshtoken_token_revoked_af8a5134_uniq` (`token`,`revoked`),
  KEY `oauth2_provider_refr_application_id_2d1c311b_fk_oauth2_pr` (`application_id`),
  KEY `oauth2_provider_refr_user_id_da837fce_fk_medconnec` (`user_id`),
  CONSTRAINT `oauth2_provider_refr_access_token_id_775e84e8_fk_oauth2_pr` FOREIGN KEY (`access_token_id`) REFERENCES `oauth2_provider_accesstoken` (`id`),
  CONSTRAINT `oauth2_provider_refr_application_id_2d1c311b_fk_oauth2_pr` FOREIGN KEY (`application_id`) REFERENCES `oauth2_provider_application` (`id`),
  CONSTRAINT `oauth2_provider_refr_user_id_da837fce_fk_medconnec` FOREIGN KEY (`user_id`) REFERENCES `medconnectapp_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_provider_refreshtoken`
--

LOCK TABLES `oauth2_provider_refreshtoken` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_refreshtoken` DISABLE KEYS */;
INSERT INTO `oauth2_provider_refreshtoken` VALUES (1,'wuLOyfaTmWLFSlKNjSBpYjpCLaob02',1,1,8,'2026-04-17 01:10:55.991725','2026-04-17 01:10:55.991780',NULL,'72938e14864a48c89aab40795574a6ad'),(2,'J3ILjdY8dhCL0S9d5WBYBlgyz39zew',2,1,1,'2026-04-17 01:25:47.368303','2026-04-17 01:25:47.368374',NULL,'cb16ee5b4fa24cbe8ff2316b54472435'),(3,'XfPX6saRpCLe9dIC1wHWJDYks1D6pe',3,1,8,'2026-04-17 01:26:04.788120','2026-04-17 01:26:04.788136',NULL,'d9ea3c1b6c13409195929879626fbb01');
/*!40000 ALTER TABLE `oauth2_provider_refreshtoken` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-17  8:40:41
