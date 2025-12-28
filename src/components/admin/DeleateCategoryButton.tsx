export default function DeleteCategoryButton({
  categoryId,
  onDelete,
}: {
  categoryId: string;
  onDelete: () => void;
}) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Category deleted!");
        onDelete();
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
    <button
      className="bg-red-500 text-white px-2 py-1 rounded"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
