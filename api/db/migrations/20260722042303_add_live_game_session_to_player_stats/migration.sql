/*
  Warnings:

  - The primary key for the `LiveGameSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `LiveGameSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[gameName]` on the table `LiveGameSession` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LiveGameSession" DROP CONSTRAINT "LiveGameSession_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "LiveGameSession_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlayerStats" ADD COLUMN     "liveGameSessionId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "LiveGameSession_gameName_key" ON "LiveGameSession"("gameName");

-- CreateIndex
CREATE INDEX "LiveGameSession_gameName_idx" ON "LiveGameSession"("gameName");

-- CreateIndex
CREATE INDEX "PlayerStats_liveGameSessionId_idx" ON "PlayerStats"("liveGameSessionId");

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_liveGameSessionId_fkey" FOREIGN KEY ("liveGameSessionId") REFERENCES "LiveGameSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
