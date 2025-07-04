import { useState } from 'react';
import PaymentConfirmation from './PaymentConfirmation';

// Simple icon components using Unicode/CSS
const CreditCard = ({ size = 24, className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <span className="text-lg">💳</span>
  </div>
);

const Smartphone = ({ size = 24, className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <span className="text-lg">📱</span>
  </div>
);

const Wallet = ({ size = 24, className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <span className="text-lg">👛</span>
  </div>
);

const DollarSign = ({ size = 24, className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <span className="text-lg">💵</span>
  </div>
);

const Lock = ({ size = 16, className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <span className="text-sm">🔒</span>
  </div>
);

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
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet },
    { id: 'cod', name: 'Cash on Delivery', icon: DollarSign }
  ];

  const walletOptions = [
    { id: 'paytm', name: 'Paytm' },
    { id: 'phonepe', name: 'PhonePe' },
    { id: 'googlepay', name: 'Google Pay' },
    { id: 'amazonpay', name: 'Amazon Pay' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (selectedMethod === 'card') {
      // Remove spaces for validation
      const cardNumberDigits = paymentData.cardNumber.replace(/\s/g, '');
      if (!cardNumberDigits || cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
        newErrors.cardNumber = 'Valid card number is required (13-19 digits)';
      }
      if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
      } else {
        // Validate expiry date is not in the past
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const v = value.replace(/\D/g, '');
    
    // Limit to 19 digits
    const trimmed = v.substring(0, 19);
    
    // Add spaces every 4 digits
    const parts = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      parts.push(trimmed.substring(i, i + 4));
    }
    
    return parts.join(' ');
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const v = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.1;
      
      const result = {
        transactionId: 'TXN' + Date.now(),
        method: selectedMethod,
        amount: totalAmount,
        status: isSuccess ? 'success' : 'failed'
      };
      
      setPaymentResult(result);
      setShowConfirmation(true);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentResult({
        transactionId: null,
        method: selectedMethod,
        amount: totalAmount,
        status: 'failed'
      });
      setShowConfirmation(true);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmationContinue = () => {
    if (paymentResult.status === 'success') {
      onPaymentSuccess(paymentResult);
    } else {
      onPaymentCancel();
    }
  };

  const handleRetry = () => {
    setShowConfirmation(false);
    setPaymentResult(null);
    setErrors({});
  };

  // Show confirmation screen
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                  placeholder="123"
                  maxLength="4"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={paymentData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.cardName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
              )}
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                value={paymentData.upiId}
                onChange={(e) => handleInputChange('upiId', e.target.value.toLowerCase())}
                placeholder="yourname@upi"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.upiId ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.upiId && (
                <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                You&apos;ll be redirected to your UPI app to complete the payment.
              </p>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Wallet
              </label>
              <select
                value={paymentData.walletType}
                onChange={(e) => handleInputChange('walletType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {walletOptions.map(wallet => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                You&apos;ll be redirected to your selected wallet app to complete the payment.
              </p>
            </div>
          </div>
        );

      case 'cod':
        return (
          <div className="bg-yellow-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <DollarSign className="text-yellow-600" size={24} />
              <div>
                <h3 className="font-medium text-yellow-800">Cash on Delivery</h3>
                <p className="text-sm text-yellow-700">
                  Pay ₹{totalAmount} when your order arrives. Please keep exact change ready.
                </p>
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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
        <p className="text-gray-600">Total Amount: ₹{totalAmount}</p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map(method => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                disabled={isCurrentlyProcessing}
                className={`p-4 border rounded-lg transition-all disabled:opacity-50 ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon size={24} className="mx-auto mb-2" />
                <p className="text-sm font-medium">{method.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      <div className="space-y-6">
        {renderPaymentForm()}

        {/* Security Info */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Lock size={16} />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onPaymentCancel}
            disabled={isCurrentlyProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCurrentlyProcessing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isCurrentlyProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Pay ₹{totalAmount}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}