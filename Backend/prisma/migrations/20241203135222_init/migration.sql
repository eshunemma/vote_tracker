-- CreateTable
CREATE TABLE "PoolingStations" (
    "id" SERIAL NOT NULL,
    "station_name" TEXT,
    "station_code" TEXT,
    "electoral_area" TEXT,

    CONSTRAINT "PoolingStations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "candidate_id" INTEGER,
    "votes" INTEGER NOT NULL,
    "pooling_station_id" INTEGER,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PoolingStations_station_code_key" ON "PoolingStations"("station_code");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_pooling_station_id_fkey" FOREIGN KEY ("pooling_station_id") REFERENCES "PoolingStations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
