const amqp = require('amqplib');

let connection = null;
let channel = null;

/**
 * Connect to RabbitMQ server
 * @returns {Promise<Object>} The RabbitMQ channel
 */
async function connect() {
  try {
    if (channel) return channel;
    
    const host = process.env.RABBITMQ_HOST || 'localhost';
    const user = process.env.RABBITMQ_USER || 'guest';
    const password = process.env.RABBITMQ_PASS || 'guest';
    
    // Connection URL
    const url = `amqp://${user}:${password}@${host}`;
    
    // Connect to RabbitMQ server
    connection = await amqp.connect(url);
    
    // Create a channel
    channel = await connection.createChannel();
    
    console.log('Connected to RabbitMQ');
    
    // Handle connection closing
    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
      channel = null;
      connection = null;
      
      // Try to reconnect after a delay
      setTimeout(async () => {
        try {
          await connect();
        } catch (error) {
          console.error('Failed to reconnect to RabbitMQ:', error.message);
        }
      }, 5000);
    });
    
    // Handle connection errors
    connection.on('error', (error) => {
      console.error('RabbitMQ connection error:', error.message);
      if (connection) connection.close();
    });
    
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error.message);
    throw error;
  }
}

/**
 * Function to close the RabbitMQ connection
 */
async function closeConnection() {
  if (channel) await channel.close();
  if (connection) await connection.close();
  channel = null;
  connection = null;
  console.log('RabbitMQ connection closed');
}

// Queue names
const QUEUES = {
  ORDER_NOTIFICATION: 'order-notification',
  WELCOME_EMAIL: 'welcome-email'
};

module.exports = {
  connect,
  closeConnection,
  QUEUES
}; 