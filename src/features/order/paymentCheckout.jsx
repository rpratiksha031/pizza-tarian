// In your parent component (e.g., CheckoutPage.jsx)
import { useNavigate } from 'react-router-dom';
import PaymentGateway from './PaymentGateway';

function CheckoutPage() {
  const navigate = useNavigate();
  
  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    
    // Save payment data if needed
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    
    // Navigate to an existing page in your app
    navigate('/'); // Go to home page
    // OR navigate('/orders'); // If you have an orders page
    // OR navigate('/dashboard'); // If you have a dashboard
  };
  
  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    navigate('/'); // Go back to home or previous page
  };
  
  return (
    <PaymentGateway
      totalAmount={1299}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentCancel={handlePaymentCancel}
    />
  );
}

export default CheckoutPage;