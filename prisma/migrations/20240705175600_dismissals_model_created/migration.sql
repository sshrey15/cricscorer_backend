-- CreateTable
CREATE TABLE "Dismisals" (
    "id" TEXT NOT NULL,
    "inningsId" TEXT NOT NULL,
    "batsmanId" TEXT NOT NULL,
    "dismisalType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dismisals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dismisals" ADD CONSTRAINT "Dismisals_inningsId_fkey" FOREIGN KEY ("inningsId") REFERENCES "Innings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dismisals" ADD CONSTRAINT "Dismisals_batsmanId_fkey" FOREIGN KEY ("batsmanId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
