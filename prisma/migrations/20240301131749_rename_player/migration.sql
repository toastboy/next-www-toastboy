/*
 Warnings:
 
 - The primary key for the `ClubSupporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `ClubSupporter` table. All the data in the column will be lost.
 - The primary key for the `CountrySupporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `CountrySupporter` table. All the data in the column will be lost.
 - You are about to drop the `player` table. If the table is not empty, all the data it contains will be lost.
 - A unique constraint covering the columns `[playerId,countryISOcode]` on the table `CountrySupporter` will be added. If there are existing duplicate values, this will fail.
 
 */
-- AlterTable
--
DROP TABLE IF EXISTS Player;

RENAME TABLE player TO Player;