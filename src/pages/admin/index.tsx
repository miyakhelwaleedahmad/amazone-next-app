// File: src/pages/admin/index.tsx
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();

  // State for dashboard stats
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    categories: 0,
    coupons: 0,
    customers: 0,
    reviews: 0,
    report: 0,
  });

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard-stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  // Check 2-month re-login
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/admin/check-session");
        const data = await res.json();

        if (!data.allowed) {
          router.push("/admin/login"); // Force login if more than 2 months passed
        }
      } catch (err) {
        console.error("Session check failed:", err);
        router.push("/admin/login"); // Redirect on error
      }
    };
    checkLogin();
  }, [router]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🖥️ Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Add Product */}
        <Link href="/admin/add-product">
          <div className="p-6 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition">
            <h2 className="text-xl font-bold">➕ Add Product</h2>
            <p className="mt-2">{stats.products} products available</p>
          </div>
        </Link>

        {/* Categories */}
        <Link href="/admin/categories">
          <div className="p-6 bg-yellow-600 text-white rounded-lg shadow cursor-pointer hover:bg-yellow-700 transition">
            <h2 className="text-xl font-bold">🗂 Categories</h2>
            <p className="mt-2">{stats.categories} categories available</p>
          </div>
        </Link>

        {/* Coupons */}
        <Link href="/admin/coupons">
          <div className="p-6 bg-pink-600 text-white rounded-lg shadow cursor-pointer hover:bg-pink-700 transition">
            <h2 className="text-xl font-bold">🎟️ Coupons</h2>
            <p className="mt-2">{stats.coupons} coupons created</p>
          </div>
        </Link>

        {/* Customers */}
        <Link href="/admin/customers">
          <div className="p-6 bg-indigo-600 text-white rounded-lg shadow cursor-pointer hover:bg-indigo-700 transition">
            <h2 className="text-xl font-bold">👥 Customers</h2>
            <p className="mt-2">{stats.customers} customers registered</p>
          </div>
        </Link>

        {/* Orders */}
        <Link href="/admin/orders">
          <div className="p-6 bg-blue-600 text-white rounded-lg shadow cursor-pointer hover:bg-blue-700 transition">
            <h2 className="text-xl font-bold">📦 Orders</h2>
            <p className="mt-2">{stats.orders} orders placed</p>
          </div>
        </Link>

        {/* Reviews */}
        <Link href="/admin/reviews">
          <div className="p-6 bg-red-600 text-white rounded-lg shadow cursor-pointer hover:bg-red-700 transition">
            <h2 className="text-xl font-bold">⭐ Reviews</h2>
            <p className="mt-2">{stats.reviews} reviews received</p>
          </div>
        </Link>

        {/* Users (admin / staff) */}
        <Link href="/admin/users">
          <div className="p-6 bg-purple-600 text-white rounded-lg shadow cursor-pointer hover:bg-purple-700 transition">
            <h2 className="text-xl font-bold">👤 Users</h2>
            <p className="mt-2">{stats.users} staff registered</p>
          </div>
        </Link>

        {/* Reports */}
        <Link href="/admin/report">
          <div className="p-6 bg-teal-600 text-white rounded-lg shadow cursor-pointer hover:bg-teal-700 transition">
            <h2 className="text-xl font-bold">📊 Reports</h2>
            <p className="mt-2">{stats.report} reports available</p>
          </div>
        </Link>

        {/* Settings */}
        <Link href="/admin/settings">
          <div className="p-6 bg-gray-600 text-white rounded-lg shadow cursor-pointer hover:bg-gray-700 transition">
            <h2 className="text-xl font-bold">⚙️ Settings</h2>
            <p className="mt-2">Manage your store settings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
