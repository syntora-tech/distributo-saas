/*
  Warnings:

  - You are about to drop the column `email` on the `Recipient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Recipient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipient" DROP COLUMN "email",
DROP COLUMN "name";
