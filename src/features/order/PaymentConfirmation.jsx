import React, { useState, useEffect } from 'react';
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

// Payment Confirmation Component
function PaymentConfirmation({ isSuccess, transactionId, amount, method, onContinue, onRetry }) {
  const methodNames = {
    card: 'Credit/Debit Card',
    upi: 'UPI',
    wallet: 'Digital Wallet',
    cod: 'Cash on Delivery'
  };

  // Auto-redirect after successful payment
  useEffect(() => {
    if (isSuccess && onContinue) {
      const timer = setTimeout(() => {
        onContinue();
      }, 2000); // 2 second delay to show success message

      return () => clearTimeout(timer);
    }
  }, [isSuccess, onContinue]);

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
            ? 'Your payment has been processed successfully. Redirecting...' 
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

      {/* Only show buttons for failed payments */}
      {!isSuccess && (
        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
          >
            Go Back
          </button>
          
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}