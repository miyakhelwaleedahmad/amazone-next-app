// orders.tsx
import React from "react";

type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
};

const dummyOrders: Order[] = [
  { id: "1001", date: "2025-09-10", total: 2500, status: "Delivered" },
  { id: "1002", date: "2025-09-15", total: 4000, status: "Processing" },
];

export default function OrdersPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <div className="space-y-4">
        {dummyOrders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded shadow-sm flex justify-between"
          >
            <div>
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Date:</strong> {order.date}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">Rs. {order.total}</p>
              <button className="text-blue-600 underline">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
