
import Banner from "@/components/Banner";
import Products from '@/components/Products';
import { ProductProps } from "../store/file";  

interface props{
productData:ProductProps[];
}
 
export default function Home({productData}:props) {
 
  return (
    <main>
     <div className="max-w-screen-2xl mx-auto">
      <Banner/>
      <div className="relative md:-mt020 lgl:-mt-32 xl:-mt-60 z-60 mb-10 ">
      <Products productData={productData} />
      </div>

       
      </div>
     
    </main>
  );
}
 
// server side rendreng for fetching data//

export const getServerSideProps = async () => {
  // ✅ 1. Fetch FakeStore Tech Products
  const res1 = await fetch("https://fakestoreapiserver.reactbd.com/tech");
  const productData = await res1.json();

  // ✅ 2. Fetch DummyJSON Beauty Products
  const res2 = await fetch("https://dummyjson.com/products/category/beauty");
  const beautyData = await res2.json();

  // ✅ 3. Return both in props
  return {
    props: {
      productData,              // FakeStore tech
      beautyProducts: beautyData.products, // DummyJSON beauty
    },
  };
};
