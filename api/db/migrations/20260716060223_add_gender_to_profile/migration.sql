/*
  Warnings:

  - Added the required column `gameName` to the `PlayerStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "withAssessment" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "PlayerStats" ADD COLUMN     "gameName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "gender" TEXT;
