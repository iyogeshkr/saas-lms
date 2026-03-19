const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  term: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'upcoming'],
    default: 'upcoming'
  },
  invoiceNumber: String,
  paidDate: Date,
  paymentMethod: String,
  transactionId: String,
  lateFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Fee', feeSchema);