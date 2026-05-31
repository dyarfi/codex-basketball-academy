/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `verificationCode` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('DRAFT', 'ISSUED', 'REVOKED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "revokedReason" TEXT,
ADD COLUMN     "signatureUrl" TEXT,
ADD COLUMN     "status" "CertificateStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "verificationCode" TEXT NOT NULL,
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_verificationCode_key" ON "Certificate"("verificationCode");

-- CreateIndex
CREATE INDEX "Certificate_status_idx" ON "Certificate"("status");

-- CreateIndex
CREATE INDEX "Certificate_certificateNumber_idx" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certificate_verificationCode_idx" ON "Certificate"("verificationCode");

-- CreateIndex
CREATE INDEX "Certificate_expiryDate_idx" ON "Certificate"("expiryDate");
