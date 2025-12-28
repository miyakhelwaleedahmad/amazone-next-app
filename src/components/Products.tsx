import React from "react";
import { ProductProps } from "../store/file";
import Image from "next/image";
import { HiShoppingCart } from "react-icons/hi";
import { FaHeart } from "react-icons/fa6";
import FormattedPrice from "./FormattedPrice";
import { Span } from "next/dist/trace";
import {useDispatch} from "react-redux"
import { addToCart, addToFavourite } from "../store/nextSlice";
 
 

const Products = ({ productData }: any) => {
  const dispatch=useDispatch();
  return (
    <div className="w-full px-6  mt-20  top-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-0">
      {productData.map(
        ({
          _id,
          title,
          brand,
          category,
          description,
          image,
          isNew,
          oldPrice,
          price,
        }: ProductProps) => (
          <div
            key={_id}
            className="w-full bg-white text-black p-4 border border-gray-300   rounded-lg group overflow-hidden"
          >
            <div className="w-full   h-[260] relative ">
              <Image
                width={300}
                height={300}
                src={image}
                alt="product image"
                className="w-full h-full object-cover scale-90 hover:scale-100 transition-transform duration-300"
              />

              <div className="w-12 h-22 absolute bottom-10 right-0 border-[1px] border-gray-400 bg-white  items-center  rounded-md flex flex-col translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ">
                <span  onClick={()=>dispatch(addToCart({
                _id:_id,
                brand:brand,
                category:category,
                image:image,
                description:description,
                isNew:isNew,
                oldPrice:oldPrice,
                price:price,
                title:title,
                quantity:1,
              }))}  className="w-full h-full border-b-[1px] border-gray-400 flex items-center justify-center  text-xl bg-transparent hover:bg-[#febd69] cursor-pointer duration-300">
                  <HiShoppingCart />
                </span>
                <span onClick={()=>dispatch(addToFavourite(
                  { _id:_id,
                brand:brand,
                category:category,
                image:image,
                description:description,
                isNew:isNew,
                oldPrice:oldPrice,
                price:price,
                title:title,
                quantity:1,}

                ))} className="w-full h-full border-b-[1px] border-gray-400 flex items-center justify-center  text-xl bg-transparent hover:bg-[#febd69] cursor-pointer duration-300">
                  <FaHeart />
                </span>
              </div>
           {isNew&& (
            <p className="absolute top-0 right-0 text-[#131921] font-medium text-xs tracking-wide animation-bounce">
              !save<FormattedPrice amount={oldPrice - price}/>
            </p>
           )}
            </div>
            <hr/>
             <div className="px-4 py-3 flex flex-col gap-1 ">
              <p className="text-xs text-gray-500 tracking-wide ">{category}</p>
              <p className="text-base font-medium">{title}</p>
              <p className="flex itemss-center gap-2 ">
                <span className="text-sm line-throught"><FormattedPrice amount={oldPrice}/>
                </span>
                <span className="text-[#131921] font-semibold"><FormattedPrice amount={price}/>
                </span>
              </p>
              <p className="text-xs text-gray-600 text-justify">
                {description.substring(0,60)}
              </p>
              <button onClick={()=>dispatch(addToCart({
                _id:_id,
                brand:brand,
                category:category,
                image:image,
                description:description,
                isNew:isNew,
                oldPrice:oldPrice,
                price:price,
                title:title,
                quantity:1,
              }))} className="h-10 font-medium bg-[#131921] text-white rounded-md   hover:bg-[#febd69]  hover:text-black cursor-pointer duration-300 mt-2" >add to cart</button>
             </div>
          </div>
        )
      )}
    </div>
  );
};
export default Products;
