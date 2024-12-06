import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { prisma } from "./context.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world from Express!");
});
app.get("/get-by-station/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const data = await prisma.results.findMany({
    where: {
      pooling_station_id: id,
    },
    orderBy: {
      candidate: {
        id: "asc",
      },
    },
    include: {
      candidate: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  res.send({
    data,
    message: "Success",
  });
});

app.get("/get-polling-stations", async (req, res) => {
  const data = await prisma.poolingStations.findMany();
  res.send({
    data,
    message: "Success",
  });
});

app.put("/updateScore/:code", async (req, res) => {
  const { ndc, npp } = req.body;
  const { code } = req.params;
  if (ndc) {
    await prisma.results.updateMany({
      where: {
        AND: {
          pooling_station_id: code,
          candidate_id: 1,
        },
      },
      data: {
        votes: Number(ndc),
      },
    });
  }
  if (npp) {
    await prisma.results.updateMany({
      where: {
        AND: {
          pooling_station_id: code,
          candidate_id: 2,
        },
      },
      data: {
        votes: Number(npp),
      },
    });
  }
  res.send("Hello, world from Express!");
});

app.post("/get-stations-by-phone/:phone", async (req, res) => {
  const { phone } = req.params;
  const data = await prisma.poolingStations.findMany({
    where: {
      phone,
    },
    include: {
      results: {
        include: {
          candidate: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (data.length == 0) {
    return res.status(404).send({
      data: "null",
      message: "Not a valid Number",
    });
  }
  const returnData = {
    id: data[0].phone,
    name: data[0].name,
    pollingStations: data,
  };
  res.send({
    data: returnData,
    message: "Success",
  });
});
app.post("/get-stations-by-phone1/:phone", async (req, res) => {
  const { phone } = req.params;
  console.log(typeof phone);

  const data = await prisma.poolingStations.findMany({
    where: {
      phone: `${phone}`,
    },
  });
  console.log(data);
  if (!data) {
    res.status(404).send({
      data: "null",
      message: "No Polling Station for Number",
    });
  }
  res.send({
    data,
    message: "Success",
  });
});

app.get("/get-all-results", async (req, res) => {
  const data = await prisma.results.findMany({
    include: {
      candidate: true,
      poolingStation: true,
    },
  });
  res.send({
    data,
    message: "Success",
  });
});

// Set the server to listen on a port (e.g., 3000)
const port = 9999;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
