-- AlterTable
ALTER TABLE "Distribution" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Fee" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Distribution_tokenAddress_idx" ON "Distribution"("tokenAddress");

-- CreateIndex
CREATE INDEX "Distribution_userId_idx" ON "Distribution"("userId");

-- CreateIndex
CREATE INDEX "Fee_distributionId_idx" ON "Fee"("distributionId");

-- CreateIndex
CREATE INDEX "Recipient_walletAddress_idx" ON "Recipient"("walletAddress");

-- CreateIndex
CREATE INDEX "Recipient_distributionId_idx" ON "Recipient"("distributionId");

-- CreateIndex
CREATE INDEX "Recipient_transactionId_idx" ON "Recipient"("transactionId");

-- CreateIndex
CREATE INDEX "Transaction_signature_idx" ON "Transaction"("signature");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_distributionId_idx" ON "Transaction"("distributionId");

-- CreateIndex
CREATE INDEX "User_walletAddress_idx" ON "User"("walletAddress");
