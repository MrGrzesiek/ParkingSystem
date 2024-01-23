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

CREATE TABLE IF NOT EXISTS `visit_history`
(
 `id`            int NOT NULL ,
 `departure_time` datetime NOT NULL ,
 `payment_id`    int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`payment_id`),
CONSTRAINT `FK_4` FOREIGN KEY `FK_1` (`payment_id`) REFERENCES `payment` (`id`)
);
