import Image from "next/image";
import awsImage from "@/components/pics/aws.png";  


const Footer = () => {
  return (
    <div className="w-full h-20 bg-[#232F3E]  text-gray-300 flex items-center justify-center gap-4">
      <Image src={awsImage} alt="aws" className="w-24" />
      <p className="text-sm  -mt-4">All rights reserved <a className="hover:text-white hover:underline decoration-[1px]" href="https://@reactbd.com" target="_blank"></a></p>
    </div>
  );
};

export default Footer;
