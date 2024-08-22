/*
  Warnings:

  - Added the required column `inningsId` to the `CurrentBattingStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentBattingStats" ADD COLUMN     "inningsId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CurrentBattingStats" ADD CONSTRAINT "CurrentBattingStats_inningsId_fkey" FOREIGN KEY ("inningsId") REFERENCES "Innings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
