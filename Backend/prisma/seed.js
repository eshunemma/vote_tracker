import { PrismaClient } from "@prisma/client";
import { pollingStations } from "../data.js";
const prisma = new PrismaClient();

async function main() {
  await prisma.candidates.createMany({
    data: [
      {
        id: 1,
        name: "Abdul",
      },
      {
        id: 2,
        name: "Kobby Okyere Darko",
      },
    ],
  });

  pollingStations.map((data) => {
    createpolling(data);
  });
  console.log("Successfully Seeded Data");
}

async function createpolling(data) {
  await prisma.poolingStations.create({
    data: {
      station_code: data?.PS_CODE,
      station_name: data?.POLLING_STATION_NAME,
      electoral_area: data?.ELECTORAL_WARD_AREA,
      phone: `${data?.PHONE_NUMBER}`,
      name: data?.NAME_OF_WCO,
      results: {
        createMany: {
          data: [
            {
              candidate_id: 1,
            },
            {
              candidate_id: 2,
            },
          ],
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
