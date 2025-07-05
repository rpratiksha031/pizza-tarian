// src/features/order/PaymentGateway.jsx
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
  Zap
} from 'lucide-react';

// Confirmation screen component
function PaymentConfirmation({ isSuccess, transactionId, amount, method, onContinue, onRetry }) {
  const methodNames = {
    card: 'Credit/Debit Card',
    upi: 'UPI',
    wallet: 'Digital Wallet',
    cod: 'Cash on Delivery',
    razorpay: 'Razorpay'
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6 text-center">
      <div className="flex flex-col items-center">
        {isSuccess ? (
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
        )}
        <h2 className={`text-2xl font-bold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>  
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h2>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold">₹{amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Method:</span>
          <span className="font-semibold">{methodNames[method]}</span>
        </div>
        {transactionId && (
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-sm">{transactionId}</span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <button
          onClick={onContinue}
          className={`w-full py-2 rounded-lg font-medium transition ${
            isSuccess
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
          }`}
        >
          {isSuccess ? 'Continue' : 'Go Back'}
        </button>
        {!isSuccess && (
          <button
            onClick={onRetry}
            className="w-full py-2 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            <RefreshCw size={18} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function PaymentGateway({
  totalAmount = 1299,
  onPaymentSuccess = data => console.log('Payment successful:', data),
  onPaymentCancel = () => console.log('Payment cancelled'),
  isProcessing = false
}) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiryDate: '', cvv: '', cardName: '', upiId: '', walletType: 'paytm' });
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'cod', name: 'COD', icon: DollarSign },
    { id: 'razorpay', name: 'Razorpay', icon: Zap }
  ];

  const handleRazorpayPayment = () => {
    const options = {
      key: 'rzp_test_yourKeyHere',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'PizzaTarian',
      image: '/logo192.png',
      description: 'Complete your order',
      handler: res => {
        setPaymentResult({
          transactionId: res.razorpay_payment_id,
          method: 'razorpay',
          amount: totalAmount,
          status: 'success',
          timestamp: new Date().toISOString()
        });
        setShowConfirmation(true);
      },
      prefill: { name: '', email: '', contact: '' },
      theme: { color: '#facc15' }
    };
    new window.Razorpay(options).open();
  };

  const renderForm = () => {
    // Only Razorpay for demo simplicity
    if (selectedMethod === 'razorpay') {
      return (
        <button
          onClick={handleRazorpayPayment}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition"
        >
          Pay ₹{totalAmount} with Razorpay
        </button>
      );
    }
    return (
      <button
        onClick={onPaymentCancel}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
      >
        {`Pay ₹${totalAmount}`}
      </button>
    );
  };

  if (showConfirmation && paymentResult) {
    return (
      <div className="py-8">
        <PaymentConfirmation
          isSuccess={paymentResult.status === 'success'}
          transactionId={paymentResult.transactionId}
          amount={paymentResult.amount}
          method={paymentResult.method}
          onContinue={() => onPaymentSuccess(paymentResult)}
          onRetry={() => setShowConfirmation(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl font-bold">Secure Payment</h2>
        <Lock size={20} />
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {paymentMethods.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedMethod(id)}
              className={`flex flex-col items-center p-3 border rounded-lg transition ${
                selectedMethod === id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon size={24} className="mb-2" />
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>
        <div>{renderForm()}</div>
      </div>
    </div>
  );
}
