import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";
import PaymentGateway from './PaymentGateway';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress
  } = useSelector((state) => state.user);

  const isLoadingAddress = addressStatus === 'loading';

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();
  const cart = useSelector(getCart) || [];
  const totalCartPrice = useSelector(getTotalCartPrice) || 0;
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    
    // Validate form first
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const errors = {};
    if (!data.customer.trim()) {
      errors.customer = "Please enter your name";
    }
    if (!isValidPhone(data.phone)) {
      errors.phone = "Please give us your valid contact number.";
    }
    if (!data.address.trim()) {
      errors.address = "Please enter your address";
    }
    
    if (Object.keys(errors).length > 0) {
      // You might want to set these errors to state and display them
      console.error("Form validation errors:", errors);
      return;
    }
    
    // Prepare order data
    const order = {
      ...data,
      cart: cart,
      priority: withPriority,
      totalPrice: totalPrice
    };
    
    setOrderData(order);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Add payment info to order
      const finalOrder = {
        ...orderData,
        paymentId: paymentData.transactionId,
        paymentMethod: paymentData.method,
        paymentStatus: 'completed'
      };
      
      const newOrder = await createOrder(finalOrder);
      console.log("Order created:", newOrder);
      store.dispatch(clearCart());
      
      // Redirect to order confirmation
      window.location.href = `/order/${newOrder.id}`;
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle error - maybe show error message
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setOrderData(null);
  };

  // Show payment gateway if payment is initiated
  if (showPayment && orderData) {
    return (
      <PaymentGateway
        totalAmount={orderData.totalPrice}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentCancel={handlePaymentCancel}
        isProcessing={false}
      />
    );
  }

  if (!cart.length) return <EmptyCart />;
  if (formErrors?.general) {
    return (
      <div className="px-4 py-6">
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
          <p>{formErrors.general}</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let&apos;s go!</h2>

      <Form method="POST" onSubmit={handleOrderSubmit}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center grow">
          <label className="sm:basis-40">First Name</label>
          <input 
            className="input w-full" 
            type="text" 
            name="customer" 
            defaultValue={username} 
            required 
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
          </div>
          {formErrors?.phone && (
            <p className="text-xs mt-2 rounded-md bg-red-100 p-2 text-red-700">
              {formErrors.phone}
            </p>
          )}
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input 
              type="text"
              className="input w-full"
              name="address" 
              required
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {addressStatus === 'error' && (
              <p className="text-xs mt-2 rounded-md bg-red-100 p-2 text-red-700">
                {errorAddress}
              </p>
            )}
          </div>

          {!position.latitude && !position.longitude && (
            <span className="absolute right-[4px] top-0">
              <Button
                disabled={isLoadingAddress}
                type="small" 
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:ring-yellow-400 focus:ring-offset-2"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting ? "Processing..." : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input type="hidden" name="priority" value={withPriority} />
      </Form>
    </div>
  );
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // Parse cart data safely
    let cart;
    try {
      cart = JSON.parse(data.cart || '[]');
    } catch (parseError) {
      console.error("Error parsing cart data:", parseError);
      return { general: "Invalid cart data" };
    }

    // Validate cart structure
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array:", cart);
      return { general: "Invalid cart format" };
    }

    // Ensure each cart item has required properties
    const validatedCart = cart.map(item => ({
      ...item,
      addOns: item.addOns || [],
      ingredients: item.ingredients || []
    }));

    const order = {
      ...data,
      cart: validatedCart,
      priority: data.priority === "true",
    };

    console.log("Order data:", order); // Debug log

    const errors = {};
    if (!isValidPhone(order.phone))
      errors.phone = "Please give us your valid contact number.";
    
    if (Object.keys(errors).length > 0) return errors;

    const newOrder = await createOrder(order);
    console.log("Order created:", newOrder); // Debug log
    store.dispatch(clearCart());
    return redirect(`/order/${newOrder.id}`);
  } catch (error) {
    console.error("Error in action:", error);
    return { general: "Failed to create order. Please try again." };
  }
}

export default CreateOrder;