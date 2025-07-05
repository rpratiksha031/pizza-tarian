// Test ID: IIDSAT

import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";

import { getOrder } from "../../services/apiRestaurant";
import { useFetcher, useLoaderData } from "react-router-dom";
import OrderItem from './OrderItem';
import { useEffect } from "react";

function Summary() {
  const order = useLoaderData();

  const fetcher = useFetcher();
  console.log(fetcher);
  
  useEffect(function() {
    if (!fetcher.data && fetcher.state === 'idle')
      fetcher.load('/menu');
  }, [fetcher]);

  // Everyone can search for all orders, so for privacy reasons we're gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold text-stone-800">Order # {id}</h2>

        <div className="flex gap-2">
          {priority && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-white">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-white">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 bg-yellow-100 px-6 py-5 rounded-md shadow-sm">
        <p className="font-semibold text-stone-800">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-600">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-stone-200 divide-y border-b border-t">
        {cart.map((item) => (
          <OrderItem 
            item={item} 
            key={item.pizzaId} 
            isLoadingIngredients={fetcher.state === 'loading'}
            ingredients={fetcher.data?.find((ele) => ele.id === item.pizzaId)?.ingredients}
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Summary;