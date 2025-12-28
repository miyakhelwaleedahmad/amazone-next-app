// src/pages/admin/setting.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Settings {
  storeName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  shippingCost: number;
  maintenanceMode: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    storeName: "",
    email: "",
    phone: "",
    address: "",
    currency: "USD",
    taxRate: 0,
    shippingCost: 0,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/settings");
        setSettings(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put("/api/admin/settings", settings);
      alert("Settings saved successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading settings...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded p-6 space-y-4">
        {/* Store Info */}
        <h2 className="text-lg font-semibold">Store Info</h2>
        <input
          type="text"
          placeholder="Store Name"
          className="border px-3 py-2 w-full rounded"
          value={settings.storeName}
          onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border px-3 py-2 w-full rounded"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          className="border px-3 py-2 w-full rounded"
          value={settings.phone}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          className="border px-3 py-2 w-full rounded"
          value={settings.address}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
        />

        {/* Store Config */}
        <h2 className="text-lg font-semibold mt-6">Store Configuration</h2>
        <input
          type="text"
          placeholder="Currency (e.g. USD)"
          className="border px-3 py-2 w-full rounded"
          value={settings.currency}
          onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
        />
        <input
          type="number"
          placeholder="Tax Rate (%)"
          className="border px-3 py-2 w-full rounded"
          value={settings.taxRate}
          onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Shipping Cost"
          className="border px-3 py-2 w-full rounded"
          value={settings.shippingCost}
          onChange={(e) => setSettings({ ...settings, shippingCost: Number(e.target.value) })}
        />

        {/* Maintenance Mode */}
        <div className="flex items-center gap-3 mt-4">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="w-5 h-5"
          />
          <span>Enable Maintenance Mode</span>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
