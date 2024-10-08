import { useState} from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {

  const [withPriority, setWithPriority] = useState(false);

  const {username,status:addressStatus,
    position,
    address,
    error:errorAddress

  }=useSelector ((state)=>state.user);

  const isLoadingAddress=addressStatus==='loading';

  const dispatch=useDispatch();

  const navigate = useNavigation();
  const isSubmitting = navigate.state === "submitting";

  const formErrors = useActionData();
  // const cart = fakeCart;

  const cart=useSelector(getCart);
  const totalCartPrice= useSelector(getTotalCartPrice);
    const priorityPrice=withPriority? totalCartPrice*0.2:0;
   const totalPrice=totalCartPrice+priorityPrice;

    if(!cart.length) return <EmptyCart/>
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold ">Ready to order? Let&apos;s go!</h2>

      

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center grow">
          <label className="sm:basis-40">First Name</label>
          <input  className="input w-full" type="text" name="customer" defaultValue={username} required />
        </div>

        <div  className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p className="text-xs mt-2 rounded-md bg-red-100 p-2 text-red-700 ">{formErrors.phone} </p>}
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative ">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input type="text"
            className="input w-full mb-5"
            name="address" required
            disabled={isLoadingAddress} />

{addressStatus==='error' && <p className="text-xs mt-2 rounded-md bg-red-100 p-2 text-red-700 ">{errorAddress}</p>}

          </div>



          {!position.latitude && !position.longitude&&(
            <span className=" mb-5  absolute right-[4px] ">
          <Button
          disabled={isLoadingAddress}
          defaultValue={address}
          type="small" onClick={(e)=>{
            e.preventDefault();
            dispatch(fetchAddress)
          }
            
            }>get position</Button>
          </span>)}
        
        </div>

        <div className="mb-12 flex items-centergap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="mx-3 h-6 w-6 accent-yellow-400 focus:ring-yellow-400focus:ring-offset-2 "
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium" >Want to yo give your order priority?</label>
        </div>

        <div>
          <Button  disabled={isSubmitting|| isLoadingAddress}  type="primary">
            {isSubmitting ? "Placing order" : `Order now for ${formatCurrency(totalPrice)} `}
          </Button>
        </div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // console.log(data);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  // console.log(order);

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone = "Please give us your valid contact number.";
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  store.dispatch (clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
