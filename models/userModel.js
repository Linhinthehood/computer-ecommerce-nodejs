const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  isDefault: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: [true, 'Address name is required']
  },
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
}, { _id: true });

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
  addresses: [addressSchema],
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

// Middleware để đảm bảo chỉ có một địa chỉ mặc định
userSchema.pre('save', function(next) {
  if (this.isModified('addresses')) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length > 1) {
      const error = new Error('Only one address can be set as default');
      return next(error);
    }
  }
  next();
});

// Method để thêm địa chỉ mới
userSchema.methods.addAddress = async function(addressData) {
  // Nếu là địa chỉ đầu tiên, set làm mặc định
  if (this.addresses.length === 0) {
    addressData.isDefault = true;
  }
  
  // Nếu địa chỉ mới được đánh dấu mặc định, bỏ mặc định của địa chỉ cũ
  if (addressData.isDefault) {
    this.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  this.addresses.push(addressData);
  return this.save();
};

// Method để cập nhật địa chỉ
userSchema.methods.updateAddress = async function(addressId, updateData) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  
  // Nếu đang update địa chỉ thành mặc định
  if (!address.isDefault && updateData.isDefault) {
    this.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  Object.assign(address, updateData);
  return this.save();
};

// Method để xóa địa chỉ
userSchema.methods.removeAddress = async function(addressId) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  
  // Không cho phép xóa địa chỉ mặc định nếu còn địa chỉ khác
  if (address.isDefault && this.addresses.length > 1) {
    throw new Error('Cannot delete default address. Please set another address as default first.');
  }
  
  // Sử dụng filter để tạo mảng mới không có địa chỉ cần xóa
  this.addresses = this.addresses.filter(addr => addr._id.toString() !== addressId);
  return this.save();
};

// Method để lấy địa chỉ mặc định
userSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(addr => addr.isDefault);
};

module.exports = mongoose.model('Users', userSchema);