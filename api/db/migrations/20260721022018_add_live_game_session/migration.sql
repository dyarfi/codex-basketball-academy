-- CreateTable
CREATE TABLE "LiveGameSession" (
    "id" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameDate" TIMESTAMP(3) NOT NULL,
    "selectedTeamId" TEXT,
    "roster" JSONB NOT NULL,
    "statsMap" JSONB NOT NULL,
    "substitutedOut" JSONB NOT NULL,
    "substitutionLog" JSONB NOT NULL,
    "gameMinute" INTEGER NOT NULL DEFAULT 1,
    "gameStarted" BOOLEAN NOT NULL DEFAULT false,
    "gameFinished" BOOLEAN NOT NULL DEFAULT false,
    "elapsedSeconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveGameSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LiveGameSession_selectedTeamId_idx" ON "LiveGameSession"("selectedTeamId");

-- CreateIndex
CREATE INDEX "LiveGameSession_gameDate_idx" ON "LiveGameSession"("gameDate");

-- AddForeignKey
ALTER TABLE "LiveGameSession" ADD CONSTRAINT "LiveGameSession_selectedTeamId_fkey" FOREIGN KEY ("selectedTeamId") REFERENCES "AgeGroupTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
