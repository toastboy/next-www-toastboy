/*
 Warnings:
 
 - You are about to alter the column `diff_average` on the `Diffs` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Double`.
 - You are about to alter the column `average` on the `Picker` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Double`.
 - You are about to alter the column `averages` on the `PlayerRecord` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Double`.
 - You are about to drop the `standings` table. If the table is not empty, all the data it contains will be lost.
 - Made the column `club_name` on table `Club` required. This step will fail if there are existing NULL values in that column.
 - Made the column `login` on table `Player` required. This step will fail if there are existing NULL values in that column.
 
 */
-- AlterTable
ALTER TABLE
  `Club`
MODIFY
  `club_name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE
  `Diffs`
MODIFY
  `diff_average` DOUBLE NULL;

-- AlterTable
ALTER TABLE
  `Outcome`
MODIFY
  `pub` INTEGER NULL;

-- AlterTable
ALTER TABLE
  `Picker`
MODIFY
  `average` DOUBLE NULL;

-- AlterTable
ALTER TABLE
  `Player`
MODIFY
  `login` VARCHAR(16) NOT NULL;

-- AlterTable
ALTER TABLE
  `PlayerRecord`
MODIFY
  `responses` INTEGER NULL;

ALTER TABLE
  `PlayerRecord`
MODIFY
  `P` INTEGER NULL;

ALTER TABLE
  `PlayerRecord`
MODIFY
  `W` INTEGER NULL;

ALTER TABLE
  `PlayerRecord`
MODIFY
  `D` INTEGER NULL;

ALTER TABLE
  `PlayerRecord`
MODIFY
  `L` INTEGER NULL;

ALTER TABLE
  `PlayerRecord`
MODIFY
  `points` INTEGER NULL;

ALTER TABLE
  `PlayerRecord`
MODIFY
  `averages` DOUBLE NULL;

ALTER TABLE
  `PlayerRecord`
MODIFY
  `stalwart` INTEGER NULL;

ALTER TABLE
  `PlayerRecord`
MODIFY
  `pub` INTEGER NULL;