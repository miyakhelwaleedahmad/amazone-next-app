import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Order {
  customerName: string;
  email: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  status: string;
  date: string;
}

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState<Order>({
    customerName: "",
    email: "",
    items: [],
    totalAmount: 0,
    status: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setOrder({ ...order, status: newStatus });
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
      setMessage("✅ Status updated!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update status");
    }
  };

  if (loading) return <p>Loading order...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📦 Order Details</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <p><strong>Customer:</strong> {order.customerName}</p>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Total:</strong> ${order.totalAmount}</p>
      <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Items:</h2>
      <ul className="list-disc pl-6">
        {order.items.map((item, i) => (
          <li key={i}>{item.name} - Qty: {item.qty} - ${item.price}</li>
        ))}
      </ul>

      <div className="mt-4">
        <label className="block mb-1">Order Status:</label>
        <select
          value={order.status}
          onChange={handleStatusChange}
          className="border p-2 rounded w-full"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
