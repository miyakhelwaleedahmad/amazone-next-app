// src/pages/products/index.tsx
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface ProductsPageProps {
  products: Product[];
}

export default function ProductsPage({ products }: ProductsPageProps) {
  if (!products || products.length === 0) {
    return <p className="text-center mt-10">No products available.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <Link href={`/products/${product._id}`}>
              <div>
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="rounded mb-4"
                  />
                )}
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 mt-1">${product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Fetch products from API
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
    if (!res.ok) {
      return { props: { products: [] } };
    }

    const products = await res.json();
    return { props: { products } };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { props: { products: [] } };
  }
};
