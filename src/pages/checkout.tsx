// checkout.tsx
import React from "react";
import { useRouter } from "next/router";

export default function CheckoutPage() {
  const router = useRouter();

  const handlePlaceOrder = () => {
    // TODO: integrate with backend order API
    alert("Order placed successfully!");
    router.push("/orders");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <form className="space-y-4">
        <div>
          <label className="block font-medium">Shipping Address</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label className="block font-medium">Payment Method</label>
          <select className="border p-2 rounded w-full">
            <option value="card">Credit/Debit Card</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
