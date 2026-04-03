const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      minlength: [2, 'Restaurant name should be at least 2 characters'],
      maxlength: [50, 'Restaurant name should not exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description should not exceed 500 characters'],
      default: '',
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true, default: '' },
      zipCode: { type: String, trim: true, default: '' },
      country: { type: String, required: true, trim: true },
    },
    cuisineType: {
      type: [String],
      required: [true, 'At least one cuisine type is required'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one cuisine type is required',
      },
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ tenant: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
