import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Wallet,
  DollarSign,
  Lock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  ArrowLeft,
  Shield
} from 'lucide-react';
import Order from './Order';

// PaymentConfirmation Component
const PaymentConfirmation = ({ 
  isSuccess = true, 
  transactionId = '', 
  amount = 0, 
  method = '', 
  onContinue = () => {}, 
  onRetry = () => {} 
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8 text-center">
        {isSuccess ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-600">Thank you for your order</p>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₹{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium capitalize">{method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            </div>
            
          
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="text-gray-600">Something went wrong with your payment</p>
            
            <div className="flex space-x-3">
              <button
                onClick={onRetry}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
              >
                Try Again
              </button>
              <button
                onClick={onContinue}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Payment Gateway Component
export default function PaymentGateway({
  totalAmount = 1299,
  onPaymentSuccess = (data) => console.log('Payment successful:', data),
  onPaymentCancel = () => console.log('Payment cancelled'),
  isProcessing = false
}) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    walletType: 'paytm'
  });
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'cod', name: 'COD', icon: DollarSign },
    { id: 'razorpay', name: 'Razorpay', icon: Zap }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (selectedMethod === 'card') {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        newErrors.cardNumber = 'Enter valid card number';
      }
      if (!paymentData.expiryDate) {
        newErrors.expiryDate = 'Enter expiry date';
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        newErrors.cvv = 'Enter valid CVV';
      }
      if (!paymentData.cardName) {
        newErrors.cardName = 'Enter cardholder name';
      }
    } else if (selectedMethod === 'upi') {
      if (!paymentData.upiId || !paymentData.upiId.includes('@')) {
        newErrors.upiId = 'Enter valid UPI ID';
      }
       }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulatePayment = () => {
    try {
      if (selectedMethod !== 'cod' && !validateForm()) {
        return;
      }

      setProcessing(true);
      setErrors({});
      
      // Simulate payment processing delay
      setTimeout(() => {
        try {
          // Simulate random success/failure (90% success rate)
          const isSuccess = Math.random() > 0.1;
          
          const result = {
            transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            method: selectedMethod,
            amount: totalAmount,
            status: isSuccess ? 'success' : 'failed',
            timestamp: new Date().toISOString(),
            paymentMethod: selectedMethod,
            ...(selectedMethod === 'card' && { 
              cardLast4: paymentData.cardNumber.slice(-4) || '****' 
            }),
            ...(selectedMethod === 'upi' && { 
              upiId: paymentData.upiId || '' 
            }),
            ...(selectedMethod === 'wallet' && { 
              walletType: paymentData.walletType || 'paytm' 
            })
          };
          
          console.log('Payment simulation result:', result);
          setPaymentResult(result);
          setProcessing(false);
          setShowConfirmation(true);
        } catch (error) {
          console.error('Error in payment simulation:', error);
          setProcessing(false);
          alert('Payment processing failed. Please try again.');
        }
      }, 2000);
    } catch (error) {
      console.error('Error initiating payment:', error);
      setProcessing(false);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderCardForm = () => (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Card Number"
          value={paymentData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength="16"
        />
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="MM/YY"
            value={paymentData.expiryDate}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
              }
              handleInputChange('expiryDate', value);
            }}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength="5"
          />
          {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="CVV"
            value={paymentData.cvv}
            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cvv ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength="3"
          />
          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
        </div>
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Cardholder Name"
          value={paymentData.cardName}
          onChange={(e) => handleInputChange('cardName', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cardName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
      </div>
    </div>
  );

  const renderUPIForm = () => (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="UPI ID (e.g., user@paytm)"
          value={paymentData.upiId}
          onChange={(e) => handleInputChange('upiId', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.upiId ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
      </div>
    </div>
  );

  const renderWalletForm = () => (
    <div className="space-y-4">
      <div>
        <select
          value={paymentData.walletType}
          onChange={(e) => handleInputChange('walletType', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="paytm">Paytm</option>
          <option value="phonepe">PhonePe</option>
          <option value="googlepay">Google Pay</option>
          <option value="amazonpay">Amazon Pay</option>
        </select>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (selectedMethod) {
      case 'card':
        return renderCardForm();
      case 'upi':
        return renderUPIForm();
      case 'wallet':
        return renderWalletForm();
      case 'cod':
        return (
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-gray-700">You will pay ₹{totalAmount} when your order is delivered.</p>
          </div>
        );
      case 'razorpay':
        return (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700">Quick and secure payment via Razorpay</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Show confirmation screen
  if (showConfirmation && paymentResult) {
    return (
      <div className="py-8">
        <PaymentConfirmation
          isSuccess={paymentResult.status === 'success'}
          transactionId={paymentResult.transactionId}
          amount={paymentResult.amount}
          method={paymentResult.method}
          onContinue={() => {
            try {
              if (paymentResult.status === 'success') {
                // Store payment data safely
                if (typeof window !== 'undefined' && window.localStorage) {
                  localStorage.setItem('paymentData', JSON.stringify(paymentResult));
                }
                
                // Call success handler safely
                if (typeof onPaymentSuccess === 'function') {
                  onPaymentSuccess(paymentResult);
                } else {
                  console.log('Payment successful:', paymentResult);
                  alert('Payment successful! Order confirmed.');
                }
              } else {
                // Call cancel handler safely
                if (typeof onPaymentCancel === 'function') {
                  onPaymentCancel();
                } else {
                  console.log('Payment failed');
                  alert('Payment failed. Please try again.');
                }
              }
            } catch (error) {
              console.error('Error handling payment completion:', error);
              alert('Payment was processed, but there was an error. Please contact support.');
            }
          }}
          onRetry={() => {
            try {
              setShowConfirmation(false);
              setPaymentResult(null);
              setProcessing(false);
              setErrors({});
              console.log('Payment retry initiated');
            } catch (error) {
              console.error('Error during payment retry:', error);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl font-bold">Secure Payment</h2>
        <div className="flex items-center space-x-2">
          <Shield size={16} />
          <Lock size={16} />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Amount Display */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-gray-800">₹{totalAmount}</p>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Choose Payment Method</h3>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedMethod(id)}
                className={`flex flex-col items-center p-3 border rounded-lg transition-all ${
                  selectedMethod === id
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          {renderForm()}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={simulatePayment}
            disabled={processing}
            className={`w-full font-bold py-4 rounded-lg transition-all ${
              processing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <RefreshCw size={20} className="animate-spin mr-2" />
                Processing Payment...
              </div>
            ) : (
              `Pay ₹${totalAmount}`
            )}
          </button>
          
          <button
            onClick={() => {
              try {
                if (typeof onPaymentCancel === 'function') {
                  onPaymentCancel();
                } else {
                  console.log('Payment cancelled by user');
                  alert('Payment cancelled');
                }
              } catch (error) {
                console.error('Error cancelling payment:', error);
              }
            }}
            disabled={processing}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            Cancel Order
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 flex items-center justify-center space-x-1">
          <Lock size={12} />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}