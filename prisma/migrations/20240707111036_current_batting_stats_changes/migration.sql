/*
  Warnings:

  - Added the required column `dismisalId` to the `CurrentBattingStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonStrickerId` to the `CurrentBattingStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentBattingStats" ADD COLUMN     "dismisalId" TEXT NOT NULL,
ADD COLUMN     "nonStrickerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CurrentBattingStats" ADD CONSTRAINT "CurrentBattingStats_nonStrickerId_fkey" FOREIGN KEY ("nonStrickerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentBattingStats" ADD CONSTRAINT "CurrentBattingStats_dismisalId_fkey" FOREIGN KEY ("dismisalId") REFERENCES "Dismisals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
