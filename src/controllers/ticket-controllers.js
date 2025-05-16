const TicketService = require("../services/email-service");

const create = async (req, res) => {
  try {
    const response = await TicketService.createNotification(req.body);
    return res.status(201).json({
      success: true,
      message: "Successfully created a ticket",
      data: response,
      err: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create a ticket",
      data: {},
      err: error,
    });
  }
};

module.exports = {
  create,
};  
