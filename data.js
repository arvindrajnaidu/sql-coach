// Practice dataset. Generated once with a fixed seed so answers never change.
window.SEED_SQL = `
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  signup_date TEXT,
  plan TEXT,
  acquisition_source TEXT
);
INSERT INTO users VALUES (1,'Aisha','US','2024-06-12','free','referral');
INSERT INTO users VALUES (2,'Ben','India','2024-03-03','free','organic');
INSERT INTO users VALUES (3,'Chen','Canada','2024-06-22','free','ads');
INSERT INTO users VALUES (4,'Diego','US','2024-04-18','free','organic');
INSERT INTO users VALUES (5,'Elena','India','2024-02-25','pro','ads');
INSERT INTO users VALUES (6,'Farah','Canada','2024-01-07','free','ads');
INSERT INTO users VALUES (7,'Gabe',NULL,'2024-04-17','pro','ads');
INSERT INTO users VALUES (8,'Hana','US','2024-03-12','free','organic');
INSERT INTO users VALUES (9,'Ivan','India','2024-03-28','free','ads');
INSERT INTO users VALUES (10,'Jade','US','2024-03-27','free','organic');
INSERT INTO users VALUES (11,'Kofi','UK','2024-01-25','free','ads');
INSERT INTO users VALUES (12,'Lena','US','2024-03-08','enterprise','organic');
INSERT INTO users VALUES (13,'Mateo','US','2024-05-17','pro','organic');
INSERT INTO users VALUES (14,'Nina','India','2024-05-21','enterprise','ads');
INSERT INTO users VALUES (15,'Omar','India','2024-04-02','enterprise','organic');
INSERT INTO users VALUES (16,'Priya','India','2024-01-12','free','organic');
INSERT INTO users VALUES (17,'Quinn','US','2024-02-29','pro','referral');
INSERT INTO users VALUES (18,'Rosa','UK','2024-04-26','free','referral');
INSERT INTO users VALUES (19,'Sam',NULL,'2024-03-31','enterprise','referral');
INSERT INTO users VALUES (20,'Tara','US','2024-06-28','pro','ads');
INSERT INTO users VALUES (21,'Uma','India','2024-05-16','free','organic');
INSERT INTO users VALUES (22,'Victor','India','2024-04-07','enterprise','ads');
INSERT INTO users VALUES (23,'Wen','UK','2024-02-26','free','ads');
INSERT INTO users VALUES (24,'Xena','UK','2024-01-09','pro','referral');
INSERT INTO users VALUES (25,'Yusuf','India','2024-01-17','pro','referral');
INSERT INTO users VALUES (26,'Zoe','Brazil','2024-02-24','pro','organic');
INSERT INTO users VALUES (27,'Arjun','India','2024-02-06','free','ads');
INSERT INTO users VALUES (28,'Bella','Canada','2024-05-23','free','ads');
INSERT INTO users VALUES (29,'Carlos','Germany','2024-04-19','free','ads');
INSERT INTO users VALUES (30,'Dana','Canada','2024-02-05','pro','organic');
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  order_date TEXT,
  amount REAL,
  status TEXT
);
INSERT INTO orders VALUES (101,30,'2024-02-18',19.99,'completed');
INSERT INTO orders VALUES (102,7,'2024-08-04',19.99,'completed');
INSERT INTO orders VALUES (103,24,'2024-05-08',75.0,'completed');
INSERT INTO orders VALUES (104,21,'2024-05-19',19.99,'completed');
INSERT INTO orders VALUES (105,21,'2024-07-24',149.0,'completed');
INSERT INTO orders VALUES (106,17,'2024-04-10',15.5,'completed');
INSERT INTO orders VALUES (107,29,'2024-06-26',75.0,'completed');
INSERT INTO orders VALUES (108,20,'2024-07-26',99.0,'refunded');
INSERT INTO orders VALUES (109,20,'2024-08-18',29.99,'completed');
INSERT INTO orders VALUES (110,7,'2024-09-03',75.0,'pending');
INSERT INTO orders VALUES (111,24,'2024-04-01',15.5,'completed');
INSERT INTO orders VALUES (112,14,'2024-08-08',49.99,'completed');
INSERT INTO orders VALUES (113,22,'2024-04-28',19.99,'completed');
INSERT INTO orders VALUES (114,3,'2024-11-06',29.99,'completed');
INSERT INTO orders VALUES (115,19,'2024-08-19',29.99,'completed');
INSERT INTO orders VALUES (116,24,'2024-04-27',49.99,'pending');
INSERT INTO orders VALUES (117,30,'2024-03-28',99.0,'completed');
INSERT INTO orders VALUES (118,26,'2024-05-30',15.5,'refunded');
INSERT INTO orders VALUES (119,18,'2024-05-27',49.99,'completed');
INSERT INTO orders VALUES (120,13,'2024-05-23',75.0,'completed');
INSERT INTO orders VALUES (121,9,'2024-03-30',19.99,'completed');
INSERT INTO orders VALUES (122,2,'2024-05-01',19.99,'pending');
INSERT INTO orders VALUES (123,13,'2024-06-05',75.0,'completed');
INSERT INTO orders VALUES (124,26,'2024-06-28',49.99,'completed');
INSERT INTO orders VALUES (125,29,'2024-09-13',15.5,'completed');
INSERT INTO orders VALUES (126,19,'2024-07-14',49.99,'completed');
INSERT INTO orders VALUES (127,26,'2024-06-14',149.0,'completed');
INSERT INTO orders VALUES (128,18,'2024-05-10',19.99,'completed');
INSERT INTO orders VALUES (129,29,'2024-07-15',19.99,'completed');
INSERT INTO orders VALUES (130,8,'2024-07-28',15.5,'completed');
INSERT INTO orders VALUES (131,7,'2024-06-28',15.5,'completed');
INSERT INTO orders VALUES (132,3,'2024-10-14',75.0,'completed');
INSERT INTO orders VALUES (133,25,'2024-06-04',9.99,'pending');
INSERT INTO orders VALUES (134,30,'2024-04-06',29.99,'completed');
INSERT INTO orders VALUES (135,19,'2024-05-25',199.0,'pending');
INSERT INTO orders VALUES (136,7,'2024-07-24',9.99,'pending');
INSERT INTO orders VALUES (137,10,'2024-07-22',99.0,'completed');
INSERT INTO orders VALUES (138,29,'2024-09-09',15.5,'completed');
INSERT INTO orders VALUES (139,12,'2024-05-03',9.99,'completed');
INSERT INTO orders VALUES (140,21,'2024-06-01',149.0,'completed');
INSERT INTO orders VALUES (141,22,'2024-08-08',75.0,'pending');
INSERT INTO orders VALUES (142,20,'2024-08-08',9.99,'pending');
INSERT INTO orders VALUES (143,3,'2024-08-09',19.99,'completed');
INSERT INTO orders VALUES (144,26,'2024-04-25',199.0,'completed');
INSERT INTO orders VALUES (145,22,'2024-06-10',9.99,'completed');
INSERT INTO orders VALUES (146,17,'2024-07-28',75.0,'completed');
INSERT INTO orders VALUES (147,10,'2024-05-19',149.0,'completed');
INSERT INTO orders VALUES (148,15,'2024-05-06',99.0,'completed');
INSERT INTO orders VALUES (149,30,'2024-02-24',9.99,'completed');
INSERT INTO orders VALUES (150,22,'2024-05-03',19.99,'completed');
INSERT INTO orders VALUES (151,20,'2024-09-04',29.99,'pending');
INSERT INTO orders VALUES (152,3,'2024-08-24',149.0,'completed');
INSERT INTO orders VALUES (153,18,'2024-09-13',99.0,'completed');
INSERT INTO orders VALUES (154,25,'2024-06-01',9.99,'completed');
INSERT INTO orders VALUES (155,21,'2024-08-01',19.99,'pending');
INSERT INTO orders VALUES (156,6,'2024-03-15',19.99,'refunded');
INSERT INTO orders VALUES (157,29,'2024-09-08',29.99,'completed');
INSERT INTO orders VALUES (158,24,'2024-03-03',149.0,'completed');
INSERT INTO orders VALUES (159,25,'2024-03-25',75.0,'completed');
INSERT INTO orders VALUES (160,2,'2024-03-27',199.0,'refunded');
CREATE TABLE feature_usage (
  event_id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  feature TEXT,
  event_date TEXT,
  minutes_used INTEGER
);
INSERT INTO feature_usage VALUES (1,2,'export','2024-03-03',50);
INSERT INTO feature_usage VALUES (2,6,'export','2024-05-21',11);
INSERT INTO feature_usage VALUES (3,27,'dashboard','2024-04-26',46);
INSERT INTO feature_usage VALUES (4,16,'dashboard','2024-05-11',8);
INSERT INTO feature_usage VALUES (5,3,'search','2024-10-20',58);
INSERT INTO feature_usage VALUES (6,6,'dashboard','2024-05-09',54);
INSERT INTO feature_usage VALUES (7,14,'dashboard','2024-08-03',10);
INSERT INTO feature_usage VALUES (8,16,'dashboard','2024-03-17',20);
INSERT INTO feature_usage VALUES (9,14,'ai_assistant','2024-09-13',56);
INSERT INTO feature_usage VALUES (10,2,'export','2024-06-26',14);
INSERT INTO feature_usage VALUES (11,25,'search','2024-04-01',7);
INSERT INTO feature_usage VALUES (12,14,'dashboard','2024-08-28',57);
INSERT INTO feature_usage VALUES (13,16,'search','2024-05-19',10);
INSERT INTO feature_usage VALUES (14,9,'reports','2024-07-16',52);
INSERT INTO feature_usage VALUES (15,29,'search','2024-05-11',2);
INSERT INTO feature_usage VALUES (16,7,'export','2024-07-20',51);
INSERT INTO feature_usage VALUES (17,16,'search','2024-06-11',56);
INSERT INTO feature_usage VALUES (18,27,'reports','2024-06-12',18);
INSERT INTO feature_usage VALUES (19,7,'search','2024-07-26',7);
INSERT INTO feature_usage VALUES (20,15,'dashboard','2024-07-22',55);
INSERT INTO feature_usage VALUES (21,18,'reports','2024-05-24',53);
INSERT INTO feature_usage VALUES (22,17,'export','2024-04-14',53);
INSERT INTO feature_usage VALUES (23,29,'reports','2024-08-08',15);
INSERT INTO feature_usage VALUES (24,1,'reports','2024-09-04',26);
INSERT INTO feature_usage VALUES (25,13,'ai_assistant','2024-06-21',5);
INSERT INTO feature_usage VALUES (26,28,'export','2024-06-27',42);
INSERT INTO feature_usage VALUES (27,19,'search','2024-05-21',54);
INSERT INTO feature_usage VALUES (28,20,'dashboard','2024-08-09',8);
INSERT INTO feature_usage VALUES (29,10,'dashboard','2024-04-18',17);
INSERT INTO feature_usage VALUES (30,2,'dashboard','2024-03-16',28);
INSERT INTO feature_usage VALUES (31,14,'ai_assistant','2024-08-22',21);
INSERT INTO feature_usage VALUES (32,16,'dashboard','2024-05-17',8);
INSERT INTO feature_usage VALUES (33,15,'dashboard','2024-07-26',13);
INSERT INTO feature_usage VALUES (34,10,'search','2024-04-01',28);
INSERT INTO feature_usage VALUES (35,1,'ai_assistant','2024-08-17',35);
INSERT INTO feature_usage VALUES (36,25,'search','2024-06-01',48);
INSERT INTO feature_usage VALUES (37,25,'export','2024-03-26',28);
INSERT INTO feature_usage VALUES (38,3,'export','2024-09-15',40);
INSERT INTO feature_usage VALUES (39,13,'ai_assistant','2024-08-09',8);
INSERT INTO feature_usage VALUES (40,27,'export','2024-06-24',33);
INSERT INTO feature_usage VALUES (41,11,'search','2024-05-25',21);
INSERT INTO feature_usage VALUES (42,15,'export','2024-06-30',36);
INSERT INTO feature_usage VALUES (43,6,'search','2024-03-25',43);
INSERT INTO feature_usage VALUES (44,15,'search','2024-06-27',58);
INSERT INTO feature_usage VALUES (45,7,'dashboard','2024-07-04',20);
INSERT INTO feature_usage VALUES (46,15,'ai_assistant','2024-06-11',1);
INSERT INTO feature_usage VALUES (47,11,'reports','2024-04-06',28);
INSERT INTO feature_usage VALUES (48,29,'dashboard','2024-07-02',42);
INSERT INTO feature_usage VALUES (49,13,'search','2024-07-15',29);
INSERT INTO feature_usage VALUES (50,25,'dashboard','2024-03-28',31);
INSERT INTO feature_usage VALUES (51,29,'ai_assistant','2024-08-12',48);
INSERT INTO feature_usage VALUES (52,7,'dashboard','2024-07-10',19);
INSERT INTO feature_usage VALUES (53,19,'search','2024-06-23',40);
INSERT INTO feature_usage VALUES (54,13,'ai_assistant','2024-05-28',49);
INSERT INTO feature_usage VALUES (55,9,'export','2024-06-22',15);
INSERT INTO feature_usage VALUES (56,29,'reports','2024-05-14',2);
INSERT INTO feature_usage VALUES (57,2,'search','2024-04-03',40);
INSERT INTO feature_usage VALUES (58,28,'search','2024-06-01',27);
INSERT INTO feature_usage VALUES (59,24,'reports','2024-05-13',46);
INSERT INTO feature_usage VALUES (60,26,'search','2024-04-19',26);
INSERT INTO feature_usage VALUES (61,9,'search','2024-04-15',45);
INSERT INTO feature_usage VALUES (62,1,'ai_assistant','2024-10-04',56);
INSERT INTO feature_usage VALUES (63,28,'dashboard','2024-09-13',50);
INSERT INTO feature_usage VALUES (64,16,'reports','2024-03-29',52);
INSERT INTO feature_usage VALUES (65,26,'search','2024-05-06',4);
INSERT INTO feature_usage VALUES (66,20,'ai_assistant','2024-07-29',8);
INSERT INTO feature_usage VALUES (67,17,'ai_assistant','2024-03-18',30);
INSERT INTO feature_usage VALUES (68,25,'dashboard','2024-05-07',39);
INSERT INTO feature_usage VALUES (69,13,'search','2024-08-21',40);
INSERT INTO feature_usage VALUES (70,30,'dashboard','2024-06-01',28);
INSERT INTO feature_usage VALUES (71,30,'dashboard','2024-06-25',29);
INSERT INTO feature_usage VALUES (72,7,'ai_assistant','2024-07-21',31);
INSERT INTO feature_usage VALUES (73,17,'ai_assistant','2024-04-03',16);
INSERT INTO feature_usage VALUES (74,30,'export','2024-05-21',50);
INSERT INTO feature_usage VALUES (75,28,'search','2024-07-28',41);
INSERT INTO feature_usage VALUES (76,9,'search','2024-05-02',5);
INSERT INTO feature_usage VALUES (77,26,'reports','2024-04-06',18);
INSERT INTO feature_usage VALUES (78,13,'dashboard','2024-06-26',6);
INSERT INTO feature_usage VALUES (79,6,'reports','2024-03-20',25);
INSERT INTO feature_usage VALUES (80,26,'search','2024-03-20',14);
INSERT INTO feature_usage VALUES (81,3,'search','2024-08-14',22);
INSERT INTO feature_usage VALUES (82,20,'search','2024-08-26',4);
INSERT INTO feature_usage VALUES (83,8,'search','2024-06-26',25);
INSERT INTO feature_usage VALUES (84,28,'search','2024-08-05',2);
INSERT INTO feature_usage VALUES (85,28,'search','2024-08-04',31);
INSERT INTO feature_usage VALUES (86,1,'export','2024-10-10',20);
INSERT INTO feature_usage VALUES (87,28,'ai_assistant','2024-07-11',58);
INSERT INTO feature_usage VALUES (88,30,'dashboard','2024-04-23',48);
INSERT INTO feature_usage VALUES (89,27,'ai_assistant','2024-05-09',39);
INSERT INTO feature_usage VALUES (90,9,'reports','2024-05-29',18);
INSERT INTO feature_usage VALUES (91,16,'dashboard','2024-05-02',25);
INSERT INTO feature_usage VALUES (92,13,'search','2024-08-10',52);
INSERT INTO feature_usage VALUES (93,15,'reports','2024-07-03',54);
INSERT INTO feature_usage VALUES (94,17,'reports','2024-06-26',40);
INSERT INTO feature_usage VALUES (95,20,'search','2024-07-01',38);
INSERT INTO feature_usage VALUES (96,21,'dashboard','2024-08-08',6);
INSERT INTO feature_usage VALUES (97,24,'reports','2024-04-24',56);
INSERT INTO feature_usage VALUES (98,17,'dashboard','2024-03-24',17);
INSERT INTO feature_usage VALUES (99,15,'reports','2024-05-13',30);
INSERT INTO feature_usage VALUES (100,13,'ai_assistant','2024-06-29',57);
INSERT INTO feature_usage VALUES (101,15,'ai_assistant','2024-05-07',54);
INSERT INTO feature_usage VALUES (102,16,'ai_assistant','2024-04-02',6);
INSERT INTO feature_usage VALUES (103,18,'search','2024-04-28',35);
INSERT INTO feature_usage VALUES (104,2,'reports','2024-04-16',42);
INSERT INTO feature_usage VALUES (105,3,'search','2024-09-29',3);
INSERT INTO feature_usage VALUES (106,28,'reports','2024-05-26',13);
INSERT INTO feature_usage VALUES (107,30,'dashboard','2024-03-03',10);
INSERT INTO feature_usage VALUES (108,9,'search','2024-04-13',43);
INSERT INTO feature_usage VALUES (109,4,'reports','2024-06-29',30);
INSERT INTO feature_usage VALUES (110,26,'ai_assistant','2024-04-02',24);
INSERT INTO feature_usage VALUES (111,7,'dashboard','2024-07-03',48);
INSERT INTO feature_usage VALUES (112,26,'ai_assistant','2024-03-15',53);
INSERT INTO feature_usage VALUES (113,7,'dashboard','2024-05-26',38);
INSERT INTO feature_usage VALUES (114,1,'export','2024-10-08',37);
INSERT INTO feature_usage VALUES (115,25,'search','2024-06-25',26);
INSERT INTO feature_usage VALUES (116,26,'dashboard','2024-03-26',38);
INSERT INTO feature_usage VALUES (117,26,'search','2024-06-15',16);
INSERT INTO feature_usage VALUES (118,4,'ai_assistant','2024-07-16',20);
INSERT INTO feature_usage VALUES (119,25,'ai_assistant','2024-05-16',8);
INSERT INTO feature_usage VALUES (120,29,'ai_assistant','2024-06-30',3);
INSERT INTO feature_usage VALUES (121,14,'search','2024-07-28',43);
INSERT INTO feature_usage VALUES (122,14,'dashboard','2024-05-29',42);
INSERT INTO feature_usage VALUES (123,13,'ai_assistant','2024-05-18',27);
INSERT INTO feature_usage VALUES (124,30,'dashboard','2024-05-02',28);
INSERT INTO feature_usage VALUES (125,14,'ai_assistant','2024-08-10',30);
INSERT INTO feature_usage VALUES (126,26,'search','2024-03-20',12);
INSERT INTO feature_usage VALUES (127,27,'search','2024-05-06',18);
INSERT INTO feature_usage VALUES (128,22,'dashboard','2024-07-19',50);
INSERT INTO feature_usage VALUES (129,18,'search','2024-06-24',53);
INSERT INTO feature_usage VALUES (130,27,'export','2024-05-15',21);
INSERT INTO feature_usage VALUES (131,9,'dashboard','2024-07-12',18);
INSERT INTO feature_usage VALUES (132,17,'ai_assistant','2024-04-01',30);
INSERT INTO feature_usage VALUES (133,21,'search','2024-08-02',25);
INSERT INTO feature_usage VALUES (134,13,'search','2024-05-20',55);
INSERT INTO feature_usage VALUES (135,13,'search','2024-06-09',14);
INSERT INTO feature_usage VALUES (136,14,'export','2024-08-31',22);
INSERT INTO feature_usage VALUES (137,10,'dashboard','2024-07-17',45);
INSERT INTO feature_usage VALUES (138,10,'dashboard','2024-06-06',34);
INSERT INTO feature_usage VALUES (139,8,'reports','2024-03-22',47);
INSERT INTO feature_usage VALUES (140,16,'dashboard','2024-05-02',49);
INSERT INTO feature_usage VALUES (141,9,'search','2024-06-24',42);
INSERT INTO feature_usage VALUES (142,26,'search','2024-05-02',51);
INSERT INTO feature_usage VALUES (143,1,'export','2024-06-23',15);
INSERT INTO feature_usage VALUES (144,15,'reports','2024-06-29',20);
INSERT INTO feature_usage VALUES (145,25,'export','2024-05-14',31);
INSERT INTO feature_usage VALUES (146,20,'export','2024-09-03',28);
INSERT INTO feature_usage VALUES (147,27,'export','2024-05-10',23);
INSERT INTO feature_usage VALUES (148,26,'export','2024-04-28',20);
INSERT INTO feature_usage VALUES (149,10,'dashboard','2024-04-25',47);
INSERT INTO feature_usage VALUES (150,8,'dashboard','2024-04-21',48);
CREATE TABLE employees (
  emp_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  title TEXT,
  salary INTEGER,
  manager_id INTEGER REFERENCES employees(emp_id)
);
INSERT INTO employees VALUES (1,'Grace','Leadership','CEO',250000,NULL);
INSERT INTO employees VALUES (2,'Marcus','Engineering','VP Engineering',210000,1);
INSERT INTO employees VALUES (3,'Leila','Product','VP Product',200000,1);
INSERT INTO employees VALUES (4,'Tom','Engineering','Engineer',140000,2);
INSERT INTO employees VALUES (5,'Sofia','Engineering','Engineer',150000,2);
INSERT INTO employees VALUES (6,'Raj','Engineering','Senior Engineer',175000,2);
INSERT INTO employees VALUES (7,'Mei','Product','Program Manager',135000,3);
INSERT INTO employees VALUES (8,'Andre','Product','Product Manager',145000,3);
INSERT INTO employees VALUES (9,'Ines','Product','Program Manager',128000,3);
INSERT INTO employees VALUES (10,'Kenji','Design','Designer',120000,3);
INSERT INTO employees VALUES (11,'Olga','Sales','Sales Lead',130000,1);
INSERT INTO employees VALUES (12,'Pete','Sales','Account Exec',95000,11);
INSERT INTO employees VALUES (13,'Ruth','Sales','Account Exec',99000,11);
INSERT INTO employees VALUES (14,'Hugo','Engineering','Engineer',138000,6);
`;
