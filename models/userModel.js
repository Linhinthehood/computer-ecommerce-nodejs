const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    ward: {
      type: String,
      required: [true, 'Ward is required']
    },
    district: {
      type: String,
      required: [true, 'District is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    }
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  passwordChangeRequired: {
    type: Boolean,
    default: true
  },
  lastPasswordChange: {
    type: Date
  }
}, 
{ 
  timestamps: true,
  collection: 'users' // Tên collection trong MongoDB
});

module.exports = mongoose.model('Users', userSchema);