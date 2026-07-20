/*
  Warnings:

  - You are about to drop the column `coachId` on the `AgeGroupTeam` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CoachRole" AS ENUM ('HEAD_COACH', 'ASSISTANT', 'TRAINER');

-- CreateEnum
CREATE TYPE "InvitationEvent" AS ENUM ('REGISTER', 'LOGIN', 'ACCEPT', 'CHECK_IN');

-- DropForeignKey
ALTER TABLE "AgeGroupTeam" DROP CONSTRAINT "AgeGroupTeam_coachId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "AgeGroupTeam" DROP COLUMN "coachId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "teamId";

-- CreateTable
CREATE TABLE "TeamMembership" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "TeamMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamCoach" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "CoachRole" NOT NULL DEFAULT 'ASSISTANT',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TeamCoach_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembership_userId_teamId_key" ON "TeamMembership"("userId", "teamId");

-- CreateIndex
CREATE INDEX "TeamCoach_userId_idx" ON "TeamCoach"("userId");

-- CreateIndex
CREATE INDEX "TeamCoach_teamId_idx" ON "TeamCoach"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamCoach_userId_teamId_key" ON "TeamCoach"("userId", "teamId");

-- AddForeignKey
ALTER TABLE "TeamMembership" ADD CONSTRAINT "TeamMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembership" ADD CONSTRAINT "TeamMembership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "AgeGroupTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamCoach" ADD CONSTRAINT "TeamCoach_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamCoach" ADD CONSTRAINT "TeamCoach_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "AgeGroupTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
