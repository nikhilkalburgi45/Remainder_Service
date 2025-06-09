// const amqplib = require("amqplib");
// const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require("../config/serverConfig");

// const QUEUE_NAME = "REMINDER_QUEUE";

// const createChannel = async () => {
//   try {
//     const connection = await amqplib.connect(MESSAGE_BROKER_URL);
//     const channel = await connection.createChannel();
//     await channel.assertExchange(EXCHANGE_NAME, "direct", false);
//     return channel;
//   } catch (error) {
//     throw error;
//   }
// };

// const subscribeMessage = async (channel, service, binding_key) => {
//   try {
//     const applicationQueue = await channel.assertQueue(QUEUE_NAME);
//     await channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

//     channel.consume(applicationQueue.queue, (msg) => {
//       console.log("📥 Received data from queue:");
//       console.log(msg.content.toString());
//       channel.ack(msg);
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// const publishMessage = async (channel, binding_key, message) => {
//   try {
//     await channel.assertQueue(QUEUE_NAME);
//     await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = {
//   subscribeMessage,
//   createChannel,
//   publishMessage,
// };

// utils/messageQueue.js

const amqplib = require("amqplib");
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require("../config/serverConfig");

const QUEUE_NAME = "REMINDER_QUEUE";

// 🔁 1. Create channel and durable exchange
const createChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();

    // Ensure exchange is durable
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });

    return channel;
  } catch (error) {
    throw error;
  }
};

// 📥 2. Subscribe to the queue with durability and ack
const subscribeMessage = async (channel, service, binding_key) => {
  try {
    // Ensure queue is durable
    const applicationQueue = await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    // Bind the queue with the exchange and binding key
    await channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

    // Consume messages from the queue
    channel.consume(applicationQueue.queue, (msg) => {
      console.log("📥 Received data from queue:");
      console.log(msg.content.toString());

      const payload = JSON.parse(msg.content.toString());

      service(payload);

      channel.ack(msg);
    });
  } catch (error) {
    throw error;
  }
};

// ✉️ 3. Publish messages with persistence
const publishMessage = async (channel, binding_key, message) => {
  try {
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // 👇 Bind the queue here too!
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, binding_key);

    channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message), {
      persistent: true,
    });

    console.log("📤 Message published to exchange");
  } catch (error) {
    throw error;
  }
};

module.exports = {
  subscribeMessage,
  createChannel,
  publishMessage,
};
