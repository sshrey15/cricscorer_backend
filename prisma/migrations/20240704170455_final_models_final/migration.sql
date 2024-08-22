/*
  Warnings:

  - You are about to drop the column `fours` on the `BatsmanStats` table. All the data in the column will be lost.
  - You are about to drop the column `sixes` on the `BatsmanStats` table. All the data in the column will be lost.
  - You are about to drop the column `strikeRate` on the `BatsmanStats` table. All the data in the column will be lost.
  - You are about to drop the column `economy` on the `BowlerStats` table. All the data in the column will be lost.
  - You are about to drop the column `strikeRate` on the `BowlerStats` table. All the data in the column will be lost.
  - You are about to drop the column `runRate` on the `Innings` table. All the data in the column will be lost.
  - You are about to drop the column `wickets` on the `Innings` table. All the data in the column will be lost.
  - You are about to drop the column `overs` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `wickets` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `win` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `matchesplayed` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `Overs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RunsGain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RunsScored` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inningsId` to the `BatsmanStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `BatsmanStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runs` to the `BatsmanStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inningsId` to the `BowlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `BowlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Overs" DROP CONSTRAINT "Overs_bowlerId_fkey";

-- DropForeignKey
ALTER TABLE "Overs" DROP CONSTRAINT "Overs_inningsId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_teamId_fkey";

-- DropForeignKey
ALTER TABLE "RunsGain" DROP CONSTRAINT "RunsGain_bowlerId_fkey";

-- DropForeignKey
ALTER TABLE "RunsGain" DROP CONSTRAINT "RunsGain_inningsId_fkey";

-- DropForeignKey
ALTER TABLE "RunsGain" DROP CONSTRAINT "RunsGain_overId_fkey";

-- DropForeignKey
ALTER TABLE "RunsScored" DROP CONSTRAINT "RunsScored_batsmanId_fkey";

-- DropForeignKey
ALTER TABLE "RunsScored" DROP CONSTRAINT "RunsScored_inningsId_fkey";

-- AlterTable
ALTER TABLE "BatsmanStats" DROP COLUMN "fours",
DROP COLUMN "sixes",
DROP COLUMN "strikeRate",
ADD COLUMN     "inningsId" TEXT NOT NULL,
ADD COLUMN     "matchId" TEXT NOT NULL,
ADD COLUMN     "runs" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BowlerStats" DROP COLUMN "economy",
DROP COLUMN "strikeRate",
ADD COLUMN     "inningsId" TEXT NOT NULL,
ADD COLUMN     "matchId" TEXT NOT NULL,
ALTER COLUMN "overs" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Innings" DROP COLUMN "runRate",
DROP COLUMN "wickets";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "overs",
DROP COLUMN "score",
DROP COLUMN "teamId",
DROP COLUMN "wickets",
DROP COLUMN "win",
ADD COLUMN     "winnerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "matchesplayed";

-- DropTable
DROP TABLE "Overs";

-- DropTable
DROP TABLE "RunsGain";

-- DropTable
DROP TABLE "RunsScored";

-- CreateTable
CREATE TABLE "ScoreCard" (
    "id" TEXT NOT NULL,
    "inningsId" TEXT NOT NULL,
    "runs" INTEGER NOT NULL,
    "wickets" INTEGER NOT NULL,
    "overs" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentBowlingStats" (
    "id" TEXT NOT NULL,
    "inningsId" TEXT NOT NULL,
    "bowlerId" TEXT NOT NULL,
    "overNumber" INTEGER NOT NULL,
    "overs" DOUBLE PRECISION NOT NULL,
    "ballsBowled" INTEGER NOT NULL,
    "wickets" INTEGER NOT NULL,
    "wide" INTEGER NOT NULL,
    "noBall" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrentBowlingStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentBattingStats" (
    "id" TEXT NOT NULL,
    "strickerId" TEXT NOT NULL,
    "runs" INTEGER NOT NULL,
    "balls" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrentBattingStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreCard" ADD CONSTRAINT "ScoreCard_inningsId_fkey" FOREIGN KEY ("inningsId") REFERENCES "Innings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentBowlingStats" ADD CONSTRAINT "CurrentBowlingStats_inningsId_fkey" FOREIGN KEY ("inningsId") REFERENCES "Innings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentBowlingStats" ADD CONSTRAINT "CurrentBowlingStats_bowlerId_fkey" FOREIGN KEY ("bowlerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentBattingStats" ADD CONSTRAINT "CurrentBattingStats_strickerId_fkey" FOREIGN KEY ("strickerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatsmanStats" ADD CONSTRAINT "BatsmanStats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatsmanStats" ADD CONSTRAINT "BatsmanStats_inningsId_fkey" FOREIGN KEY ("inningsId") REFERENCES "Innings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BowlerStats" ADD CONSTRAINT "BowlerStats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BowlerStats" ADD CONSTRAINT "BowlerStats_inningsId_fkey" FOREIGN KEY ("inningsId") REFERENCES "Innings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
