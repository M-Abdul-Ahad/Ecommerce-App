import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  addressInfo: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    }
  },

  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ],
  
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  orderStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },

  orderId: {
    type: String,
    required: true,
    unique: true
  },

  date: {
    type: Date,
    default: Date.now
  },

  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD'
  },

  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Paid'
  }
}, {
  timestamps: true
});

export default model('Order', orderSchema);
