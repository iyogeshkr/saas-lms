const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Fee = require('../models/Fee');
const dotenv = require("dotenv")
dotenv.config()

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount, feeId, description } = req.body;
    const studentId = req.user._id;

    // Validate fee exists and belongs to student
    const fee = await Fee.findOne({
      _id: feeId,
      student: studentId,
      status: 'pending'
    });

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee not found or already paid'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount), // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}_${feeId}`,
      payment_capture: 1,
      notes: {
        feeId: feeId.toString(),
        studentId: studentId.toString(),
        term: fee.term
      }
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    await Payment.create({
      student: studentId,
      fee: feeId,
      amount: amount / 100, // Convert back to rupees
      razorpayOrderId: order.id,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      order: order,
      fee: fee
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      feeId
    } = req.body;

    // Generate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET_KEY')
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature"
      });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'completed',
        paymentMethod: 'razorpay',
        metadata: req.body
      },
      { new: true }
    );

    // Update fee status
    await Fee.findByIdAndUpdate(feeId, {
      status: 'paid',
      paidDate: new Date(),
      paymentMethod: 'razorpay',
      transactionId: razorpay_payment_id
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: payment
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const studentId = req.user._id;

    const payments = await Payment.find({ student: studentId })
      .populate('fee', 'term amount dueDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments: payments
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
};

// Test endpoint
exports.test = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payments API is working',
    timestamp: new Date().toISOString()
  });
};