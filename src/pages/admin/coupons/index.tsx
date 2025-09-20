import { useEffect, useState } from "react";
import Link from "next/link";

interface Coupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string;
  active: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch("/api/admin/coupons");
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) return <p>Loading coupons...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Coupons</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4">Discount</th>
            <th className="py-3 px-4">Expires</th>
            <th className="py-3 px-4">Active</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(c => (
            <tr key={c._id} className="border-t">
              <td className="py-2 px-4">{c.code}</td>
              <td className="py-2 px-4">{c.discountValue} ({c.discountType})</td>
              <td className="py-2 px-4">{new Date(c.expiresAt).toLocaleDateString()}</td>
              <td className="py-2 px-4">{c.active ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
