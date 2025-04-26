/**
 * Standalone Worker Script for RabbitMQ Message Processing
 * 
 * This script can be run separately from the main application to process
 * messages from RabbitMQ queues. This is useful for scaling message processing
 * independently from the main application.
 */

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import required modules
const rabbitmq = require('./config/rabbitmq');
const messagingWorkers = require('./workers/messagingWorkers');

console.log('Starting message processing worker...');

// Connect to RabbitMQ and start workers
rabbitmq.connect()
  .then(async () => {
    console.log('Connected to RabbitMQ');
    
    // Start all messaging workers
    await messagingWorkers.startWorkers();
    
    console.log('Worker is now processing messages');
  })
  .catch(err => {
    console.error('Failed to connect to RabbitMQ:', err);
    process.exit(1);
  });

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  
  // Close RabbitMQ connection
  await rabbitmq.closeConnection();
  
  process.exit(0);
});

console.log('Worker script initialized. Press Ctrl+C to stop.'); 