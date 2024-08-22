/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `scorer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CurrentBattingStats" DROP CONSTRAINT "CurrentBattingStats_dismisalId_fkey";

-- AlterTable
ALTER TABLE "CurrentBattingStats" ALTER COLUMN "dismisalId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "scorer_email_key" ON "scorer"("email");

-- AddForeignKey
ALTER TABLE "CurrentBattingStats" ADD CONSTRAINT "CurrentBattingStats_dismisalId_fkey" FOREIGN KEY ("dismisalId") REFERENCES "Dismisals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
