const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // email duy nhất
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  }
}, 
{ 
  timestamps: true,
  collection: 'users' // Tên collection trong MongoDB
});

module.exports = mongoose.model('Users', userSchema);