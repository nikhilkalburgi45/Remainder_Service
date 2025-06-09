const sender = require("../config/emailConfig");
const TicketRepository = require("../repository/ticket-repository");
const { Op } = require("sequelize");

const sendBasicEmail = async (mailFrom, mailTo, mailSubject, mailBody) => {
  try {
    const response = await sender.sendMail({
      from: mailFrom,
      to: mailTo,
      subject: mailSubject,
      text: mailBody,
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const fetchPendingEmails = async () => {
  try {
    const repository = new TicketRepository();
    const currentTime = new Date();
    const response = await repository.get({
      status: "PENDING",
      notificationTime: {
        [Op.lte]: currentTime,
      },
    });
    console.log(
      `Found ${response.length} pending emails at ${currentTime.toISOString()}`
    );
    return response;
  } catch (error) {
    console.log("Error in fetchPendingEmails:", error);
    throw error;
  }
};

const createNotification = async (data) => {
  try {
    const repository = new TicketRepository();
    const response = await repository.create(data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const updateTicket = async (ticketId, status) => {
  try {
    const repository = new TicketRepository();
    const response = await repository.update(ticketId, status);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const subscribeEvents = async (payload) => {
  try {
    console.log("Triggered the email service event");
    const service = payload.service;
    const data = payload.data;

    switch (service) {
      case "CREATE_TICKET":
        await createNotification(data);
        break;
      case "SEND_BASIC_MAIL":
        await sendBasicEmail(data);
        break;
      default:
        console.log("No valid event received");
        break;
    }
  } catch (error) {
    console.log("Error in subscribeEvents:", error);
  }
};

const testingQueue = async (data) => {
  try {
    const message = JSON.parse(data);
    console.log("Inside service layer", message);

    // Extract the service type and data from the nested structure
    const service = message.service;
    const ticketData = message.data;

    if (service === "CREATE_TICKET") {
      // Create notification with the ticket data
      await createNotification(ticketData);
      console.log("Ticket created successfully");
    }
  } catch (error) {
    console.error("Error processing queue message:", error);
  }
};

module.exports = {
  sendBasicEmail,
  fetchPendingEmails,
  createNotification,
  updateTicket,
  subscribeEvents,
  testingQueue,
};
