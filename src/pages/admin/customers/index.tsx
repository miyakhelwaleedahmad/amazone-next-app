// src/pages/admin/customers/index.tsx
import { useEffect, useState } from "react";
import Link from "next/link";

interface Customer {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/admin/customers");
        const data = await res.json();
        setCustomers(data); // ✅ API returns array directly, not { customers }
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <p className="p-4">Loading customers...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Registered</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id} className="border-t">
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.email}</td>
              <td className="py-2 px-4">
                {new Date(customer.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-4">
                <Link
                  href={`/admin/customers/${customer._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
