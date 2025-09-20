// W:\Amazone-clone2\my-app\src\pages\categories\Electronics.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart, addToFavourite } from "@/store/nextSlice";
import { StoreProduct } from "@/types";
import toast from "react-hot-toast";

const Electronics = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products/category/smartphones");
        const data = await res.json();

        // ✅ map API fields to StoreProduct type
        const mappedProducts: StoreProduct[] = data.products.map((p: any) => ({
          _id: p.id, // ❌ was product.id — FIXED
          title: p.title,
          brand: p.brand,
          category: p.category,
          description: p.description,
          image: p.thumbnail, // ❌ was product.thumbnail — FIXED
          isNew: true,
          oldPrice: p.price,
          price: p.price,
          quantity: 1,
          discountPercentage: p.discountPercentage,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching Electronics products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: StoreProduct, discountPrice: number | null) => {
    dispatch(
      addToCart({
        _id: product._id, // ❌ was product.id — FIXED
        title: product.title,
        brand: product.brand,
        category: product.category,
        description: product.description,
        image: product.image, // ❌ was product.thumbnail — FIXED
        isNew: true,
        oldPrice: product.oldPrice,
        price: discountPrice || product.price,
        quantity: 1,
      })
    );
    toast.success(`${product.title} has been added to your cart 🛒`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Electronics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map((product) => {
          const discountPrice = product.discountPercentage
            ? product.price - (product.price * product.discountPercentage) / 100
            : null;

          return (
            <div
              key={product._id} // ❌ was product.id — FIXED
              className="bg-white rounded-2xl shadow-md p-4 relative flex flex-col"
            >
              {discountPrice && (
                <span className="absolute top-3 right-3 bg-gray-100 text-black text-xs font-semibold px-2 py-1 rounded-md shadow">
                  save ${(product.price - discountPrice).toFixed(2)}
                </span>
              )}

              <div className="flex justify-center">
                <Image
                  src={product.image || "/placeholder.png"} // ❌ was product.thumbnail — FIXED
                  alt={product.title}
                  width={220}
                  height={220}
                  className="object-contain"
                />
              </div>

              <div className="absolute right-3 top-1/2 flex flex-col gap-2">
                <button
                  onClick={() => handleAddToCart(product, discountPrice)}
                  className="bg-white p-2 rounded-md shadow hover:bg-gray-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    dispatch(
                      addToFavourite({
                        _id: product._id, // ❌ was product.id — FIXED
                        title: product.title,
                        brand: product.brand,
                        category: product.category,
                        description: product.description,
                        image: product.image, // ❌ was product.thumbnail — FIXED
                        isNew: true,
                        oldPrice: product.oldPrice,
                        price: discountPrice || product.price,
                        quantity: 1,
                      })
                    );
                    toast.success(`${product.title} was added to your favourites ❤️`);
                  }}
                  className="bg-white p-2 rounded-md shadow hover:bg-gray-200"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 border-t pt-3">
                <p className="text-gray-500 text-sm">{product.category}</p>
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

                <div className="mt-2 flex items-center gap-2">
                  {discountPrice ? (
                    <>
                      <span className="text-gray-400 line-through">${product.oldPrice}</span>
                      <span className="text-black font-bold">${discountPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-black font-bold">${product.price}</span>
                  )}
                </div>

                {/* Add to cart button */}
                <button
                  onClick={() => handleAddToCart(product, discountPrice)}
                  className="mt-4 bg-black text-white py-2 px-4 rounded-lg w-full hover:bg-gray-800"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Electronics;
