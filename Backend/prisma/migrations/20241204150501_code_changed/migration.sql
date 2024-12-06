/*
  Warnings:

  - A unique constraint covering the columns `[pooling_station_id]` on the table `results` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_pooling_station_id_fkey";

-- AlterTable
ALTER TABLE "results" ALTER COLUMN "pooling_station_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "results_pooling_station_id_key" ON "results"("pooling_station_id");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_pooling_station_id_fkey" FOREIGN KEY ("pooling_station_id") REFERENCES "PoolingStations"("station_code") ON DELETE SET NULL ON UPDATE CASCADE;
