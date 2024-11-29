/*
  Warnings:

  - You are about to drop the column `edad` on the `alumnos` table. All the data in the column will be lost.
  - You are about to drop the column `grado` on the `alumnos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `alumnos` DROP COLUMN `edad`,
    DROP COLUMN `grado`;
