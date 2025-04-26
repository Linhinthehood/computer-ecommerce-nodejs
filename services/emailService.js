/**
 * Email Service - Handles sending email notifications
 * Note: This is a mock implementation. In a real application, you'd use a library like nodemailer.
 */

/**
 * Send a welcome email to a new user
 * @param {Object} user - The user object containing name and email
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
async function sendWelcomeEmail(user) {
  try {
    console.log(`
      ==== MOCK EMAIL SENT ====
      To: ${user.email}
      Subject: Welcome to Our Store, ${user.name}!
      
      Dear ${user.name},
      
      Thank you for joining Our Store! We're excited to have you on board.
      
      Best regards,
      The Store Team
      ==== END OF MOCK EMAIL ====
    `);
    
    // Simulate async process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    return false;
  }
}

/**
 * Send an order confirmation email
 * @param {Object} orderData - The order data
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
async function sendOrderConfirmationEmail(orderData) {
  try {
    const { email, fullName, totalPrice, cartItems } = orderData;
    
    console.log(`
      ==== MOCK EMAIL SENT ====
      To: ${email}
      Subject: Order Confirmation #${Date.now().toString().slice(-6)}
      
      Dear ${fullName},
      
      Thank you for your order! Your order has been confirmed.
      
      Order Details:
      --------------
      Total Items: ${cartItems.length}
      Total Amount: $${totalPrice.toFixed(2)}
      
      Your items will be shipped soon.
      
      Best regards,
      The Store Team
      ==== END OF MOCK EMAIL ====
    `);
    
    // Simulate async process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error.message);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail
}; 