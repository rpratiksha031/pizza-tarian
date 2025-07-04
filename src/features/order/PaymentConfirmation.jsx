import React from 'react';

const PaymentConfirmation = ({ 
  isSuccess, 
  transactionId, 
  amount, 
  method,
  onContinue,
  onRetry 
}) => {
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
            <p className="text-gray-600 mb-2">
              Payment Method: {method}
            </p>
            <p className="text-gray-600 mb-4">
              Transaction ID: {transactionId}
            </p>
            <p className="text-sm text-gray-500">
              Your order has been placed successfully! You will be redirected to your order details.
            </p>
          </div>
        ) : (
          <p className="text-gray-600 mb-4">
            Please try again or contact support if the problem persists.
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        {!isSuccess && (
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
        
        <button
          onClick={onContinue}
          className={`${!isSuccess ? 'flex-1' : 'w-full'} ${
            isSuccess 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
          } text-white py-2 px-4 rounded-lg`}
        >
          {isSuccess ? 'Continue to Order' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;