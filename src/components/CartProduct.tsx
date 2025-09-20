// src/components/CartProduct.tsx
import React from "react";
import Image from "next/image";
import FormattedPrice from "@/components/FormattedPrice";
import { Plus, Minus } from "lucide-react";
import { StoreProduct } from "@/store/file";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { decreaseQuantity, deleteProduct, increaseQuantity } from "@/store/nextSlice";

interface CartProductsProps {
  item: StoreProduct;
}

const CartProduct = ({ item }: CartProductsProps) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-gray-100 rounded-lg flex items-center gap-4 p-4">
      <Image
        className="object-cover"
        width={150}
        height={150}
        src={item.image ?? "/placeholder.png"}
        alt={item.title}
      />

      <div className="flex flex-1 items-center justify-between px-2 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-[#232F3E]">{item.title}</p>
          <p className="text-sm text-gray-600">{item.description}</p>
          <p className="text-sm text-gray-600">
            Unit Price{" "}
            <span className="font-semibold text-[#232F3E]">
              <FormattedPrice amount={item.price} />
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center mt-1 border-gray-300 px-4 py-1 rounded-full w-28 shadow-lg shadow-gray-300 gap-3">
            <span
              onClick={() => dispatch(increaseQuantity(item._id))}
              className="w-6 h-6 flex items-center justify-center rounded-full text-base bg-transparent hover:bg-gray-300 cursor-pointer"
            >
              <Plus />
            </span>

            <span>{item.quantity}</span>

            <span
              onClick={() => dispatch(decreaseQuantity(item._id))}
              className="w-6 h-6 flex items-center justify-center rounded-full text-base bg-transparent hover:bg-gray-300 cursor-pointer"
            >
              <Minus />
            </span>
          </div>

          <div
            onClick={() => dispatch(deleteProduct(item._id))}
            className="flex items-center text-sm font-medium text-gray-400 hover:text-red-600 cursor-pointer duration-300 gap-1"
          >
            <IoMdClose className="mt-[2px]" /> <p>Remove</p>
          </div>
        </div>

        <div className="text-lg font-semibold text-[#232F3E]">
          <FormattedPrice amount={item.price * item.quantity} />
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
