CREATE TABLE IF NOT EXISTS `parking_rates`
(
 `id`                        int NOT NULL ,
 `hour_rate`                 decimal NOT NULL ,
 `free_entry_minutes`        int NOT NULL ,
 `exit_grace_period_minutes` int NOT NULL ,

PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `spot`
(
 `id`             int NOT NULL ,
 `status`         int NOT NULL ,
 `reg_number`     varchar(20),
 `entry_time`     datetime,
 `departure_time` datetime,

PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `spot_history`
(
 `id`             int NOT NULL ,
 `entry_time`     datetime NOT NULL ,
 `departure_time` datetime NOT NULL ,
 `reg_number`     varchar(20) NOT NULL ,
 `spot_id`        int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`spot_id`),
CONSTRAINT `FK_3` FOREIGN KEY `FK_1` (`spot_id`) REFERENCES `spot` (`id`)
);

CREATE TABLE IF NOT EXISTS `entry`
(
 `id`         int NOT NULL ,
 `reg_number` varchar(20) NOT NULL ,
 `entry_time` datetime NOT NULL ,
 `photo_name` varchar(100) NOT NULL ,

PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `payment`
(
 `id`       int NOT NULL ,
 `data`     datetime NOT NULL ,
 `amount`   decimal NOT NULL ,
 `entry_id` int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`entry_id`),
CONSTRAINT `FK_5` FOREIGN KEY `FK_1` (`entry_id`) REFERENCES `entry` (`id`)
);

CREATE TABLE IF NOT EXISTS `users`
(
 `id`       int NOT NULL ,
 `email`    varchar(100) NOT NULL ,
 `password_hash` varchar(200) NOT NULL,
PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `visit_history`
(
 `id`            int NOT NULL ,
 `departure_time` datetime NOT NULL ,
 `payment_id`    int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`payment_id`),
CONSTRAINT `FK_4` FOREIGN KEY `FK_1` (`payment_id`) REFERENCES `payment` (`id`)
);

INSERT INTO spot (id, status) VALUES (1, 0), (2, 0), (3, 0), (4, 0), (5, 0), (6, 0), (7, 0), (8, 0), (9, 0), (10, 0),
                                     (11, 0), (12, 0), (13, 0), (14, 0), (15, 0), (16, 0), (17, 0), (18, 0), (19, 0), (20, 0),
                                     (21, 0), (22, 0), (23, 0), (24, 0), (25, 0), (26, 0), (27, 0), (28, 0), (29, 0), (30, 0),
                                     (31, 0), (32, 0), (33, 0), (34, 0), (35, 0), (36, 0), (37, 0), (38, 0), (39, 0), (40, 0),
                                     (41, 0), (42, 0), (43, 0), (44, 0), (45, 0), (46, 0), (47, 0), (48, 0), (49, 0), (50, 0);

INSERT INTO parking_rates (id, hour_rate, free_entry_minutes, exit_grace_period_minutes) VALUES (1, 1.5, 15, 15);

INSERT INTO spot_history (id, entry_time, departure_time, reg_number, spot_id)
VALUES
(1, '2024-01-01 00:10:45', '2024-01-01 00:33:12', 'EL-111a', 1),
(2, '2024-01-02 04:00:02', '2024-01-02 12:40:50', 'EL-111a', 2),
(3, '2024-01-03 12:20:30', '2024-01-05 14:04:03', 'EL-222b', 3),
(4, '2024-01-04 13:00:01', '2024-01-04 14:00:01', 'EBE-333c', 4),
(5, '2024-01-05 15:04:00', '2024-01-05 17:00:42', 'EL-444d', 5),
(6, '2024-01-06 16:00:00', '2024-01-06 16:15:34', 'EL-555e', 6),
(7, '2024-01-07 17:00:00', '2024-01-07 21:37:00', 'EL-666f', 7),
(8, '2024-01-08 20:10:42', '2024-01-09 07:01:04', 'EL-777g', 8),
(9, '2024-01-11 00:16:45', '2024-01-01 00:33:12', 'EL-111a', 1);

INSERT INTO entry (id, reg_number, entry_time, photo_name)
VALUES
(1, 'EL-111a', '2024-01-01 00:10:45', 'photo1.jpg'),
(2, 'EL-111a', '2024-01-02 04:00:02', 'photo2.jpg'),
(3, 'EL-222b', '2024-01-03 12:20:30', 'photo3.jpg'),
(4, 'EBE-333c', '2024-01-04 13:00:01', 'photo4.jpg'),
(5, 'EL-444d', '2024-01-05 15:04:00', 'photo5.jpg'),
(6, 'EL-555e', '2024-01-06 16:00:00', 'photo6.jpg'),
(7, 'EL-666f', '2024-01-07 17:00:00', 'photo7.jpg'),
(8, 'EL-777g', '2024-01-08 20:10:42', 'photo8.jpg'),
(9, 'EL-111a', '2024-01-11 00:16:45', 'photo9.jpg');

INSERT INTO payment (id, data, amount, entry_id)
VALUES
(1, '2024-01-01 00:33:12', 1.5, 1),
(2, '2024-01-02 12:40:50', 16.5, 2),
(3, '2024-01-05 14:04:03', 36.0, 3),
(4, '2024-01-04 14:00:01', 1.5, 4),
(5, '2024-01-05 17:00:42', 1.5, 5),
(6, '2024-01-06 16:15:34', 1.5, 6),
(7, '2024-01-07 21:37:00', 1.5, 7),
(8, '2024-01-09 07:01:04', 11.5, 8),
(9, '2024-01-01 00:33:12', 1.5, 9);

INSERT INTO visit_history (id, departure_time, payment_id) VALUES (1, '2024-01-01 00:33:12', 1),
                                                                   (2, '2024-01-02 12:40:50', 2),
                                                                   (3, '2024-01-05 14:04:03', 3),
                                                                   (4, '2024-01-04 14:00:01', 4),
                                                                   (5, '2024-01-05 17:00:42', 5),
                                                                   (6, '2024-01-06 16:15:34', 6),
                                                                   (7, '2024-01-07 21:37:00', 7),
                                                                   (8, '2024-01-09 07:01:04', 8),
                                                                   (9, '2024-01-01 00:33:12', 9);

INSERT INTO users (id, email, password_hash) VALUES (1, 'admin@gmail.com', '60a5d3e4100fe8afa5ee0103739a45711d50d7f3ba7280d8a95b51f5d04aa4b8');