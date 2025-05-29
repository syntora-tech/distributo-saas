-- CreateEnum
CREATE TYPE "DepositAddressStatus" AS ENUM ('ACTIVE', 'USED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Distribution" ADD COLUMN     "depositAddressId" TEXT;

-- CreateTable
CREATE TABLE "DepositAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "derivationPath" TEXT NOT NULL,
    "status" "DepositAddressStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DepositAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepositAddress_address_key" ON "DepositAddress"("address");

-- CreateIndex
CREATE INDEX "DepositAddress_userId_idx" ON "DepositAddress"("userId");

-- CreateIndex
CREATE INDEX "DepositAddress_address_idx" ON "DepositAddress"("address");

-- CreateIndex
CREATE INDEX "Distribution_depositAddressId_idx" ON "Distribution"("depositAddressId");

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_depositAddressId_fkey" FOREIGN KEY ("depositAddressId") REFERENCES "DepositAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositAddress" ADD CONSTRAINT "DepositAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
