// src/pages/products/[id].tsx
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: { name: string };
  } | null;
}

export default function ProductDetail({ product }: ProductProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      {product.imageUrl && (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="rounded-md shadow"
        />
      )}
      <p className="text-gray-700 mt-4">{product.description}</p>
      <p className="text-lg font-semibold mt-2">${product.price}</p>
      {product.category && (
        <p className="mt-1 text-sm text-gray-500">
          Category: {product.category.name}
        </p>
      )}
    </div>
  );
}

// ✅ Fetch data from API
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`
    );

    if (!res.ok) {
      return { props: { product: null } };
    }

    const product = await res.json();
    return { props: { product } };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { props: { product: null } };
  }
};
