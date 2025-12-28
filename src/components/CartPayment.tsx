import { SiMediamarkt } from "react-icons/si";
import FormattedPrice from "./FormattedPrice";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { StateProps, StoreProduct } from "@/types";
import { RootState } from "@/store/store";  //
// import{ loadSripe} from '@stripe/stripe-js';
import { useSession } from "next-auth/react";




const CartPayment = () => {
        const { productData, userInfo } = useSelector((state: RootState) => state.next);
        const [totalAmount, setTotalAmount] = useState(0);
        useEffect(() => {
                let amt = 0;
                productData.map((item: StoreProduct) => {
                        amt += item.price * item.quantity;
                        return
                })
                setTotalAmount(amt);

        }, [productData]);
        //stripe payment//
        // const stripePromise=loadstripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        // const {data:session}=useSession()
        // const handleChechkout =async()=>{
        //         const handleChechkout=(=>{
        //         const stripe=awit stripePromise;

        //         const response=awit fetch("/api/checkout"{
        //                 method:"POST",
        //                 headers:{
        //                         "content-Type":"application/json",
        //                 },
        //                 body:json.stringify({items:productData,email:session?.user?.email}),
        //         });
        // }
        //       console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        // })
        return (
                <div className="flex flex-col gap-7">
                        <div className="flex gap-3">
                                <span className="bg-green-600 rounded-full p-1 h-6 text-sm text-white flex items-center justify-center mt-1">
                                        <SiMediamarkt />
                                </span>
                                <p className="text-sm">Your order quaifies for FREE shipping by  choosing this option at checkout.see details please ...</p>
                        </div>
                        <p className="flex items-center justify-between px-6 font-semibold ">
                                Totall:{ }
                                <span className="font-bold text-xl">
                                        <FormattedPrice amount={totalAmount} />
                                </span>
                        </p>
                        {
                                userInfo ? (<div className="flex flex-col items-center">
                                        <button  className="w-full h-10 text-sm  font-semibold bg-[#131921] text-white rounded-lg hover:bg-[#febd69] duration-300 ">Proceed to Buy</button></div>) : (<div className="flex flex-col items-center">
                                                <button className="w-full h-10 text-sm font-bold bg-[#131921] bg-opacity-50 text-white rounded-lg cursor-not-allowed">Proceed to Buy</button>
                                                <p className="text-xs mt-1 text-red-500 font-semibold animate-bounce ">Please login to continue</p>
                                        </div>)
                        }
                </div>
        );
};
export default CartPayment;