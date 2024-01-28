-- CreateTable
CREATE TABLE `arse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `player` INTEGER NULL,
    `rater` INTEGER NULL,
    `in_goal` INTEGER NULL,
    `running` INTEGER NULL,
    `shooting` INTEGER NULL,
    `passing` INTEGER NULL,
    `ball_skill` INTEGER NULL,
    `attacking` INTEGER NULL,
    `defending` INTEGER NULL,

    INDEX `player`(`player`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `soccerway_id` INTEGER NULL,
    `club_name` VARCHAR(255) NULL,
    `uri` VARCHAR(255) NULL,
    `country` VARCHAR(255) NULL,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `club_supporter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player` INTEGER NOT NULL DEFAULT 0,
    `club` INTEGER NOT NULL DEFAULT 0,

    INDEX `club_ibfk_1`(`player`),
    INDEX `club_ibfk_2`(`club`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `iso_code` VARCHAR(6) NOT NULL,
    `country_name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `iso_code`(`iso_code`),
    UNIQUE INDEX `country_name`(`country_name`),
    PRIMARY KEY (`iso_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diffs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `a` TEXT NULL,
    `b` TEXT NULL,
    `diff_age` DOUBLE NULL,
    `diff_unknown_age` INTEGER NULL,
    `diff_goalies` TINYINT NULL,
    `diff_average` DECIMAL(10, 3) NULL,
    `diff_played` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_day` INTEGER NOT NULL,
    `stamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `player` INTEGER NOT NULL,
    `body` MEDIUMTEXT NULL,

    INDEX `player`(`player`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_day` (
    `game_number` INTEGER NOT NULL,
    `game_date` DATE NULL,
    `game` BOOLEAN NULL DEFAULT true,
    `mail_sent` DATETIME(0) NULL,
    `comment` VARCHAR(255) NULL,
    `bibs` ENUM('A', 'B') NULL,
    `picker_games_history` INTEGER NULL,

    PRIMARY KEY (`game_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation` (
    `uuid` CHAR(38) NOT NULL,
    `player` INTEGER NOT NULL DEFAULT 0,
    `game_day` INTEGER NOT NULL DEFAULT 0,

    INDEX `invitation_ibfk_1`(`player`),
    INDEX `invitation_ibfk_2`(`game_day`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nationality` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player` INTEGER NOT NULL,
    `iso_code` VARCHAR(6) NOT NULL,

    INDEX `iso_code`(`iso_code`),
    INDEX `player`(`player`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outcome` (
    `game_day` INTEGER NOT NULL,
    `player` INTEGER NOT NULL,
    `response` VARCHAR(20) NULL,
    `responsetime` DATETIME(0) NULL,
    `points` INTEGER NULL,
    `team` ENUM('A', 'B') NULL,
    `comment` VARCHAR(127) NULL,
    `pub` TINYINT NULL,
    `paid` BOOLEAN NULL,
    `goalie` TINYINT NULL,

    INDEX `game_day`(`game_day`),
    INDEX `idx_outcome`(`player`, `game_day`),
    UNIQUE INDEX `unique_outcome`(`player`, `game_day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picker` (
    `player` INTEGER NOT NULL,
    `player_name` VARCHAR(255) NULL,
    `age` INTEGER NULL,
    `average` DECIMAL(10, 3) NULL,
    `goalie` TINYINT NULL,
    `played` INTEGER NULL,

    PRIMARY KEY (`player`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picker_teams` (
    `player` INTEGER NOT NULL,
    `team` ENUM('A', 'B') NULL,

    UNIQUE INDEX `player`(`player`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_admin` TINYINT NULL,
    `login` VARCHAR(16) NULL,
    `first_name` VARCHAR(32) NULL,
    `last_name` VARCHAR(32) NULL,
    `email` VARCHAR(255) NULL,
    `joined` DATE NULL,
    `finished` DATE NULL,
    `born` DATE NULL,
    `introduced_by` INTEGER NULL,
    `comment` VARCHAR(32) NULL,
    `anonymous` TINYINT NULL,
    `goalie` TINYINT NULL,
    `mugshot` VARCHAR(20) NULL,

    UNIQUE INDEX `login`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `standings` (
    `player` INTEGER NOT NULL DEFAULT 0,
    `table_year` INTEGER NOT NULL,
    `game_day` INTEGER NOT NULL DEFAULT 0,
    `responses` INTEGER NULL DEFAULT 0,
    `P` INTEGER NULL DEFAULT 0,
    `W` INTEGER NULL DEFAULT 0,
    `D` INTEGER NULL DEFAULT 0,
    `L` INTEGER NULL DEFAULT 0,
    `points` INTEGER NULL DEFAULT 0,
    `averages` DECIMAL(10, 3) NULL DEFAULT 0.000,
    `stalwart` INTEGER NULL DEFAULT 0,
    `pub` INTEGER NULL DEFAULT 0,
    `rank_points` INTEGER NULL,
    `rank_averages` INTEGER NULL,
    `rank_stalwart` INTEGER NULL,
    `rank_speedy` INTEGER NULL,
    `rank_pub` INTEGER NULL,
    `speedy_seconds` INTEGER NULL,

    INDEX `standings_ibfk_2`(`game_day`),
    PRIMARY KEY (`player`, `table_year`, `game_day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `misc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `last_game_mod` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
