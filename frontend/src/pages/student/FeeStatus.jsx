import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ScheduleIcon from "@mui/icons-material/Schedule";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import HistoryIcon from "@mui/icons-material/History";
import studentService from "../../api/studentService";
import paymentService from "../../api/paymentService";

const FeeStatus = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalPending: 0,
    totalUpcoming: 0,
    totalAnnual: 0
  });

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      const response = await studentService.getFeeStatus();
      
      if (response.success) {
        setFees(response.fees.details);
        setSummary(response.fees.summary);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch fee data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return "success";
      case "pending": return "warning";
      case "upcoming": return "info";
      case "overdue": return "error";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay'));

      document.head.appendChild(script);
    });
  };

  // Main payment function
  const handlePayment = async (fee) => {
    try {
      setProcessing(true);
      
      // 1. Check Razorpay
      await loadRazorpayScript();
      
      if (!window.Razorpay) {
        throw new Error("Payment service not available");
      }

      // 2. Check backend connection
      const testResult = await paymentService.testConnection();
      if (!testResult.success) {
        throw new Error("Payment server not responding");
      }

      // 3. Create order
      const orderResult = await paymentService.createOrder(fee.id, fee.amount);
      if (!orderResult.success) {
        throw new Error(orderResult.message || "Failed to create order");
      }

      // 4. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag",
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: "School Management System",
        description: `Payment for ${fee.term}`,
        order_id: orderResult.order.id,
        image: "https://your-school-logo.com/logo.png", // Add your logo
        handler: async (response) => {
          try {
            const verifyResult = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              feeId: fee.id
            });

            if (verifyResult.success) {
              setSuccessMessage(`Payment successful! Transaction ID: ${response.razorpay_payment_id}`);
              fetchFeeData();
            } else {
              setError("Payment verification failed: " + (verifyResult.message || "Unknown error"));
            }
          } catch (verifyError) {
            setError("Payment verification failed. Please contact support.");
            console.error("Verification error:", verifyError);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || 'Student',
          email: "student@school.com",
          contact: "9999999999"
        },
        theme: {
          color: "#667eea"
        },
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled by user");
            setProcessing(false);
          }
        }
      };

      // 5. Open payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      // 6. Handle errors in payment
      razorpay.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });

    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const handlePayNow = (fee) => {
    setSelectedFee(fee);
    setPaymentDialog(true);
  };

  const handleDownloadInvoice = (fee) => {
    // Generate/download invoice
    console.log("Download invoice:", fee.invoice);
    // Implement invoice download
  };

  const handleViewHistory = async () => {
    try {
      const response = await paymentService.getPaymentHistory();
      console.log("Payment history:", response);
      // Show history in dialog or new page
    } catch (err) {
      setError("Failed to load payment history");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student" userName="Alice Johnson">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" userName="Alice Johnson">
      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => !processing && setPaymentDialog(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          {selectedFee && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedFee.term}
              </Typography>
              <Typography color="text.secondary">
                Amount: <strong>₹{selectedFee.amount.toLocaleString()}</strong>
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Due Date: {formatDate(selectedFee.dueDate)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                You will be redirected to Razorpay's secure payment page.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPaymentDialog(false)} 
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setPaymentDialog(false);
              handlePayment(selectedFee);
            }}
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            {processing ? "Processing..." : "Proceed to Pay"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          color: "#fff",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">
              💳 Fee Status
            </Typography>
            <Typography sx={{ opacity: 0.9 }}>
              View payments, pending dues, and invoices
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={handleViewHistory}
            sx={{ color: '#fff', borderColor: '#fff' }}
          >
            Payment History
          </Button>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          { 
            label: "Total Paid", 
            value: summary.totalPaid, 
            icon: <AccountBalanceWalletIcon />, 
            color: "#4CAF50" 
          },
          { 
            label: "Pending", 
            value: summary.totalPending, 
            icon: <ScheduleIcon />, 
            color: "#FF9800" 
          },
          { 
            label: "Upcoming", 
            value: summary.totalUpcoming, 
            icon: <UpcomingIcon />, 
            color: "#2196F3" 
          },
          { 
            label: "Total Fee", 
            value: summary.totalAnnual, 
            icon: <PaymentIcon />, 
            color: "#9C27B0" 
          },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Card
              sx={{
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography color="text.secondary">{item.label}</Typography>
                  <Box
                    sx={{
                      background: item.color,
                      color: "#fff",
                      p: 1,
                      borderRadius: "50%",
                    }}
                  >
                    {item.icon}
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight="bold" mt={2}>
                  ₹{item.value.toLocaleString()}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Academic Year 2024
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Fee Details Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          📄 Fee Details
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#f5f7fb" }}>
                <TableCell>Term</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id} hover>
                  <TableCell fontWeight="600">{fee.term}</TableCell>
                  <TableCell align="right">₹{fee.amount.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(fee.dueDate)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={fee.status} 
                      color={getStatusColor(fee.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{fee.invoice}</Typography>
                    {fee.paidDate && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Paid: {formatDate(fee.paidDate)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Button 
                        size="small" 
                        startIcon={<ReceiptIcon />}
                        onClick={() => handleDownloadInvoice(fee)}
                        variant="outlined"
                      >
                        Invoice
                      </Button>
                      {fee.status?.toLowerCase() === "pending" && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PaymentIcon />}
                          onClick={() => handlePayNow(fee)}
                          disabled={processing}
                        >
                          Pay Now
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </DashboardLayout>
  );
};

export default FeeStatus;