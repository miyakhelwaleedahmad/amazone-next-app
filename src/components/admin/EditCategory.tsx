import { useState } from "react";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function EditCategory({
  category,
  onComplete,
}: {
  category: Category;
  onComplete: () => void;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [isActive, setIsActive] = useState(category.isActive);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${category._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, isActive }),
      });

      if (res.ok) {
        alert("Category updated successfully!");
        onComplete();
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
    <div className="border p-4 rounded mb-6 bg-gray-50">
      <h3 className="font-semibold mb-2">Edit Category</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <div className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-1"
          />
          Active
        </label>
      </div>
      <button
        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
        onClick={handleUpdate}
      >
        Save
      </button>
      <button className="bg-gray-300 px-3 py-1 rounded" onClick={onComplete}>
        Cancel
      </button>
    </div>
  );
}
