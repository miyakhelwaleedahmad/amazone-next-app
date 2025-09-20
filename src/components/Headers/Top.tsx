 import Image from "next/image";
import logo from "../pics/logo.png";
import { BiCaretDown } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { MdLocationPin } from "react-icons/md";
import cartImage from "@/components/pics/cart.png";
import Link from "next/link";
import {useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react";
import {addUser} from "@/store/nextSlice";

function Location() {
  return (
    <div className="flex items-center gap-1">
      <MdLocationPin />
      <span>Your Location</span>
    </div>
  );
}

const Header = () => {
  const { data: session } = useSession()

  const { productData, favouriteData,userInfo } = useSelector(
    (state: RootState) => state.next
  );
const dispatch = useDispatch(); 
  useEffect(()=>{
  if(session){
    dispatch(
    addUser({
    name:session.user?.name ||"",
    email:session.user?.email ||"",
    image:session?.user?.image ||"",
    })
  );
  }
 },[session,dispatch]); 
  

  return (
    <div className="w-full h-15 bg-[#131921] text-[#ccc] sticky top-0 z-50">
      <div className="h-full w-full mx-auto inline-flex items-center justify-between gap-1 mdl:gap-3 px-2">
        {/* logo */}
        <div className="px-2 border border-transparent hover:border-white cursor-pointer duration-300 flex items-center justify-center h-[60%] w-[15%]">
          <Image className="object-cover w-16" src={logo} alt="amazon logo" />
        </div>

        {/* delivery */}
        <div className="px-2 border border-transparent hover:border-white cursor-pointer duration-300 items-center justify-center h-[70%] hidden xl:inline-flex gap-1">
          <MdLocationPin />
          <div className="text-xs">
            <p>Delivered to</p>
            <p className="text-white font-bold uppercase">USA</p>
          </div>
        </div>

        {/* searchbar */}
        <div className="flex-1 h-10 hidden md:inline-flex items-center justify-between relative">
          <input
            className="w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-[3px] bg-white border-transparent outline-none focus-visible:border-amazone_yt products"
            type="text"
            placeholder="Search next_amazone_yt products"
          />
          <span className="w-12 h-10 bg-[#febd69] text-black text-2xl flex items-center justify-center right-0 absolute rounded-tr-md pt-1.5">
            <HiOutlineSearch />
          </span>
        </div>

        {/* signing */}
         
           {userInfo?(
           <div  
           className="text-xs w-55  text-gray-100 flex flex-col justify-center px-3 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]">
            <img src={userInfo.image} alt="userImage" className="w-8 h-8 rounded-full object-cover"/>
            <div className="text-xs text-gray-100 flex flex-col justify-between">
              <p className="text-white font-bold">{userInfo.name}</p>
              <p>{userInfo.email}</p>
            </div>
           </div>
  ):(
  <div onClick={()=>signIn()}
           className="text-xs text-gray-100 flex flex-col justify-center px-2">
            <p>Hellow,signIn</p>
            <p>Account&List{""}</p>
            <span>
              <BiCaretDown/>
            </span>
           </div>
         ) }

        {/* favourite */}
        <div className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[50%] relative">
          <p>Marked</p>
          <p className="text-white font-bold">& Favorite ({favouriteData.length})</p>
          {
                favouriteData.length > 0 && <span className="absolute right-2 mb-4 w-4 h-4 border-[1px] border-gray-400 flex-center justify-center text-xs text-[#febd69] ">{favouriteData.length}</span>
          }
        </div>
        

        {/* cart */}
        <Link href="/cart" className="relative flex flex-col items-center bg-[#131921]">
          <Image
            className="w-10  object-cover h-9 mt-1 bg-[#131921]"
            src={cartImage}
            alt="cartImg"
          />
          <p className="text-xs text-white bg-[#131921] font-bold mt-1">Cart</p>
          <span className="absolute text-[#febd69] text-sm top-0.5 pl-1">
            
          {productData ?productData.length:0}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
