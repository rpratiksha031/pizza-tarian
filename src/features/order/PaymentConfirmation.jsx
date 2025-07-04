// PaymentConfirmation.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentConfirmation = ({ 
  isSuccess, 
  transactionId, 
  amount, 
  onContinue 
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="mb-6">
        {isSuccess ? (
          <div className="text-green-600 text-6xl mb-4">✅</div>
        ) : (
          <div className="text-red-600 text-6xl mb-4">❌</div>
        )}
        
        <h2 className="text-2xl font-bold mb-2">
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h2>
        
        {isSuccess ? (
          <div>
            <p className="text-gray-600 mb-2">
              Amount: ₹{amount}
            </p>
            <p className="text-gray-600 mb-4">
              Transaction ID: {transactionId}
            </p>
            <p className="text-sm text-gray-500">
              Your order has been placed successfully!
            </p>
          </div>
        ) : (
          <p className="text-gray-600">
            Please try again or contact support if the problem persists.
          </p>
        )}
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        {isSuccess ? 'Continue to Order' : 'Try Again'}
      </button>
    </div>
  );
};

export default PaymentConfirmation;