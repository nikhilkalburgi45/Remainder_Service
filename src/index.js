const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./config/serverConfig");
const { subscribeMessage, createChannel } = require("./utils/messageQueue");

// const { sendBasicEmail } = require("./services/email-service");
const { setupJobs } = require("./utils/job");
const ticketController = require("./controllers/ticket-controllers");

const setupAndStartServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const channel = await createChannel();

  app.post("/api/v1/tickets", ticketController.create);

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);

    // setupJobs();
  });
};

setupAndStartServer();
