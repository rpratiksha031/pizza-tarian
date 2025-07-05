
import { useState } from 'react';

// PaymentConfirmation component (inline since it's imported)
const PaymentConfirmation = ({ 
  isSuccess, 
  transactionId, 
  amount, 
  method, 
  onContinue, 
  onRetry 
}) => {
  const methodNames = {
    card: 'Credit/Debit Card',
    upi: 'UPI',
    wallet: 'Digital Wallet',
    cod: 'Cash on Delivery'
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center">
        <div className="mb-4">
          {isSuccess ? (
            <div className="text-green-500 text-6xl">✓</div>
          ) : (
            <div className="text-red-500 text-6xl">✗</div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h2>
        
        {isSuccess ? (
          <div className="space-y-3">
            <p className="text-gray-600">
              Your payment has been processed successfully.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                Transaction ID: {transactionId}
              </p>
              <p className="text-sm text-green-800">
                Amount: ₹{amount}
              </p>
              <p className="text-sm text-green-800">
                Method: {methodNames[method]}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600">
              Your payment could not be processed. Please try again.
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800">
                Amount: ₹{amount}
              </p>
              <p className="text-sm text-red-800">
                Method: {methodNames[method]}
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 space-y-3">
          {isSuccess ? (
            <button
              onClick={onContinue}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={onRetry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={onContinue}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};