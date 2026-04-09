CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(200) NOT NULL,
  lastname VARCHAR(120) NOT NULL,
  username VARCHAR(40) NULL DEFAULT NULL UNIQUE,
  bio TEXT NULL DEFAULT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  university VARCHAR(150) NOT NULL,
  reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  profile_pic_id VARCHAR(300) NOT NULL DEFAULT 'avatar.jpg',
  `status` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'inactive'
);

CREATE TABLE `conversation` (
  convor_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user1_id INT(11),
  user2_id INT(11),
  `timestamp` TIMESTAMP NOT NULL,
  FOREIGN KEY (user1_id) REFERENCES users(user_id),
  FOREIGN KEY (user2_id) REFERENCES users(user_id)
);

CREATE TABLE messages (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT(11) NOT NULL,
  sender_id INT(11) NOT NULL,
  receiver_id INT(11) NOT NULL,
  `message` TEXT NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  read_status TINYINT(1) NOT NULL DEFAULT 0,
  multimedia_status TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (conversation_id) REFERENCES `conversation`(convor_id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

CREATE TABLE friends (
  user_id INT(11) NOT NULL,
  friend_id INT(11) NOT NULL,
  PRIMARY KEY (user_id, friend_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (friend_id) REFERENCES users(user_id)
);

CREATE TABLE notification (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  receiver_id INT(11),
  sender_id INT(11),
  message_id INT(11),
  time_stamp TIMESTAMP,
  FOREIGN KEY (receiver_id) REFERENCES users(user_id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id),
  FOREIGN KEY (message_id) REFERENCES messages(id)
);
