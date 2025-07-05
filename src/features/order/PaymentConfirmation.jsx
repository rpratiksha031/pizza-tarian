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
  Shield,
  Star,
  Zap
} from 'lucide-react';

// If using React Router, uncomment this line:
// import { useNavigate } from 'react-router-dom';

// Payment Confirmation Component
function PaymentConfirmation({ isSuccess, transactionId, amount, method, onContinue, onRetry }) {
  const methodNames = {
    card: 'Credit/Debit Card',
    upi: 'UPI',
    wallet: 'Digital Wallet',
    cod: 'Cash on Delivery'
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center">
      <div className="mb-6">
        {isSuccess ? (
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        ) : (
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        )}
        
        <h2 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h2>
        
        <p className="text-gray-600">
          {isSuccess 
            ? 'Your payment has been processed successfully.' 
            : 'There was an issue processing your payment.'}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold">₹{amount}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Method:</span>
          <span className="font-semibold">{methodNames[method]}</span>
        </div>
        {transactionId && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-semibold text-sm">{transactionId}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={onContinue}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isSuccess 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {isSuccess ? 'Continue' : 'Go Back'}
        </button>
        
        {!isSuccess && (
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Main Payment Gateway Component
export default function PaymentGateway({ 
  totalAmount = 1299, 
  onPaymentSuccess = (data) => {
    console.log('Payment successful:', data);
    // Default navigation - you should override this
    window.location.href = '/order-confirmation';
  }, 
  onPaymentCancel = () => {
    console.log('Payment cancelled');
    // Default navigation - you should override this  
    window.location.href = '/cart';
  },
  isProcessing = false,
  // Add these optional props for better navigation control
  successRedirectUrl = '/order-confirmation',
  cancelRedirectUrl = '/cart'
}) {
  // If using React Router, uncomment this line:
  // const navigate = useNavigate();
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
    { 
      id: 'card', 
      name: 'Card', 
      fullName: 'Credit/Debit Card',
      icon: CreditCard, 
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      activeColor: 'border-blue-500 bg-blue-100'
    },
    { 
      id: 'upi', 
      name: 'UPI', 
      fullName: 'UPI Payment',
      icon: Smartphone, 
      color: 'bg-green-50 border-green-200 text-green-700',
      activeColor: 'border-green-500 bg-green-100'
    },
    { 
      id: 'wallet', 
      name: 'Wallet', 
      fullName: 'Digital Wallet',
      icon: Wallet, 
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      activeColor: 'border-purple-500 bg-purple-100'
    },
    { 
      id: 'cod', 
      name: 'COD', 
      fullName: 'Cash on Delivery',
      icon: DollarSign, 
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      activeColor: 'border-orange-500 bg-orange-100'
    }
  ];

  const walletOptions = [
    { id: 'paytm', name: 'Paytm', color: 'text-blue-600' },
    { id: 'phonepe', name: 'PhonePe', color: 'text-purple-600' },
    { id: 'googlepay', name: 'Google Pay', color: 'text-green-600' },
    { id: 'amazonpay', name: 'Amazon Pay', color: 'text-orange-600' }
  ];

  const validateForm = () => {
    const newErrors = {};

    try {
      if (selectedMethod === 'card') {
        const cardNumberDigits = paymentData.cardNumber.replace(/\s/g, '');
        if (!cardNumberDigits || cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
          newErrors.cardNumber = 'Valid card number is required (13-19 digits)';
        }
        if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
          newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
        } else {
          const [month, year] = paymentData.expiryDate.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;
          
          if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            newErrors.expiryDate = 'Card has expired';
          }
        }
        if (!paymentData.cvv || paymentData.cvv.length < 3 || paymentData.cvv.length > 4) {
          newErrors.cvv = 'Valid CVV is required (3-4 digits)';
        }
        if (!paymentData.cardName.trim()) {
          newErrors.cardName = 'Cardholder name is required';
        }
      }

      if (selectedMethod === 'upi') {
        if (!paymentData.upiId || !paymentData.upiId.includes('@')) {
          newErrors.upiId = 'Valid UPI ID is required (e.g., name@upi)';
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
      newErrors.general = 'Validation failed. Please check your input.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    try {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
      
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    } catch (error) {
      console.error('Input change error:', error);
    }
  };

  const formatCardNumber = (value) => {
    try {
      const v = value.replace(/\D/g, '');
      const trimmed = v.substring(0, 19);
      const parts = [];
      for (let i = 0; i < trimmed.length; i += 4) {
        parts.push(trimmed.substring(i, i + 4));
      }
      return parts.join(' ');
    } catch (error) {
      console.error('Card number formatting error:', error);
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    try {
      const v = value.replace(/\D/g, '');
      if (v.length >= 2) {
        return v.substring(0, 2) + '/' + v.substring(2, 4);
      }
      return v;
    } catch (error) {
      console.error('Expiry date formatting error:', error);
      return value;
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!validateForm()) return;

      setProcessing(true);
      setErrors({});

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isSuccess = Math.random() > 0.1;
      
      const result = {
        transactionId: isSuccess ? 'TXN' + Date.now() : null,
        method: selectedMethod,
        amount: totalAmount,
        status: isSuccess ? 'success' : 'failed',
        timestamp: new Date().toISOString()
      };
      
      setPaymentResult(result);
      setShowConfirmation(true);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrors({
        general: 'Payment processing failed. Please try again.'
      });
      setPaymentResult({
        transactionId: null,
        method: selectedMethod,
        amount: totalAmount,
        status: 'failed',
        timestamp: new Date().toISOString()
      });
      setShowConfirmation(true);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmationContinue = () => {
    try {
      if (paymentResult && paymentResult.status === 'success') {
        // Call the success callback first
        onPaymentSuccess(paymentResult);
        
        // Then handle navigation
        // Option 1: Using React Router (uncomment if using React Router)
        // navigate(successRedirectUrl);
        
        // Option 2: Using window.location (current fallback)
        // Comment out the line below if using React Router
        if (typeof onPaymentSuccess === 'function' && onPaymentSuccess.toString().includes('console.log')) {
          // Only redirect if using default callback
          setTimeout(() => {
            window.location.href = successRedirectUrl;
          }, 100);
        }
      } else {
        onPaymentCancel();
        
        // Handle failed payment navigation
        // Option 1: Using React Router (uncomment if using React Router)
        // navigate(cancelRedirectUrl);
        
        // Option 2: Using window.location (current fallback)
        if (typeof onPaymentCancel === 'function' && onPaymentCancel.toString().includes('console.log')) {
          // Only redirect if using default callback
          setTimeout(() => {
            window.location.href = cancelRedirectUrl;
          }, 100);
        }
      }
    } catch (error) {
      console.error('Confirmation continue error:', error);
      // Fallback navigation on error
      window.location.href = '/';
    }
  };

  const handleRetry = () => {
    try {
      setShowConfirmation(false);
      setPaymentResult(null);
      setErrors({});
    } catch (error) {
      console.error('Retry error:', error);
    }
  };

  if (showConfirmation && paymentResult) {
    return (
      <PaymentConfirmation
        isSuccess={paymentResult.status === 'success'}
        transactionId={paymentResult.transactionId}
        amount={paymentResult.amount}
        method={paymentResult.method}
        onContinue={handleConfirmationContinue}
        onRetry={handleRetry}
      />
    );
  }

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-200'
                  }`}
                  autoComplete="cc-number"
                />
                <CreditCard className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                  autoComplete="cc-exp"
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                  placeholder="123"
                  maxLength="4"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.cvv ? 'border-red-500' : 'border-gray-200'
                  }`}
                  autoComplete="cc-csc"
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={paymentData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.cardName ? 'border-red-500' : 'border-gray-200'
                }`}
                autoComplete="cc-name"
              />
              {errors.cardName && (
                <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
              )}
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value.toLowerCase())}
                  placeholder="yourname@upi"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.upiId ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <Smartphone className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
              {errors.upiId && (
                <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
              )}
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="text-green-600" size={20} />
                <span className="font-semibold text-green-800">Quick & Secure</span>
              </div>
              <p className="text-sm text-green-700">
                You will be redirected to your UPI app to complete the payment securely.
              </p>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Wallet
              </label>
              <select
                value={paymentData.walletType}
                onChange={(e) => handleInputChange('walletType', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                {walletOptions.map(wallet => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Wallet className="text-purple-600" size={20} />
                <span className="font-semibold text-purple-800">Digital Wallet</span>
              </div>
              <p className="text-sm text-purple-700">
                You will be redirected to your selected wallet app to complete the payment.
              </p>
            </div>
          </div>
        );

      case 'cod':
        return (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 mb-1">Cash on Delivery</h3>
                <p className="text-sm text-orange-700">
                  Pay ₹{totalAmount} when your order arrives. Please keep exact change ready.
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <Star className="text-orange-500" size={16} />
                  <span className="text-sm text-orange-600">No processing fees</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isCurrentlyProcessing = processing || isProcessing;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Secure Payment</h2>
            <p className="text-blue-100">Complete your purchase safely</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Shield className="text-white" size={24} />
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-blue-100">Total Amount</span>
            <span className="text-2xl font-bold">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm font-medium">{errors.general}</p>
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  disabled={isCurrentlyProcessing}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 disabled:opacity-50 ${
                    isSelected
                      ? `${method.activeColor} shadow-lg transform scale-105`
                      : `${method.color} hover:shadow-md hover:scale-102`
                  }`}
                >
                  <Icon size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-semibold">{method.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          {renderPaymentForm()}

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
            <Lock size={16} />
            <span>256-bit SSL encryption • Your data is protected</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onPaymentCancel}
              disabled={isCurrentlyProcessing}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isCurrentlyProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-medium flex items-center justify-center space-x-2"
            >
              {isCurrentlyProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Pay ₹{totalAmount}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}