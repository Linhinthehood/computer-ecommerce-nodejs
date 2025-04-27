const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0, default: 0 }
});

// Tạo sub-schema riêng cho Specifications
const specificationSchema = new mongoose.Schema({
  cpu_series: { 
    type: String, 
    enum: ['Intel 9', 'Intel 7', 'Intel 5', 'Intel 3'],
  },
  ram_capacity: { 
    type: String, 
    enum: ['8GB', '16GB', '32GB', '64GB'],
  },
  ram_type: { 
    type: String, 
    enum: ['DDR4', 'DDR5'],
  },
  ram_brand: { 
    type: String, 
    enum: ['Corsair', 'Kingston', 'G.Skill', 'PNY'],
  },
  ssd_brand: {
    type: String,
    enum: ['Samsung', 'Wester Digital', 'Kingston', 'Corsair', 'PNY'],
  },
  ssd_capacity: {
    type: String,
    enum: ['128GB', '256GB', '512GB', '1TB', '2TB'],
  },
  hdd_brand: {
    type: String,
    enum: ['WesterDigital', 'Seagate', 'Toshiba'],
  },
  hdd_capacity: {
    type: String,
    enum: ['1TB', '2TB', '6TB'],
  },
  storage_type: {
    type: String,
    enum: ['SSD', 'HDD'],
  },
}, { _id: false });

const productSchema = new mongoose.Schema({
  product_id: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  brand: { 
    type: String, 
    required: true,
    enum: [
      'ASUS', 'ACER', 'MSI', 'LENOVO', 'DELL', 'HP',          
      'Samsung', 'Wester Digital', 'Kingston', 'Corsair', 'PNY', 
      'G.Skill',                                                
      'WesterDigital', 'Seagate', 'Toshiba'                    
    ]
  },
  
  description: { type: String, required: true, minLength: 100 },
  short_description: { type: String, required: true, maxLength: 200 },
  category: { 
    type: String, 
    required: true, 
    enum: ['LAPTOP', 'CPU', 'RAM', 'SSD', 'HDD']
  },
  tags: [String],
  images: {
    type: [String],
    validate: [array => array.length >= 3, 'Cần ít nhất 3 ảnh cho sản phẩm']
  },
  variants: [variantSchema],
  
  // Gắn specification cố định enum vào
  specifications: specificationSchema,

  average_rating: { type: Number, min: 1, max: 5, default: 5 },
  total_reviews: { type: Number, default: 0, min: 0 }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'products'
});

// Index
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, brand: 1 });

module.exports = mongoose.model("Product", productSchema);
