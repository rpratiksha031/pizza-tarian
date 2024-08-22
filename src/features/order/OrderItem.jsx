import { formatCurrency } from "../../utils/helpers";

function OrderItem({ item, isLoadingIngredients, ingredients }) {
  const { quantity, name, totalPrice } = item;
// console.log(isLoadingIngredients);
// console.log(ingredients);
  return (
    <li className="py-3">
      <div className="flex item-centr justify-between gap-4 text-sm">
        <p>
          <span>{quantity}&times;</span> {name}
        </p>
        <p className="font-bold">{formatCurrency(totalPrice)}</p>
      </div>
      <p className="text-sm capitalize italic text-stone-500">
        {isLoadingIngredients?'loading...':ingredients.join(',')}
      </p>
    </li>
  );
}

export default OrderItem;
