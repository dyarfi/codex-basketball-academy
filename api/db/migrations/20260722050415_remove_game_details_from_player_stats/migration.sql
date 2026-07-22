/*
  Warnings:

  - You are about to drop the column `gameDate` on the `PlayerStats` table. All the data in the column will be lost.
  - You are about to drop the column `gameName` on the `PlayerStats` table. All the data in the column will be lost.
  - Made the column `liveGameSessionId` on table `PlayerStats` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PlayerStats" DROP CONSTRAINT "PlayerStats_liveGameSessionId_fkey";

-- DropIndex
DROP INDEX "PlayerStats_gameDate_idx";

-- AlterTable
ALTER TABLE "PlayerStats" DROP COLUMN "gameDate",
DROP COLUMN "gameName",
ALTER COLUMN "liveGameSessionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_liveGameSessionId_fkey" FOREIGN KEY ("liveGameSessionId") REFERENCES "LiveGameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
