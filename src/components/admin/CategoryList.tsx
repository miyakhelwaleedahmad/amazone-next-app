import { useEffect, useState } from "react";
import EditCategory from "./EditCategory";
import DeleteCategoryButton from "@/components/admin/DeleateCategoryButton";

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditComplete = () => {
    setEditingCategory(null);
    fetchCategories();
  };

  const handleDelete = () => {
    fetchCategories();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Existing Categories</h2>
      <table className="min-w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Slug</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="border px-4 py-2">{cat.name}</td>
              <td className="border px-4 py-2">{cat.slug}</td>
              <td className="border px-4 py-2">{cat.description}</td>
              <td className="border px-4 py-2">{cat.isActive ? "Active" : "Inactive"}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  className="bg-yellow-400 px-2 py-1 rounded"
                  onClick={() => setEditingCategory(cat)}
                >
                  Edit
                </button>
                <DeleteCategoryButton categoryId={cat._id} onDelete={handleDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCategory && (
        <EditCategory category={editingCategory} onComplete={handleEditComplete} />
      )}
    </div>
  );
}
