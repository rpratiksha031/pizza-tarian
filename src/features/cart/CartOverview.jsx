import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {

  const totalCarQuantity=useSelector(getTotalCartQuantity);
  const totalPrice= useSelector(getTotalCartPrice);
  if (!totalCarQuantity) return null;
  return (
    <div className="bg-stone-800 text-white uppercase p-4 text-sm md:text-base flex items-center justify-between">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{totalCarQuantity} pizzas</span>
        <span>{formatCurrency (totalPrice)}  </span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
