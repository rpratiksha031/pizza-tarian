
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
{/*             
            <button
              onClick={onContinue}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
            >
              Continue to Order Details
            </button> */}
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