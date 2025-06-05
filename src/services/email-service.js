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

const testingQueue = async (data) => {
  console.log("Inside Service Layer", data);
};

module.exports = {
  sendBasicEmail,
  fetchPendingEmails,
  createNotification,
  updateTicket,
  testingQueue,
};
