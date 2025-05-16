const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./config/serverConfig");
// const { sendBasicEmail } = require("./services/email-service");
const { setupJobs } = require("./utils/job");
const { create } = require("./controllers/ticket-controllers");

const setupAndStartServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/api/v1/tickets", create);

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);

    setupJobs();
  });
};

setupAndStartServer();
