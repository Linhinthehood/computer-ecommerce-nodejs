/**
 * Email Service - Handles sending email notifications
 * Note: This is a mock implementation. In a real application, you'd use a library like nodemailer.
 */

/**
 * Send a welcome email to a new user with their temporary password
 * @param {Object} user - The user object containing name, email and temporary password
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
async function sendWelcomeEmail(user) {
  try {
    console.log(`
      ==== MOCK EMAIL SENT ====
      To: ${user.email}
      Subject: Welcome to Our Store - Your Account Information
      
      Dear ${user.name},
      
      Thank you for creating an account with Our Store! 
      
      Here are your account details:
      - Email: ${user.email}
      - Temporary Password: ${user.password}
      
      For security reasons, please change your password when you first log in.
      You can do this by going to your Profile Settings after logging in.
      
      If you didn't create this account, please contact our support team immediately.
      
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
 * Send a password reset email
 * @param {Object} data - Contains user email and reset token/password
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
async function sendPasswordResetEmail(data) {
  try {
    console.log(`
      ==== MOCK EMAIL SENT ====
      To: ${data.email}
      Subject: Password Reset - Our Store
      
      Dear Customer,
      
      Your password has been reset successfully.
      
      Your new temporary password is: ${data.password}
      
      Please change this password after logging in for security purposes.
      
      If you didn't request this password reset, please contact our support team immediately.
      
      Best regards,
      The Store Team
      ==== END OF MOCK EMAIL ====
    `);
    
    // Simulate async process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
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
  sendPasswordResetEmail,
  sendOrderConfirmationEmail
}; 