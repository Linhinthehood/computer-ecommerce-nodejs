/**
 * Messaging Workers - Consumers for RabbitMQ queues
 */
const { QUEUES } = require('../config/rabbitmq');
const messageService = require('../services/messageService');
const emailService = require('../services/emailService');

/**
 * Start all workers
 */
async function startWorkers() {
  try {
    // Start the welcome email worker
    await startWelcomeEmailWorker();
    
    // Start the order notification worker
    await startOrderNotificationWorker();
    
    console.log('All messaging workers started successfully');
  } catch (error) {
    console.error('Error starting workers:', error.message);
  }
}

/**
 * Start the welcome email worker
 */
async function startWelcomeEmailWorker() {
  await messageService.consumeMessages(QUEUES.WELCOME_EMAIL, async (userData) => {
    console.log('Processing welcome email for:', userData.email);
    
    // Send welcome email
    await emailService.sendWelcomeEmail(userData);
    
    console.log('Welcome email processed for:', userData.email);
  });
  
  console.log('Welcome email worker started');
}

/**
 * Start the order notification worker
 */
async function startOrderNotificationWorker() {
  await messageService.consumeMessages(QUEUES.ORDER_NOTIFICATION, async (orderData) => {
    console.log('Processing order notification for:', orderData.email);
    
    // Send order confirmation email
    await emailService.sendOrderConfirmationEmail(orderData);
    
    console.log('Order notification processed for:', orderData.email);
  });
  
  console.log('Order notification worker started');
}

module.exports = {
  startWorkers
}; 