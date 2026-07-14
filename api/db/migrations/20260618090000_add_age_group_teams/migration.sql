-- AlterTable
ALTER TABLE "User" ADD COLUMN "teamId" TEXT;

-- CreateTable
CREATE TABLE "AgeGroupTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "description" TEXT,
    "coachId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgeGroupTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgeGroupTeam_name_key" ON "AgeGroupTeam"("name");

-- CreateIndex
CREATE INDEX "AgeGroupTeam_ageGroup_idx" ON "AgeGroupTeam"("ageGroup");

-- CreateIndex
CREATE INDEX "AgeGroupTeam_isActive_idx" ON "AgeGroupTeam"("isActive");

-- AddForeignKey
ALTER TABLE "AgeGroupTeam" ADD CONSTRAINT "AgeGroupTeam_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "AgeGroupTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
