import { removeUser } from "@/store/nextSlice";
import { StateProps } from "@/types";
import { LuMenu } from "react-icons/lu";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
const Bottomheader = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(
    (state: RootState) => state.next
  );
  const handleSignOut = () => {
    dispatch(removeUser());
  };

  return (
    <div className="w-full  h-10 bg-[#232F3E] text-white px-4 flex items-center">
      <p className="flex items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
        <LuMenu />
        ALL
      </p>
        
             <Link
        href="/Categories/Todays_deal"
        className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300"
      >
        Todays deal
      </Link>
      
      <Link href={"/Categories/Electronics"}
        className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300"
      >
      <p>Electronics</p>
      
      </Link> 

<Link
  href={"/Categories/Fashion"}
  className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300"
>
  <p>Fashion</p>
</Link>

<Link href={"/Categories/HomeKitchen"}
        className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300"
      >
      <p>Home &Kitchen</p>
      
      </Link>
<Link href={"/Categories/BeautyPersonalcare"}
        className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300"
      >
      <p>Beauty&Personal care</p>
      
      </Link>
<Link href={"/Categories/SportsOutdoors"}
        className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300"
      >
      <p>Sports Outdoors</p>
      
      </Link>
<Link href={"/Categories/HealthHousehold"}
        className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300"
      >
      <p>Health & Household</p>
      
      </Link>

 
      <button onClick={handleSignOut} className="hidden md:inline-flex items-center  h-8 px-2 border border-transparent hover:border-red-500 hover:text-red-400 text-[#febd69] cursor-pointer duration-300">signout</button>









    </div>
  );
};

export default Bottomheader;
