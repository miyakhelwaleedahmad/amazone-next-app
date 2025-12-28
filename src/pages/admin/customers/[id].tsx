// W:\Amazone-clone2\my-app\src\pages\admin\customers\[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/admin/customers/${id}`);
        const data = await res.json();
        setCustomer(data.customer);
      } catch (error) {
        console.error("Failed to fetch customer", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <p className="p-4">Loading customer details...</p>;
  if (!customer) return <p className="p-4">Customer not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <p>
          <span className="font-semibold">Name:</span> {customer.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {customer.email}
        </p>
        {customer.phone && (
          <p>
            <span className="font-semibold">Phone:</span> {customer.phone}
          </p>
        )}
        {customer.address && (
          <p>
            <span className="font-semibold">Address:</span> {customer.address}
          </p>
        )}
        <p>
          <span className="font-semibold">Joined:</span>{" "}
          {new Date(customer.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
