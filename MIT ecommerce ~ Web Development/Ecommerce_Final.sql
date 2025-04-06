SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;



SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';


DROP TABLE IF EXISTS `cart`;

CREATE TABLE `cart` (
  `Cart_ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int DEFAULT NULL,
  `Guest_ID` int DEFAULT NULL,
  `Total_Value` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`Cart_ID`),
  KEY `Guest_ID` (`Guest_ID`),
  KEY `cart_ibfk_2_idx` (`User_ID`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`Guest_ID`) REFERENCES `guest` (`Guest_ID`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=latin1;



LOCK TABLES `cart` WRITE;

INSERT INTO `cart` VALUES (229,38,NULL,1070000.00),(230,40,NULL,235000.00),(231,40,NULL,69000.00),(232,38,NULL,365000.00),(233,38,NULL,1240000.00),(234,38,NULL,270000.00);

UNLOCK TABLES;


DROP TABLE IF EXISTS `cart_item`;

CREATE TABLE `cart_item` (
  `Cart_ID` int NOT NULL,
  `Variant_ID` int NOT NULL,
  `Quantity` int DEFAULT NULL,
  `Item_Total_Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`Cart_ID`,`Variant_ID`),
  KEY `cart_item_ibfk_2_idx` (`Variant_ID`),
  CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`Cart_ID`) REFERENCES `cart` (`Cart_ID`),
  CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`Variant_ID`) REFERENCES `variant` (`Variant_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


LOCK TABLES `cart_item` WRITE;

INSERT INTO `cart_item` VALUES (229,10,3,570000.00),(229,11,2,500000.00),(230,9,1,220000.00),(230,29,2,15000.00),(231,37,2,60000.00),(231,42,1,9000.00),(232,12,1,350000.00),(232,29,2,15000.00),(233,4,2,340000.00),(233,14,3,900000.00),(234,14,3,900000.00),(234,32,3,270000.00);

UNLOCK TABLES;



DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `Category_ID` int NOT NULL AUTO_INCREMENT,
  `Category_Name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
-

LOCK TABLES `category` WRITE;

INSERT INTO `category` VALUES (1,'Mobile Phones'),(2,'Laptops'),(3,'TV'),(4,'Toys'),(5,'Tablets'),(6,'Refrigerators'),(7,'Gaming Consoles'),(8,'Smart Watches'),(9,'Mouse'),(10,'Keyboard');

UNLOCK TABLES;


DROP TABLE IF EXISTS `delivery`;

CREATE TABLE `delivery` (
  `City` varchar(20) NOT NULL,
  `Days` int DEFAULT NULL,
  PRIMARY KEY (`City`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


LOCK TABLES `delivery` WRITE;

INSERT INTO `delivery` VALUES ('Ampara',7),('Anuradhapura',7),('Badulla',7),('Batticaloa',7),('Colombo',5),('Galle',5),('Gampaha',7),('Hambonthota',7),('Jaffna',5),('Kaluthara ',7),('Kandy',5),('Kegalle',7),('Kilinochchi',7),('Kurunagala',7),('Mannar',7),('Matale',7),('Matara',7),('Monaragala',7),('Mullaitivu',7),('Nuwara-Eliya',7),('Polonnaruwa',7),('Puttalam',7),('Rathnapura',7),('Vavunia',7);

UNLOCK TABLES;



DROP TABLE IF EXISTS `guest`;

CREATE TABLE `guest` (
  `Guest_ID` int NOT NULL AUTO_INCREMENT,
  `Telephone_No` varchar(10) DEFAULT NULL,
  `Street_Address` varchar(50) DEFAULT NULL,
  `City` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Guest_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;


LOCK TABLES `guest` WRITE;

UNLOCK TABLES;


DROP TABLE IF EXISTS `inventory`;

CREATE TABLE `inventory` (
  `Variant_ID` int NOT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`Variant_ID`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`Variant_ID`) REFERENCES `variant` (`Variant_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


LOCK TABLES `inventory` WRITE;

INSERT INTO `inventory` VALUES (1,4),(2,6),(3,-1),(4,0),(5,3),(6,4),(7,0),(8,-1),(9,2),(10,0),(11,-1),(12,3),(13,4),(14,-2),(15,4),(16,4),(17,0),(18,-1),(19,4),(20,1),(21,4),(22,4),(23,4),(24,4),(25,3),(26,1),(27,4),(28,-1),(29,-2),(30,5),(31,3),(32,1),(33,0),(34,1),(35,-1),(36,0),(37,-3),(38,4),(39,0),(40,4),(41,4),(42,4);

UNLOCK TABLES;



DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `Order_ID` int NOT NULL AUTO_INCREMENT,
  `Cart_ID` int DEFAULT NULL,
  `Date_Of_Order` date DEFAULT NULL,
  `User_ID` int DEFAULT NULL,
  `Guest_ID` int DEFAULT NULL,
  `Payment_type` varchar(20) DEFAULT NULL,
  `Delivery_type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Order_ID`),
  KEY `order_ibfk_1_idx` (`Cart_ID`),
  KEY `order_ibfk_2_idx` (`User_ID`),
  KEY `order_ibfk_3_idx` (`Guest_ID`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`Cart_ID`) REFERENCES `cart` (`Cart_ID`),
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`),
  CONSTRAINT `order_ibfk_3` FOREIGN KEY (`Guest_ID`) REFERENCES `guest` (`Guest_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;


LOCK TABLES `order` WRITE;

INSERT INTO `order` VALUES (95,229,'2022-12-10',38,NULL,'Cash','Delivery'),(96,230,'2023-12-30',40,NULL,'Cash','Store_Pickup'),(97,231,'2023-01-01',40,NULL,'Card','Delivery'),(98,232,'2023-01-13',38,NULL,'Cash','Delivery'),(99,233,'2023-01-13',38,NULL,'Cash','Delivery'),(100,234,'2023-01-13',38,NULL,'Cash','Delivery');

UNLOCK TABLES;


DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `Product_ID` int NOT NULL AUTO_INCREMENT,
  `SKU` varchar(20) DEFAULT NULL,
  `Title` varchar(20) DEFAULT NULL,
  `Weight` decimal(7,2) DEFAULT NULL,
  `Category_ID` int DEFAULT NULL,
  `Subcategory_ID` int DEFAULT NULL,
  `Image` varchar(50) NOT NULL,
  `Description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`Product_ID`),
  KEY `Category_ID` (`Category_ID`),
  KEY `Subcategory_ID` (`Subcategory_ID`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`Category_ID`) REFERENCES `category` (`Category_ID`),
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`Subcategory_ID`) REFERENCES `subcategory` (`Subcategory_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;



INSERT INTO `product` VALUES (1,'K3150','iPhone8',202.00,1,1,'iphone8.jpg','A sleek, powerful smartphone with a 4.7-inch Retina HD display, Touch ID fingerprint sensor, 12MP camera, A11 Bionic chip, and 64GB or 256GB of storage. Water and dust resistant, supports wireless charging and runs on iOS 14.'),(2,'J3133','iPhoneX',174.00,1,1,'iphonex.jpg','A premium smartphone with a 5.8-inch Super Retina display, Face ID facial recognition, dual 12MP rear cameras, A11 Bionic chip, and 64GB or 256GB of storage. Water and dust resistant, supports wireless charging and runs on iOS 14.'),(3,'L5150','Samsung Galaxy A80',200.00,1,2,'samsung-galaxy-a80.jpg','A mid-range smartphone with a 6.7-inch Super AMOLED display, rotating triple camera, Qualcomm Snapdragon 730G processor, and 8GB of RAM. Also has an in-display fingerprint sensor and runs on Android 9.'),(4,'I4150','Asus Vivobook 15',1500.00,2,3,'asus_vivobook_15.jpg','A budget-friendly laptop with a 15.6-inch display, Intel Celeron N4000 processor, 4GB of RAM, and 64GB of eMMC storage. Has a slim and lightweight design.'),(5,'D3456','Dell XPS 13',1320.00,2,4,'DELL XPS 13.jpeg','A premium ultrabook with a 13.3-inch InfinityEdge display, Intel Core i5 or i7 processor, 8GB or 16GB of RAM, and 256GB or 512GB SSD storage. Has a sleek, aluminum design and long battery life.'),(6,'D7628','Dell Inspiron 14',1520.00,2,4,'DELL Inspiron 14.jpg','A budget-friendly laptop with a 14-inch HD display, AMD A9-9420 processor, 4GB of RAM, and 128GB of eMMC storage. Has a simple and functional design.'),(7,'A7845','Asus Zenbook 14',1100.00,2,3,'Asus Zenbook 14.jpg','A premium ultrabook with a 14-inch Full HD display, Intel Core i5 or i7 processor, 8GB or 16GB of RAM, and 512GB or 1TB SSD storage. Has a slim and lightweight design, with a backlit keyboard.'),(8,'S3426','Samsung Galaxy S21',202.00,1,2,'Samsung Galaxy S21.jpg',' A flagship smartphone with a 6.2-inch Dynamic AMOLED display, Triple rear camera, Exynos 2100 or Snapdragon 888 processor, and 8GB of RAM. Has 5G capabilities, an in-display fingerprint sensor and runs on Android 11.'),(9,'S0967','Sony Bravia',21000.00,3,5,'Sony Bravia.jpg','A high-end 4K TV with HDR compatibility, Android TV, and built-in WiFi. Available in various sizes.'),(10,'S4804','Sony X80K',10100.00,3,5,'Sony X80K.jpg','A 4K smart TV with HDR, X-Reality Pro, and Motionflow XR technology for an enhanced viewing experience. Has built-in WiFi and runs on Android TV.'),(11,'G3480','LG NanoCell',16300.00,3,6,'LG NanoCell.jpg','A line of 4K TVs with advanced color and contrast technology, providing more accurate and natural colors. Also has Smart TV capabilities with LG\'s webOS platform. Available in various sizes.'),(12,'G5093','LG CX',18000.00,3,6,'LG CX.jpg','A high-end 4K OLED TV with a sleek, minimalist design and advanced features such as AI ThinQ, LG\'s webOS platform and support for both Dolby Vision and Atmos. Available in various sizes.'),(13,'I6233','iPad Air',460.00,5,7,'iPad Air.jpg','A slim and powerful tablet from Apple with a 10.5-inch Retina display, A12 Bionic chip, and up to 256GB of storage. Runs on iOS 14 and has a Touch ID fingerprint sensor.'),(14,'I7888','iPad Mini',290.00,5,7,'iPad Mini.jpg','A compact and portable tablet from Apple with a 7.9-inch Retina display, A12 Bionic chip, and up to 256GB of storage. Runs on iOS 14 and has a Touch ID fingerprint sensor.'),(15,'I0916','iPad Pro',680.00,5,7,'iPad Pro.jpg','A high-end tablet from Apple with a 11-inch or 12.9-inch edge-to-edge Liquid Retina display, A12Z Bionic chip, and up to 1TB of storage. Runs on iOS 14 and has a Face ID facial recognition.'),(16,'S8905','Samsung Galxy Tab 7',280.00,5,8,'Samsung Galaxy Tab S7.jpg','A budget-friendly tablet from Samsung with a 7-inch display, Quad-core processor, 1GB of RAM, and 8GB of storage. Runs on Android and has a 2MP rear camera.'),(17,'S5090','Samsung Galaxy Tab A',420.00,5,8,'Samsung Galaxy Tab Active 3.jpg','A mid-range tablet from Samsung with a 8-inch or 10.1-inch display, Octa-core processor, 2GB of RAM, and 32GB of storage. Runs on Android and has a 5MP rear camera.'),(18,'L5665','LG LSXS26326S',99999.99,6,9,'LG LSXS26326S.jpg',' A side-by-side refrigerator with a 26 cu.ft. total capacity, Energy Star rating, and smart features like SmartThinQ and PrintProof finish.'),(19,'L3899','LG LTCS20220S',99999.99,6,9,'LG LTCS20220S.jpg','A top-freezer refrigerator with a 20 cu.ft. total capacity, Energy Star rating, and features like SmartThinQ and a door alarm.'),(20,'W7610','Whirpool WRT518SZ',82000.00,6,10,'Whirpool WRT518SZFW.jpg','A top-freezer refrigerator with a 18 cu.ft. total capacity and features such as Adaptive Defrost and EveryDrop Water Filtration.'),(21,'W9892','Whirpool WRT311FZ',84000.00,6,10,'Whirpool WRT311FZDW.jpg','A top-freezer refrigerator with a 11 cu.ft. total capacity and features such as Adaptive Defrost and EveryDrop Water Filtration.'),(22,'P4681','PlayStation 5',5700.00,7,11,'PlayStation 5.jpg','A next-generation gaming console from Sony with an ultra-fast SSD, 3D audio, and support for 4K and 8K gaming.'),(23,'P0928','PlayStation 4',3300.00,7,11,'PlayStation 4.jpg','A previous generation gaming console from Sony with a powerful processor and graphics card, and support for 1080p gaming.'),(24,'B6778','Xbox Series X',4400.00,7,12,'Xbox Series X.jpg',' A next-generation gaming console from Microsoft with an ultra-fast SSD, hardware-accelerated DirectX raytracing, and support for 4K and 8K gaming.'),(25,'B2097','Xbox series S',4300.00,7,12,'Xbox Series S.jpg','A next-generation gaming console from Microsoft with a compact design, an ultra-fast SSD, hardware-accelerated DirectX raytracing and support for 1440p gaming.'),(26,'R4563','Drone',320.00,4,13,'Drone.jpg','An unmanned aerial vehicle controlled remotely by a pilot. It can be used for aerial photography, videography, and other tasks.'),(27,'R7900','Remote Control Car',700.00,4,13,'RC Car.jpg',' A small, radio-controlled vehicle that can be operated by a remote control.'),(28,'B7819','Electronic Guitar',900.00,4,14,'Electronic Guitar.jpg','A guitar that can produce a wide range of sounds and effects, and can be connected to amplifiers and other devices.'),(29,'T5555','Electronic Violin',700.00,4,14,'Electronic Violin.jpg','A violin that can produce a wide range of sounds and effects, and can be connected'),(30,'A9027','Apple Watch SE',26.00,8,15,'Apple Watch SE.jpg',' A smartwatch from Apple with a Retina display, Heart Rate sensor, and a variety of health and fitness features. It runs on watchOS and has a variety of customizable watch faces and bands.'),(31,'G3890','Galaxy Watch 4',30.00,8,16,'Galaxy Watch 4.jpg','A smartwatch from Samsung with a 1.4-inch or 1.2-inch AMOLED display, Heart Rate sensor, and a variety of health and fitness features. It runs on Tizen and has a variety of customizable watch faces and bands. It also has GPS and 4G connectivity.'),(32,'G0962','Galaxy Watch 5',36.00,8,16,'Galaxy Watch 5.jpg','A smartwatch from Samsung with a 1.4-inch or 1.2-inch AMOLED display, Heart Rate sensor, and a variety of health and fitness features. It runs on Tizen and has a variety of customizable watch faces and bands. It also has GPS, 5ATM water resistance, and 4G connectivity.'),(33,'R1456','Razer Viper Ultimate',74.00,9,17,'Razer Viper Ultimate.jpg','A high-performance wireless gaming mouse with Razer\'s SpeedFlex cable for minimal drag, Razer\'s Focus+ optical sensor and Razer\'s Razer Chroma RGB lighting.'),(34,'R3478','Razer DeathAdder',82.00,9,17,'Razer DeathAdder.jpg','A popular gaming mouse with Razer\'s optical sensor, Razer Chroma RGB lighting and customizable macro buttons.'),(35,'L1209','Logitech G303',75.00,9,18,'Logitech G303.jpg','A gaming mouse with Logitech\'s HERO sensor, Logitech\'s RGB lighting and customizable macro buttons.'),(36,'L3621','Logitech G903',110.00,9,18,'Logitech G903.jpg',' A high-performance gaming mouse with Logitech\'s HERO sensor, Logitech\'s RGB lighting, customizable macro buttons and Logitech\'s PowerPlay wireless charging compatibility.'),(37,'R6709','Razer Huntsman',910.00,10,19,'Razer Huntsman.jpg','A gaming keyboard with Razer\'s Opto-mechanical switches, Razer\'s Chroma RGB lighting and customizable macro buttons.'),(38,'R3335','Razer BlackWidow',1030.00,10,19,'Razer BlackWidow.jpg','A gaming keyboard with Razer\'s mechanical switches, Razer\'s Chroma RGB lighting and customizable macro buttons.'),(39,'L3689','Logitech G613',1460.00,10,20,'Logitech G613.jpg','A gaming keyboard with Logitech\'s Romer-G mechanical switches, Logitech\'s customizable macro buttons and Logitech\'s LIGHTSPEED wireless technology.'),(40,'L9032','Logitech K400',1390.00,10,20,'Logitech K400.jpg','A wireless keyboard and touchpad combo with a compact and portable design and multi-language support.');

UNLOCK TABLES;



DROP TABLE IF EXISTS `product_variant`;

CREATE TABLE `product_variant` (
  `Product_ID` int NOT NULL,
  `Variant_ID` int NOT NULL,
  PRIMARY KEY (`Product_ID`,`Variant_ID`),
  KEY `product_variant_ibfk_1_idx` (`Variant_ID`),
  CONSTRAINT `product_variant_ibfk_1` FOREIGN KEY (`Variant_ID`) REFERENCES `variant` (`Variant_ID`),
  CONSTRAINT `product_variant_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




LOCK TABLES `product_variant` WRITE;

INSERT INTO `product_variant` VALUES (1,1),(1,2),(3,3),(2,4),(4,5),(4,6),(5,7),(6,8),(7,9),(8,10),(9,11),(10,12),(11,13),(12,14),(13,15),(14,16),(15,17),(16,18),(17,19),(18,20),(19,21),(20,22),(21,23),(22,24),(23,25),(24,26),(25,27),(26,28),(27,29),(28,30),(29,31),(30,32),(31,33),(32,34),(33,35),(34,36),(35,37),(36,38),(37,39),(38,40),(39,41),(40,42);

UNLOCK TABLES;


DROP TABLE IF EXISTS `subcategory`;

CREATE TABLE `subcategory` (
  `Subcategory_ID` int NOT NULL AUTO_INCREMENT,
  `Subcategory_Name` varchar(20) DEFAULT NULL,
  `Category_ID` int DEFAULT NULL,
  PRIMARY KEY (`Subcategory_ID`),
  KEY `Category_ID` (`Category_ID`),
  CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`Category_ID`) REFERENCES `category` (`Category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

LOCK TABLES `subcategory` WRITE;

INSERT INTO `subcategory` VALUES (1,'iPhone',1),(2,'Samsung',1),(3,'Asus',2),(4,'Dell',2),(5,'Sony',3),(6,'LG',3),(7,'iPad',5),(8,'Samsung',5),(9,'LG',6),(10,'Whirpool',6),(11,'PlayStation',7),(12,'Xbox',7),(13,'RC Vehicles',4),(14,'Musical Instruments',4),(15,'Apple Watch',8),(16,'Samsung Galaxy Watch',8),(17,'Razor',9),(18,'Logitec',9),(19,'Razor',10),(20,'Logitec',10);

UNLOCK TABLES;


DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `User_ID` int NOT NULL AUTO_INCREMENT,
  `User_Name` varchar(20) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `First_Name` varchar(20) DEFAULT NULL,
  `Last_Name` varchar(20) DEFAULT NULL,
  `Telephone_No` varchar(10) DEFAULT NULL,
  `Street_Address` varchar(50) DEFAULT NULL,
  `City` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

LOCK TABLES `user` WRITE;

INSERT INTO `user` VALUES (38,'Prasanjith','$2y$10$GJNFNGTf9tz5btKl7oCzxuDW2UkVs6nzSRzjMZUPhVTT.h6YFJ4Ti','Prasanjith','Lorensuhewa','0701597950','Hirimbura New Lane','Galle'),(39,'Isuru','$2y$10$vQ0L7CLlcHahlBvzOvh8QOBkFKeeXkVwLhePnGgQRqeE0Lz3CUuAK','Isuru','Jayawickrama','0776006846','No.655/4B, Athurugiriya Road, Kottawa','Colombo'),(40,'hpravija','$2y$10$J5Gs1Jhphp/S/YBmSBUJWuefUTJckpjDYpujwmnknmYr5.MVyZVY2','Ravija','Randinu','0703317600','No.41,Madapathala,Second lane','Galle');

UNLOCK TABLES;



DROP TABLE IF EXISTS `variant`;

CREATE TABLE `variant` (
  `Variant_ID` int NOT NULL,
  `Attribute` varchar(20) NOT NULL,
  `Value` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Variant_ID`,`Attribute`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


LOCK TABLES `variant` WRITE;

INSERT INTO `variant` VALUES (1,'Colour','Black'),(1,'Storage','64GB'),(1,'ZPrice','150000'),(2,'Colour','Black'),(2,'Storage','128GB'),(2,'ZPrice','170000'),(3,'Colour','Silver'),(3,'Storage','128GB'),(3,'ZPrice','120000'),(4,'Colour','White'),(4,'Storage','256GB'),(4,'ZPrice','170000'),(5,'Colour','Silver'),(5,'Processor','Intel Core i5 9100H'),(5,'RAM','16GB DDR4'),(5,'Storage','512GB SSD'),(5,'VGA','Intel Iris Graphics'),(5,'ZPrice','270000'),(6,'Colour','White'),(6,'Processor','AMD Ryzen 5 5500H'),(6,'RAM','8GB'),(6,'Storage','1TB HDD'),(6,'VGA','AMD Radeon Graphics'),(6,'ZPrice','210000'),(7,'Colour','Black'),(7,'Processor','Intel Core i7'),(7,'Ram','16GB'),(7,'Storage','1TB HDD'),(7,'VGA','Intel Iris Graphics'),(7,'ZPrice','170000'),(8,'Colour','Black'),(8,'Processor','Intel core i5'),(8,'Ram','8GB'),(8,'Storage','1TB'),(8,'VGA','Intel Iris Graphics'),(8,'ZPrice','210000'),(9,'Colour','Black'),(9,'Processor','Intel core i7'),(9,'Ram ','16GB'),(9,'Storage','1TB'),(9,'VGA','Intel Iris Graphics'),(9,'ZPrice','220000'),(10,'Colour','Black'),(10,'Storage','256GB'),(10,'ZPrice','190000'),(11,'Resolution','FullHD'),(11,'Size','50\"'),(11,'ZPrice','250000'),(12,'Resolution','UltraHD'),(12,'Size','55\"'),(12,'ZPrice','350000'),(13,'Resolution','UltraHD'),(13,'Size','55\"'),(13,'ZPrice','320000'),(14,'Resolution','FullHD'),(14,'Size','65\"'),(14,'ZPrice','300000'),(15,'Colour','Silver'),(15,'Generation','Fifth'),(15,'ZPrice','225000'),(16,'Colour','Silver'),(16,'Generation','Sixth'),(16,'ZPrice','208000'),(17,'Colour','Silver'),(17,'Generation','Fifth'),(17,'ZPrice','300000'),(18,'Colour','Black'),(18,'Storage','256GB'),(18,'ZPrice','360000'),(19,'Colour','Black'),(19,'Storage','128GB'),(19,'ZPrice','120000'),(20,'Capacity','207L'),(20,'Colour','Silver'),(20,'ZPrice','310000'),(21,'Capacity','307L'),(21,'Colour','Black'),(21,'ZPrice','450000'),(22,'Capacity','307L'),(22,'Colour','Black'),(22,'ZPrice','320000'),(23,'Capacity','277L'),(23,'Colour','Black'),(23,'ZPrice','290000'),(24,'Version','Standard'),(24,'ZPrice','260000'),(25,'Version','Slim'),(25,'ZPrice','130000'),(26,'Version','Standard'),(26,'ZPrice','250000'),(27,'Version','Standard'),(27,'ZPrice','150000'),(28,'Colour','Green'),(28,'ZPrice','15000'),(29,'Colour','Red'),(29,'ZPrice','7500'),(30,'Colour','Blue'),(30,'ZPrice','7000'),(31,'Colour','Blue'),(31,'ZPrice','8000'),(32,'Configuration','GPS+Cellular'),(32,'ZPrice','90000'),(33,'Version','Standard'),(33,'ZPrice','77000'),(34,'Version','Pro'),(34,'ZPrice','160000'),(35,'Version','Cyberpunk'),(35,'ZPrice','40000'),(36,'Version','V2'),(36,'ZPrice','16000'),(37,'Version','Shroud'),(37,'ZPrice','30000'),(38,'Version','Tenz'),(38,'ZPrice','35000'),(39,'Version','Tournement Edition'),(39,'ZPrice','42000'),(40,'Version','Tournement Edition'),(40,'ZPrice','30000'),(41,'Version','Wireless'),(41,'ZPrice','34000'),(42,'Version','Wireless'),(42,'ZPrice','9000');

UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
