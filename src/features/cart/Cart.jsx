// import { Link } from 'react-router-dom';
import LinkButton from '../../ui/LinkButton';
import Button from '../../ui/Button';
import CartItem from './CartItem';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart } from './cartSlice';
import EmptyCart from './EmptyCart';

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function Cart() {
  const username=useSelector ((state)=>state.user.username);

  const cart =useSelector(getCart);
  const dispatch=useDispatch();
 
 if(!cart.length) return <EmptyCart/>
  return (
  <div className="px-4 py-6 bg-yellow-100 rounded-xl shadow-md text-stone-800">
<div className="text-red-600 font-semibold hover:underline inline-block mb-2">
  <LinkButton to="/menu">&larr; Back to menu</LinkButton>
</div>



  <h2 className="mt-7 text-2xl font-bold">Your cart, {username}</h2>

  <ul className="divide-y divide-yellow-300 border-b border-yellow-400 mt-4">
    {cart.map((item) => (
      <CartItem item={item} key={item.pizzaId} />
    ))}
  </ul>

  <div className="mt-6 flex flex-wrap gap-4">
    <Button type="primary" to="/order/new">
      Order pizzas
    </Button>
    <Button type="secondary" onClick={() => dispatch(clearCart())}>
      Clear cart
    </Button>
  </div>
</div>

  );
}

export default Cart;
