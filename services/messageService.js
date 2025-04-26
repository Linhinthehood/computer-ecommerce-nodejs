/**
 * Message Service - Handles publishing and consuming messages using RabbitMQ
 */
const rabbitmq = require('../config/rabbitmq');

/**
 * Publish a message to a queue
 * @param {string} queue - The queue name
 * @param {Object} message - The message to publish
 * @returns {Promise<boolean>} - Whether the message was published successfully
 */
async function publishMessage(queue, message) {
  try {
    const channel = await rabbitmq.connect();
    
    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: true });
    
    // Publish the message
    const success = channel.sendToQueue(
      queue, 
      Buffer.from(JSON.stringify(message)),
      { persistent: true } // Messages will be saved even if RabbitMQ restarts
    );
    
    console.log(`Message published to queue: ${queue}`);
    return success;
  } catch (error) {
    console.error(`Error publishing message to queue ${queue}:`, error.message);
    return false;
  }
}

/**
 * Consume messages from a queue
 * @param {string} queue - The queue name
 * @param {Function} callback - The callback function to process messages
 */
async function consumeMessages(queue, callback) {
  try {
    const channel = await rabbitmq.connect();
    
    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: true });
    
    // Set prefetch to 1 to ensure fair dispatch
    await channel.prefetch(1);
    
    console.log(`Waiting for messages from queue: ${queue}`);
    
    // Consume messages
    channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          
          // Process the message
          await callback(content);
          
          // Acknowledge that the message has been processed
          channel.ack(msg);
        } catch (error) {
          console.error(`Error processing message from queue ${queue}:`, error.message);
          
          // Reject the message and requeue it
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error(`Error consuming messages from queue ${queue}:`, error.message);
  }
}

module.exports = {
  publishMessage,
  consumeMessages
}; 