const { NotiFicationTicket } = require("../models/index");
const { Op } = require("sequelize");

class TicketRepository {
  constructor() {
    this.NotificationTicket = NotiFicationTicket;
  }

  async getAll() {
    try {
      const tickets = await this.NotificationTicket.findAll();
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const ticket = await this.NotificationTicket.create(data);
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async get(filter) {
    try {
      const whereClause = {
        status: filter.status
      };
      
      if (filter.notificationTime) {
        // Convert the notification time to UTC for comparison
        const currentTime = new Date();
        whereClause.notificationTime = {
          [Op.lte]: currentTime
        };
      }

      console.log('Searching for tickets with where clause:', whereClause);
      const ticket = await this.NotificationTicket.findAll({
        where: whereClause
      });
      console.log('Found tickets:', ticket.length);
      return ticket;
    } catch (error) {
      console.error('Error in get method:', error);
      throw error;
    }
  }

  async update(ticketId, status) {
    try {
      const ticket = await this.NotificationTicket.findByPk(ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      ticket.status = status.status || status;
      await ticket.save();
      return ticket;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TicketRepository;
