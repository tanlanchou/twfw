-- common.verification_code definition

CREATE TABLE `verification_code` (
  `userId` char(32) NOT NULL,
  `code` char(6) NOT NULL,
  `created_at` datetime NOT NULL,
  `platform` varchar(100) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;