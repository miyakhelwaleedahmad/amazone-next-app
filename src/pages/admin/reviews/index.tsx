// src/pages/admin/reviews/index.tsx
import { useEffect, useState } from "react";

interface Review {
  _id: string;
  productId: string;
  productName: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/admin/reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Delete review
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Reviews</h1>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Comment</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id} className="border-t">
                <td className="py-2 px-4">{r.productName}</td>
                <td className="py-2 px-4">{r.user}</td>
                <td className="py-2 px-4">{r.rating} ⭐</td>
                <td className="py-2 px-4">{r.comment}</td>
                <td className="py-2 px-4">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
