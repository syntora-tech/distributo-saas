/*
  Warnings:

  - You are about to drop the column `recipientId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Recipient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipient" DROP CONSTRAINT "Recipient_distributionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recipientId_fkey";

-- DropIndex
DROP INDEX "Transaction_hash_key";

-- DropIndex
DROP INDEX "Transaction_recipientId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "recipientId",
ADD COLUMN     "walletAddress" TEXT;

-- DropTable
DROP TABLE "Recipient";
