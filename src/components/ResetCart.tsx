import { resetCart } from "@/store/nextSlice";
import { useDispatch } from "react-redux";
 
const ResetCart=()=>{
        const dispatch=useDispatch()
        const handleResetCart=()=>{
          const confirmReset=window.confirm(
                "Are you sure to reset the cart"
          );
          if(confirmReset){
                dispatch(resetCart());
          }
          
        };
        
        return(
         <button onClick={handleResetCart} className="w-44 h-10 ml-1 mb-1 mt-1 font-semibold bg-gray-200  rounded-lg hover:bg-red-600 hover:text-white duration-500">Reset Cart</button>
        )
};
export default ResetCart;