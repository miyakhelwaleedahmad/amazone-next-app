import { useState } from "react";

export default function AddProduct({ onAdd }: { onAdd?: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: parseFloat(price), description }),
      });

      if (res.ok) {
        alert("Product added!");
        setName("");
        setPrice("");
        setDescription("");
        if (onAdd) onAdd();
      } else {
        const data = await res.json();
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-6">
      <div>
        <label className="block mb-1 font-semibold">Product Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Product
      </button>
    </form>
  );
}
