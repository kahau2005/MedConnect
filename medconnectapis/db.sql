-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '00546850-b2fe-11f0-8147-f26f4349a4ff:1-5570';

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
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add application',7,'add_application'),(22,'Can change application',7,'change_application'),(23,'Can delete application',7,'delete_application'),(24,'Can view application',7,'view_application'),(25,'Can add access token',6,'add_accesstoken'),(26,'Can change access token',6,'change_accesstoken'),(27,'Can delete access token',6,'delete_accesstoken'),(28,'Can view access token',6,'view_accesstoken'),(29,'Can add grant',9,'add_grant'),(30,'Can change grant',9,'change_grant'),(31,'Can delete grant',9,'delete_grant'),(32,'Can view grant',9,'view_grant'),(33,'Can add refresh token',11,'add_refreshtoken'),(34,'Can change refresh token',11,'change_refreshtoken'),(35,'Can delete refresh token',11,'delete_refreshtoken'),(36,'Can view refresh token',11,'view_refreshtoken'),(37,'Can add id token',10,'add_idtoken'),(38,'Can change id token',10,'change_idtoken'),(39,'Can delete id token',10,'delete_idtoken'),(40,'Can view id token',10,'view_idtoken'),(41,'Can add device grant',8,'add_devicegrant'),(42,'Can change device grant',8,'change_devicegrant'),(43,'Can delete device grant',8,'delete_devicegrant'),(44,'Can view device grant',8,'view_devicegrant'),(45,'Can add user',26,'add_user'),(46,'Can change user',26,'change_user'),(47,'Can delete user',26,'delete_user'),(48,'Can view user',26,'view_user'),(49,'Can add disease',14,'add_disease'),(50,'Can change disease',14,'change_disease'),(51,'Can delete disease',14,'delete_disease'),(52,'Can view disease',14,'view_disease'),(53,'Can add disease category',15,'add_diseasecategory'),(54,'Can change disease category',15,'change_diseasecategory'),(55,'Can delete disease category',15,'delete_diseasecategory'),(56,'Can view disease category',15,'view_diseasecategory'),(57,'Can add medicine category',19,'add_medicinecategory'),(58,'Can change medicine category',19,'change_medicinecategory'),(59,'Can delete medicine category',19,'delete_medicinecategory'),(60,'Can view medicine category',19,'view_medicinecategory'),(61,'Can add service',24,'add_service'),(62,'Can change service',24,'change_service'),(63,'Can delete service',24,'delete_service'),(64,'Can view service',24,'view_service'),(65,'Can add specialty',25,'add_specialty'),(66,'Can change specialty',25,'change_specialty'),(67,'Can delete specialty',25,'delete_specialty'),(68,'Can view specialty',25,'view_specialty'),(69,'Can add doctor',16,'add_doctor'),(70,'Can change doctor',16,'change_doctor'),(71,'Can delete doctor',16,'delete_doctor'),(72,'Can view doctor',16,'view_doctor'),(73,'Can add patient profile',20,'add_patientprofile'),(74,'Can change patient profile',20,'change_patientprofile'),(75,'Can delete patient profile',20,'delete_patientprofile'),(76,'Can view patient profile',20,'view_patientprofile'),(77,'Can add appointment',12,'add_appointment'),(78,'Can change appointment',12,'change_appointment'),(79,'Can delete appointment',12,'delete_appointment'),(80,'Can view appointment',12,'view_appointment'),(81,'Can add medicine',18,'add_medicine'),(82,'Can change medicine',18,'change_medicine'),(83,'Can delete medicine',18,'delete_medicine'),(84,'Can view medicine',18,'view_medicine'),(85,'Can add payment',21,'add_payment'),(86,'Can change payment',21,'change_payment'),(87,'Can delete payment',21,'delete_payment'),(88,'Can view payment',21,'view_payment'),(89,'Can add prescription',22,'add_prescription'),(90,'Can change prescription',22,'change_prescription'),(91,'Can delete prescription',22,'delete_prescription'),(92,'Can view prescription',22,'view_prescription'),(93,'Can add prescription detail',23,'add_prescriptiondetail'),(94,'Can change prescription detail',23,'change_prescriptiondetail'),(95,'Can delete prescription detail',23,'delete_prescriptiondetail'),(96,'Can view prescription detail',23,'view_prescriptiondetail'),(97,'Can add appointment service',13,'add_appointmentservice'),(98,'Can change appointment service',13,'change_appointmentservice'),(99,'Can delete appointment service',13,'delete_appointmentservice'),(100,'Can view appointment service',13,'view_appointmentservice'),(101,'Can add doctor schedule',17,'add_doctorschedule'),(102,'Can change doctor schedule',17,'change_doctorschedule'),(103,'Can delete doctor schedule',17,'delete_doctorschedule'),(104,'Can view doctor schedule',17,'view_doctorschedule'),(105,'Can add chat message',27,'add_chatmessage'),(106,'Can change chat message',27,'change_chatmessage'),(107,'Can delete chat message',27,'delete_chatmessage'),(108,'Can view chat message',27,'view_chatmessage'),(109,'Can add chat room',28,'add_chatroom'),(110,'Can change chat room',28,'change_chatroom'),(111,'Can delete chat room',28,'delete_chatroom'),(112,'Can view chat room',28,'view_chatroom'),(113,'Can add video call log',29,'add_videocalllog'),(114,'Can change video call log',29,'change_videocalllog'),(115,'Can delete video call log',29,'delete_videocalllog'),(116,'Can view video call log',29,'view_videocalllog'),(117,'Can add test result',30,'add_testresult'),(118,'Can change test result',30,'change_testresult'),(119,'Can delete test result',30,'delete_testresult'),(120,'Can view test result',30,'view_testresult');
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2026-04-15 10:24:32.146273','10','Hai BS',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',26,1),(2,'2026-04-17 01:13:42.954856','10','Bác sĩ Hai BS',1,'[{\"added\": {}}]',16,1),(3,'2026-04-17 01:15:08.940993','4','DoctorSchedule object (4)',1,'[{\"added\": {}}]',17,1),(4,'2026-04-17 01:59:19.997603','5','DoctorSchedule object (5)',1,'[{\"added\": {}}]',17,1),(5,'2026-04-17 03:26:57.374616','3','Mắt',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',25,1),(6,'2026-04-17 03:33:16.283516','2','Tai Mũi Họng',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',25,1),(7,'2026-04-17 03:33:26.849405','1','Nội tổng quát',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',25,1),(8,'2026-04-17 03:34:20.934471','4','Xương khớp',1,'[{\"added\": {}}]',25,1),(9,'2026-04-18 08:13:36.108196','6','DoctorSchedule object (6)',1,'[{\"added\": {}}]',17,1),(10,'2026-04-19 03:01:06.657161','11','Bác sĩ Hau BS',1,'[{\"added\": {}}]',16,1),(11,'2026-04-19 03:02:10.524165','7','DoctorSchedule object (7)',1,'[{\"added\": {}}]',17,1),(12,'2026-04-19 03:23:46.959946','5','Thần kinh',1,'[{\"added\": {}}]',25,1),(13,'2026-04-19 03:24:01.388719','6','Hô hấp',1,'[{\"added\": {}}]',25,1),(14,'2026-04-19 03:24:16.903552','7','Ngoại tiêu hóa',1,'[{\"added\": {}}]',25,1),(15,'2026-04-19 03:24:31.194650','8','Nội tiết',1,'[{\"added\": {}}]',25,1),(16,'2026-04-19 03:25:22.582123','9','Phục hồi chức năng',1,'[{\"added\": {}}]',25,1),(17,'2026-04-19 03:25:30.719588','10','Sơ sinh',1,'[{\"added\": {}}]',25,1),(18,'2026-04-19 03:26:06.576858','11','Lão',1,'[{\"added\": {}}]',25,1),(19,'2026-04-20 14:44:51.549969','11','Hau BS',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',26,1),(20,'2026-04-20 14:47:06.895338','8','DoctorSchedule object (8)',1,'[{\"added\": {}}]',17,1),(21,'2026-04-20 15:53:48.353538','8','DoctorSchedule object (8)',2,'[{\"changed\": {\"fields\": [\"Start time\"]}}]',17,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(4,'contenttypes','contenttype'),(12,'medconnectapp','appointment'),(13,'medconnectapp','appointmentservice'),(27,'medconnectapp','chatmessage'),(28,'medconnectapp','chatroom'),(14,'medconnectapp','disease'),(15,'medconnectapp','diseasecategory'),(16,'medconnectapp','doctor'),(17,'medconnectapp','doctorschedule'),(18,'medconnectapp','medicine'),(19,'medconnectapp','medicinecategory'),(20,'medconnectapp','patientprofile'),(21,'medconnectapp','payment'),(22,'medconnectapp','prescription'),(23,'medconnectapp','prescriptiondetail'),(24,'medconnectapp','service'),(25,'medconnectapp','specialty'),(30,'medconnectapp','testresult'),(26,'medconnectapp','user'),(29,'medconnectapp','videocalllog'),(6,'oauth2_provider','accesstoken'),(7,'oauth2_provider','application'),(8,'oauth2_provider','devicegrant'),(9,'oauth2_provider','grant'),(10,'oauth2_provider','idtoken'),(11,'oauth2_provider','refreshtoken'),(5,'sessions','session');
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-04-15 10:01:04.470044'),(2,'contenttypes','0002_remove_content_type_name','2026-04-15 10:01:04.523173'),(3,'auth','0001_initial','2026-04-15 10:01:04.705845'),(4,'auth','0002_alter_permission_name_max_length','2026-04-15 10:01:04.742224'),(5,'auth','0003_alter_user_email_max_length','2026-04-15 10:01:04.747367'),(6,'auth','0004_alter_user_username_opts','2026-04-15 10:01:04.752264'),(7,'auth','0005_alter_user_last_login_null','2026-04-15 10:01:04.757322'),(8,'auth','0006_require_contenttypes_0002','2026-04-15 10:01:04.759963'),(9,'auth','0007_alter_validators_add_error_messages','2026-04-15 10:01:04.765300'),(10,'auth','0008_alter_user_username_max_length','2026-04-15 10:01:04.772375'),(11,'auth','0009_alter_user_last_name_max_length','2026-04-15 10:01:04.779323'),(12,'auth','0010_alter_group_name_max_length','2026-04-15 10:01:04.791218'),(13,'auth','0011_update_proxy_permissions','2026-04-15 10:01:04.797205'),(14,'auth','0012_alter_user_first_name_max_length','2026-04-15 10:01:04.803543'),(15,'medconnectapp','0001_initial','2026-04-15 10:01:05.915261'),(16,'admin','0001_initial','2026-04-15 10:01:06.020405'),(17,'admin','0002_logentry_remove_auto_add','2026-04-15 10:01:06.028382'),(18,'admin','0003_logentry_add_action_flag_choices','2026-04-15 10:01:06.039811'),(19,'oauth2_provider','0001_initial','2026-04-15 10:01:06.594932'),(20,'oauth2_provider','0002_auto_20190406_1805','2026-04-15 10:01:06.690869'),(21,'oauth2_provider','0003_auto_20201211_1314','2026-04-15 10:01:06.744498'),(22,'oauth2_provider','0004_auto_20200902_2022','2026-04-15 10:01:07.106976'),(23,'oauth2_provider','0005_auto_20211222_2352','2026-04-15 10:01:07.190217'),(24,'oauth2_provider','0006_alter_application_client_secret','2026-04-15 10:01:07.221448'),(25,'oauth2_provider','0007_application_post_logout_redirect_uris','2026-04-15 10:01:07.276738'),(26,'oauth2_provider','0008_alter_accesstoken_token','2026-04-15 10:01:07.291089'),(27,'oauth2_provider','0009_add_hash_client_secret','2026-04-15 10:01:07.358698'),(28,'oauth2_provider','0010_application_allowed_origins','2026-04-15 10:01:07.407272'),(29,'oauth2_provider','0011_refreshtoken_token_family','2026-04-15 10:01:07.458553'),(30,'oauth2_provider','0012_add_token_checksum','2026-04-15 10:01:07.691209'),(31,'oauth2_provider','0013_alter_application_authorization_grant_type_device','2026-04-15 10:01:07.799522'),(32,'sessions','0001_initial','2026-04-15 10:01:07.833577'),(33,'medconnectapp','0002_alter_appointment_diagnosis','2026-04-15 10:10:57.113507'),(34,'medconnectapp','0003_alter_user_avatar','2026-04-15 10:20:18.705425'),(35,'medconnectapp','0004_chatroom_videocalllog_chatmessage','2026-04-17 01:07:16.045414'),(36,'medconnectapp','0005_remove_medicine_category_delete_medicinecategory','2026-04-17 02:25:54.255981'),(37,'medconnectapp','0006_medicinecategory_alter_doctor_background_and_more','2026-04-17 02:30:17.884577'),(38,'medconnectapp','0007_alter_patientprofile_user','2026-04-18 08:12:11.925265'),(39,'medconnectapp','0008_alter_appointment_status_testresult','2026-04-21 04:36:13.936384');
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_appointment`
--

LOCK TABLES `medconnectapp_appointment` WRITE;
/*!40000 ALTER TABLE `medconnectapp_appointment` DISABLE KEYS */;
INSERT INTO `medconnectapp_appointment` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','SCHEDULED','2026-04-16 08:00:00.000000','Khám sức khỏe','Mệt mỏi','Đợi khám','2026-04-16 08:00:00.000000',1,1,4),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','COMPLETED','2026-04-15 09:00:00.000000','Đau họng','Ho, rát họng','Đã kê đơn thuốc','2026-04-15 09:00:00.000000',2,3,5),(3,0,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','CANCELED','2026-04-17 08:00:00.000000','Mờ mắt','Nhức mắt','Bệnh nhân bận đột xuất',NULL,3,1,6),(4,1,'2026-04-17 01:16:33.855010','2026-04-17 01:29:41.317752','COMPLETED','2026-04-17 08:00:00.000000',NULL,NULL,NULL,NULL,8,1,10),(5,1,'2026-04-17 01:59:24.830589','2026-04-17 01:59:24.830609','COMPLETED','2026-04-20 14:57:30.289479',NULL,NULL,NULL,'2026-04-18 08:00:00.000000',8,1,10),(6,1,'2026-04-18 07:11:24.244240','2026-04-18 07:11:24.244269','COMPLETED','2026-04-20 14:57:30.289479',NULL,NULL,NULL,'2026-04-18 08:15:00.000000',8,1,10),(8,1,'2026-04-18 10:23:12.194890','2026-04-18 10:23:12.194916','SCHEDULED','2026-04-20 14:57:30.289479',NULL,NULL,NULL,'2026-04-19 08:00:00.000000',8,1,10),(10,1,'2026-04-20 14:47:12.386953','2026-04-21 16:11:44.359283','PENDING','2026-04-21 08:00:00.000000',NULL,NULL,NULL,'2026-04-21 08:00:00.000000',10,1,11),(15,1,'2026-04-20 15:56:03.993609','2026-04-22 03:39:02.568111','COMPLETED','2026-04-21 08:15:00.000000',NULL,NULL,NULL,'2026-04-21 08:15:00.000000',10,1,11);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_appointmentservice`
--

LOCK TABLES `medconnectapp_appointmentservice` WRITE;
/*!40000 ALTER TABLE `medconnectapp_appointmentservice` DISABLE KEYS */;
INSERT INTO `medconnectapp_appointmentservice` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',1,150000.00,2,1),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',1,200000.00,2,2),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',1,150000.00,1,1),(4,1,'2026-04-21 04:22:56.840538','2026-04-22 04:10:00.897237',1,150000.00,10,1);
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
INSERT INTO `medconnectapp_doctor` VALUES (4,'10 năm kinh nghiệm nội khoa tại BV Chợ Rẫy',1),(5,'5 năm kinh nghiệm chuyên khoa Tai Mũi Họng',2),(6,'Bác sĩ chuyên khoa II Mắt',3),(10,'5 năm kinh nghiệm',2),(11,'10 năm kinh nghiệm',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_doctorschedule`
--

LOCK TABLES `medconnectapp_doctorschedule` WRITE;
/*!40000 ALTER TABLE `medconnectapp_doctorschedule` DISABLE KEYS */;
INSERT INTO `medconnectapp_doctorschedule` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','2026-04-16 08:00:00.000000',4,15,4),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','2026-04-16 13:00:00.000000',4,15,5),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','2026-04-17 08:00:00.000000',4,15,6),(4,1,'2026-04-17 01:15:08.940098','2026-04-17 01:15:08.940124','2026-04-17 07:30:00.000000',5,15,10),(5,1,'2026-04-17 01:59:19.995223','2026-04-17 01:59:19.995265','2026-04-18 07:30:00.000000',5,15,10),(6,1,'2026-04-18 08:13:36.107533','2026-04-18 08:13:36.107551','2026-04-19 08:00:00.000000',8,15,10),(7,1,'2026-04-19 03:02:10.522070','2026-04-19 03:02:10.522133','2026-04-20 07:00:00.000000',10,15,11),(8,1,'2026-04-20 14:47:06.892691','2026-04-20 15:53:48.351260','2026-04-21 06:00:00.000000',10,15,11);
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
  `category_id` bigint DEFAULT NULL,
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
INSERT INTO `medconnectapp_medicine` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Amoxicillin 500mg',300,5000.00,'Viên','2027-12-31',1),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Paracetamol 500mg',859,2000.00,'Viên','2028-06-30',2),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','Vitamin C 1000mg',984,3000.00,'Viên','2026-10-15',3);
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
INSERT INTO `medconnectapp_patientprofile` VALUES (1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',1,'MALE','1990-05-10',65.5,170,'Không','Không','O','Quận 1, TP.HCM'),(1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',2,'FEMALE','1995-08-15',50,160,'Phấn hoa','Không','A','Quận 3, TP.HCM'),(1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',3,'MALE','1988-12-20',72,175,'Hải sản','Dạ dày','B','Quận 7, TP.HCM'),(1,'2026-04-18 08:16:36.224894','2026-04-22 04:42:06.705562',8,'MALE','2005-10-26',50,160,'đậu phộng, hải sản, phấn hoa',NULL,'A',NULL),(1,'2026-04-21 16:53:14.323727','2026-04-21 16:53:14.323767',10,'MALE','2005-10-26',80,170,NULL,NULL,'O',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_prescription`
--

LOCK TABLES `medconnectapp_prescription` WRITE;
/*!40000 ALTER TABLE `medconnectapp_prescription` DISABLE KEYS */;
INSERT INTO `medconnectapp_prescription` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','DISPENSED',2),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','PENDING',1),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000','PENDING',3),(4,1,'2026-04-17 02:05:44.263104','2026-04-17 04:41:49.935307','DISPENSED',4),(5,1,'2026-04-18 07:24:08.363249','2026-04-18 07:38:31.299280','DISPENSED',6),(7,1,'2026-04-18 07:41:24.939471','2026-04-18 07:41:24.939516','PENDING',6),(8,1,'2026-04-18 10:23:41.479685','2026-04-18 10:23:41.479723','PENDING',6),(9,1,'2026-04-18 10:40:55.307398','2026-04-18 10:40:55.307433','PENDING',8),(10,1,'2026-04-20 16:34:31.864807','2026-04-20 16:34:31.864827','PENDING',10),(12,1,'2026-04-21 16:26:56.385381','2026-04-21 16:26:56.385424','PENDING',15);
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_prescriptiondetail`
--

LOCK TABLES `medconnectapp_prescriptiondetail` WRITE;
/*!40000 ALTER TABLE `medconnectapp_prescriptiondetail` DISABLE KEYS */;
INSERT INTO `medconnectapp_prescriptiondetail` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',10,1,2,5,5000.00,'AFTER_MEAL',1,1),(2,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',10,1,2,5,2000.00,'AFTER_MEAL',2,1),(3,1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',20,1,1,20,3000.00,'BEFORE_MEAL',3,2),(4,1,'2026-04-17 02:17:42.820304','2026-04-17 02:17:42.820352',14,1,2,7,5000.00,'AFTER_MEAL',1,4),(5,1,'2026-04-17 02:45:35.144551','2026-04-17 02:45:35.144595',14,1,2,7,2000.00,'AFTER_MEAL',2,4),(6,1,'2026-04-17 02:45:35.157307','2026-04-17 02:45:35.157354',4,1,1,4,3000.00,'AFTER_MEAL',3,4),(7,1,'2026-04-18 07:29:46.572065','2026-04-18 07:29:46.572147',14,1,2,7,2000.00,'AFTER_MEAL',2,5),(18,1,'2026-04-18 12:12:49.500183','2026-04-18 14:15:54.337657',100,1,2,33,2000.00,'BEFORE_MEAL',2,9),(19,1,'2026-04-18 12:12:49.501854','2026-04-18 12:12:49.501896',100,1,1,22,3000.00,'AFTER_MEAL',3,9),(20,1,'2026-04-18 12:15:49.682573','2026-04-18 12:15:49.682596',99,1,2,33,5000.00,'BEFORE_MEAL',1,9),(25,1,'2026-04-18 16:15:43.308436','2026-04-18 16:16:52.501094',2,1,2,1,2000.00,'BEFORE_MEAL',2,9),(26,1,'2026-04-18 16:20:51.040143','2026-04-18 16:20:51.040216',2,1,2,1,3000.00,'BEFORE_MEAL',3,9),(27,1,'2026-04-20 16:36:19.696024','2026-04-20 16:36:19.696045',14,1,2,7,3000.00,'BEFORE_MEAL',3,10),(28,1,'2026-04-20 16:40:21.714626','2026-04-20 16:40:21.714657',7,1,1,7,2000.00,'AFTER_MEAL',2,10),(29,1,'2026-04-20 16:40:21.716690','2026-04-20 16:40:21.716721',7,1,1,7,5000.00,'BEFORE_MEAL',1,10),(30,1,'2026-04-21 04:43:49.466200','2026-04-21 04:43:49.466242',30,1,1,7,2000.00,'AFTER_MEAL',2,10),(31,1,'2026-04-21 16:27:09.636078','2026-04-21 16:27:09.636109',94,1,1,94,5000.00,'AFTER_MEAL',1,12);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_specialty`
--

LOCK TABLES `medconnectapp_specialty` WRITE;
/*!40000 ALTER TABLE `medconnectapp_specialty` DISABLE KEYS */;
INSERT INTO `medconnectapp_specialty` VALUES (1,1,'2026-04-15 10:16:56.000000','2026-04-17 03:33:24.677605','Nội tổng quát','Khám các bệnh lý nội khoa cơ bản','image/upload/v1776396806/fec8pammvssecbdpf08i.png'),(2,1,'2026-04-15 10:16:56.000000','2026-04-17 03:33:13.244613','Tai Mũi Họng','Chuyên khám và điều trị Tai Mũi Họng','image/upload/v1776396795/wdey9rel2mkaz5jlb9ms.png'),(3,1,'2026-04-15 10:16:56.000000','2026-04-17 03:26:54.052082','Mắt','Khám và đo khúc xạ mắt','image/upload/v1776396416/op8zrf2s56fuzc42xwxi.png'),(4,1,'2026-04-17 03:34:20.932604','2026-04-17 03:34:20.932664','Xương khớp','Điều trị các bệnh liên quan về xương khớp','image/upload/Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png'),(5,1,'2026-04-19 03:23:46.958668','2026-04-19 03:23:46.958711','Thần kinh','','image/upload/Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png'),(6,1,'2026-04-19 03:24:01.387088','2026-04-19 03:24:01.387144','Hô hấp','','image/upload/Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png'),(7,1,'2026-04-19 03:24:16.902381','2026-04-19 03:24:16.902414','Ngoại tiêu hóa','','image/upload/Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png'),(8,1,'2026-04-19 03:24:31.193379','2026-04-19 03:24:31.193412','Nội tiết','','image/upload/Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png'),(9,1,'2026-04-19 03:25:22.580125','2026-04-19 03:25:22.580187','Phục hồi chức năng','','image/upload/Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png'),(10,1,'2026-04-19 03:25:30.718270','2026-04-19 03:25:30.718306','Sơ sinh','','image/upload/Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png'),(11,1,'2026-04-19 03:26:06.575228','2026-04-19 03:26:06.575283','Lão','','image/upload/Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png');
/*!40000 ALTER TABLE `medconnectapp_specialty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medconnectapp_testresult`
--

DROP TABLE IF EXISTS `medconnectapp_testresult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medconnectapp_testresult` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `result_type` varchar(20) NOT NULL,
  `result_data` longtext,
  `conclusion` longtext,
  `appointment_service_id` bigint NOT NULL,
  `tested_by_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointment_service_id` (`appointment_service_id`),
  KEY `medconnectapp_testre_tested_by_id_bd365c6c_fk_medconnec` (`tested_by_id`),
  CONSTRAINT `medconnectapp_testre_appointment_service__0376debd_fk_medconnec` FOREIGN KEY (`appointment_service_id`) REFERENCES `medconnectapp_appointmentservice` (`id`),
  CONSTRAINT `medconnectapp_testre_tested_by_id_bd365c6c_fk_medconnec` FOREIGN KEY (`tested_by_id`) REFERENCES `medconnectapp_doctor` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_testresult`
--

LOCK TABLES `medconnectapp_testresult` WRITE;
/*!40000 ALTER TABLE `medconnectapp_testresult` DISABLE KEYS */;
INSERT INTO `medconnectapp_testresult` VALUES (1,1,'2026-04-21 05:39:36.861799','2026-04-21 05:39:36.861826','BLOOD','Hemoglobin: 13.8 g/dL','Bình thường',4,11);
/*!40000 ALTER TABLE `medconnectapp_testresult` ENABLE KEYS */;
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
  `phone` varchar(10) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medconnectapp_user`
--

LOCK TABLES `medconnectapp_user` WRITE;
/*!40000 ALTER TABLE `medconnectapp_user` DISABLE KEYS */;
INSERT INTO `medconnectapp_user` VALUES (1,'pbkdf2_sha256$1200000$mvPPCgjXVNowgpLmmgIUTV$RRkHClitqsqWhPk6S53hIN0DC6RZ5CUZgoO34UY6PTQ=',1,'admin','','','',1,'2026-04-15 10:06:26.634238','2026-04-15 10:06:26.634262',1,'ADMIN','',NULL),(2,'patient123',0,'patient1','Nguyễn','Văn A','patient1@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'PATIENT','0901111111',NULL),(3,'patient123',0,'patient2','Trần','Thị B','patient2@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'PATIENT','0902222222',NULL),(4,'patient123',0,'patient3','Lê','Văn C','patient3@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'PATIENT','0903333333',NULL),(5,'doctor123',0,'doctor1','Phạm','Bác Sĩ D','doctor1@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'DOCTOR','0904444444',NULL),(6,'doctor123',0,'doctor2','Hoàng','Bác Sĩ E','doctor2@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'DOCTOR','0905555555',NULL),(7,'doctor123',0,'doctor3','Vũ','Bác Sĩ F','doctor3@gmail.com',1,'2026-04-15 10:16:56.000000','2026-04-15 10:16:56.000000',0,'DOCTOR','0906666666',NULL),(8,'pbkdf2_sha256$1200000$Eeh4sRSz3q5W1rEWGhyqQQ$uleN2xaEfmPl8G4TeyF5o67b1H4Vnc5AQ/Pr6oLwu3Q=',0,'hau','Hau','Pham','hau@gmail.com',1,'2026-04-15 10:17:55.064532','2026-04-15 10:17:55.064563',0,'PATIENT','0987654321','image/upload/v1776248274/d4outkeghzi4x3tsuclc.jpg'),(10,'pbkdf2_sha256$1200000$rmFI3OBofICClGdnVPw1lZ$CbvRfyU2lPeZStqAXtYuhmG+jK5UY+GwaVvi/CLSSrY=',0,'bshai','Hai','BS','bshai@gmail.com',1,'2026-04-15 10:22:03.495070','2026-04-15 10:24:32.141094',0,'DOCTOR','0123456789','image/upload/d4outkeghzi4x3tsuclc.jpg'),(11,'pbkdf2_sha256$1200000$OOlK8VVl8LdmYX8VbKaBoo$FNPUbq/grqaVKiKQ5/zvC4JVRTtIMYk+p1DBx0fWEk8=',0,'bshau','Hau','BS','bshau@gmail.com',1,'2026-04-19 03:00:39.786233','2026-04-20 14:44:51.543103',0,'DOCTOR','0123456789','image/upload/d4outkeghzi4x3tsuclc.jpg');
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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_provider_accesstoken`
--

LOCK TABLES `oauth2_provider_accesstoken` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_accesstoken` DISABLE KEYS */;
INSERT INTO `oauth2_provider_accesstoken` VALUES (1,'SWhX25vFY6ZwqMbqq9LcCnbxJNFxA2','2026-04-17 11:10:55.977135','read write',1,8,'2026-04-17 01:10:55.978278','2026-04-17 01:10:55.978291',NULL,NULL,'1d43defb2756f83f2b56c3ae168549ecd5416ae419084211a744eac8e608c28d'),(2,'nTaoVlXoDGwgMQrSpWyQAuMm1h93KH','2026-04-17 11:25:47.364730','read write',1,1,'2026-04-17 01:25:47.365780','2026-04-17 01:25:47.365824',NULL,NULL,'b8ae74394654d3c41cb6910ed0d621204f0d8e6a26dd10d7ad7a9d2168e1e48a'),(3,'kkMIdeJbgBDp1cnIdQ02dPZAHc03p0','2026-04-17 11:26:04.786970','read write',1,8,'2026-04-17 01:26:04.787357','2026-04-17 01:26:04.787369',NULL,NULL,'8e5a5d2a3938a95db6a111cf1cfd0178aa4638f33bcedde97e7cdf16f7dd6d69'),(4,'dDUKfrtLvMv8AiU84homaByyZ7UHam','2026-04-17 12:05:38.401219','read write',1,10,'2026-04-17 02:05:38.401968','2026-04-17 02:05:38.401987',NULL,NULL,'7d132fccfe86f00ee5afeab1c72079ae29d36b5c88d5c28bffb9db59d6cfcea8'),(5,'ZezlHWrld83oO1wz93JCauWuzzqllm','2026-04-17 13:46:11.820361','read write',1,8,'2026-04-17 03:46:11.821159','2026-04-17 03:46:11.821177',NULL,NULL,'cadcbe351d6ed6a97d6e936fd31d0d54c5d9e7b0e6b532f3859fca50445cbe12'),(6,'frYkZsIPBLQoeZUwCQeSmQjmE1n98h','2026-04-17 14:08:22.375414','read write',1,10,'2026-04-17 04:08:22.376175','2026-04-17 04:08:22.376195',NULL,NULL,'4011544eb8d682ffe30cb3a3f96c750b923ab45a9b8e719da64506a30c3aa830'),(7,'jWNFphOBSawF1upJefr3sC9GKVTKtc','2026-04-17 14:10:05.665194','read write',1,8,'2026-04-17 04:10:05.665930','2026-04-17 04:10:05.665943',NULL,NULL,'ecf815bb44aa5a6e28689f967783e4c01d6b5f787c7f2359c76b89a4e92efec1'),(8,'QRMPvfElJXp8P7G1XTkcwD2d3HkX5q','2026-04-18 17:09:36.553069','read write',1,8,'2026-04-18 07:09:36.553845','2026-04-18 07:09:36.554440',NULL,NULL,'185d266eb5122e36f25d7d38c91e2265691eb434c49d056dafe906e5968ff8bd'),(9,'xIsTK2owPUiFsEHNKBbTS6VrwZ7OeE','2026-04-18 17:11:48.236584','read write',1,10,'2026-04-18 07:11:48.236909','2026-04-18 07:11:48.236915',NULL,NULL,'55544b0d26ce6d4c4427887ab98193e3d341a7fa80f595af6b94237d6b97de36'),(10,'Unao395fWRS1y9hyk4i4Zb1IyzjsCt','2026-04-18 17:34:50.726335','read write',1,1,'2026-04-18 07:34:50.726843','2026-04-18 07:34:50.726853',NULL,NULL,'2f38cf371c87c0a271a14c2428faf0cea65e9a846a868e513a4cc44c74a6621f'),(11,'AC53nIpqjyrFWmD87OpyfFZADEqaXW','2026-04-18 17:34:51.844907','read write',1,1,'2026-04-18 07:34:51.845256','2026-04-18 07:34:51.845263',NULL,NULL,'04f3bd3cbc555c3e82804277dde0e7cea904cc8309c97bacdea365ca90f8fa9f'),(12,'eP3Rv5AdddE2WSahYMGKHbfz8f0Ytu','2026-04-18 18:15:50.953082','read write',1,8,'2026-04-18 08:15:50.953522','2026-04-18 08:15:50.953531',NULL,NULL,'76d39167907a6dba24743e5881382fc979162a4e34787121f4add3959a8fe553'),(13,'w7zGgF9O65uECple0gw1iMOzsvpbuT','2026-04-18 18:23:35.058546','read write',1,10,'2026-04-18 08:23:35.059051','2026-04-18 08:23:35.059062',NULL,NULL,'f12dd43e89ff9eb2e2c86134198bfa399a24dea2b2a90101fbd5169627118327'),(14,'DOfsT0CIBHafvWOUwXCIapvHGoX9Mi','2026-04-18 20:22:53.747070','read write',1,8,'2026-04-18 10:22:53.747528','2026-04-18 10:22:53.747537',NULL,NULL,'794300f873a97db843a3f831fa755b94f86cd0c253d144f5d5c40cd2a70fdb58'),(15,'cpEfaoI5WyF5o9935jedc0nih1rFhv','2026-04-18 20:23:33.392136','read write',1,10,'2026-04-18 10:23:33.392737','2026-04-18 10:23:33.392749',NULL,NULL,'73e1b0615832cdc70d3799f195ca5ee7b50cdc873d10b657a27e0d15a5a3d9b1'),(16,'vc1A8uD6xgFWYdX0j8k4EaWzhuSMqA','2026-04-18 20:36:55.781305','read write',1,8,'2026-04-18 10:36:55.781996','2026-04-18 10:36:55.782007',NULL,NULL,'c2b54b7ded86510ba0fac57b7a5725487329ee09cf281ded7c0abbb5fd974984'),(17,'vL4cr8oJxeos1MBoJD0LUxAUk2x0Mk','2026-04-18 21:30:01.494361','read write',1,10,'2026-04-18 11:30:01.494919','2026-04-18 11:30:01.494930',NULL,NULL,'c1aa9c1036148891d63ff9ca79e9f44d0e49ab8fcd960bee7704a29f32816455'),(18,'T48aWCGksy8guUVK7dwcgvZke2FCeA','2026-04-19 12:58:51.865563','read write',1,8,'2026-04-19 02:58:51.866937','2026-04-19 02:58:51.866976',NULL,NULL,'5139f22ad6758246a9478cec7bb6d0ae8f458667dc57c93552fc8b8c511bc06a'),(19,'y4W3SFMvgYEuRGf1EeRV8m38Ur6WR0','2026-04-19 12:59:27.143958','read write',1,10,'2026-04-19 02:59:27.144345','2026-04-19 02:59:27.144356',NULL,NULL,'ebb5ed2f341aefabc2147251a7477d7806234abcddda273819bb7d60dcbf8e74'),(20,'1BZTRbMyfs2JNWVkekRsUJ16LxhIeV','2026-04-20 01:17:56.359808','read write',1,10,'2026-04-19 15:17:56.361007','2026-04-19 15:17:56.361036',NULL,NULL,'2235528334014307b120a97d9371b5e2064feca14fc456692d0d3cdec427a4bb'),(21,'vMLwVkmfzVWkcctl6S2KLPZ2UlQwtD','2026-04-20 01:18:38.992695','read write',1,8,'2026-04-19 15:18:38.993036','2026-04-19 15:18:38.993042',NULL,NULL,'bfc17c2a0be1573dfdbc3e13585c0375737a9717c38a494613df896c8ebbb8cd'),(22,'pa7adfLZRftoc4t1yrNk2ywoo9IQNQ','2026-04-21 00:31:28.398531','read write',1,10,'2026-04-20 14:31:28.399252','2026-04-20 14:31:28.399277',NULL,NULL,'cfac852836b123b026b0946d080fd47154c458c2356e0c524377fbe258a5f98b'),(23,'shKwMAKl7GckwwRhJO6dKabRt4sing','2026-04-21 00:31:40.337208','read write',1,8,'2026-04-20 14:31:40.337731','2026-04-20 14:31:40.337744',NULL,NULL,'7493dd9b534ed116f0477f2cd918e0c1848177efba29da8999b19a5e15e0f532'),(24,'VNYKGCXY8Sarze358Lzs697vm8BPsK','2026-04-21 00:41:36.641902','read write',1,10,'2026-04-20 14:41:36.642665','2026-04-20 14:41:36.642684',NULL,NULL,'8bc04c8e0c4774d8c71aa08f7ebb6f788c879db2476c7802b69a02d08d42da87'),(25,'lIQ3QKagkw9psb8NH5IRZC70QjOLq6','2026-04-21 01:56:48.780986','read write',1,8,'2026-04-20 15:56:48.781649','2026-04-20 15:56:48.781662',NULL,NULL,'8ad99de3629bf0a8eb722f0026c1eb7ed834716951ec316fdf3df74c9e5fa87c'),(26,'jbJEGZeIRUhAjQ5lZZkAtE9unfq7Oq','2026-04-21 02:34:27.230144','read write',1,11,'2026-04-20 16:34:27.230895','2026-04-20 16:34:27.230913',NULL,NULL,'4e832767542b32db1167d5f7bfa032c9ff5f6852595e23b1edec66fca69cf3b3'),(27,'GYIR6a9pR8oNdkbtelOvsvA0SSjTMS','2026-04-21 02:46:27.407100','read write',1,8,'2026-04-20 16:46:27.407567','2026-04-20 16:46:27.407575',NULL,NULL,'1b5fc1c179942a41c16bcf2f6772a735c8b237b705623f5ea41bb9eeb653bfd7'),(28,'Q3yt0IOeHAHzz7m4rP691ce8mMfeA2','2026-04-21 02:53:55.066160','read write',1,10,'2026-04-20 16:53:55.066649','2026-04-20 16:53:55.066658',NULL,NULL,'3facc6abaebb8754014614c3020b839d53f7f5a66ce3b6e001d0e1673a168ee1'),(29,'jrvbFG1olWCxipmjhD6WbpN8YfySyv','2026-04-21 13:07:30.499953','read write',1,10,'2026-04-21 03:07:30.500713','2026-04-21 03:07:30.500731',NULL,NULL,'c674c69e5f4a685946940810a4141b7037930b1ad6bca6c3aad3ce1615b41f10'),(30,'AWJcG3kNafWE3LwaQoPbSYPqpQmAdw','2026-04-21 13:08:51.574790','read write',1,11,'2026-04-21 03:08:51.575185','2026-04-21 03:08:51.575190',NULL,NULL,'b4625402b2b9eee8a24647d17027b0a9e7996233093e53641c3905e8fea889e3'),(31,'je2dOhVNWxT8h52dBzFQgk5kYbSZRi','2026-04-21 13:10:24.154329','read write',1,10,'2026-04-21 03:10:24.154856','2026-04-21 03:10:24.154868',NULL,NULL,'ca4e083df2762a4608b46d8fe695b259d6897b25116df435e49a9d94ebc59a37'),(32,'En0bsqQAMSep2VJetu1f649zT6aBMO','2026-04-21 14:07:20.446209','read write',1,11,'2026-04-21 04:07:20.446728','2026-04-21 04:07:20.446738',NULL,NULL,'51e81efb175fa50e3003b28808396fe3e2d263ff1bae76f9a2de44fb12d41ef3'),(33,'xGkyZMnnxR85OQiUh1VMDrZ9XeTN6o','2026-04-22 01:46:44.246682','read write',1,11,'2026-04-21 15:46:44.247150','2026-04-21 15:46:44.247158',NULL,NULL,'7d2423771ac596d716c5baed960741efba274660fabf265e24129f9e174018f9'),(34,'VvmxNMOUaGnunYekujHU80B8quQYGz','2026-04-22 02:10:50.794556','read write',1,10,'2026-04-21 16:10:50.795316','2026-04-21 16:10:50.795335',NULL,NULL,'b0229f90ecea2d889b720a2a2818b1561cffc99eee171abe6f720f4a4d884bb8'),(35,'mUJrfd3Rfmy3jPdUukj9ct07UvLb5Y','2026-04-22 02:17:26.333117','read write',1,11,'2026-04-21 16:17:26.333618','2026-04-21 16:17:26.333627',NULL,NULL,'297671cf8b711fe3f1caa4f1643e7812111a03a2601dcc643172108c4cd86782'),(36,'2Ggy5IcA62GJZnBzCzzZhhBhYLr82V','2026-04-22 02:40:10.325362','read write',1,10,'2026-04-21 16:40:10.326094','2026-04-21 16:40:10.326113',NULL,NULL,'352e255b88541653d4eb4a44b60aee64465f3e6f7f1e0e49afb4eb4a65e241f6'),(37,'aFTwWULxcj59WuuQsgnu8TaTz9pdpt','2026-04-22 13:38:57.272936','read write',1,10,'2026-04-22 03:38:57.273663','2026-04-22 03:38:57.273681',NULL,NULL,'dffee4e73447e657e2d73f8a3cf2322aa888d5d8170c68601985bb47b0d144c7'),(38,'CYZXlN5mAK8xdvXJ2yl262xw1AWjK1','2026-04-22 14:06:15.716151','read write',1,11,'2026-04-22 04:06:15.716598','2026-04-22 04:06:15.716606',NULL,NULL,'e33a94b0d9e0170fc2bc40c4c58fedc4c0feed3d661068a22f75513f53505474'),(39,'72rvkPomYXNxgZi1Sz4u4kfFUuFkeH','2026-04-22 14:24:57.328464','read write',1,11,'2026-04-22 04:24:57.329196','2026-04-22 04:24:57.329209',NULL,NULL,'481003ed3ecee9112e60fb948eb730a0cdc0a99248f18fd5684f3162ddd535ff'),(40,'HH3fl8YQE2O19jVv21Mt03XMu5IwVf','2026-04-22 14:26:13.059586','read write',1,8,'2026-04-22 04:26:13.060093','2026-04-22 04:26:13.060105',NULL,NULL,'c0ad54be7d53e536b5c657f4f4c1be3a14a51f2135dc7210d9e6610bb89b27a2'),(41,'5FCyi5TQKiaFoJmhwvQLcYOteV6nXp','2026-04-22 14:26:19.925583','read write',1,10,'2026-04-22 04:26:19.925899','2026-04-22 04:26:19.925905',NULL,NULL,'029e97debe6a463c9fdf7ecb74efcf40ab2c48d104b4dd9fd97e9096aaf54634'),(42,'ogjMlBpnL3EUKArFk16O39s8y14Mhp','2027-04-22 04:27:35.466816','read write',1,10,'2026-04-22 04:27:35.467596','2026-04-22 04:27:35.467615',NULL,NULL,'27c6e0101a1943a27064c6d11f709be5d2d1b911deaa837287493852df7cf4ca'),(43,'SeZYWVFCsw2vKTihlFKzEvF2a5WYs4','2027-04-22 04:27:39.985551','read write',1,8,'2026-04-22 04:27:39.986066','2026-04-22 04:27:39.986077',NULL,NULL,'b9cf46188fb066aca5ccf591b23921a2253298eb136016f55a6de835839042f3'),(44,'M4kEDUl452YLdh8VQTZmsxK6zTNhId','2027-04-22 04:38:24.257481','read write',1,10,'2026-04-22 04:38:24.258259','2026-04-22 04:38:24.258289',NULL,NULL,'cc3ae64c90b681d62b5213a50ccdcd372c02e8d8f9fc6ae9e19fe13c517bd1cb'),(45,'GPV7K2yl5ZqnQ8FU8XzIkEHEgjx0jg','2027-04-22 04:38:29.717341','read write',1,8,'2026-04-22 04:38:29.718219','2026-04-22 04:38:29.718247',NULL,NULL,'e5beb1810ab9412ecfe7a0668ddcaebfeacdf4b9e6de5b4a0e473f0a286f6c43'),(46,'ycqsAW4gk58jd63JwgnzcmlN3xN63k','2027-04-22 04:38:58.526634','read write',1,8,'2026-04-22 04:38:58.527118','2026-04-22 04:38:58.527129',NULL,NULL,'c3a42935d272a368407dae079e9ebfeceba3067ed6d06465df24ba61de9d9e1a'),(47,'9tnXCmRrAAqnUenjbeLMcGCGl76Fg6','2027-04-22 04:39:03.021248','read write',1,10,'2026-04-22 04:39:03.021547','2026-04-22 04:39:03.021553',NULL,NULL,'1defd0c790e3b2b01a1d57934d76a352c5b843179754b094e5c065da6af1ec67'),(48,'hvJDlvjxtqxLW4TIKhHn75arwhqI7R','2027-04-22 04:39:05.649435','read write',1,1,'2026-04-22 04:39:05.649872','2026-04-22 04:39:05.649884',NULL,NULL,'20489cc8ef536fd0e7eeb023eb768bdbbe410067ccb85be407553b8710f59240'),(49,'UlQKdJlUMpKzp1DD3UzDOfsiYitT9g','2027-04-22 05:44:23.840948','read write',1,10,'2026-04-22 05:44:23.841278','2026-04-22 05:44:23.841285',NULL,NULL,'3c83b0f18da922995783b28dbb00984bbd1305965b94f0b387004069434ce744'),(50,'2Raumsznf3HBAAAnm0t0eaRlF0x1mT','2027-04-22 05:44:24.142148','read write',1,10,'2026-04-22 05:44:24.142464','2026-04-22 05:44:24.142471',NULL,NULL,'e08f7a61b21ef692578d08d42cb205c8f6c1cf3c4978ade2a2d07d56cee39bc7'),(51,'GgQN2dWNiu2wV5mJPgkuliVKXwR1hv','2027-04-22 05:44:29.429046','read write',1,11,'2026-04-22 05:44:29.429556','2026-04-22 05:44:29.429567',NULL,NULL,'8093a69f7ecbc9d337da6ffc99c4d41707c312ac3f8ef4063c600d29b3c5f1f0'),(52,'f98etSoe3YQT4pyaNSwEL4eqq8G6YN','2027-04-22 05:49:13.017987','read write',1,8,'2026-04-22 05:49:13.018289','2026-04-22 05:49:13.018295',NULL,NULL,'49172bcf1e93fa36c275e439e66a28f8710e9f0b35a51c0b8abf4963cf7361a0'),(53,'ITf6XzPv8nVJDGRZY9ZVEqBxKg6UAU','2027-04-22 05:49:28.538599','read write',1,10,'2026-04-22 05:49:28.539383','2026-04-22 05:49:28.539414',NULL,NULL,'a0e055c423d082c47f01a98133f3f1111d6176e8496a15aa8fc8454f08de714f');
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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_provider_refreshtoken`
--

LOCK TABLES `oauth2_provider_refreshtoken` WRITE;
/*!40000 ALTER TABLE `oauth2_provider_refreshtoken` DISABLE KEYS */;
INSERT INTO `oauth2_provider_refreshtoken` VALUES (1,'wuLOyfaTmWLFSlKNjSBpYjpCLaob02',1,1,8,'2026-04-17 01:10:55.991725','2026-04-17 01:10:55.991780',NULL,'72938e14864a48c89aab40795574a6ad'),(2,'J3ILjdY8dhCL0S9d5WBYBlgyz39zew',2,1,1,'2026-04-17 01:25:47.368303','2026-04-17 01:25:47.368374',NULL,'cb16ee5b4fa24cbe8ff2316b54472435'),(3,'XfPX6saRpCLe9dIC1wHWJDYks1D6pe',3,1,8,'2026-04-17 01:26:04.788120','2026-04-17 01:26:04.788136',NULL,'d9ea3c1b6c13409195929879626fbb01'),(4,'AODVepIHeVaF5d7r1Zmf7QtT0GNmq1',4,1,10,'2026-04-17 02:05:38.404772','2026-04-17 02:05:38.404832',NULL,'9e9b578f1a844cb3871f72eb61549c63'),(5,'XNYul5F0JkKleGmwGDb9JERkVKZwJo',5,1,8,'2026-04-17 03:46:11.823304','2026-04-17 03:46:11.823346',NULL,'83b4183df4ca492aa96e2b52dc7a0e2a'),(6,'0WJ2UiwTbHu3RaNKgOoWTG3VDll7Kl',6,1,10,'2026-04-17 04:08:22.377994','2026-04-17 04:08:22.378022',NULL,'713c714df78240cf802b0951863aef7a'),(7,'wEfAG1rh8qSNuyvRNGGY4K85Wmequ0',7,1,8,'2026-04-17 04:10:05.667777','2026-04-17 04:10:05.667810',NULL,'2d799f1d8201477ebbf078ddc84910b9'),(8,'wiu591eWd50SG1pMJ5RC6xt73E6nms',8,1,8,'2026-04-18 07:09:36.567737','2026-04-18 07:09:36.567772',NULL,'38fba324e72a43c387b079caa574e59b'),(9,'RrR2M7rEVcSSWi5VOZRTNurY12Vdbo',9,1,10,'2026-04-18 07:11:48.238232','2026-04-18 07:11:48.238250',NULL,'d3414b32d0e34a67ad85d3c28d56de79'),(10,'yE2JDj5enX9HQ712LUtZrkIWdRmN9O',10,1,1,'2026-04-18 07:34:50.728474','2026-04-18 07:34:50.728493',NULL,'aeb254771df04cba85bc12893711db33'),(11,'1XPBtvDx7vyzZ1DxdHGWUUbiBg1EkL',11,1,1,'2026-04-18 07:34:51.846265','2026-04-18 07:34:51.846284',NULL,'8ec2205a6ebe484d913845d021d20519'),(12,'MeXDVzHw4IuZyepSO2kk8JazCJ41R6',12,1,8,'2026-04-18 08:15:50.954603','2026-04-18 08:15:50.954614',NULL,'d4bd6d6e22e44b95b8be389a655b49ae'),(13,'GCyiFXDFAaVKTeoA8r7Z5XaQDFVrDq',13,1,10,'2026-04-18 08:23:35.060329','2026-04-18 08:23:35.060348',NULL,'ee330607e7334b6293ac7dffa8b219ba'),(14,'lNZYAcj6ZpEhRHmdXMtH4aEIgThIrv',14,1,8,'2026-04-18 10:22:53.748346','2026-04-18 10:22:53.748357',NULL,'9321c512495b463cbefdd7917aacaa73'),(15,'aSSPvhD6f8VtQlvbvIgPciJRiM6QBU',15,1,10,'2026-04-18 10:23:33.394943','2026-04-18 10:23:33.395004',NULL,'d45142e0fd5847f997070194f2f71fd0'),(16,'VV0wAlKkwWXDzzk8yuC6Bk7Bk4pG7Y',16,1,8,'2026-04-18 10:36:55.782937','2026-04-18 10:36:55.782950',NULL,'d8607d1774cc46fb90d5dbb65dae60bf'),(17,'c3QLFVy0Kb0tPOX4yQSerzplFneqxW',17,1,10,'2026-04-18 11:30:01.496163','2026-04-18 11:30:01.496185',NULL,'23fb55d6da734f79bd0f2b856a7eb162'),(18,'heoConODPpQjDGrtV9VRLDRZr77OR1',18,1,8,'2026-04-19 02:58:51.882018','2026-04-19 02:58:51.882077',NULL,'7de5dde30eed4902ad80fc6616a9583c'),(19,'WdimtjjzZzThNMPeMSLwIQR9wS8K14',19,1,10,'2026-04-19 02:59:27.145539','2026-04-19 02:59:27.145559',NULL,'a33a9618be3e47d9a7e8335d5ea07c42'),(20,'De1oCuTm97r126BcYnGQf6f2EKfW7f',20,1,10,'2026-04-19 15:17:56.374947','2026-04-19 15:17:56.374979',NULL,'1b41590e4a154141a1139629d35d5cbc'),(21,'xJpkI2itLnZ4tpZNyZuQ4I9krxbDhJ',21,1,8,'2026-04-19 15:18:38.994277','2026-04-19 15:18:38.994291',NULL,'2f4ec9dbb1124813bc803f783ca27095'),(22,'1YWOQ4PA3mpyBxNhQVYhhNQUXL1CVE',22,1,10,'2026-04-20 14:31:28.406894','2026-04-20 14:31:28.406931',NULL,'2cbe45224fc04a628ceb70d08070af7b'),(23,'NpLj48PQ4UwlUzPSsPaWprkFHWzDLI',23,1,8,'2026-04-20 14:31:40.340484','2026-04-20 14:31:40.340534',NULL,'155c831efc5742dfa98cf4032c0e57fa'),(24,'iuaaYtU8WPgzYUVN7hGnfZvsVGzCDZ',24,1,10,'2026-04-20 14:41:36.644795','2026-04-20 14:41:36.644842',NULL,'6e3e56b3db6342b49958cd86a0908b72'),(25,'gpATIG1h1NlvW7pufY8ioKa4eINrVS',25,1,8,'2026-04-20 15:56:48.783841','2026-04-20 15:56:48.783871',NULL,'93918934310546a3bfb3f79564553b08'),(26,'oP3i3tgt4kGqYsezdOrHGEqWXZwWrP',26,1,11,'2026-04-20 16:34:27.233319','2026-04-20 16:34:27.233349',NULL,'44f74df463dc428fba370f39d57c9b54'),(27,'yfa6toIYnd2l4Y4PDOkt2hXBKIhx7A',27,1,8,'2026-04-20 16:46:27.409083','2026-04-20 16:46:27.409097',NULL,'d8602a200c424e14af22f3d979dd7fb4'),(28,'7lAflRPuSgzDM43ltJlAoewAa6otjm',28,1,10,'2026-04-20 16:53:55.068343','2026-04-20 16:53:55.068369',NULL,'dcc5619d43fd4dad8c36771952a646fa'),(29,'KMS7ZiWN6KMICfKkcbNuxmVruZQ0KO',29,1,10,'2026-04-21 03:07:30.507302','2026-04-21 03:07:30.507333',NULL,'b2e235728d0d4fb3b2b12cc69c84b64e'),(30,'daIhRMWjLGsdc85LgluMXdu2p4Qktg',30,1,11,'2026-04-21 03:08:51.576504','2026-04-21 03:08:51.576521',NULL,'1327e7e9ddcb4a9984e7c355ee382787'),(31,'LZtNQL9zVE78F1lgChCQi3jIWGviTZ',31,1,10,'2026-04-21 03:10:24.156640','2026-04-21 03:10:24.156668',NULL,'edd9470fcde04bafa4e2cb2ae76f7340'),(32,'vpAvYox1pJe4Sw66h12hVQ8TYpwnjK',32,1,11,'2026-04-21 04:07:20.457985','2026-04-21 04:07:20.458008',NULL,'720b63538614489c88e0893f27857525'),(33,'qrfxErq5qjyNWFyy661hF7sjbIUFYH',33,1,11,'2026-04-21 15:46:44.257413','2026-04-21 15:46:44.257434',NULL,'793cb5ea080743eaa0bc58e8ddfe4e77'),(34,'CTBITT7G0bH3Ww5nLN1Mqf9KFi62JU',34,1,10,'2026-04-21 16:10:50.797063','2026-04-21 16:10:50.797094',NULL,'0c751454d17b4797bec2c9faf81ac3ce'),(35,'PwpeQykFmlD5LZBN0EqQnqgxbpIsBY',35,1,11,'2026-04-21 16:17:26.334989','2026-04-21 16:17:26.335003',NULL,'75424ad4f9fd4cc498180460da851d19'),(36,'m3Y4XFUdTRI6QrkFH8DYk4aYrG6Qop',36,1,10,'2026-04-21 16:40:10.328052','2026-04-21 16:40:10.328080',NULL,'82f791f76e15483e977d021948799097'),(37,'UpNXUJxFlL6jwRgjLREOigO6sLWxxU',37,1,10,'2026-04-22 03:38:57.284879','2026-04-22 03:38:57.284912',NULL,'ab92f3060462471bb4287daaefa1a44d'),(38,'5grk7dNRpZoaNRXStF8cHun1Kh3HEf',38,1,11,'2026-04-22 04:06:15.717774','2026-04-22 04:06:15.717784',NULL,'e91a9f49cb744487b3f4ad3bc95eafa2'),(39,'TfR7LEKUM4haqc6eeowEkuPW81Epqk',39,1,11,'2026-04-22 04:24:57.331186','2026-04-22 04:24:57.331216',NULL,'de85f76dccf74dcf833544506c56629a'),(40,'wKy7xVOCj0wniL6GDbZfbPVLIau38T',40,1,8,'2026-04-22 04:26:13.061992','2026-04-22 04:26:13.062018',NULL,'215a252dab0c4d3c98c2332baf8c0aab'),(41,'0spWcK3SJEn3WQVHCuBhCOYXz2rJlD',41,1,10,'2026-04-22 04:26:19.927014','2026-04-22 04:26:19.927033',NULL,'540b712f2b294a3e8f3dfd85634b1f30'),(42,'Yj3S4tf2Bn28mcpcBM1arDuPXNCVZb',42,1,10,'2026-04-22 04:27:35.469592','2026-04-22 04:27:35.469649',NULL,'e2beff6756b0417dbee0e9e99a35a919'),(43,'mcCVQVSYa5Xkbr1pGhjQOdstNZuE5L',43,1,8,'2026-04-22 04:27:39.987876','2026-04-22 04:27:39.987905',NULL,'eb9ef79748584e7d87ce863fa7315598'),(44,'EhB8J3wzYX7bPhS4jvg36wkC9CdIHx',44,1,10,'2026-04-22 04:38:24.260201','2026-04-22 04:38:24.260250',NULL,'3b1602816b4346ac9bca4866a6373150'),(45,'jwrNHsLHi5SQXRvLk9ZZwjAg41q4A1',45,1,8,'2026-04-22 04:38:29.720075','2026-04-22 04:38:29.720116',NULL,'0dfe7e3b8e304fd38edc3277b191d92e'),(46,'My0vLL4S2UGOlBiurcmB9lQIzWZZuJ',46,1,8,'2026-04-22 04:38:58.529102','2026-04-22 04:38:58.529158',NULL,'7804c793115d4e308fdda8fa33aa90d9'),(47,'YgZn7U8Z8Cze030DVLbyKZkAs6vYp4',47,1,10,'2026-04-22 04:39:03.022422','2026-04-22 04:39:03.022434',NULL,'a872f3837053420aaa5da51af87074cd'),(48,'nNGNwBlUxWifVY8HqpVnkvVYwsQlWy',48,1,1,'2026-04-22 04:39:05.650952','2026-04-22 04:39:05.650967',NULL,'16925a709ada4046b5739197d6b9169f'),(49,'bdoGlhTllFAaz9dnc62A6tN04dptsC',49,1,10,'2026-04-22 05:44:23.842338','2026-04-22 05:44:23.842353',NULL,'516ede90af4c44178b42a9852adb7e30'),(50,'TeeA17B00zK6zSdkIt1NKUAMylCiEE',50,1,10,'2026-04-22 05:44:24.143652','2026-04-22 05:44:24.143664',NULL,'c36fe6d9f99444ffb788961c3adc84e9'),(51,'5lS1B2dEDaUqdqwYPa0XDxjFT8EyvK',51,1,11,'2026-04-22 05:44:29.431348','2026-04-22 05:44:29.431374',NULL,'05232493a2e042438b1549102dadd702'),(52,'QelaZOtl6tx1K6Bp5hwwdWz8tDtp5k',52,1,8,'2026-04-22 05:49:13.019351','2026-04-22 05:49:13.019362',NULL,'8bcc098b70194df78acce29fe89c1cba'),(53,'awBcaCyq4BNtUnLOCC7ms9MqYTA1nT',53,1,10,'2026-04-22 05:49:28.541569','2026-04-22 05:49:28.541611',NULL,'844b99951e0f409da9eb473bacbd2901');
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

-- Dump completed on 2026-04-23 11:29:52
