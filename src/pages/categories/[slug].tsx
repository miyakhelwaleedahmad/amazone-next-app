// // W:\Amazone-clone2\my-app\src\pages\categories\[slug].tsx

// import { GetServerSideProps } from "next";
// import { useRouter } from "next/router";
// import clientPromise from "@/lib/mongodb"; // ✅ MongoDB connection
// import { ObjectId } from "mongodb";

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
//   image: string;
//   category: string;
//   slug: string;
// }

// interface CategoryPageProps {
//   products: Product[];
//   categoryName: string;
// }

// export default function CategoryPage({ products, categoryName }: CategoryPageProps) {
//   const router = useRouter();

//   if (router.isFallback) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <main className="max-w-screen-2xl mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6 capitalize">{categoryName}</h1>

//       {products.length === 0 ? (
//         <p>No products found in this category.</p>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <div
//               key={product._id}
//               className="border rounded-xl p-4 shadow-md hover:shadow-lg transition"
//             >
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-48 object-cover rounded-lg mb-3"
//               />
//               <h2 className="font-semibold">{product.name}</h2>
//               <p className="text-gray-600">${product.price}</p>
//               <button
//                 className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                 onClick={() => router.push(`/products/${product._id}`)}
//               >
//                 View Details
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { slug } = context.params as { slug: string };

//   const client = await clientPromise;
//   const db = client.db("My_ecommerce_website");

//   //  Find all products that belong to this category
//   const products = await db
//     .collection("products")
//     .find({ category: slug })
//     .toArray();

//   return {
//     props: {
//       products: JSON.parse(JSON.stringify(products)),
//       categoryName: slug.replace(/-/g, " "), // show "health and beauty" instead of "health-and-beauty"
//     },
//   };
// };
